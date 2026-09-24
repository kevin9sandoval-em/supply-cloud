'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  Layers,
  FileText,
  DollarSign,
  Check,
  X,
  Sparkles,
  Download,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatMoney } from '@/lib/store';
import { Product } from '@/types';
import {
  downloadCatalogTemplateCSV,
  exportCatalogToCSV,
  parseCatalogCSV,
} from '@/lib/csvHelper';

export default function CatalogoPage() {
  const { products, addProduct, addBulkProducts, activeOrg } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Estado de carga masiva
  const [bulkCsvText, setBulkCsvText] = useState('');
  const [parsedPreview, setParsedPreview] = useState<Omit<Product, 'id' | 'organizationId'>[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Formulario individual nuevo producto
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Mantenimiento y Refacciones');
  const [unit, setUnit] = useState('Pza');
  const [referencePriceMxn, setReferencePriceMxn] = useState('');
  const [description, setDescription] = useState('');
  const [technicalSpecs, setTechnicalSpecs] = useState('');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
  );

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || prod.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || !referencePriceMxn) {
      alert('Por favor completa los campos obligatorios (Nombre, SKU y Precio de Referencia).');
      return;
    }

    addProduct({
      sku: sku.trim().toUpperCase(),
      name: name.trim(),
      category,
      unit,
      referencePriceMxn: parseFloat(referencePriceMxn) || 0,
      description: description.trim(),
      technicalSpecs: technicalSpecs.trim(),
      photoUrl:
        photoUrl.trim() ||
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    });

    setIsModalOpen(false);
    setSku('');
    setName('');
    setDescription('');
    setTechnicalSpecs('');
    setReferencePriceMxn('');
  };

  // Manejo de archivo CSV cargado
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setBulkCsvText(text);
        const { products: parsed, errors } = parseCatalogCSV(text);
        setParsedPreview(parsed);
        setParseErrors(errors);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmBulkImport = () => {
    if (parsedPreview.length === 0) return;

    const count = addBulkProducts(parsedPreview);
    setIsBulkModalOpen(false);
    setBulkCsvText('');
    setParsedPreview([]);
    setParseErrors([]);
    setBulkSuccessMsg(`¡Se importaron ${count} productos exitosamente al catálogo de ${activeOrg.name}!`);
    setTimeout(() => setBulkSuccessMsg(null), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header con acciones masivas */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Catálogo Maestro de Productos
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800">
              {products.length} ítems en {activeOrg.name}
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Normaliza fotos, especificaciones técnicas y precios de referencia para cotizaciones inmediatas.
          </p>
        </div>

        {/* Botones de acción masiva */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => downloadCatalogTemplateCSV()}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Descargar archivo modelo de Excel/CSV para llenar productos masivos"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Descargar Plantilla CSV</span>
          </button>

          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
            title="Importar catálogo completo desde archivo Excel/CSV"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Carga Masiva Excel/CSV</span>
          </button>

          <button
            onClick={() => exportCatalogToCSV(products, activeOrg.name)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Exportar catálogo actual a archivo CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exportar</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Individual</span>
          </button>
        </div>
      </div>

      {bulkSuccessMsg && (
        <div className="my-4 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 flex items-center space-x-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{bulkSuccessMsg}</span>
        </div>
      )}

      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 my-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por SKU, nombre del producto o especificación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Todas las Categorías' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-sm flex flex-col group transition-all"
          >
            {/* Imagen del producto */}
            <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
              <img
                src={product.photoUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-slate-900/90 text-sky-400 border border-slate-700/80 backdrop-blur-sm shadow">
                  {product.sku}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900/90 text-slate-300 border border-slate-700/80 backdrop-blur-sm">
                  {product.unit}
                </span>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
                  {product.category}
                </div>
                <h3 className="font-bold text-white text-base mt-1 leading-snug">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                )}

                {product.technicalSpecs && (
                  <div className="mt-3 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300">
                    <span className="font-semibold text-slate-400 block mb-0.5">Especificación Técnica:</span>
                    {product.technicalSpecs}
                  </div>
                )}
              </div>

              {/* Precios y pie */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                    Costo de Referencia
                  </span>
                  <span className="text-base font-black text-emerald-400">
                    {formatMoney(product.referencePriceMxn, 'MXN')}
                  </span>
                </div>

                <span className="text-[11px] text-slate-500 font-mono">
                  Base {activeOrg.baseCurrency}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <Boxes className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No hay productos en esta vista</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Puedes cargar productos individuales o utilizar la <strong>Carga Masiva Excel/CSV</strong> para subir tu catálogo en bloque.
          </p>
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Cargar Catálogo Masivo</span>
          </button>
        </div>
      )}

      {/* MODAL DE CARGA MASIVA DE CATÁLOGO (EXCEL / CSV) */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    Carga Masiva de Catálogo (Excel / CSV)
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Importando para: <strong>{activeOrg.name}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 my-4 space-y-4 pr-1 text-xs">
              {/* Paso 1: Descargar Plantilla */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">1. ¿No tienes el formato oficial?</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Descarga la plantilla con encabezados estándar para llenarla en Excel.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => downloadCatalogTemplateCSV()}
                  className="px-3 py-1.5 rounded-lg font-semibold bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 shrink-0 flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Plantilla CSV</span>
                </button>
              </div>

              {/* Paso 2: Seleccionar Archivo */}
              <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-6 text-center bg-slate-950/60 transition-colors">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <FileSpreadsheet className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
                <div className="text-sm font-bold text-white">
                  Selecciona tu archivo CSV / Excel
                </div>
                <p className="text-slate-400 mt-1">
                  Guarda tu hoja de cálculo como archivo CSV delimitado por comas
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow"
                >
                  Examinar Archivo...
                </button>
              </div>

              {/* Errores de parseo */}
              {parseErrors.length > 0 && (
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 space-y-1">
                  <div className="font-bold flex items-center space-x-1 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>Se detectaron inconsistencias en algunas filas:</span>
                  </div>
                  <ul className="list-disc list-inside text-[11px] space-y-0.5 max-h-24 overflow-y-auto">
                    {parseErrors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Previsualización de filas leídas */}
              {parsedPreview.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-200">
                      Previsualización ({parsedPreview.length} productos listos para importar):
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold">
                      ✓ Validación superada
                    </span>
                  </div>

                  <div className="border border-slate-800 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-[11px] text-slate-300">
                      <thead className="bg-slate-950 text-slate-400 sticky top-0 border-b border-slate-800">
                        <tr>
                          <th className="px-3 py-2">SKU</th>
                          <th className="px-3 py-2">Nombre</th>
                          <th className="px-3 py-2">Categoría</th>
                          <th className="px-3 py-2 text-right">Precio Ref</th>
                          <th className="px-3 py-2">Unidad</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-900/60 font-mono">
                        {parsedPreview.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/40">
                            <td className="px-3 py-1.5 text-sky-400 font-bold">{item.sku}</td>
                            <td className="px-3 py-1.5 text-white font-sans truncate max-w-[200px]">
                              {item.name}
                            </td>
                            <td className="px-3 py-1.5 text-slate-400 font-sans">{item.category}</td>
                            <td className="px-3 py-1.5 text-right text-emerald-400">
                              {formatMoney(item.referencePriceMxn, 'MXN')}
                            </td>
                            <td className="px-3 py-1.5 text-slate-400 font-sans">{item.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Acciones */}
            <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsBulkModalOpen(false);
                  setParsedPreview([]);
                  setParseErrors([]);
                }}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkImport}
                disabled={parsedPreview.length === 0}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  parsedPreview.length > 0
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                Confirmar e Importar {parsedPreview.length} Productos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Individual Nuevo Producto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Boxes className="w-5 h-5 text-blue-400" />
                <span>Dar de Alta Producto en {activeOrg.name}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Código SKU *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. VAL-SS-02"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Unidad de Medida
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Pza">Pieza (Pza)</option>
                    <option value="Kg">Kilogramo (Kg)</option>
                    <option value="Metro">Metro (m)</option>
                    <option value="Litro">Litro (L)</option>
                    <option value="Caja">Caja / Lote</option>
                    <option value="Juego">Juego / Set</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre Oficial del Producto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Válvula de Mariposa 4 pulg con actuador neumático"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Categoría
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Precio Referencia (MXN) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="2500.00"
                    value={referencePriceMxn}
                    onChange={(e) => setReferencePriceMxn(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  URL de Foto del Producto
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Descripción y Requisitos Técnicos
                </label>
                <textarea
                  rows={2}
                  placeholder="Materiales, presiones de trabajo, normas ASTM/ISO aplicables..."
                  value={technicalSpecs}
                  onChange={(e) => setTechnicalSpecs(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30"
                >
                  Guardar en Catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
