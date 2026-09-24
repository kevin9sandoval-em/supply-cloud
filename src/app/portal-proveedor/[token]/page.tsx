'use client';

import React, { useState, use, useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Building2,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  Send,
  Boxes,
  MapPin,
  FileCheck2,
  HelpCircle,
  Sparkles,
  Download,
  Upload,
  FileSpreadsheet,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Currency, QuotationItemBid } from '@/types';
import { formatMoney } from '@/lib/store';
import {
  downloadRFQQuotationTemplateCSV,
  parseQuotationCSV,
} from '@/lib/csvHelper';

interface PageProps {
  params: Promise<{ token: string }>;
}

export default function PortalProveedorPage({ params }: PageProps) {
  const { token } = use(params);
  const { allRfqs, suppliers, quotations, submitQuotation, rates, organizations } = useApp();

  let targetSupplierId = 'sup-2';
  let targetRfqId = 'rfq-101';

  if (token.startsWith('token-')) {
    const parts = token.replace('token-', '').split('-');
    if (parts.length >= 3) {
      targetSupplierId = `${parts[0]}-${parts[1]}`;
      targetRfqId = parts.slice(2).join('-');
    }
  }

  const rfq = allRfqs.find((r) => r.id === targetRfqId) || allRfqs[0];
  const supplier = suppliers.find((s) => s.id === targetSupplierId) || suppliers[0];

  // Identificar la empresa compradora a la que le están cotizando
  const buyerOrg = organizations.find((o) => o.id === rfq?.organizationId) || organizations[0];

  const existingQuote = quotations.find(
    (q) => q.rfqId === rfq?.id && q.supplierId === supplier?.id
  );

  // Estados del formulario
  const [currency, setCurrency] = useState<Currency>(
    existingQuote?.currency || (supplier?.id === 'sup-2' ? 'USD' : 'MXN')
  );
  const [validityDays, setValidityDays] = useState<number>(existingQuote?.validityDays || 30);
  const [paymentTerms, setPaymentTerms] = useState<string>(
    existingQuote?.paymentTerms || 'Crédito 30 días'
  );
  const [warrantyMonths, setWarrantyMonths] = useState<number>(
    existingQuote?.warrantyMonths || 12
  );
  const [generalNotes, setGeneralNotes] = useState<string>(
    existingQuote?.generalNotes || ''
  );

  const [bids, setBids] = useState<{ [productId: string]: { price: string; days: number; brand: string } }>(() => {
    const init: { [productId: string]: { price: string; days: number; brand: string } } = {};
    if (rfq) {
      rfq.items.forEach((it) => {
        const prevBid = existingQuote?.items.find((bi) => bi.productId === it.productId);
        init[it.productId] = {
          price: prevBid ? prevBid.unitPrice.toString() : '',
          days: prevBid ? prevBid.leadTimeDays : 5,
          brand: prevBid?.brandOrModel || '',
        };
      });
    }
    return init;
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [csvFeedback, setCsvFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!rfq || !supplier) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-white">Enlace de Cotización no válido</h2>
        <p className="text-xs text-slate-400 mt-2">
          Verifica que el token sea correcto o contacta al departamento de compras.
        </p>
      </div>
    );
  }

  const handlePriceChange = (productId: string, val: string) => {
    setBids((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], price: val },
    }));
  };

  const handleDaysChange = (productId: string, days: number) => {
    setBids((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], days: Math.max(1, days) },
    }));
  };

  const handleBrandChange = (productId: string, brand: string) => {
    setBids((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], brand },
    }));
  };

  // Carga masiva de cotización en Excel/CSV
  const handleQuotationCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const { bids: parsedBids, matchedCount, errors } = parseQuotationCSV(text, rfq);

        if (matchedCount > 0) {
          setBids((prev) => ({
            ...prev,
            ...parsedBids,
          }));
          setCsvFeedback(`¡Éxito! Se cargaron automáticamente precios y tiempos para ${matchedCount} partidas.`);
          setTimeout(() => setCsvFeedback(null), 6000);
        } else {
          alert('No se encontraron partidas coincidentes en el archivo. Asegúrate de usar la plantilla descargada.');
        }
      }
    };
    reader.readAsText(file);
  };

  let totalQuoted = 0;
  rfq.items.forEach((it) => {
    const p = parseFloat(bids[it.productId]?.price) || 0;
    totalQuoted += p * it.quantity;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const missing = rfq.items.some(
      (it) => !bids[it.productId]?.price || parseFloat(bids[it.productId]?.price) <= 0
    );
    if (missing) {
      alert('Por favor ingresa un precio unitario válido para todas las partidas solicitadas.');
      return;
    }

    if (!validityDays || validityDays < 7) {
      alert('La vigencia del precio debe ser de al menos 7 días.');
      return;
    }

    const itemsPayload: QuotationItemBid[] = rfq.items.map((it) => ({
      productId: it.productId,
      unitPrice: parseFloat(bids[it.productId]?.price) || 0,
      leadTimeDays: bids[it.productId]?.days || 5,
      brandOrModel: bids[it.productId]?.brand || '',
    }));

    const rateObj = rates.find((r) => r.code === currency);
    const exchangeRateAtSubmission = rateObj ? rateObj.rateToMxn : 1.0;

    submitQuotation({
      rfqId: rfq.id,
      organizationId: rfq.organizationId,
      token,
      supplierId: supplier.id,
      supplierName: supplier.name,
      supplierEmail: supplier.contactEmail,
      currency,
      exchangeRateAtSubmission,
      validityDays,
      paymentTerms,
      warrantyMonths,
      generalNotes,
      items: itemsPayload,
    });

    setIsSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 1. ENCABEZADO DE RECONOCIMIENTO CLARO DEL CLIENTE COMPRADOR */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-sky-400 shrink-0">
              <Building2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div>
              <div className="text-[11px] sm:text-xs uppercase font-bold tracking-wider text-sky-400 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <span>Portal Oficial de Cotización a Proveedores</span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mt-1">
                {buyerOrg.legalName}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-2.5 text-xs text-slate-300">
                <span className="font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-slate-300">
                  RFC: <strong className="text-white">{buyerOrg.taxId}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Entrega en: <strong className="text-slate-200">{buyerOrg.deliveryAddress}</strong></span>
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 bg-slate-950/80 border border-slate-800 p-4 sm:p-5 rounded-2xl text-left lg:text-right min-w-[260px]">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Proveedor Invitado:</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">{supplier.name}</div>
            <div className="text-xs text-slate-400 mt-0.5">{supplier.contactEmail}</div>
            <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
              {supplier.taxId ? `RFC: ${supplier.taxId}` : 'Proveedor Homologado Verificado'}
            </div>
          </div>
        </div>

        {/* Garantía de confidencialidad */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center space-x-2.5 text-xs text-slate-400">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Subasta a Ciegas Confidencial:</strong> Tus precios y condiciones solo serán visibles para el comité de compras de <strong>{buyerOrg.name}</strong>. Ningún otro proveedor tiene acceso a tu oferta.
          </span>
        </div>
      </div>

      {isSubmitted ? (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            ¡Cotización Enviada Exitosamente!
          </h2>
          <p className="text-slate-300 text-sm mt-3 max-w-lg mx-auto">
            Hemos registrado tu propuesta en <strong>{currency}</strong> para{' '}
            <strong>{buyerOrg.legalName}</strong> con{' '}
            <strong>{validityDays} días de vigencia de precio garantizada</strong>. Se ha notificado al departamento de {rfq.department}.
          </p>

          <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 inline-block text-left text-xs text-slate-300 font-mono">
            <div>Cliente Comprador: <span className="text-white font-bold">{buyerOrg.legalName}</span></div>
            <div>Folio Licitación: <span className="text-sky-400 font-bold">{rfq.code}</span></div>
            <div>Monto Ofertado: <span className="text-emerald-400 font-bold">{formatMoney(totalQuoted, currency)}</span></div>
            <div>Vigencia Precio: <span className="text-amber-400 font-bold">{validityDays} días garantizados</span></div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-xs text-slate-400 hover:text-white px-4 py-2"
            >
              Modificar oferta enviada
            </button>
            <Link
              href={`/licitaciones/${rfq.id}`}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30"
            >
              <span>Ver Cuadro Comparativo (Vista Compras)</span>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Datos del Requerimiento */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950 px-3 py-1 rounded-md border border-sky-800/60">
                    {rfq.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded-md">
                    {rfq.department}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-2 tracking-tight">
                  {rfq.title}
                </h2>
              </div>

              <div className="text-xs text-slate-400 text-left sm:text-right shrink-0 bg-slate-950/60 border border-slate-800/80 px-4 py-2.5 rounded-xl">
                <div className="text-[10px] uppercase font-bold text-slate-400">Fecha Límite de Recepción:</div>
                <div className="font-bold text-white text-sm mt-0.5">
                  {new Date(rfq.deadline).toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed max-w-4xl">
              {rfq.description}
            </p>
          </div>

          {/* Configuración Comercial: Divisa y Vigencia Obligatoria */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2.5 mb-5">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Condiciones Comerciales y Moneda de Cotización</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Moneda Ofertada *
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-white font-bold text-xs focus:outline-none focus:border-sky-500 shadow-sm"
                >
                  <option value="MXN">Pesos Mexicanos (MXN)</option>
                  <option value="USD">Dólares Americanos (USD)</option>
                  <option value="EUR">Euros (EUR)</option>
                </select>
                <span className="text-[11px] text-slate-400 mt-1.5 block">
                  Puedes cotizar en tu moneda de origen
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Vigencia del Precio (Días) *
                </label>
                <select
                  value={validityDays}
                  onChange={(e) => setValidityDays(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-white font-bold text-xs focus:outline-none focus:border-sky-500 shadow-sm"
                >
                  <option value={15}>15 días naturales</option>
                  <option value={30}>30 días (Recomendado)</option>
                  <option value={60}>60 días garantizados</option>
                  <option value={90}>90 días garantizados</option>
                </select>
                <span className="text-[11px] text-amber-400/90 mt-1.5 block font-medium">
                  Compromiso contractual firme sin escalatorias
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Condiciones de Pago
                </label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  placeholder="Ej. Crédito 30 días, Contado..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-sky-500 shadow-sm"
                />
                <span className="text-[11px] text-slate-400 mt-1.5 block">
                  Sujeto a validación del comité de compras
                </span>
              </div>
            </div>
          </div>

          {/* 2. BANNER DE COTIZACIÓN MASIVA EN EXCEL / CSV PARA EL PROVEEDOR */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    ¿Prefieres cotizar en Excel / CSV?
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Descarga el formato estandarizado de esta licitación, llena tus precios y tiempos en Excel y súbelo para autocompletar todas las partidas en 1 segundo.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => downloadRFQQuotationTemplateCSV(rfq)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span>Descargar Formato</span>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv,text/csv"
                  onChange={handleQuotationCSVUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Cotización CSV</span>
                </button>
              </div>
            </div>

            {csvFeedback && (
              <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{csvFeedback}</span>
              </div>
            )}
          </div>

          {/* Partidas a Cotizar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2.5">
                  <Boxes className="w-5 h-5 text-blue-400" />
                  <span>Partidas Solicitadas ({rfq.items.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Revisa la fotografía y especificaciones técnicas antes de ingresar tu precio unitario en{' '}
                  <strong className="text-white">{currency}</strong>.
                </p>
              </div>
              <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                Divisa activa: <strong className="text-sky-400 font-bold">{currency}</strong>
              </div>
            </div>

            <div className="space-y-4">
              {rfq.items.map((it) => {
                const itemPrice = parseFloat(bids[it.productId]?.price) || 0;
                const itemLineTotal = itemPrice * it.quantity;

                return (
                  <div
                    key={it.id}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6"
                  >
                    <div className="flex items-start space-x-4 flex-1 min-w-0">
                      <img
                        src={it.photoUrl}
                        alt={it.productName}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0 shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/80 px-2.5 py-0.5 rounded border border-sky-800/40">
                            {it.sku}
                          </span>
                          <span className="text-xs font-bold uppercase bg-slate-800 text-slate-200 px-2.5 py-0.5 rounded">
                            Requerido: {it.quantity} {it.unit}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-white mt-1.5 leading-snug">
                          {it.productName}
                        </h4>
                        {it.specNotes && (
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {it.specNotes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap items-end gap-3.5 w-full xl:w-auto shrink-0 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                      <div className="w-full sm:w-36">
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-300 mb-1">
                          Precio Unitario ({currency}) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          placeholder="0.00"
                          value={bids[it.productId]?.price || ''}
                          onChange={(e) => handlePriceChange(it.productId, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 shadow-sm"
                        />
                      </div>

                      <div className="w-1/2 sm:w-28">
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-300 mb-1">
                          Entrega (Días)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={bids[it.productId]?.days || 5}
                          onChange={(e) => handleDaysChange(it.productId, parseInt(e.target.value) || 1)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono font-bold text-white text-center focus:outline-none focus:border-sky-500 shadow-sm"
                        />
                      </div>

                      <div className="w-1/2 sm:w-36">
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-300 mb-1">
                          Marca / Modelo
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. SKF, Apollo..."
                          value={bids[it.productId]?.brand || ''}
                          onChange={(e) => handleBrandChange(it.productId, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 shadow-sm"
                        />
                      </div>

                      <div className="hidden sm:block pl-3 border-l border-slate-800 min-w-[120px] text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-500">Subtotal Línea</div>
                        <div className="font-mono text-xs font-bold text-slate-200 mt-1">
                          {formatMoney(itemLineTotal, currency)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-400">
                Monto Total de la Propuesta ({currency}):
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                {formatMoney(totalQuoted, currency)}
              </span>
            </div>
          </div>

          {/* Notas generales */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md">
            <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-2">
              Notas adicionales o condiciones de entrega para {buyerOrg.name}
            </label>
            <textarea
              rows={2}
              placeholder="Indica si incluye flete puesto en su planta, certificados de calidad o tiempos de fabricación..."
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/30 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Cotización a {buyerOrg.name}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
