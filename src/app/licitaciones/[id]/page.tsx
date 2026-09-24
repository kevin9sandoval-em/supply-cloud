'use client';

import React, { useState, use, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  DollarSign,
  TrendingDown,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Award,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  Building2,
  Sparkles,
  Info,
  Download,
  Upload,
  FileSpreadsheet,
  X,
  Printer,
  FileText,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calculateComparison, formatMoney } from '@/lib/store';
import {
  downloadRFQQuotationTemplateCSV,
  parseQuotationCSV,
} from '@/lib/csvHelper';
import { Currency, QuotationItemBid } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LicitacionDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { allRfqs, quotations, suppliers, awardRFQ, submitQuotation, rates } = useApp();
  const [viewMode, setViewMode] = useState<'baseMxn' | 'original'>('baseMxn');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [justAwarded, setJustAwarded] = useState<string | null>(null);

  // Modal para que el comprador suba cotización offline de un proveedor
  const [isBuyerUploadOpen, setIsBuyerUploadOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [uploadCurrency, setUploadCurrency] = useState<Currency>('MXN');
  const [uploadValidityDays, setUploadValidityDays] = useState(30);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const [isAwardDocOpen, setIsAwardDocOpen] = useState(false);
  const buyerFileInputRef = useRef<HTMLInputElement>(null);

  const rfq = allRfqs.find((r) => r.id === id);

  if (!rfq) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-white">Licitación no encontrada</h2>
        <Link href="/licitaciones" className="text-sky-400 text-sm mt-3 inline-block">
          ← Volver a listado
        </Link>
      </div>
    );
  }

  const rfqQuotations = quotations.filter((q) => q.rfqId === rfq.id);
  const { referenceTotalMxn, rows, supplierScores } = calculateComparison(rfq, rfqQuotations);

  const bestScore = supplierScores.find((s) => s.isRecommended);

  const handleAward = (supplierId: string, quotationId: string, supplierName: string) => {
    if (
      confirm(
        `¿Confirmas la adjudicación formal de la orden de compra a "${supplierName}"? Se notificará automáticamente al proveedor seleccionado.`
      )
    ) {
      awardRFQ(rfq.id, supplierId, quotationId);
      setJustAwarded(supplierName);
      setTimeout(() => setJustAwarded(null), 4000);
    }
  };

  const copyMagicLink = (supId: string) => {
    const url = `${window.location.origin}/portal-proveedor/token-${supId}-${rfq.id}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(supId);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  // Carga masiva por parte del comprador
  const handleBuyerCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const { bids, matchedCount } = parseQuotationCSV(text, rfq);

        if (matchedCount > 0) {
          const sup = suppliers.find((s) => s.id === selectedSupplierId);
          if (!sup) return;

          const itemsPayload: QuotationItemBid[] = rfq.items.map((it) => {
            const parsedBid = bids[it.productId];
            return {
              productId: it.productId,
              unitPrice: parsedBid ? parseFloat(parsedBid.price) || 0 : it.referencePriceMxn,
              leadTimeDays: parsedBid ? parsedBid.days : 5,
              brandOrModel: parsedBid?.brand || '',
              notes: parsedBid?.notes || 'Cargado vía archivo por equipo de compras',
            };
          });

          const rateObj = rates.find((r) => r.code === uploadCurrency);
          const exchangeRate = rateObj ? rateObj.rateToMxn : 1.0;

          submitQuotation({
            rfqId: rfq.id,
            organizationId: rfq.organizationId,
            token: `token-${sup.id}-${rfq.id}`,
            supplierId: sup.id,
            supplierName: sup.name,
            supplierEmail: sup.contactEmail,
            currency: uploadCurrency,
            exchangeRateAtSubmission: exchangeRate,
            validityDays: uploadValidityDays,
            paymentTerms: 'Crédito 30 días',
            warrantyMonths: 12,
            generalNotes: 'Oferta capturada desde archivo Excel recibido por el proveedor.',
            items: itemsPayload,
          });

          setIsBuyerUploadOpen(false);
          setUploadSuccessMsg(`¡Se cargó la cotización de ${sup.name} (${matchedCount} partidas) al comparativo!`);
          setTimeout(() => setUploadSuccessMsg(null), 5000);
        } else {
          alert('No se encontraron partidas coincidentes en el archivo. Verifica el SKU.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb & Header */}
      <div className="mb-4">
        <Link
          href="/licitaciones"
          className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a Licitaciones</span>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/80 border border-sky-800/60 px-2.5 py-0.5 rounded-md">
              {rfq.code}
            </span>

            {rfq.status === 'open' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-800">
                Abierta para Cotizar
              </span>
            )}
            {rfq.status === 'evaluating' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-800">
                En Evaluación ({rfqQuotations.length} cotizaciones a ciegas)
              </span>
            )}
            {rfq.status === 'awarded' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Adjudicada</span>
              </span>
            )}

            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
              Cliente: <span className="text-amber-400 font-semibold">{rfq.organizationName}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {rfq.title}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {rfq.department} • Cierre:{' '}
            {new Date(rfq.deadline).toLocaleDateString('es-MX', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Acciones de Divisa y Carga Masiva */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          {/* Descarga formato para proveedores */}
          <button
            onClick={() => downloadRFQQuotationTemplateCSV(rfq)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Descargar plantilla en blanco de esta licitación para proveedores"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Formato CSV Licitación</span>
          </button>

          {/* Carga de cotización offline por comprador */}
          <button
            onClick={() => setIsBuyerUploadOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-all"
            title="Cargar archivo Excel/CSV recibido de un proveedor"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>+ Cargar Oferta de Proveedor</span>
          </button>

          {/* Toggle de Divisas */}
          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('baseMxn')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'baseMxn'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Normalizado MXN ($ y %)
            </button>
            <button
              onClick={() => setViewMode('original')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'original'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Divisa Original
            </button>
          </div>

          {/* Acta de Fallo Imprimible si ya fue adjudicada */}
          {rfq.awardedSupplierId && (
            <button
              onClick={() => setIsAwardDocOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all"
              title="Generar Acta de Fallo y Dictamen de Adjudicación Imprimible"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Acta de Fallo / Dictamen</span>
            </button>
          )}
        </div>
      </div>

      {uploadSuccessMsg && (
        <div className="my-4 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 flex items-center space-x-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{uploadSuccessMsg}</span>
        </div>
      )}

      {justAwarded && (
        <div className="my-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 flex items-center space-x-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-sm">
            <strong>¡Orden de Compra Adjudicada con Éxito!</strong> Se ha seleccionado a{' '}
            <strong>{justAwarded}</strong>. La plataforma ha congelado los términos y generado la
            confirmación legal con el ahorro pactado.
          </div>
        </div>
      )}

      {/* Tarjeta de Oferta Ganadora Sugerida y Ahorro */}
      {bestScore && (
        <div className="my-6 bg-gradient-to-r from-blue-950/70 via-slate-900 to-emerald-950/50 border border-blue-500/40 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>

              <div>
                <div className="inline-flex items-center space-x-1 text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-1">
                  <span>Recomendación Inteligente de Adjudicación</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  {bestScore.supplierName}{' '}
                  {bestScore.originalCurrency !== 'MXN' && (
                    <span className="text-xs font-mono font-normal text-slate-400">
                      (Oferta en {bestScore.originalCurrency})
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Mejor balance de costo, tiempo promedio de entrega ({bestScore.avgLeadTimeDays} días) y{' '}
                  <strong>garantía de precio por {bestScore.validityDays} días</strong>.
                </p>
              </div>
            </div>

            {/* Cifras de Ahorro Clave ($ y %) */}
            <div className="flex flex-wrap items-center gap-4 bg-slate-950/70 border border-slate-800/80 p-4 rounded-xl">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  Total Normalizado
                </div>
                <div className="text-lg font-mono font-black text-white">
                  {formatMoney(bestScore.totalBaseMxn, 'MXN')}
                </div>
                {bestScore.originalCurrency !== 'MXN' && (
                  <div className="text-[10px] font-mono text-slate-500">
                    Orig: {formatMoney(bestScore.totalOriginal, bestScore.originalCurrency)}
                  </div>
                )}
              </div>

              <div className="h-10 w-px bg-slate-800 hidden sm:block"></div>

              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-400">
                  Ahorro en Dinero ($)
                </div>
                <div className="text-lg font-mono font-black text-emerald-400">
                  {bestScore.savingsAmountMxn >= 0 ? '+' : ''}
                  {formatMoney(bestScore.savingsAmountMxn, 'MXN')}
                </div>
                <div className="text-[10px] text-slate-400">vs. Costo de Referencia</div>
              </div>

              <div className="h-10 w-px bg-slate-800 hidden sm:block"></div>

              <div>
                <div className="text-[10px] uppercase font-bold text-sky-400">
                  Ahorro en Porcentaje (%)
                </div>
                <div className="text-xl font-mono font-black text-sky-400">
                  {bestScore.savingsPercent.toFixed(1)}%
                </div>
                <div className="text-[10px] text-slate-400">Margen ganado</div>
              </div>

              {!rfq.awardedSupplierId ? (
                <button
                  onClick={() => handleAward(bestScore.supplierId, bestScore.quotationId, bestScore.supplierName)}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all ml-auto"
                >
                  <Award className="w-4 h-4" />
                  <span>Adjudicar a este Proveedor</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsAwardDocOpen(true)}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/30 transition-all ml-auto"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Acta de Fallo</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Matriz Comparativa Detallada */}
      <div className="my-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Cuadro Comparativo de Partidas a Ciegas</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                {rfq.items.length} partidas evaluadas
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualización lado a lado. Los valores en verde destacan el mejor precio por partida.
            </p>
          </div>

          <div className="text-xs text-slate-400">
            Costo Histórico / Referencia Total:{' '}
            <strong className="text-white font-mono">{formatMoney(referenceTotalMxn, 'MXN')}</strong>
          </div>
        </div>

        {rfqQuotations.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">Esperando cotizaciones de proveedores</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Puedes esperar a que los proveedores ingresen a su portal o presionar <strong>"+ Cargar Oferta de Proveedor"</strong> si te enviaron su archivo de cotización por correo.
            </p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3.5 min-w-[240px]">Partida / Producto</th>
                    <th className="px-3 py-3.5 text-center">Cant.</th>
                    <th className="px-4 py-3.5 text-right">Ref. Interna</th>

                    {/* Columnas dinámicas de proveedores */}
                    {rfqQuotations.map((quot) => (
                      <th
                        key={quot.id}
                        className={`px-4 py-3.5 min-w-[210px] border-l border-slate-800 ${
                          rfq.awardedSupplierId === quot.supplierId ? 'bg-emerald-950/30' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs truncate">
                            {quot.supplierName}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-sky-300">
                            {quot.currency}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-normal mt-0.5 flex items-center justify-between">
                          <span>Vigencia: {quot.validityDays} días</span>
                          <span>{quot.paymentTerms}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/60">
                  {rows.map((row) => (
                    <tr key={row.productId} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-xs font-bold text-sky-400">
                            {row.sku}
                          </span>
                          <div className="text-xs font-semibold text-white truncate max-w-[200px]">
                            {row.productName}
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-4 text-center font-mono text-xs text-white">
                        {row.quantity}
                      </td>

                      <td className="px-4 py-4 text-right font-mono text-xs text-slate-400">
                        {formatMoney(row.referencePriceMxn, 'MXN')}
                      </td>

                      {rfqQuotations.map((quot) => {
                        const bid = row.bidsBySupplier[quot.supplierId];
                        if (!bid) {
                          return (
                            <td
                              key={quot.id}
                              className="px-4 py-4 text-center text-xs text-slate-600 border-l border-slate-800 font-mono"
                            >
                              Sin cotizar
                            </td>
                          );
                        }

                        const displayPrice =
                          viewMode === 'baseMxn'
                            ? formatMoney(bid.priceInBaseMxn, 'MXN')
                            : formatMoney(bid.originalPrice, bid.originalCurrency);

                        return (
                          <td
                            key={quot.id}
                            className={`px-4 py-4 border-l border-slate-800 text-right ${
                              bid.isLowest ? 'bg-emerald-950/20' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-slate-500 font-mono">
                                {bid.leadTimeDays}d entrega
                              </span>
                              <span
                                className={`font-mono text-xs font-bold ${
                                  bid.isLowest ? 'text-emerald-400' : 'text-white'
                                }`}
                              >
                                {displayPrice}
                              </span>
                            </div>

                            {bid.brand && (
                              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                                Marca: {bid.brand}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>

                {/* Pie de tabla con Totales Consolidados y Ahorros */}
                <tfoot className="bg-slate-950 font-bold border-t-2 border-slate-800 text-xs">
                  <tr>
                    <td colSpan={3} className="px-4 py-3.5 text-right uppercase text-slate-400">
                      Total Consolidado (MXN):
                    </td>
                    {supplierScores.map((score) => (
                      <td
                        key={score.supplierId}
                        className={`px-4 py-3.5 text-right border-l border-slate-800 font-mono text-sm ${
                          score.isRecommended ? 'text-emerald-400' : 'text-white'
                        }`}
                      >
                        {formatMoney(score.totalBaseMxn, 'MXN')}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-slate-950/70">
                    <td colSpan={3} className="px-4 py-3 text-right uppercase text-emerald-400 font-black">
                      Ahorro Neto en Dinero ($):
                    </td>
                    {supplierScores.map((score) => (
                      <td
                        key={score.supplierId}
                        className={`px-4 py-3 text-right border-l border-slate-800 font-mono ${
                          score.savingsAmountMxn >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {score.savingsAmountMxn >= 0 ? '+' : ''}
                        {formatMoney(score.savingsAmountMxn, 'MXN')}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-slate-950/70">
                    <td colSpan={3} className="px-4 py-3 text-right uppercase text-sky-400 font-black">
                      Porcentaje de Ahorro (%):
                    </td>
                    {supplierScores.map((score) => (
                      <td
                        key={score.supplierId}
                        className="px-4 py-3 text-right border-l border-slate-800 font-mono text-sky-400"
                      >
                        {score.savingsPercent.toFixed(1)}%
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-slate-950/70">
                    <td colSpan={3} className="px-4 py-2.5 text-right uppercase text-slate-500 text-[11px]">
                      Garantía / Vigencia Precio:
                    </td>
                    {supplierScores.map((score) => (
                      <td
                        key={score.supplierId}
                        className="px-4 py-2.5 text-right border-l border-slate-800 font-mono text-slate-300 text-[11px]"
                      >
                        {score.validityDays} días firmes
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td colSpan={3} className="px-4 py-3.5 text-right uppercase text-slate-400">
                      Adjudicación:
                    </td>
                    {supplierScores.map((score) => (
                      <td key={score.supplierId} className="px-4 py-3.5 text-center border-l border-slate-800">
                        {rfq.awardedSupplierId === score.supplierId ? (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Adjudicado</span>
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              handleAward(score.supplierId, score.quotationId, score.supplierName)
                            }
                            disabled={!!rfq.awardedSupplierId}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              rfq.awardedSupplierId
                                ? 'opacity-30 cursor-not-allowed bg-slate-800 text-slate-500'
                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow'
                            }`}
                          >
                            Adjudicar
                          </button>
                        )}
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL PARA QUE EL COMPRADOR CARGUE OFERTA DE PROVEEDOR VÍA CSV */}
      {isBuyerUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Upload className="w-5 h-5 text-indigo-400" />
                <span>Cargar Cotización de Proveedor (Excel / CSV)</span>
              </h3>
              <button
                onClick={() => setIsBuyerUploadOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  ¿A qué proveedor pertenece este archivo? *
                </label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.taxId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Moneda de la Oferta
                  </label>
                  <select
                    value={uploadCurrency}
                    onChange={(e) => setUploadCurrency(e.target.value as Currency)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold"
                  >
                    <option value="MXN">Pesos Mexicanos (MXN)</option>
                    <option value="USD">Dólares Americanos (USD)</option>
                    <option value="EUR">Euros (EUR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Vigencia de Precio
                  </label>
                  <select
                    value={uploadValidityDays}
                    onChange={(e) => setUploadValidityDays(parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold"
                  >
                    <option value={15}>15 días</option>
                    <option value={30}>30 días</option>
                    <option value={60}>60 días</option>
                    <option value={90}>90 días</option>
                  </select>
                </div>
              </div>

              <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-5 text-center bg-slate-950 transition-colors">
                <input
                  type="file"
                  ref={buyerFileInputRef}
                  accept=".csv,text/csv"
                  onChange={handleBuyerCSVUpload}
                  className="hidden"
                />
                <FileSpreadsheet className="w-8 h-8 text-indigo-400 mx-auto mb-1.5" />
                <div className="text-xs font-bold text-white">
                  Selecciona el archivo CSV enviado por el proveedor
                </div>
                <button
                  type="button"
                  onClick={() => buyerFileInputRef.current?.click()}
                  className="mt-2.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow"
                >
                  Examinar Archivo...
                </button>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsBuyerUploadOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Directorio de Enlaces Seguros para Proveedores */}
      <div className="mt-12 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white flex items-center space-x-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-sky-400" />
          <span>Acceso Privado a Ciegas para Proveedores</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Cada proveedor tiene un token único y cifrado. Copia su enlace para invitarlo por correo o WhatsApp, o haz clic en "Simular Portal" para ver cómo lo ve él.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rfq.invitedSupplierIds.map((supId) => {
            const sup = suppliers.find((s) => s.id === supId);
            const hasQuoted = rfqQuotations.some((q) => q.supplierId === supId);
            const quote = rfqQuotations.find((q) => q.supplierId === supId);

            return (
              <div
                key={supId}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{sup?.name || supId}</span>
                    {hasQuoted ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        Cotizó ({quote?.currency})
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-950 text-amber-400 border border-amber-500/30">
                        Pendiente
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{sup?.contactEmail}</div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => copyMagicLink(supId)}
                    className="text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1"
                  >
                    {copiedToken === supId ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Enlace</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/portal-proveedor/token-${supId}-${rfq.id}`}
                    target="_blank"
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center space-x-1"
                  >
                    <span>Simular Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL DE ACTA DE FALLO Y DICTAMEN DE ADJUDICACIÓN IMPRIMIBLE */}
      {isAwardDocOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl my-6">
            {/* Barra superior de controles (no se imprime) */}
            <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-b border-slate-800 print:hidden">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs text-white">
                  Dictamen Oficial de Fallo y Adjudicación — {rfq.code}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir / Guardar en PDF</span>
                </button>
                <button
                  onClick={() => setIsAwardDocOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Hoja del Documento con estilo membretado formal */}
            <div className="bg-white text-slate-900 p-8 sm:p-12 font-sans overflow-y-auto max-h-[80vh]">
              {/* Membrete */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6 mb-6">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-widest text-sky-800">
                    Supply-Cloud • Red de Adquisiciones Industriales B2B
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 uppercase tracking-tight">
                    Acta de Fallo y Dictamen de Adjudicación
                  </h1>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Procedimiento de Licitación Industrial a Ciegas No.{' '}
                    <strong className="text-slate-900 font-mono">{rfq.code}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Folio Oficial</div>
                  <div className="font-mono text-sm font-black text-slate-900">
                    FALLO-{rfq.code}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Fecha: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Convocante y Adjudicado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-6">
                <div>
                  <div className="font-bold uppercase text-[10px] tracking-wider text-slate-500 mb-1">
                    1. Entidad Convocante (Comprador)
                  </div>
                  <div className="font-bold text-slate-900 text-sm">{rfq.organizationName}</div>
                  <div className="text-slate-700 mt-0.5">
                    <strong>RFC:</strong> {rfq.organizationTaxId}
                  </div>
                  <div className="text-slate-700 mt-0.5">
                    <strong>Planta / Entrega:</strong> {rfq.deliveryAddress}
                  </div>
                  <div className="text-slate-700 mt-0.5">
                    <strong>Departamento:</strong> {rfq.department}
                  </div>
                </div>

                <div>
                  <div className="font-bold uppercase text-[10px] tracking-wider text-emerald-700 mb-1">
                    2. Proveedor Adjudicado (Ganador)
                  </div>
                  {(() => {
                    const sup = suppliers.find((s) => s.id === rfq.awardedSupplierId);
                    const quot = quotations.find(
                      (q) => q.rfqId === rfq.id && q.supplierId === rfq.awardedSupplierId
                    );
                    return (
                      <>
                        <div className="font-bold text-slate-900 text-sm">
                          {sup?.companyName || sup?.name}
                        </div>
                        <div className="text-slate-700 mt-0.5">
                          <strong>RFC:</strong> {sup?.taxId || 'N/A'}
                        </div>
                        <div className="text-slate-700 mt-0.5">
                          <strong>Contacto:</strong> {sup?.contactEmail} • {sup?.phone}
                        </div>
                        <div className="text-slate-700 mt-0.5">
                          <strong>Vigencia de Precios Pactada:</strong>{' '}
                          <span className="text-emerald-800 font-bold">
                            {quot?.validityDays || 30} días naturales
                          </span>
                        </div>
                        <div className="text-slate-700 mt-0.5">
                          <strong>Condición de Pago:</strong> {quot?.paymentTerms || 'Crédito 30 días'}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Partidas Adjudicadas */}
              <div className="mb-6">
                <div className="font-bold uppercase text-[10px] tracking-wider text-slate-500 mb-2">
                  3. Relación de Partidas y Precios Unitarios Adjudicados
                </div>
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 uppercase text-[10px]">
                    <tr>
                      <th className="p-2 border-r border-slate-200">#</th>
                      <th className="p-2 border-r border-slate-200">SKU</th>
                      <th className="p-2 border-r border-slate-200">Descripción Técnica</th>
                      <th className="p-2 text-center border-r border-slate-200">Cant.</th>
                      <th className="p-2 text-center border-r border-slate-200">U.M.</th>
                      <th className="p-2 text-right border-r border-slate-200">P. Unitario</th>
                      <th className="p-2 text-center border-r border-slate-200">Entrega</th>
                      <th className="p-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const quot = quotations.find(
                        (q) => q.rfqId === rfq.id && q.supplierId === rfq.awardedSupplierId
                      );
                      let subtotalOrig = 0;

                      return rfq.items.map((item, idx) => {
                        const bid = quot?.items.find((bi) => bi.productId === item.productId);
                        const unitPrice = bid?.unitPrice || 0;
                        const lineTotal = unitPrice * item.quantity;
                        subtotalOrig += lineTotal;

                        return (
                          <tr key={item.id} className="border-b border-slate-200">
                            <td className="p-2 border-r border-slate-200 font-mono">{idx + 1}</td>
                            <td className="p-2 border-r border-slate-200 font-mono font-bold text-slate-700">
                              {item.sku}
                            </td>
                            <td className="p-2 border-r border-slate-200">
                              <div className="font-bold text-slate-900">{item.productName}</div>
                              {bid?.brandOrModel && (
                                <div className="text-[10px] text-slate-500">
                                  Marca/Modelo: {bid.brandOrModel}
                                </div>
                              )}
                            </td>
                            <td className="p-2 text-center border-r border-slate-200 font-mono">
                              {item.quantity}
                            </td>
                            <td className="p-2 text-center border-r border-slate-200">{item.unit}</td>
                            <td className="p-2 text-right border-r border-slate-200 font-mono font-semibold">
                              {formatMoney(unitPrice, quot?.currency || 'MXN')}
                            </td>
                            <td className="p-2 text-center border-r border-slate-200">
                              {bid?.leadTimeDays || 5} días
                            </td>
                            <td className="p-2 text-right font-mono font-bold text-slate-900">
                              {formatMoney(lineTotal, quot?.currency || 'MXN')}
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Dictamen Económico y Ahorro */}
              {(() => {
                const score = supplierScores.find((s) => s.supplierId === rfq.awardedSupplierId);
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs mb-6">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-600">
                        Costo de Referencia Inicial
                      </div>
                      <div className="text-base font-black font-mono text-slate-800">
                        {formatMoney(referenceTotalMxn, 'MXN')}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-emerald-800">
                        Importe Adjudicado (Consolidado)
                      </div>
                      <div className="text-base font-black font-mono text-emerald-900">
                        {formatMoney(score?.totalBaseMxn || 0, 'MXN')}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-sky-800">
                        Ahorro Monetario Logrado
                      </div>
                      <div className="text-base font-black font-mono text-sky-900">
                        {formatMoney(score?.savingsAmountMxn || 0, 'MXN')} (
                        {score?.savingsPercent.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Cláusula Legal de Cumplimiento */}
              <div className="text-[10px] text-slate-600 leading-relaxed border-t border-slate-200 pt-4 mb-8">
                <strong>CLÁUSULA DE FIRMEZA DE PRECIOS Y CONFIDENCIALIDAD:</strong> El proveedor adjudicado
                declara formalmente que los precios unitarios contenidos en la presente acta son firmes,
                definitivos y no sujetos a escalatoria durante el plazo estipulado de vigencia. Cualquier
                incumplimiento en tiempo de entrega o variación unilateral de precios invalidará la orden
                de compra correspondiente conforme a las políticas corporativas de compras de la convocante.
              </div>

              {/* Cuadro de Firmas Legales */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t-2 border-slate-300 text-center text-xs">
                <div>
                  <div className="h-14 border-b border-slate-400"></div>
                  <div className="font-bold text-slate-900 mt-2">Lic. Andrea Morales</div>
                  <div className="text-[10px] text-slate-500">Gerencia de Compras & Sourcing</div>
                  <div className="text-[9px] text-slate-400">{rfq.organizationName}</div>
                </div>

                <div>
                  <div className="h-14 border-b border-slate-400"></div>
                  <div className="font-bold text-slate-900 mt-2">Ing. Fernando Valdés</div>
                  <div className="text-[10px] text-slate-500">Dirección de Operaciones / Planta</div>
                  <div className="text-[9px] text-slate-400">Aprobación Técnica</div>
                </div>

                <div>
                  <div className="h-14 border-b border-slate-400"></div>
                  <div className="font-bold text-slate-900 mt-2">Representante Legal</div>
                  <div className="text-[10px] text-slate-500">Proveedor Adjudicado</div>
                  <div className="text-[9px] text-slate-400">Aceptación de Condiciones</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
