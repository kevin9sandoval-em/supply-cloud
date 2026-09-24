'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  FileSpreadsheet,
  ArrowLeft,
  Boxes,
  Users,
  Calendar,
  Building2,
  Plus,
  Trash2,
  Check,
  ShieldCheck,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { RFQItem } from '@/types';
import { formatMoney } from '@/lib/store';

function NuevaLicitacionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoriaFromUrl = searchParams.get('categoriaId');

  const { products, suppliers, categories, createRFQ } = useApp();

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Mantenimiento y Refacciones');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('2026-09-30');

  // Items seleccionados
  const [selectedItems, setSelectedItems] = useState<RFQItem[]>([]);
  // Proveedores invitados
  const [invitedSuppliers, setInvitedSuppliers] = useState<string[]>(
    suppliers.map((s) => s.id)
  );

  // Cargar productos automáticamente si vino con parámetro de categoría
  useEffect(() => {
    if (categoriaFromUrl) {
      loadCategoryBundle(categoriaFromUrl);
      setTitle(`Licitación Programada — Paquete ${categoriaFromUrl}`);
    }
  }, [categoriaFromUrl]);

  const loadCategoryBundle = (catName: string) => {
    const catProducts = products.filter(
      (p) => p.category.toLowerCase() === catName.toLowerCase()
    );

    if (catProducts.length === 0) return;

    const bundleItems: RFQItem[] = catProducts.map((prod) => ({
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      photoUrl: prod.photoUrl,
      unit: prod.unit,
      quantity: prod.minStock || 10,
      referencePriceMxn: prod.referencePriceMxn,
      specNotes: prod.technicalSpecs,
    }));

    setSelectedItems(bundleItems);
  };

  const handleAddItem = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    if (selectedItems.some((it) => it.productId === productId)) {
      alert('Este producto ya fue agregado a la licitación.');
      return;
    }

    const newItem: RFQItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      photoUrl: prod.photoUrl,
      unit: prod.unit,
      quantity: 1,
      referencePriceMxn: prod.referencePriceMxn,
      specNotes: prod.technicalSpecs,
    };

    setSelectedItems([...selectedItems, newItem]);
  };

  const handleUpdateQuantity = (itemId: string, qty: number) => {
    setSelectedItems(
      selectedItems.map((it) => (it.id === itemId ? { ...it, quantity: Math.max(1, qty) } : it))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter((it) => it.id !== itemId));
  };

  const handleToggleSupplier = (supplierId: string) => {
    if (invitedSuppliers.includes(supplierId)) {
      setInvitedSuppliers(invitedSuppliers.filter((id) => id !== supplierId));
    } else {
      setInvitedSuppliers([...invitedSuppliers, supplierId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      alert('Ingresa el título del requerimiento o licitación.');
      return;
    }

    if (selectedItems.length === 0) {
      alert('Debes agregar al menos 1 producto del catálogo a la licitación.');
      return;
    }

    if (invitedSuppliers.length === 0) {
      alert('Debes seleccionar al menos 1 proveedor para invitar.');
      return;
    }

    const created = createRFQ({
      title: title.trim(),
      department,
      description: description.trim(),
      status: 'open',
      deadline: new Date(deadline).toISOString(),
      baseCurrency: 'MXN',
      items: selectedItems,
      invitedSupplierIds: invitedSuppliers,
    });

    router.push(`/licitaciones/${created.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-4">
        <Link
          href="/licitaciones"
          className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a Licitaciones</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Crear Nueva Licitación / RFQ
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Define las partidas con fotos del catálogo o jala paquetes completos por categoría.
          </p>
        </div>
      </div>

      {/* Banner de carga rápida por categoría */}
      <div className="my-6 p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs text-slate-300 font-medium">
            ¿Deseas precargar un paquete completo? Selecciona una categoría:
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                loadCategoryBundle(cat.name);
                setTitle(`Licitación Programada — Paquete ${cat.name}`);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-950 border border-slate-700 text-slate-300 hover:text-white hover:border-blue-500 transition-colors"
            >
              + {cat.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        {/* Paso 1: Información General */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white flex items-center space-x-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-black">
              1
            </span>
            <span>Datos del Requerimiento</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Título de la Licitación *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Suministro Anual de EPP y Calzado de Seguridad para Planta 2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Departamento / Centro de Costos
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Fecha Límite de Recepción de Cotizaciones *
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Instrucciones Generales para Proveedores
              </label>
              <textarea
                rows={2}
                placeholder="Indica condiciones de entrega (puesto en planta), certificados de calidad requeridos..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Paso 2: Selección de Partidas del Catálogo */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-black">
                2
              </span>
              <span>Productos / Partidas a Cotizar ({selectedItems.length})</span>
            </h2>

            {/* Selector rápido individual */}
            <div className="flex items-center space-x-2">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddItem(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                defaultValue=""
              >
                <option value="" disabled>
                  + Agregar producto individual desde catálogo...
                </option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.sku}] {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedItems.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
              <Boxes className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-300 font-medium">No has agregado productos a cotizar</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Usa el selector arriba o haz clic en las categorías sugeridas para cargar paquetes completos.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedItems.map((it) => (
                <div
                  key={it.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={it.photoUrl}
                      alt={it.productName}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-sky-400">{it.sku}</span>
                        <span className="text-xs font-semibold text-white">{it.productName}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Ref: {formatMoney(it.referencePriceMxn, 'MXN')} / {it.unit}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400">Cantidad:</span>
                      <input
                        type="number"
                        min="1"
                        value={it.quantity}
                        onChange={(e) => handleUpdateQuantity(it.id, parseInt(e.target.value) || 1)}
                        className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-white text-center"
                      />
                      <span className="text-xs text-slate-300 font-medium">{it.unit}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(it.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900 transition-colors"
                      title="Eliminar partida"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Paso 3: Proveedores Invitados */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white flex items-center space-x-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-black">
              3
            </span>
            <span>Proveedores Convocados a Cotizar a Ciegas</span>
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Cada proveedor recibirá un enlace único y no podrá ver quiénes más participan ni qué montos ofrecen.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {suppliers.map((sup) => {
              const isSelected = invitedSuppliers.includes(sup.id);
              return (
                <div
                  key={sup.id}
                  onClick={() => handleToggleSupplier(sup.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500/60 shadow-sm'
                      : 'bg-slate-950 border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{sup.name}</span>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center ${
                          isSelected ? 'bg-blue-600 text-white' : 'border border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">{sup.category}</div>
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono mt-3">
                    {sup.contactEmail}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botón Publicar */}
        <div className="flex items-center justify-end space-x-4 pt-4">
          <Link
            href="/licitaciones"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-7 py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Publicar Licitación y Generar Enlaces</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NuevaLicitacionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Cargando formulario...</div>}>
      <NuevaLicitacionContent />
    </Suspense>
  );
}
