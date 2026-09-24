'use client';

import React from 'react';
import Link from 'next/link';
import {
  Layers,
  ShieldCheck,
  TrendingDown,
  FileCheck2,
  Boxes,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Lock,
  Globe2,
  Zap,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function HomePage() {
  const { rfqs, products } = useApp();
  const demoRfq = rfqs.find((r) => r.status === 'evaluating') || rfqs[0];

  return (
    <div className="relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent pointer-events-none blur-3xl"></div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
          <span>Infraestructura B2B de Adquisiciones</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Gestiona los costos de tus productos{' '}
          <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            sin intermediarios ni caos de correos
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          Centraliza tus catálogos y especificaciones técnicas con fotos. Invita a tus proveedores a
          cotizar en una plataforma segura con <strong>subasta a ciegas</strong>, conversión multimoneda automática y
          cálculo instantáneo de ahorros en <strong>$ y %</strong>.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 transition-all hover:-translate-y-0.5"
          >
            <span>Explorar Dashboard de Empresa</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {demoRfq && (
            <Link
              href={`/licitaciones/${demoRfq.id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all"
            >
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span>Ver Cuadro Comparativo en Vivo</span>
            </Link>
          )}

          {demoRfq && (
            <Link
              href={`/portal-proveedor/token-sup-2-${demoRfq.id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl font-medium text-sky-400 hover:text-white hover:bg-slate-800/60 transition-all text-sm"
            >
              <Lock className="w-4 h-4" />
              <span>Simular Proveedor (USD)</span>
            </Link>
          )}
        </div>

        {/* Métricas destacadas */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-left backdrop-blur-sm">
            <div className="text-3xl font-black text-emerald-400">14.8%</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Ahorro promedio en compras</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-left backdrop-blur-sm">
            <div className="text-3xl font-black text-sky-400">100%</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Licitación a ciegas confidencial</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-left backdrop-blur-sm">
            <div className="text-3xl font-black text-indigo-400">USD/MXN</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Conversión y normalización de divisas</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-left backdrop-blur-sm">
            <div className="text-3xl font-black text-amber-400">0 emails</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Todo el proceso dentro de la plataforma</div>
          </div>
        </div>
      </section>

      {/* Características clave adaptadas a tus especificaciones */}
      <section className="py-16 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Diseñado específicamente para el sector industrial, manufacturero y comercial
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Resuelve los tres grandes dolores del proceso tradicional de compras B2B: opacidad,
              dispersión de archivos y cotizaciones que luego cambian en la factura.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-6 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center mb-5 text-blue-400">
                <Boxes className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Catálogo Maestro con Fotos y Fichas</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Tus proveedores ven exactamente la refacción, material o pieza requerida: foto de alta
                definición, número de parte (SKU), planos o notas técnicas para evitar errores en despacho.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Subida de fotos y especificaciones</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Precios de referencia históricos</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-6 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center mb-5 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Subasta a Ciegas y Vigencia de Precio</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Cero manipulación de precios. Ningún proveedor conoce las ofertas ajenas. Además, exigimos
                el campo obligatorio de <strong>Vigencia de Precio (días)</strong> para que la cotización sea legal y firme.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Acceso seguro sin contraseñas engorrosas</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Blindaje contra especulación de precios</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-6 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center mb-5 text-indigo-400">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Comparativo Multimoneda Automático</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Permite a proveedores cotizar en USD o moneda local. El sistema normaliza todo a Moneda
                Nacional y genera el cuadro comparativo en segundos, calculando el ahorro exacto en $ y %.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Conversión en tiempo real con tipo de cambio</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Adjudicación con 1 solo clic</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Seguridad & Dominio propio */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Globe2 className="w-4 h-4" />
              <span>Confiabilidad Empresarial</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug">
              Despliegue bajo tu propio dominio web con total seguridad
            </h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              Tus clientes industriales y sus proveedores interactúan en un entorno formal y protegido con
              certificados SSL y base de datos aislada. La información de costos y márgenes nunca se comparte entre empresas.
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-3 w-full sm:w-auto">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all text-sm"
            >
              <span>Acceder al Sistema</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all text-sm"
            >
              <span>Revisar Catálogo ({products.length} productos)</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
