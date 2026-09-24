'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Boxes,
  Layers,
  FileSpreadsheet,
  Users,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Building2,
  Zap,
  FolderTree,
  ChevronDown,
  Check,
  Database,
  X,
  FileCode2,
  LogIn,
  LogOut,
  UserCheck,
  User,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Navbar() {
  const pathname = usePathname();
  const {
    rfqs,
    allRfqs,
    resetDemoData,
    spotRequests,
    organizations,
    activeOrgId,
    activeOrg,
    setActiveOrgId,
    isCloudConfigured,
    currentUser,
    logout,
    activeRole,
    loginWithDemo,
    demoAccounts,
  } = useApp();

  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);

  // RFQ activa de la organización actual o global
  const activeRfq = rfqs.find((r) => r.status === 'evaluating') || rfqs[0] || allRfqs[0];
  const activeSpotsCount = spotRequests.filter((s) => s.status === 'active').length;

  const buyerNavLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: TrendingUp },
    { href: '/catalogo', label: 'Catálogo Maestro', icon: Boxes },
    { href: '/categorias', label: 'Categorías', icon: FolderTree },
    { href: '/licitaciones', label: 'Licitaciones (RFQs)', icon: FileSpreadsheet },
    {
      href: '/cotizaciones-rapidas',
      label: 'Cotización Rápida',
      icon: Zap,
      badge: activeSpotsCount > 0 ? `${activeSpotsCount} urgentes` : undefined,
      isSpot: true,
    },
    { href: '/proveedores', label: 'Proveedores', icon: Users },
  ];

  const supplierNavLinks = [
    { href: '/licitaciones', label: 'Licitaciones Disponibles', icon: FileSpreadsheet },
    {
      href: '/cotizaciones-rapidas',
      label: 'Urgencias Spot de Fábricas',
      icon: Zap,
      badge: activeSpotsCount > 0 ? `${activeSpotsCount} activas` : undefined,
      isSpot: true,
    },
    { href: '/proveedores', label: 'Directorio', icon: Users },
  ];

  const navLinks = activeRole === 'supplier' ? supplierNavLinks : buyerNavLinks;


  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Ticker de divisas y confianza institucional */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between border-b border-slate-800/80 text-slate-400">
        <div className="flex items-center space-x-4">
          {isCloudConfigured ? (
            <span className="inline-flex items-center text-emerald-400 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
              Nube Conectada (Supabase)
            </span>
          ) : (
            <button
              onClick={() => setIsCloudModalOpen(true)}
              className="inline-flex items-center text-amber-400 hover:text-amber-300 font-semibold text-[11px] transition-colors"
              title="Haz clic para ver cómo conectar la base de datos Supabase"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 mr-1.5"></span>
              Modo Local (Conectar Nube ⚡)
            </button>
          )}
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="hidden sm:inline text-xs">
            USD/MXN: <strong className="text-white font-mono">$19.85</strong>
          </span>
          <span className="hidden md:inline text-xs">
            EUR/MXN: <strong className="text-white font-mono">$21.40</strong>
          </span>
          <span className="hidden lg:inline text-slate-400 text-xs">
            (Cliente Actual: <strong className="text-amber-400 font-semibold">{activeOrg.name}</strong>)
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {activeRfq && (
            <Link
              href={`/portal-proveedor/token-sup-2-${activeRfq.id}`}
              className="inline-flex items-center space-x-1 text-sky-400 hover:text-sky-300 font-semibold text-xs transition-colors"
              title="Simular cómo cotiza a ciegas un proveedor en USD reconociendo la empresa compradora"
            >
              <span>Vista Proveedor (USD)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}

          <button
            onClick={() => {
              if (confirm('¿Deseas restablecer los datos de demostración de productos, categorías y cotizaciones?')) {
                resetDemoData();
              }
            }}
            className="inline-flex items-center space-x-1 text-slate-400 hover:text-white text-xs transition-colors"
            title="Restablecer datos demo"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reiniciar Demo</span>
          </button>
        </div>
      </div>

      {/* Navegación principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-700 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-900/30 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white flex items-center space-x-1">
                  <span>Supply</span>
                  <span className="text-sky-400 font-normal">-Cloud</span>
                </span>
                <span className="text-[10px] block text-slate-400 -mt-1 tracking-wider uppercase font-semibold">
                  Infraestructura B2B
                </span>
              </div>
            </Link>
          </div>

          {/* Enlaces de navegación con diseño corporativo */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

              if (link.isSpot) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'text-amber-300 hover:bg-amber-500/10 hover:text-amber-200 border border-amber-500/30'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-950 text-amber-300 border border-amber-500/50">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-700/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* SELECTOR INTERACTIVO DE EMPRESA CLIENTE (MULTI-TENANT SWITCHER) */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
                className="flex items-center space-x-2 bg-slate-800/90 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/80 transition-all text-left group"
                title="Cambiar de empresa cliente para verificar aislamiento de datos"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sky-400 shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight flex items-center space-x-1">
                    <span className="max-w-[130px] sm:max-w-[170px] truncate">{activeOrg.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>{activeOrg.taxId} • {activeOrg.city.split(',')[0]}</span>
                  </div>
                </div>
              </button>

              {/* Dropdown de organizaciones */}
              {isOrgDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-2 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                    Empresas Clientes (Entornos Aislados)
                  </div>

                  <div className="space-y-1 mt-1">
                    {organizations.map((org) => {
                      const isSelected = org.id === activeOrgId;
                      return (
                        <div
                          key={org.id}
                          onClick={() => {
                            setActiveOrgId(org.id);
                            setIsOrgDropdownOpen(false);
                          }}
                          className={`p-2.5 rounded-xl cursor-pointer transition-colors flex items-center justify-between ${
                            isSelected
                              ? 'bg-blue-950/70 border border-blue-500/40 text-white'
                              : 'hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-white text-xs">{org.name}</div>
                            <div className="text-[11px] text-slate-400">{org.industry}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              {org.taxId} • {org.city}
                            </div>
                          </div>

                          {isSelected && (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800 px-3 py-1 text-[10px] text-slate-500 leading-snug">
                    Al cambiar de cliente, el catálogo, licitaciones y compras spot cambian para garantizar cero cruce de datos.
                  </div>
                </div>
              )}
            </div>

            {/* BOTÓN URGENCIA SPOT (SOLO PARA COMPRADORES) */}
            {activeRole === 'buyer' && (
              <Link
                href="/cotizaciones-rapidas/nueva"
                className="hidden sm:inline-flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>Cotizar Urgente</span>
              </Link>
            )}

            {/* PERFIL DE USUARIO Y LOGIN/LOGOUT */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 bg-slate-800/90 hover:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-700/80 transition-all text-left group"
                  title="Perfil de usuario y cambio de rol"
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      currentUser.role === 'buyer'
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {currentUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div className="hidden xl:block">
                    <div className="text-xs font-semibold text-white leading-tight max-w-[120px] truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight flex items-center gap-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          currentUser.role === 'buyer' ? 'bg-sky-400' : 'bg-amber-400'
                        }`}
                      ></span>
                      <span>{currentUser.role === 'buyer' ? 'Comprador' : 'Proveedor'}</span>
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-2 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-3 border-b border-slate-800 bg-slate-950/60 rounded-xl mb-2">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-white text-xs">{currentUser.name}</div>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                            currentUser.role === 'buyer'
                              ? 'bg-sky-500/15 text-sky-400 border border-sky-500/25'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                          }`}
                        >
                          {currentUser.role === 'buyer' ? 'Comprador' : 'Proveedor'}
                        </span>
                      </div>
                      <div className="text-[11px] text-sky-400 font-medium mt-0.5">
                        {currentUser.jobTitle}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {currentUser.role === 'buyer'
                          ? currentUser.organizationName
                          : currentUser.supplierName}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">
                        {currentUser.email}
                      </div>
                    </div>

                    <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500">
                      Cambio Rápido de Perfil Demo
                    </div>
                    <div className="space-y-1 my-1">
                      {demoAccounts.map((demo) => (
                        <button
                          key={demo.id}
                          onClick={() => {
                            loginWithDemo(demo.id);
                            setIsUserDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                            currentUser.email === demo.email
                              ? 'bg-sky-950/60 text-sky-300 font-semibold border border-sky-500/30'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <div className="text-xs text-white">{demo.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {demo.companyName}
                            </div>
                          </div>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0 ${
                              demo.role === 'buyer'
                                ? 'bg-sky-500/10 text-sky-400'
                                : 'bg-amber-500/10 text-amber-400'
                            }`}
                          >
                            {demo.role === 'buyer' ? 'Comprador' : 'Proveedor'}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-slate-800 pt-2 mt-2 space-y-1">
                      <Link
                        href="/login"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                        <span>Gestión de Cuentas / Registro</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-md shadow-sky-600/20"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Acceder</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navegación móvil y tablets */}
      <div className="lg:hidden flex overflow-x-auto px-4 py-2 border-t border-slate-800 space-x-1">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-1.5 whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-medium ${
                isActive
                  ? link.isSpot
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
      {/* Modal de Conexión a la Nube (Supabase) */}
      {isCloudModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Conexión de Base de Datos en la Nube</h3>
                  <p className="text-[11px] text-slate-400">PostgreSQL en Supabase con RLS Activo</p>
                </div>
              </div>
              <button
                onClick={() => setIsCloudModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-4 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Supply-Cloud está listo para conectarse a tu base de datos PostgreSQL en la nube sin costo inicial. Sigue estos 3 pasos:
              </p>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>1. Crea tu proyecto en Supabase</span>
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:text-sky-300 flex items-center space-x-1 text-[11px]"
                    >
                      <span>supabase.com</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-slate-400 mt-1">Crea una cuenta gratuita y un nuevo proyecto (ej. "supply-cloud-db").</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-white flex items-center space-x-1.5">
                    <FileCode2 className="w-4 h-4 text-amber-400" />
                    <span>2. Ejecuta el archivo SQL</span>
                  </div>
                  <p className="text-slate-400 mt-1">
                    Ve a <strong>SQL Editor</strong> en Supabase, copia y pega el contenido del archivo generado:
                  </p>
                  <div className="mt-1.5 font-mono text-[11px] text-emerald-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800 truncate">
                    supply-cloud/supabase/schema.sql
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-white">3. Pega tus llaves en .env.local</div>
                  <p className="text-slate-400 mt-1">
                    En Supabase ve a <strong>Project Settings → API</strong> y copia tu URL y Anon Key en el archivo <span className="font-mono text-white">.env.local</span>:
                  </p>
                  <div className="mt-1.5 font-mono text-[10px] text-slate-300 bg-slate-900 p-2 rounded border border-slate-800 space-y-0.5">
                    <div>NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co</div>
                    <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsCloudModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
