import {
  Product,
  Supplier,
  RFQ,
  Quotation,
  CurrencyRate,
  ComparisonItemRow,
  SupplierSummaryScore,
  Currency,
  Category,
  SpotRequest,
  SpotBid,
  Organization,
  DemoAccount,
  UserProfile,
} from '@/types';

export const DEFAULT_RATES: CurrencyRate[] = [
  { code: 'MXN', name: 'Peso Mexicano', symbol: '$', rateToMxn: 1.0 },
  { code: 'USD', name: 'Dólar Americano', symbol: 'US$', rateToMxn: 19.85 },
  { code: 'EUR', name: 'Euro', symbol: '€', rateToMxn: 21.40 },
];

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-1',
    name: 'Manufacturas del Norte',
    legalName: 'Manufacturas del Norte S.A. de C.V.',
    taxId: 'MNO850412KJ1',
    industry: 'Metalmecánica, Ensamble y Maquila',
    city: 'Monterrey, N.L.',
    baseCurrency: 'MXN',
    deliveryAddress: 'Parque Industrial Kalos, Av. Kalos 120, Apodaca, N.L. C.P. 66600',
  },
  {
    id: 'org-2',
    name: 'Alimentos & Bebidas Santa Clara',
    legalName: 'Alimentos & Bebidas Santa Clara S.A. de C.V.',
    taxId: 'ASC920914MM3',
    industry: 'Procesamiento de Alimentos y Lácteos',
    city: 'Querétaro, Qro.',
    baseCurrency: 'MXN',
    deliveryAddress: 'Parque Industrial Benito Juárez, Acceso III #14, Querétaro, Qro. C.P. 76120',
  },
  {
    id: 'org-3',
    name: 'Constructora e Infraestructura del Bajío',
    legalName: 'Constructora e Infraestructura del Bajío S.A.',
    taxId: 'CIB040315GH7',
    industry: 'Construcción Pesada y Obra Civil',
    city: 'León, Gto.',
    baseCurrency: 'MXN',
    deliveryAddress: 'Blvd. Aeropuerto 1024, Col. San Carlos, León, Gto. C.P. 37295',
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-epp',
    organizationId: 'org-1',
    name: 'EPP y Seguridad Industrial',
    slug: 'epp-seguridad',
    description: 'Equipos de protección personal normados (cascos, guantes, calzado y protección visual).',
    iconName: 'Shield',
    productCount: 3,
  },
  {
    id: 'cat-ferreteria',
    organizationId: 'org-1',
    name: 'Ferretería y Tornillería Industrial',
    slug: 'ferreteria-tornilleria',
    description: 'Tornillería de alta resistencia (Grado 5, 8.8, B7), arandelas, selladores y consumibles de taller.',
    iconName: 'Wrench',
    productCount: 2,
  },
  {
    id: 'cat-valvulas',
    organizationId: 'org-1',
    name: 'Válvulas y Tubería',
    slug: 'valvulas-tuberia',
    description: 'Válvulas de bola, mariposa, retención y tubería en acero inoxidable y al carbón.',
    iconName: 'Pipette',
    productCount: 1,
  },
  {
    id: 'cat-transmision',
    organizationId: 'org-1',
    name: 'Transmisión de Potencia',
    slug: 'transmision-potencia',
    description: 'Rodamientos industriales, chumaceras, bandas dentadas y poleas.',
    iconName: 'Settings',
    productCount: 1,
  },
  // Categorías de Alimentos Santa Clara (org-2)
  {
    id: 'cat-sanitario',
    organizationId: 'org-2',
    name: 'Inoxidable Sanitario y Grado Alimenticio',
    slug: 'inoxidable-sanitario',
    description: 'Conexiones clamp, sellos de silicona FDA, tubería sanitaria pulida 304/316L.',
    iconName: 'Pipette',
    productCount: 2,
  },
  {
    id: 'cat-empaque',
    organizationId: 'org-2',
    name: 'Materiales de Empaque y Embalaje',
    slug: 'empaque-embalaje',
    description: 'Película stretch, cajas de cartón corrugado, cinta canela con adhesivo acrílico.',
    iconName: 'Boxes',
    productCount: 1,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  // Productos org-1 (Manufacturas del Norte)
  {
    id: 'prod-epp-1',
    organizationId: 'org-1',
    sku: 'EPP-CAS-01',
    name: 'Casco de Seguridad Industrial Tipo 1 Clase E con Barboquejo',
    category: 'EPP y Seguridad Industrial',
    unit: 'Pza',
    description: 'Casco dieléctrico de alta densidad con suspensión de 4 puntos y barbiquejo elástico para trabajos en altura.',
    photoUrl: 'https://images.unsplash.com/photo-1578873375972-e1a5f6e80b43?auto=format&fit=crop&w=600&q=80',
    referencePriceMxn: 245.0,
    technicalSpecs: 'Norma NOM-115-STPS y ANSI Z89.1. Dieléctrico hasta 20,000 V.',
    minStock: 50,
  },
  {
    id: 'prod-epp-2',
    organizationId: 'org-1',
    sku: 'EPP-GUA-NIT',
    name: 'Guantes de Nitrilo de Alta Resistencia Química y Mecánica',
    category: 'EPP y Seguridad Industrial',
    unit: 'Caja',
    description: 'Guante de nitrilo verde calibre 15 milésimas con interior flocado de algodón. Caja con 12 pares.',
    photoUrl: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=600&q=80',
    referencePriceMxn: 580.0,
    technicalSpecs: 'Resistente a solventes, aceites y grasas industriales. Certificado EN 388.',
    minStock: 25,
  },
  {
    id: 'prod-epp-3',
    organizationId: 'org-1',
    sku: 'EPP-LEN-Z87',
    name: 'Lentes de Seguridad Antiempañantes con Filtro UV ANSI Z87+',
    category: 'EPP y Seguridad Industrial',
    unit: 'Pza',
    description: 'Gafas de policarbonato envolventes con tratamiento antirrayadura y ventilación indirecta.',
    photoUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    referencePriceMxn: 85.0,
    technicalSpecs: 'Cumplimiento ANSI/ISEA Z87.1-2020. 99.9% protección rayos UV.',
    minStock: 100,
  },
  {
    id: 'prod-fer-1',
    organizationId: 'org-1',
    sku: 'TOR-HEX-M16',
    name: 'Tornillo Hexagonal Milimétrico Grado 8.8 (M16 x 50mm) Pavonado',
    category: 'Ferretería y Tornillería Industrial',
    unit: 'Caja',
    description: 'Tornillería estructural de alta resistencia para ensamble de maquinaria pesada. Caja con 100 piezas.',
    photoUrl: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80',
    referencePriceMxn: 1250.0,
    technicalSpecs: 'Acero templado clase 8.8, rosca estándar paso 2.0 mm, acabado negro óxido.',
    minStock: 20,
  },
  {
    id: 'prod-fer-2',
    organizationId: 'org-1',
    sku: 'TUE-SEG-M16',
    name: 'Tuerca de Seguridad Hexagonal con Inserto de Nylon M16 Grado 8',
    category: 'Ferretería y Tornillería Industrial',
    unit: 'Caja',
    description: 'Tuerca autoblocante con anillo de poliamida antivibración para ensambles dinámicos. Caja con 100 piezas.',
    photoUrl: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80',
    referencePriceMxn: 720.0,
    technicalSpecs: 'Norma DIN 985, rosca métrica M16, resistencia al torque de desajuste.',
    minStock: 20,
  },
  {
    id: 'prod-1',
    organizationId: 'org-1',
    sku: 'VAL-SS316-02',
    name: 'Válvula de Bola Acero Inoxidable 316 - 2" NPT 1000 WOG',
    category: 'Válvulas y Tubería',
    unit: 'Pza',
    description: 'Válvula de paso completo con sello de teflón reforzado para vapor y químicos corrosivos. Conexión roscada NPT.',
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    referencePriceMxn: 1850.0,
    technicalSpecs: 'Presión máxima 1000 PSI, cuerpo ASTM A351 CF8M, palanca con seguro manual.',
    minStock: 10,
  },
  {
    id: 'prod-2',
    organizationId: 'org-1',
    sku: 'ROD-SKF-22218',
    name: 'Rodamiento Oscilante de Rodillos SKF 22218 EK',
    category: 'Transmisión de Potencia',
    unit: 'Pza',
    description: 'Rodamiento de rodillos esféricos para cargas radiales y axiales pesadas en cribas y molinos.',
    photoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    referencePriceMxn: 4950.0,
    technicalSpecs: 'Diámetro interior 90 mm, exterior 160 mm, ancho 40 mm. Agujero cónico 1:12.',
    minStock: 4,
  },
  // Productos org-2 (Alimentos Santa Clara)
  {
    id: 'prod-sc-1',
    organizationId: 'org-2',
    sku: 'VAL-SAN-MAR-03',
    name: 'Válvula Sanitaria de Mariposa Inoxidable 316L Clamp 3"',
    category: 'Inoxidable Sanitario y Grado Alimenticio',
    unit: 'Pza',
    description: 'Válvula para líneas de leche pasteurizada con pulido sanitario interno Ra < 0.8 µm y asientos EPDM grado FDA.',
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    referencePriceMxn: 3400.0,
    technicalSpecs: 'Certificación 3-A Sanitary Standards, conexión Tri-Clamp 3", manija multiposición inox.',
    minStock: 6,
  },
  {
    id: 'prod-sc-2',
    organizationId: 'org-2',
    sku: 'EMP-CORR-01',
    name: 'Caja de Cartón Corrugado Doble Cornete Grado Exportación (40x30x25 cm)',
    category: 'Materiales de Empaque y Embalaje',
    unit: 'Millar',
    description: 'Cajas con resistencia ECT-44 para estibado en cuartos fríos de lácteos.',
    photoUrl: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80',
    referencePriceMxn: 14800.0,
    technicalSpecs: 'Resistente a humedad 85%, impresión flexográfica a 2 tintas.',
    minStock: 5,
  },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Distribuidora Industrial del Norte',
    companyName: 'DINOR S.A. de C.V.',
    contactEmail: 'ventas@dinor-industrial.com.mx',
    phone: '+52 81 8345 6789',
    taxId: 'DIN890412KJ1',
    rating: 4.8,
    category: 'Mantenimiento y Transmisión',
    isVerified: true,
  },
  {
    id: 'sup-2',
    name: 'Apex Global Supply LLC',
    companyName: 'Apex Industrial USA',
    contactEmail: 'bids@apexmetalsupply.com',
    phone: '+1 (713) 555-0199',
    taxId: 'US-849201992',
    rating: 4.9,
    category: 'Tubería, Válvulas y Metales',
    isVerified: true,
  },
  {
    id: 'sup-3',
    name: 'Equipos Hidráulicos y Automatización Bajío',
    companyName: 'EHAB S.A. de C.V.',
    contactEmail: 'cotizaciones@ehabajio.com',
    phone: '+52 442 211 4455',
    taxId: 'EHA120304MM9',
    rating: 4.6,
    category: 'Automatización y Motores',
    isVerified: true,
  },
  {
    id: 'sup-4',
    name: 'Seguridad y Suministros Industriales 360',
    companyName: 'SSI 360 S.A. de C.V.',
    contactEmail: 'ventas@ssi360.com.mx',
    phone: '+52 55 5890 1234',
    taxId: 'SSI150618GH4',
    rating: 4.9,
    category: 'EPP y Seguridad Industrial',
    isVerified: true,
  },
  {
    id: 'sup-5',
    name: 'Tornillería y Fijaciones Especiales de México',
    companyName: 'TORFIMEX S.A. de C.V.',
    contactEmail: 'pedidos@torfimex.mx',
    phone: '+52 33 3612 9000',
    taxId: 'TFM080922TR8',
    rating: 4.7,
    category: 'Ferretería y Tornillería Industrial',
    isVerified: true,
  },
];

export const INITIAL_RFQS: RFQ[] = [
  {
    id: 'rfq-101',
    organizationId: 'org-1',
    organizationName: 'Manufacturas del Norte S.A. de C.V.',
    organizationTaxId: 'MNO850412KJ1',
    deliveryAddress: 'Parque Industrial Kalos, Av. Kalos 120, Apodaca, N.L. C.P. 66600',
    code: 'RFQ-2026-0089',
    title: 'Adquisición de Refacciones Críticas para Línea de Envasado 3',
    department: 'Mantenimiento Mecánico - Planta 1',
    description: 'Requerimiento urgente de válvulas de inoxidable y rodamientos para paro programado de mantenimiento mayor.',
    status: 'evaluating',
    deadline: '2026-09-15T18:00:00Z',
    baseCurrency: 'MXN',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'Válvula de Bola Acero Inoxidable 316 - 2" NPT 1000 WOG',
        sku: 'VAL-SS316-02',
        photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        unit: 'Pza',
        quantity: 12,
        specNotes: 'Requerido sello en teflón virgen PTFE, grabado láser de lote.',
        referencePriceMxn: 1850.0,
      },
      {
        id: 'item-2',
        productId: 'prod-2',
        productName: 'Rodamiento Oscilante de Rodillos SKF 22218 EK',
        sku: 'ROD-SKF-22218',
        photoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
        unit: 'Pza',
        quantity: 6,
        specNotes: 'Original SKF con certificado de autenticidad exigido en recepción.',
        referencePriceMxn: 4950.0,
      },
    ],
    invitedSupplierIds: ['sup-1', 'sup-2', 'sup-3'],
    createdAt: '2026-09-02T10:30:00Z',
  },
  {
    id: 'rfq-201',
    organizationId: 'org-2',
    organizationName: 'Alimentos & Bebidas Santa Clara S.A. de C.V.',
    organizationTaxId: 'ASC920914MM3',
    deliveryAddress: 'Parque Industrial Benito Juárez, Acceso III #14, Querétaro, Qro. C.P. 76120',
    code: 'RFQ-2026-0201',
    title: 'Suministro Trimestral de Válvulas Sanitarias Grado Alimenticio 3-A',
    department: 'Mantenimiento Sanitario - Planta Envasado',
    description: 'Renovación de válvulas mariposa para cabezal de tanques asépticos de yogur.',
    status: 'open',
    deadline: '2026-09-25T18:00:00Z',
    baseCurrency: 'MXN',
    items: [
      {
        id: 'item-sc-1',
        productId: 'prod-sc-1',
        productName: 'Válvula Sanitaria de Mariposa Inoxidable 316L Clamp 3"',
        sku: 'VAL-SAN-MAR-03',
        photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        unit: 'Pza',
        quantity: 8,
        specNotes: 'Certificado 3-A Sanitary y pulido sanitario Ra < 0.8 µm exigido.',
        referencePriceMxn: 3400.0,
      },
    ],
    invitedSupplierIds: ['sup-1', 'sup-2'],
    createdAt: '2026-09-07T12:00:00Z',
  },
];

export const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 'quot-1',
    rfqId: 'rfq-101',
    token: 'token-sup-1-rfq-101',
    supplierId: 'sup-1',
    supplierName: 'Distribuidora Industrial del Norte',
    supplierEmail: 'ventas@dinor-industrial.com.mx',
    currency: 'MXN',
    exchangeRateAtSubmission: 1.0,
    validityDays: 30,
    paymentTerms: 'Crédito 30 días',
    warrantyMonths: 12,
    generalNotes: 'Disponibilidad inmediata en almacén Monterrey. Entrega incluida en planta.',
    items: [
      {
        productId: 'prod-1',
        unitPrice: 1680.0,
        leadTimeDays: 3,
        brandOrModel: 'Genebre Spain',
        notes: 'Certificado de calidad 3.1 incluido',
      },
      {
        productId: 'prod-2',
        unitPrice: 4620.0,
        leadTimeDays: 4,
        brandOrModel: 'SKF Original Suecia',
        notes: 'Lote nuevo 2026 con sello holográfico',
      },
    ],
    submittedAt: '2026-09-04T11:20:00Z',
  },
  {
    id: 'quot-2',
    rfqId: 'rfq-101',
    token: 'token-sup-2-rfq-101',
    supplierId: 'sup-2',
    supplierName: 'Apex Global Supply LLC',
    supplierEmail: 'bids@apexmetalsupply.com',
    currency: 'USD',
    exchangeRateAtSubmission: 19.85,
    validityDays: 60,
    paymentTerms: 'Crédito 45 días',
    warrantyMonths: 24,
    generalNotes: 'Precios DDP puesto en su planta Apodaca, despachado de aduana incluido.',
    items: [
      {
        productId: 'prod-1',
        unitPrice: 76.5,
        leadTimeDays: 7,
        brandOrModel: 'Apollo Valves USA',
        notes: 'High performance industrial series',
      },
      {
        productId: 'prod-2',
        unitPrice: 218.0,
        leadTimeDays: 7,
        brandOrModel: 'SKF Heavy Duty USA',
        notes: 'Manufactured under ISO 9001 specs',
      },
    ],
    submittedAt: '2026-09-05T16:45:00Z',
  },
  {
    id: 'quot-3',
    rfqId: 'rfq-101',
    token: 'token-sup-3-rfq-101',
    supplierId: 'sup-3',
    supplierName: 'Equipos Hidráulicos y Automatización Bajío',
    supplierEmail: 'cotizaciones@ehabajio.com',
    currency: 'MXN',
    exchangeRateAtSubmission: 1.0,
    validityDays: 15,
    paymentTerms: '50% anticipo, 50% contra entrega',
    warrantyMonths: 6,
    generalNotes: 'Precios sujetos a disponibilidad de inventario.',
    items: [
      {
        productId: 'prod-1',
        unitPrice: 1820.0,
        leadTimeDays: 2,
        brandOrModel: 'Worcester',
        notes: 'En stock para entrega inmediata',
      },
      {
        productId: 'prod-2',
        unitPrice: 4890.0,
        leadTimeDays: 2,
        brandOrModel: 'FAG / Schaeffler',
        notes: 'Equivalente técnico de alta gama',
      },
    ],
    submittedAt: '2026-09-06T09:10:00Z',
  },
];

export const INITIAL_SPOT_REQUESTS: SpotRequest[] = [
  {
    id: 'spot-1',
    organizationId: 'org-1',
    organizationName: 'Manufacturas del Norte S.A. de C.V.',
    code: 'SPOT-2026-0012',
    title: 'URGENTE: Empaque Clamp de Teflón Sanitario 3" para Paro de Línea',
    description: 'Fuga en reactor de jarabe. Se requieren 4 empaques tri-clamp PTFE virgen grado alimenticio hoy antes de las 6:00 PM.',
    category: 'Mantenimiento Urgente',
    quantity: 4,
    unit: 'Pza',
    urgency: 'urgent_4h',
    deadlineHours: 4,
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    partNumberOrRef: 'TC-PTFE-300-FDA',
    status: 'active',
    targetPlant: 'Planta de Bebidas - Línea 2',
    createdAt: '2026-09-09T08:30:00Z',
    bids: [
      {
        id: 'sbid-1',
        supplierId: 'sup-1',
        supplierName: 'Distribuidora Industrial del Norte',
        unitPrice: 385.0,
        currency: 'MXN',
        deliveryTimeHours: 2,
        availability: 'in_stock',
        brandNotes: 'Garlock Original en almacén local Monterrey. Entrega en taxi industrial.',
        validityHours: 12,
        submittedAt: '2026-09-09T09:15:00Z',
      },
      {
        id: 'sbid-2',
        supplierId: 'sup-3',
        supplierName: 'Equipos Hidráulicos y Automatización Bajío',
        unitPrice: 420.0,
        currency: 'MXN',
        deliveryTimeHours: 3,
        availability: 'in_stock',
        brandNotes: 'Parker Sanitario FDA certificado.',
        validityHours: 8,
        submittedAt: '2026-09-09T09:40:00Z',
      },
    ],
  },
  {
    id: 'spot-2',
    organizationId: 'org-1',
    organizationName: 'Manufacturas del Norte S.A. de C.V.',
    code: 'SPOT-2026-0014',
    title: 'Kit de Soldadura TIG y Varilla Inox 316L (Ocasión para Reparación de Tolva)',
    description: 'Compra spot para cuadrilla de contratistas de este fin de semana.',
    category: 'Ferretería y Taller',
    quantity: 15,
    unit: 'Kg',
    urgency: 'urgent_24h',
    deadlineHours: 24,
    photoUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
    partNumberOrRef: 'VAR-316L-1/8',
    status: 'active',
    targetPlant: 'Taller Central de Mantenimiento',
    createdAt: '2026-09-08T16:00:00Z',
    bids: [
      {
        id: 'sbid-3',
        supplierId: 'sup-5',
        supplierName: 'Tornillería y Fijaciones Especiales de México',
        unitPrice: 310.0,
        currency: 'MXN',
        deliveryTimeHours: 18,
        availability: 'next_day',
        brandNotes: 'Infra / Lincoln Electric con certificado químico.',
        validityHours: 24,
        submittedAt: '2026-09-08T18:20:00Z',
      },
    ],
  },
];

// Helper de persistencia en localStorage para browser y fallback en SSR
const IS_SERVER = typeof window === 'undefined';

export function getStoredData<T>(key: string, initialValue: T): T {
  if (IS_SERVER) return initialValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return initialValue;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  if (IS_SERVER) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing localStorage key "${key}":`, error);
  }
}

// Convertidor de divisas
export function convertToBaseMxn(amount: number, currency: Currency, customRate?: number): number {
  if (currency === 'MXN') return amount;
  if (customRate) return amount * customRate;
  const rateObj = DEFAULT_RATES.find((r) => r.code === currency);
  return amount * (rateObj?.rateToMxn || 1.0);
}

export function formatMoney(amount: number, currency: Currency = 'MXN'): string {
  const symbol = currency === 'USD' ? 'US$' : currency === 'EUR' ? '€' : '$';
  return `${symbol}${amount.toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

// Cálculo del Cuadro Comparativo Multimoneda
export function calculateComparison(rfq: RFQ, quotations: Quotation[]) {
  const referenceTotalMxn = rfq.items.reduce(
    (sum, item) => sum + item.referencePriceMxn * item.quantity,
    0
  );

  const rows: ComparisonItemRow[] = rfq.items.map((rfqItem) => {
    const bidsBySupplier: ComparisonItemRow['bidsBySupplier'] = {};
    let minPriceInBase = Infinity;

    quotations.forEach((quot) => {
      const bid = quot.items.find((i) => i.productId === rfqItem.productId);
      if (bid) {
        const priceInBaseMxn = convertToBaseMxn(
          bid.unitPrice,
          quot.currency,
          quot.exchangeRateAtSubmission
        );
        const totalInBaseMxn = priceInBaseMxn * rfqItem.quantity;

        bidsBySupplier[quot.supplierId] = {
          originalPrice: bid.unitPrice,
          originalCurrency: quot.currency,
          priceInBaseMxn,
          totalInBaseMxn,
          leadTimeDays: bid.leadTimeDays,
          brand: bid.brandOrModel,
        };

        if (priceInBaseMxn < minPriceInBase) {
          minPriceInBase = priceInBaseMxn;
        }
      }
    });

    Object.keys(bidsBySupplier).forEach((supId) => {
      if (Math.abs(bidsBySupplier[supId].priceInBaseMxn - minPriceInBase) < 0.01) {
        bidsBySupplier[supId].isLowest = true;
      }
    });

    return {
      productId: rfqItem.productId,
      productName: rfqItem.productName,
      sku: rfqItem.sku,
      quantity: rfqItem.quantity,
      referencePriceMxn: rfqItem.referencePriceMxn,
      bidsBySupplier,
    };
  });

  const supplierScores: SupplierSummaryScore[] = quotations.map((quot) => {
    let totalOriginal = 0;
    let totalBaseMxn = 0;
    let totalLeadTime = 0;
    let itemCount = 0;

    quot.items.forEach((bid) => {
      const rfqItem = rfq.items.find((i) => i.productId === bid.productId);
      if (rfqItem) {
        totalOriginal += bid.unitPrice * rfqItem.quantity;
        const priceBase = convertToBaseMxn(
          bid.unitPrice,
          quot.currency,
          quot.exchangeRateAtSubmission
        );
        totalBaseMxn += priceBase * rfqItem.quantity;
        totalLeadTime += bid.leadTimeDays;
        itemCount++;
      }
    });

    const avgLeadTimeDays = itemCount > 0 ? Math.round(totalLeadTime / itemCount) : 0;
    const savingsAmountMxn = referenceTotalMxn - totalBaseMxn;
    const savingsPercent = referenceTotalMxn > 0 ? (savingsAmountMxn / referenceTotalMxn) * 100 : 0;

    return {
      supplierId: quot.supplierId,
      supplierName: quot.supplierName,
      quotationId: quot.id,
      originalCurrency: quot.currency,
      totalOriginal,
      totalBaseMxn,
      avgLeadTimeDays,
      validityDays: quot.validityDays,
      paymentTerms: quot.paymentTerms,
      savingsAmountMxn,
      savingsPercent,
      isRecommended: false,
      isAwarded: rfq.awardedSupplierId === quot.supplierId,
    };
  });

  if (supplierScores.length > 0) {
    const sorted = [...supplierScores].sort((a, b) => a.totalBaseMxn - b.totalBaseMxn);
    const best = sorted[0];
    const match = supplierScores.find((s) => s.supplierId === best.supplierId);
    if (match) match.isRecommended = true;
  }

  return {
    referenceTotalMxn,
    rows,
    supplierScores,
  };
}

// -------------------------------------------------------------
// CUENTAS DEMO Y USUARIO INICIAL
// -------------------------------------------------------------
export const INITIAL_DEMO_USERS: DemoAccount[] = [
  {
    id: 'demo-buyer-1',
    email: 'andrea.morales@manufacturasnorte.com',
    name: 'Lic. Andrea Morales',
    role: 'buyer',
    jobTitle: 'Gerente de Compras & Sourcing',
    companyName: 'Manufacturas del Norte S.A. de C.V.',
    entityId: 'org-1',
    description: 'Gestión de licitaciones, compras de planta, aprobación de catálogo y ahorro consolidado en MXN.',
    initials: 'AM',
  },
  {
    id: 'demo-buyer-2',
    email: 'claudia.mendez@santaclara-alimentos.com',
    name: 'Lic. Claudia Méndez',
    role: 'buyer',
    jobTitle: 'Jefa de Abastecimiento Estratégico',
    companyName: 'Alimentos & Bebidas Santa Clara',
    entityId: 'org-2',
    description: 'Control de compras sanitarias, grado alimenticio y licitaciones de empaque.',
    initials: 'CM',
  },
  {
    id: 'demo-supplier-1',
    email: 'ventas@dinor-industrial.com.mx',
    name: 'Ing. Roberto Garza',
    role: 'supplier',
    jobTitle: 'Director Comercial & Proyectos',
    companyName: 'DINOR S.A. de C.V.',
    entityId: 'sup-1',
    description: 'Proveedor nacional de rodamientos, ferretería y transmisión de potencia.',
    initials: 'RG',
  },
  {
    id: 'demo-supplier-2',
    email: 'bids@apexmetalsupply.com',
    name: 'Marc Davis',
    role: 'supplier',
    jobTitle: 'VP Key Accounts (USA)',
    companyName: 'Apex Global Supply LLC',
    entityId: 'sup-2',
    description: 'Proveedor internacional en USD de tubería, bridas y válvulas de acero inoxidable.',
    initials: 'MD',
  },
];

export const DEFAULT_USER: UserProfile = {
  id: 'usr-1',
  email: 'andrea.morales@manufacturasnorte.com',
  name: 'Lic. Andrea Morales',
  role: 'buyer',
  jobTitle: 'Gerente de Compras & Sourcing',
  organizationId: 'org-1',
  organizationName: 'Manufacturas del Norte S.A. de C.V.',
};

