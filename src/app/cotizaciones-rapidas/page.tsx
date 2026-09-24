'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  Plus,
  Clock,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Building2,
  Phone,
  Send,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Eye,
  Check,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatMoney } from '@/lib/store';
import { SpotRequest, SpotBid, Currency } from '@/types';

export default function CotizacionesRapidasPage() {
  const { spotRequests, suppliers, acceptSpotBid, submitSpotBid } = useApp();
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [selectedSpotForBid, setSelectedSpotForBid] = useState<SpotRequest | null>(null);

  // Formulario rápido para simular oferta de proveedor
  const [bidSupplierId, setBidSupplierId] = useState(suppliers[0]?.id || '');
  const [bidPrice, setBidPrice] = useState('');
  const [bidCurrency, setBidCurrency] = useState<Currency>('MXN');
  const [bidHours, setBidHours] = useState(2);
  const [bidNotes, setBidNotes] = useState('');

  const filteredSpots = spotRequests.filter((s) => {
    if (filterUrgency === 'all') return true;
    return s.urgency === filterUrgency;
  });

  const getUrgencyBadge = (urgency: SpotRequest['urgency']) => {
    switch (urgency) {
      case 'urgent_4h':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-red-950 text-red-400 border border-red-800 animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-red-400" />
            <span>Paro de Línea (4 hrs)</span>
          </span>
        );
      case 'urgent_24h':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Urgencia 24 hrs</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-800">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Spot 48 hrs</span>
          </span>
        );
    }
  };

  const handleSimulateBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpotForBid || !bidPrice) return;

    const sup = suppliers.find((s) => s.id === bidSupplierId);
    if (!sup) return;

    submitSpotBid(selectedSpotForBid.id, {
      supplierId: sup.id,
      supplierName: sup.name,
      unitPrice: parseFloat(bidPrice) || 0,
      currency: bidCurrency,
      deliveryTimeHours: bidHours,
      availability: bidHours <= 4 ? 'in_stock' : 'next_day',
      brandNotes: bidNotes || 'Pieza en almacén con entrega directa.',
      validityHours: 12,
    });

    setSelectedSpotForBid(null);
    setBidPrice('');
    setBidNotes('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5 fill-amber-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Cotizaciones Rápidas — Compras Spot & Urgencias
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Para compras de ocasión, paros de planta o refacciones no catalogadas. Cero burocracia de SKU: describe, sube foto y recibe ofertas en minutos.
          </p>
        </div>

        <Link
          href="/cotizaciones-rapidas/nueva"
          className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Publicar Cotización Urgente</span>
        </Link>
      </div>

      {/* Filtros de Urgencia */}
      <div className="flex items-center space-x-2 my-6">
        <span className="text-xs text-slate-400 mr-2 font-medium">Filtrar por urgencia:</span>
        {[
          { id: 'all', label: 'Todas las Spot' },
          { id: 'urgent_4h', label: '🔴 Paro de Máquina (4h)' },
          { id: 'urgent_24h', label: '🟡 Urgencia 24h' },
          { id: 'standard_48h', label: '🔵 Spot 48h' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterUrgency(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterUrgency === f.id
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista de Requerimientos Spot */}
      <div className="space-y-6">
        {filteredSpots.map((spot) => {
          const acceptedBid = spot.bids.find((b) => b.isAccepted);

          return (
            <div
              key={spot.id}
              className={`bg-slate-900 border rounded-2xl p-6 shadow-sm transition-all ${
                spot.urgency === 'urgent_4h'
                  ? 'border-red-500/40 shadow-red-950/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* Lado izquierdo: Foto y descripción */}
                <div className="flex items-start space-x-4 max-w-2xl">
                  {spot.photoUrl && (
                    <img
                      src={spot.photoUrl}
                      alt={spot.title}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-slate-950 border border-slate-800 shrink-0 shadow"
                    />
                  )}

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded">
                        {spot.code}
                      </span>
                      {getUrgencyBadge(spot.urgency)}
                      {spot.status === 'awarded' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Adjudicada & En Ruta</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-white leading-snug">
                      {spot.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {spot.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
                      <span>
                        Cantidad requerida:{' '}
                        <strong className="text-white font-mono">
                          {spot.quantity} {spot.unit}
                        </strong>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>{spot.targetPlant}</span>
                      </span>
                      {spot.partNumberOrRef && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-sky-400">
                            Ref/Parte: {spot.partNumberOrRef}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lado derecho: Acciones */}
                <div className="shrink-0 flex items-center space-x-3 self-end lg:self-start">
                  <button
                    onClick={() => setSelectedSpotForBid(spot)}
                    className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                    title="Simular que un proveedor envía una oferta spot inmediata"
                  >
                    <span>+ Simular Oferta Proveedor</span>
                  </button>
                </div>
              </div>

              {/* Ofertas Inmediatas Recibidas */}
              <div className="mt-6 pt-5 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                    <span>Ofertas Rápidas Recibidas ({spot.bids.length}):</span>
                  </span>

                  {spot.bids.length > 0 && !acceptedBid && (
                    <span className="text-[11px] text-amber-400 font-medium">
                      Revisa tiempo de entrega y haz clic en "Aceptar Oferta"
                    </span>
                  )}
                </div>

                {spot.bids.length === 0 ? (
                  <div className="text-xs text-slate-500 italic p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    Esperando respuesta de proveedores convocados. Las cotizaciones spot suelen llegar en los primeros 15 a 45 minutos.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {spot.bids.map((bid) => (
                      <div
                        key={bid.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                          bid.isAccepted
                            ? 'bg-emerald-950/40 border-emerald-500/60 shadow'
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-bold text-xs text-white">
                                {bid.supplierName}
                              </span>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                Vigencia de oferta: {bid.validityHours} horas
                              </div>
                            </div>

                            <span className="font-mono text-sm font-black text-emerald-400">
                              {formatMoney(bid.unitPrice * spot.quantity, bid.currency)}
                            </span>
                          </div>

                          <div className="mt-3 text-xs text-slate-300">
                            <span className="inline-flex items-center space-x-1 font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded text-[11px] mb-1.5">
                              <Clock className="w-3 h-3" />
                              <span>Entrega en: {bid.deliveryTimeHours} horas</span>
                            </span>
                            <p className="text-[11px] text-slate-400 line-clamp-2">
                              {bid.brandNotes}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 font-mono">
                            Unitario: {formatMoney(bid.unitPrice, bid.currency)}
                          </span>

                          {bid.isAccepted ? (
                            <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Aceptada</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => acceptSpotBid(spot.id, bid.id)}
                              disabled={!!acceptedBid}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                acceptedBid
                                  ? 'opacity-30 cursor-not-allowed bg-slate-800 text-slate-500'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                              }`}
                            >
                              Aceptar Oferta
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal para Simular Oferta Spot de Proveedor */}
      {selectedSpotForBid && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h2 className="text-base font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Simular Oferta Rápida de Proveedor</span>
            </h2>

            <form onSubmit={handleSimulateBid} className="space-y-4 mt-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Proveedor que Cotiza
                </label>
                <select
                  value={bidSupplierId}
                  onChange={(e) => setBidSupplierId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Precio Unitario *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="450.00"
                    value={bidPrice}
                    onChange={(e) => setBidPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Moneda
                  </label>
                  <select
                    value={bidCurrency}
                    onChange={(e) => setBidCurrency(e.target.value as Currency)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs font-bold"
                  >
                    <option value="MXN">MXN ($)</option>
                    <option value="USD">USD (US$)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tiempo de Entrega (Horas) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={bidHours}
                  onChange={(e) => setBidHours(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Disponibilidad y Marca
                </label>
                <input
                  type="text"
                  placeholder="Ej. Stock listo para recoger en sucursal hoy"
                  value={bidNotes}
                  onChange={(e) => setBidNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedSpotForBid(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow"
                >
                  Enviar Oferta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
