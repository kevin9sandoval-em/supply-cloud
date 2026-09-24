'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FolderTree,
  Plus,
  Boxes,
  ArrowRight,
  Shield,
  Wrench,
  Pipette,
  Settings,
  Zap,
  Layers,
  Sparkles,
  CheckCircle2,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatMoney } from '@/lib/store';

export default function CategoriasPage() {
  const { categories, products, addCategory } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Icon mapping
  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('seguridad') || lower.includes('epp')) return Shield;
    if (lower.includes('ferreteria') || lower.includes('tornill')) return Wrench;
    if (lower.includes('valvula') || lower.includes('tuberia')) return Pipette;
    if (lower.includes('transmision') || lower.includes('rodamiento')) return Settings;
    if (lower.includes('motor') || lower.includes('electr')) return Zap;
    return Layers;
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCategory({
      name: name.trim(),
      description: description.trim() || `Productos y suministros de ${name.trim()}`,
    });

    setIsModalOpen(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Gestión de Categorías y Paquetes de Licitación
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800">
              {categories.length} categorías
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Organiza tus productos por familias (EPP, Ferretería, Válvulas). Lanza licitaciones masivas por categoría con 1 clic.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {/* Explicación de la función "Licitar por Categoría" */}
      <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Automatización de Licitaciones por Paquete Completo
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Al pulsar <strong>"Licitar Categoría Completa"</strong>, el sistema jala automáticamente todos los SKUs, fotos y especificaciones de esa categoría a una nueva licitación a ciegas.
            </p>
          </div>
        </div>

        <Link
          href="/licitaciones/nueva"
          className="inline-flex items-center space-x-1 text-xs font-bold text-sky-400 hover:text-sky-300 shrink-0"
        >
          <span>Ir a creador manual</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid de Categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const catProducts = products.filter(
            (p) => p.category.toLowerCase() === cat.name.toLowerCase()
          );
          const Icon = getCategoryIcon(cat.name);
          const totalRefValue = catProducts.reduce((sum, p) => sum + p.referencePriceMxn, 0);

          return (
            <div
              key={cat.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Cabecera de la categoría */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base leading-snug">{cat.name}</h3>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {catProducts.length} productos registrados
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                {/* Vista previa de productos en esta categoría */}
                <div className="mt-4 pt-4 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-2">
                    Productos base en este paquete:
                  </span>

                  {catProducts.length === 0 ? (
                    <div className="text-xs text-slate-500 italic py-2">
                      Sin productos asignados aún. Agrega productos desde el Catálogo Maestro.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {catProducts.slice(0, 3).map((prod) => (
                        <div
                          key={prod.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs"
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <img
                              src={prod.photoUrl}
                              alt={prod.name}
                              className="w-6 h-6 rounded object-cover bg-slate-900 shrink-0"
                            />
                            <span className="truncate text-slate-200">{prod.name}</span>
                          </div>
                          <span className="font-mono text-emerald-400 font-bold shrink-0 ml-2">
                            {formatMoney(prod.referencePriceMxn, 'MXN')}
                          </span>
                        </div>
                      ))}

                      {catProducts.length > 3 && (
                        <div className="text-[11px] text-slate-500 text-center pt-1 font-medium">
                          + {catProducts.length - 3} productos más en esta categoría
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Botón Maestro: Licitar Categoría Completa */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <Link
                  href={`/catalogo?categoria=${encodeURIComponent(cat.name)}`}
                  className="text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Ver ítems
                </Link>

                <Link
                  href={`/licitaciones/nueva?categoriaId=${encodeURIComponent(cat.name)}`}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Licitar Categoría Completa</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Crear Nueva Categoría */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <FolderTree className="w-5 h-5 text-blue-400" />
                <span>Crear Nueva Categoría Base</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4 mt-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre de la Categoría *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Lubricantes y Grasas Especiales, Tornillería B7..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Descripción y Alcance
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe qué tipo de materiales o refacciones agrupa esta categoría para los clientes y proveedores..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  Guardar Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
