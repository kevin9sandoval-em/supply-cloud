'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Zap,
  ArrowLeft,
  Flame,
  Clock,
  Building2,
  Camera,
  Layers,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SpotUrgency } from '@/types';

export default function NuevaCotizacionRapidaPage() {
  const router = useRouter();
  const { createSpotRequest, categories } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Mantenimiento Urgente');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('Pza');
  const [urgency, setUrgency] = useState<SpotUrgency>('urgent_4h');
  const [partNumberOrRef, setPartNumberOrRef] = useState('');
  const [targetPlant, setTargetPlant] = useState('Planta 1 — Taller Central');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Por favor indica qué producto o material requieres con urgencia.');
      return;
    }

    const deadlineHours = urgency === 'urgent_4h' ? 4 : urgency === 'urgent_24h' ? 24 : 48;

    createSpotRequest({
      title: title.trim(),
      description: description.trim() || 'Requerimiento de compra spot inmediata sin SKU previo.',
      category,
      quantity,
      unit,
      urgency,
      deadlineHours,
      photoUrl,
      partNumberOrRef: partNumberOrRef.trim() || undefined,
      targetPlant,
    });

    router.push('/cotizaciones-rapidas');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-4">
        <Link
          href="/cotizaciones-rapidas"
          className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Tablero Spot</span>
        </Link>
      </div>

      <div className="flex items-center space-x-3 pb-6 border-b border-slate-800">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Zap className="w-6 h-6 fill-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Lanzar Cotización Rápida (Compra Spot)
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Sin catálogo ni trámites previos. Notifica a tus proveedores y recibe precios en tiempo récord.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Selector de Nivel de Urgencia */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            Nivel de Urgencia / Tiempo Máximo de Respuesta *
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => setUrgency('urgent_4h')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                urgency === 'urgent_4h'
                  ? 'bg-red-950/40 border-red-500 shadow-md shadow-red-950/20'
                  : 'bg-slate-950 border-slate-800 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center space-x-2 text-red-400 font-black text-xs">
                <Flame className="w-4 h-4 fill-red-400" />
                <span>Paro de Línea (4 Horas)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Máxima prioridad. Notificación SMS/Email de alta urgencia a proveedores.
              </p>
            </div>

            <div
              onClick={() => setUrgency('urgent_24h')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                urgency === 'urgent_24h'
                  ? 'bg-amber-950/40 border-amber-500 shadow-md shadow-amber-950/20'
                  : 'bg-slate-950 border-slate-800 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                <Clock className="w-4 h-4" />
                <span>Urgencia Hoy (24 Horas)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Para surtido mismo día o turno siguiente.
              </p>
            </div>

            <div
              onClick={() => setUrgency('standard_48h')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                urgency === 'standard_48h'
                  ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-950/20'
                  : 'bg-slate-950 border-slate-800 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs">
                <Clock className="w-4 h-4" />
                <span>Compra Spot (48 Horas)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Para trabajos del fin de semana o cuadrillas temporales.
              </p>
            </div>
          </div>
        </div>

        {/* Datos de lo que urge */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              ¿Qué material o refacción urge cotizar? *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Válvula de solenoide 24VDC 1/2 pulg Parker o equivalente urgente"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Número de Parte o Referencia Marcada (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. SKF 6205-2RSH, Parker 7321..."
                value={partNumberOrRef}
                onChange={(e) => setPartNumberOrRef(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Familia o Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cantidad *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Unidad
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="Pza">Piezas (Pza)</option>
                  <option value="Kg">Kilos (Kg)</option>
                  <option value="Metro">Metros (m)</option>
                  <option value="Litro">Litros (L)</option>
                  <option value="Caja">Caja / Kit</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Planta o Punto de Entrega
              </label>
              <input
                type="text"
                value={targetPlant}
                onChange={(e) => setTargetPlant(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              URL de Foto (o foto tomada con el celular)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Detalles o Síntoma de la Falla
            </label>
            <textarea
              rows={2}
              placeholder="Indica si se acepta marca equivalente o si debe ser idéntica a la instalada..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
            ></textarea>
          </div>
        </div>

        {/* Botón Publicar */}
        <div className="flex items-center justify-end space-x-4 pt-2">
          <Link
            href="/cotizaciones-rapidas"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xl shadow-amber-500/20 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Alertar a Proveedores y Publicar Urgencia</span>
          </button>
        </div>
      </form>
    </div>
  );
}
