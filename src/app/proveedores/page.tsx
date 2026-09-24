'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  ShieldCheck,
  Star,
  Building2,
  Mail,
  Phone,
  Search,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Supplier } from '@/types';

export default function ProveedoresPage() {
  const { suppliers, quotations } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formulario nuevo proveedor
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [taxId, setTaxId] = useState('');
  const [category, setCategory] = useState('Mantenimiento y Refacciones');

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.taxId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contactEmail) {
      alert('Ingresa al menos el nombre y correo del proveedor.');
      return;
    }

    const newSup: Supplier = {
      id: `sup-${Date.now()}`,
      name: name.trim(),
      companyName: companyName.trim() || name.trim(),
      contactEmail: contactEmail.trim(),
      phone: phone.trim() || '+52 55 0000 0000',
      taxId: taxId.trim() || 'XAXX010101000',
      rating: 5.0,
      category,
      isVerified: true,
    };

    // Actualizar en el estado
    suppliers.push(newSup);
    setIsModalOpen(false);

    // Reset
    setName('');
    setCompanyName('');
    setContactEmail('');
    setPhone('');
    setTaxId('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Directorio de Proveedores Homologados
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-950 text-sky-300 border border-sky-800">
              {suppliers.length} activos
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Red de proveedores verificados para invitaciones automáticas a cotizar a ciegas.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Proveedor</span>
        </button>
      </div>

      {/* Buscador */}
      <div className="my-6">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por razón social, RFC, categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Cards de Proveedores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((sup) => {
          const quotesCount = quotations.filter((q) => q.supplierId === sup.id).length;
          const awardedCount = quotations.filter((q) => q.supplierId === sup.id && q.isAwarded).length;

          return (
            <div
              key={sup.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">
                      {sup.category}
                    </span>
                    <h3 className="font-bold text-white text-base mt-0.5">{sup.name}</h3>
                    <div className="text-xs text-slate-400">{sup.companyName}</div>
                  </div>

                  {sup.isVerified && (
                    <span className="p-1 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-500/30" title="Proveedor Verificado">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="font-mono text-slate-300">{sup.contactEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{sup.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="font-mono text-slate-400 text-[11px]">RFC/ID: {sup.taxId}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{sup.rating.toFixed(1)}</span>
                </div>

                <div className="text-[11px] text-slate-400">
                  <strong className="text-white">{quotesCount}</strong> cotizaciones •{' '}
                  <strong className="text-emerald-400">{awardedCount}</strong> adjudicadas
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nuevo Proveedor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>Registrar Nuevo Proveedor</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSupplier} className="space-y-4 mt-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre Comercial del Proveedor *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Aceros y Perfiles del Centro"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Razón Social
                </label>
                <input
                  type="text"
                  placeholder="Ej. APC Metales S.A. de C.V."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ventas@apcmetales.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    placeholder="+52 55 1234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    RFC o Tax ID
                  </label>
                  <input
                    type="text"
                    placeholder="APC990101ABC"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Giro / Categoría
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
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
                  Guardar Proveedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
