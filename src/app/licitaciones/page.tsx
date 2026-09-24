'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  DollarSign,
  Building2,
  Eye,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatMoney } from '@/lib/store';

export default function LicitacionesListPage() {
  const { rfqs, quotations, suppliers } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredRfqs = rfqs.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const copySupplierLink = (rfqId: string) => {
    // Generamos un enlace de ejemplo para el primer proveedor invitado
    const url = `${window.location.origin}/portal-proveedor/token-sup-1-${rfqId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(rfqId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Licitaciones y Requisiciones (RFQs)
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Revisa el estado de cotización a ciegas de tus requerimientos y evalúa propuestas multimoneda.
          </p>
        </div>

        <Link
          href="/licitaciones/nueva"
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nueva Licitación</span>
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-2 my-6">
        {['all', 'open', 'evaluating', 'awarded'].map((status) => {
          const labels: Record<string, string> = {
            all: 'Todas',
            open: 'Abiertas',
            evaluating: 'En Evaluación',
            awarded: 'Adjudicadas',
          };
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {labels[status]}
            </button>
          );
        })}
      </div>

      {/* Grid de Licitaciones */}
      <div className="space-y-4">
        {filteredRfqs.map((rfq) => {
          const rfqQuotations = quotations.filter((q) => q.rfqId === rfq.id);
          const hasUsdBids = rfqQuotations.some((q) => q.currency === 'USD');
          const totalRefMxn = rfq.items.reduce((s, i) => s + i.referencePriceMxn * i.quantity, 0);

          return (
            <div
              key={rfq.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 shadow-sm transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/80 border border-sky-800/60 px-2.5 py-0.5 rounded-md">
                      {rfq.code}
                    </span>

                    {rfq.status === 'open' && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-800">
                        <Clock className="w-3 h-3 text-blue-400" />
                        <span>Abierta para Cotizar</span>
                      </span>
                    )}
                    {rfq.status === 'evaluating' && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-800">
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                        <span>En Evaluación ({rfqQuotations.length} cotizaciones)</span>
                      </span>
                    )}
                    {rfq.status === 'awarded' && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Adjudicada</span>
                      </span>
                    )}

                    {hasUsdBids && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-800 text-emerald-400 border border-emerald-500/30">
                        Multimoneda Activa (USD / MXN)
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white leading-snug">
                    {rfq.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                    {rfq.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{rfq.department}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        Cierre:{' '}
                        {new Date(rfq.deadline).toLocaleDateString('es-MX', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </span>
                    <span>•</span>
                    <span>
                      Presupuesto Base:{' '}
                      <strong className="text-white font-mono">
                        {formatMoney(totalRefMxn, 'MXN')}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <button
                    onClick={() => copySupplierLink(rfq.id)}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                    title="Copiar enlace para invitar a un proveedor a cotizar a ciegas"
                  >
                    {copiedId === rfq.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">¡Link Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Link Proveedor</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/licitaciones/${rfq.id}`}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Cuadro Comparativo</span>
                  </Link>
                </div>
              </div>

              {/* Muestra de productos incluidos */}
              <div className="mt-4 pt-4 border-t border-slate-800/70 flex flex-wrap items-center gap-3">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Partidas ({rfq.items.length}):
                </span>
                {rfq.items.map((it) => (
                  <span
                    key={it.id}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-950 text-xs text-slate-300 border border-slate-800"
                  >
                    <span className="font-mono text-sky-400 font-bold">{it.quantity} {it.unit}</span>
                    <span className="truncate max-w-[200px]">{it.productName}</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
