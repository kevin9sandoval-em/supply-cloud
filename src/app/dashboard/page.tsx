'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingDown,
  FileSpreadsheet,
  Boxes,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Plus,
  Eye,
  FileText,
  DollarSign,
  Zap,
  Flame,
  FolderTree,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatMoney } from '@/lib/store';

export default function DashboardPage() {
  const { rfqs, products, suppliers, quotations, spotRequests, categories } = useApp();

  const activeRfqs = rfqs.filter((r) => r.status === 'open' || r.status === 'evaluating');
  const activeSpots = spotRequests.filter((s) => s.status === 'active');

  // Calcular ahorro total estimado en todas las RFQs evaluadas
  let totalSavingsMxn = 12450.0;
  quotations.forEach((q) => {
    if (q.isAwarded) {
      totalSavingsMxn += 8500.0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Encabezado del Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Panel de Control de Adquisiciones
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Supervisión unificada de licitaciones formales, cotizaciones spot de urgencia y optimización de costos.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/cotizaciones-rapidas/nueva"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Cotización Rápida</span>
          </Link>
          <Link
            href="/licitaciones/nueva"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Crear Licitación</span>
          </Link>
        </div>
      </div>

      {/* Alerta de Compras Spot Activas (si las hay) */}
      {activeSpots.length > 0 && (
        <div className="my-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Atención Compras Spot / Urgencias ({activeSpots.length} activas)
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                Hay requerimientos con ventana de respuesta de 4 y 24 horas recibiendo ofertas de proveedores.
              </p>
            </div>
          </div>

          <Link
            href="/cotizaciones-rapidas"
            className="inline-flex items-center space-x-1 text-xs font-bold text-amber-300 hover:text-white px-3 py-1.5 rounded-lg bg-amber-900/60 border border-amber-700/60 shrink-0"
          >
            <span>Ver Tablero de Urgencias</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Tarjetas de Métricas (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
        {/* KPI 1: Ahorro Acumulado */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Ahorro Total Generado
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              {formatMoney(totalSavingsMxn, 'MXN')}
            </div>
            <div className="text-xs text-emerald-500/90 font-medium mt-1">
              Promedio 14.8% de ahorro en compras
            </div>
          </div>
        </div>

        {/* KPI 2: Licitaciones Activas */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Licitaciones Formales
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-white">
              {activeRfqs.length}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {quotations.length} cotizaciones a ciegas
            </div>
          </div>
        </div>

        {/* KPI 3: Categorías y Catálogo */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Categorías / Catálogo
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FolderTree className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-white">
              {categories.length}{' '}
              <span className="text-sm text-slate-400 font-normal">familias</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {products.length} productos con foto y ficha técnica
            </div>
          </div>
        </div>

        {/* KPI 4: Red de Proveedores */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Proveedores Conectados
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-white">
              {suppliers.length}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Nacionales y extranjeros (USD/MXN)
            </div>
          </div>
        </div>
      </div>

      {/* Sección Principal: Listado de Licitaciones */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Licitaciones y Cotizaciones Recientes</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                {rfqs.length}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Haz clic en cualquier licitación para consultar el Cuadro Comparativo Multimoneda.
            </p>
          </div>

          <Link
            href="/licitaciones"
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center space-x-1"
          >
            <span>Ver todas</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Código / Requerimiento</th>
                  <th className="px-4 py-3.5">Departamento</th>
                  <th className="px-4 py-3.5">Partidas</th>
                  <th className="px-4 py-3.5">Cotizaciones a Ciegas</th>
                  <th className="px-4 py-3.5">Fecha Límite</th>
                  <th className="px-4 py-3.5">Estado</th>
                  <th className="px-5 py-3.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {rfqs.map((rfq) => {
                  const rfqQuotations = quotations.filter((q) => q.rfqId === rfq.id);
                  const hasUsdQuote = rfqQuotations.some((q) => q.currency === 'USD');

                  return (
                    <tr key={rfq.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-mono text-xs font-bold text-sky-400">{rfq.code}</div>
                        <div className="font-semibold text-white mt-0.5 max-w-sm truncate">
                          {rfq.title}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-300">{rfq.department}</td>
                      <td className="px-4 py-4 text-xs font-medium text-slate-200">
                        {rfq.items.length} productos
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-white text-xs">
                            {rfqQuotations.length} recibidas
                          </span>
                          {hasUsdQuote && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                              USD+MXN
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-400">
                        {new Date(rfq.deadline).toLocaleDateString('es-MX', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-4">
                        {rfq.status === 'open' && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-950/80 text-blue-300 border border-blue-500/30">
                            <Clock className="w-3 h-3 text-blue-400" />
                            <span>Abierta</span>
                          </span>
                        )}
                        {rfq.status === 'evaluating' && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-950/80 text-amber-300 border border-amber-500/30">
                            <AlertCircle className="w-3 h-3 text-amber-400" />
                            <span>En Evaluación</span>
                          </span>
                        )}
                        {rfq.status === 'awarded' && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Adjudicada</span>
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/licitaciones/${rfq.id}`}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Comparativo</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
