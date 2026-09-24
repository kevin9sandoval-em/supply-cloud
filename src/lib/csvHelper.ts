import { Product, RFQ, QuotationItemBid } from '@/types';

// Helper para descargar archivos en el navegador
function triggerDownload(content: string, filename: string, type: string = 'text/csv;charset=utf-8;') {
  const blob = new Blob(['\uFEFF' + content], { type }); // \uFEFF es el BOM de UTF-8 para que Excel abra acentos correctamente
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// -------------------------------------------------------------
// 1. CATÁLOGO DE PRODUCTOS (EMPRESA CLIENTE)
// -------------------------------------------------------------

export function downloadCatalogTemplateCSV() {
  const headers = [
    'SKU',
    'Nombre_Producto',
    'Categoria',
    'Unidad',
    'Precio_Referencia_MXN',
    'Especificaciones_Tecnicas',
    'Foto_URL',
    'Stock_Minimo',
  ];

  const sampleRows = [
    [
      'VAL-SAN-02',
      'Válvula de Asiento Inclinado Neumática 2 pulg Acero Inox 316',
      'Válvulas y Tubería',
      'Pza',
      '3850.00',
      'Actuador normalmente cerrado, presión máxima de vapor 150 PSI',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      '5',
    ],
    [
      'ROD-TIM-32215',
      'Rodamiento de Rodillos Cónicos Timken 32215',
      'Transmisión de Potencia',
      'Pza',
      '2420.00',
      'Diámetro interior 75mm, exterior 130mm, acero al cromo cementado',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
      '8',
    ],
    [
      'EPP-BOT-DIE-27',
      'Bota de Seguridad Dieléctrica con Casco de Poliamida Talla 27',
      'EPP y Seguridad Industrial',
      'Par',
      '1150.00',
      'Norma NOM-113-STPS-2009, suela antiderrapante de PU/Hule',
      'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=600&q=80',
      '20',
    ],
  ];

  const csvContent = [
    headers.join(','),
    ...sampleRows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(',')),
  ].join('\r\n');

  triggerDownload(csvContent, 'Plantilla_Catalogo_SupplyCloud.csv');
}

export function exportCatalogToCSV(products: Product[], companyName: string = 'Catalogo') {
  const headers = [
    'SKU',
    'Nombre_Producto',
    'Categoria',
    'Unidad',
    'Precio_Referencia_MXN',
    'Especificaciones_Tecnicas',
    'Foto_URL',
    'Stock_Minimo',
  ];

  const rows = products.map((p) => [
    p.sku,
    p.name,
    p.category,
    p.unit,
    p.referencePriceMxn.toString(),
    p.technicalSpecs || '',
    p.photoUrl || '',
    (p.minStock || 0).toString(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(',')),
  ].join('\r\n');

  const safeName = companyName.replace(/[^a-zA-Z0-9]/g, '_');
  triggerDownload(csvContent, `Catalogo_Productos_${safeName}.csv`);
}

export function parseCatalogCSV(csvText: string): {
  products: Omit<Product, 'id' | 'organizationId'>[];
  errors: string[];
} {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return { products: [], errors: ['El archivo CSV está vacío o solo contiene encabezados.'] };
  }

  const products: Omit<Product, 'id' | 'organizationId'>[] = [];
  const errors: string[] = [];

  // Parsear filas respetando comillas
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split simple respetando comillas
    const cols = parseCSVLine(line);

    if (cols.length < 5) {
      errors.push(`Fila ${i + 1}: columnas insuficientes.`);
      continue;
    }

    const sku = cols[0]?.trim();
    const name = cols[1]?.trim();
    const category = cols[2]?.trim() || 'General';
    const unit = cols[3]?.trim() || 'Pza';
    const priceStr = cols[4]?.replace(/[$,\s]/g, '').trim();
    const specs = cols[5]?.trim() || '';
    const photoUrl =
      cols[6]?.trim() ||
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
    const minStock = parseInt(cols[7]) || 1;

    const referencePriceMxn = parseFloat(priceStr);

    if (!sku || !name) {
      errors.push(`Fila ${i + 1}: SKU y Nombre son obligatorios.`);
      continue;
    }

    if (isNaN(referencePriceMxn) || referencePriceMxn < 0) {
      errors.push(`Fila ${i + 1}: Precio de referencia inválido ("${cols[4]}").`);
      continue;
    }

    products.push({
      sku: sku.toUpperCase(),
      name,
      description: specs || `Producto ${name}`,
      category,
      unit,
      referencePriceMxn,
      technicalSpecs: specs,
      photoUrl,
      minStock,
    });
  }

  return { products, errors };
}

// -------------------------------------------------------------
// 2. COTIZACIONES EN LICITACIONES (PROVEEDORES Y COMPRADOR)
// -------------------------------------------------------------

export function downloadRFQQuotationTemplateCSV(rfq: RFQ) {
  const headers = [
    'SKU',
    'Producto_Solicitado',
    'Cantidad_Requerida',
    'Unidad',
    'Precio_Unitario_Ofertado',
    'Dias_Entrega',
    'Marca_Ofertada',
    'Notas_Proveedor',
  ];

  const rows = rfq.items.map((it) => [
    it.sku,
    it.productName,
    it.quantity.toString(),
    it.unit,
    '', // Espacio para que el proveedor ingrese su precio
    '5', // Días sugeridos
    '', // Marca
    '', // Notas
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(',')),
  ].join('\r\n');

  triggerDownload(csvContent, `Formato_Cotizacion_${rfq.code}.csv`);
}

export function parseQuotationCSV(
  csvText: string,
  rfq: RFQ
): {
  bids: { [productId: string]: { price: string; days: number; brand: string; notes?: string } };
  matchedCount: number;
  unmatchedCount: number;
  errors: string[];
} {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return {
      bids: {},
      matchedCount: 0,
      unmatchedCount: 0,
      errors: ['El archivo de cotización está vacío o no tiene datos.'],
    };
  }

  const bids: {
    [productId: string]: { price: string; days: number; brand: string; notes?: string };
  } = {};
  let matchedCount = 0;
  let unmatchedCount = 0;
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = parseCSVLine(line);
    if (cols.length < 5) continue;

    const sku = cols[0]?.trim().toUpperCase();
    const priceStr = cols[4]?.replace(/[$,\s]/g, '').trim();
    const days = parseInt(cols[5]) || 5;
    const brand = cols[6]?.trim() || '';
    const notes = cols[7]?.trim() || '';

    // Encontrar la partida correspondiente en la RFQ
    const rfqItem = rfq.items.find((item) => item.sku.toUpperCase() === sku);

    if (rfqItem) {
      const price = parseFloat(priceStr);
      if (!isNaN(price) && price > 0) {
        bids[rfqItem.productId] = {
          price: price.toString(),
          days: Math.max(1, days),
          brand,
          notes,
        };
        matchedCount++;
      } else {
        errors.push(`Línea ${i + 1} (${sku}): Precio inválido.`);
      }
    } else {
      unmatchedCount++;
    }
  }

  return { bids, matchedCount, unmatchedCount, errors };
}

// Parser simple de línea CSV considerando comillas dobles
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Saltar escape
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}
