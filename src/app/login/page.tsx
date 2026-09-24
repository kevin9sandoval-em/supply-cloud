"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Building2,
  Factory,
  ShieldCheck,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  LogIn,
  UserPlus,
  AlertCircle,
  Briefcase,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const {
    currentUser,
    demoAccounts,
    loginWithDemo,
    loginWithEmail,
    registerWithEmail,
    logout,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"demo" | "login" | "register">("demo");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [role, setRole] = useState<"buyer" | "supplier">("buyer");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleDemoSelect = (demoId: string, accountRole: "buyer" | "supplier") => {
    loginWithDemo(demoId);
    if (accountRole === "buyer") {
      router.push("/dashboard");
    } else {
      router.push("/licitaciones");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await loginWithEmail(email, password);
      if (res.success) {
        setSuccessMsg("¡Sesión iniciada con éxito!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 600);
      } else {
        setErrorMsg(res.error || "Credenciales incorrectas o usuario no registrado.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await registerWithEmail(email, password, {
        name,
        companyName,
        jobTitle,
        role,
      });

      if (res.success) {
        setSuccessMsg("¡Registro exitoso! Ya puedes ingresar al portal.");
        setTimeout(() => {
          router.push(role === "buyer" ? "/dashboard" : "/licitaciones");
        }, 800);
      } else {
        setErrorMsg(res.error || "No se pudo completar el registro.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error al crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Side: Brand & Value Prop */}
        <div className="md:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/20 rounded-full text-xs font-semibold text-sky-400 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plataforma B2B Industrial</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
              Supply<span className="text-sky-400">Cloud</span>
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Sistema de control de costos, subastas a ciegas multicurrency y compras spot para la industria de manufactura.
            </p>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Subastas a ciegas</strong> para eliminar la especulación de proveedores.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span><strong>Consolidación en MXN</strong> con vigencia obligatoria de cotizaciones.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong>Aislamiento total</strong> entre plantas y empresas cliente.</span>
              </div>
            </div>
          </div>

          {currentUser && (
            <div className="mt-8 p-3.5 bg-slate-800/80 border border-slate-700/60 rounded-xl">
              <div className="text-xs text-slate-400 mb-1">Sesión activa actual:</div>
              <div className="font-semibold text-sm text-white">{currentUser.name}</div>
              <div className="text-xs text-sky-400">{currentUser.jobTitle}</div>
              <div className="text-xs text-slate-400 truncate">
                {currentUser.role === "buyer" ? currentUser.organizationName : currentUser.supplierName}
              </div>
              <button
                onClick={() => logout()}
                className="mt-2 text-xs text-rose-400 hover:text-rose-300 underline font-medium"
              >
                Cerrar sesión actual
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Auth Forms & Demo Switcher */}
        <div className="md:col-span-7 p-6 sm:p-8 bg-slate-900">
          {/* Tabs */}
          <div className="flex border-b border-slate-800 mb-6 gap-2">
            <button
              onClick={() => {
                setActiveTab("demo");
                setErrorMsg(null);
              }}
              className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === "demo"
                  ? "border-sky-500 text-sky-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Demo 1-Clic
            </button>
            <button
              onClick={() => {
                setActiveTab("login");
                setErrorMsg(null);
              }}
              className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === "login"
                  ? "border-sky-500 text-sky-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => {
                setActiveTab("register");
                setErrorMsg(null);
              }}
              className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === "register"
                  ? "border-sky-500 text-sky-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Registro
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: DEMO 1-CLIC */}
          {activeTab === "demo" && (
            <div>
              <div className="text-xs text-slate-400 mb-4">
                Selecciona un perfil de demostración para explorar la plataforma al instante con datos preconfigurados:
              </div>

              <div className="space-y-2.5">
                {demoAccounts.map((acc) => {
                  const isBuyer = acc.role === "buyer";
                  const isCurrent = currentUser?.email === acc.email;

                  return (
                    <button
                      key={acc.id}
                      onClick={() => handleDemoSelect(acc.id, acc.role as "buyer" | "supplier")}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                        isCurrent
                          ? "bg-sky-950/40 border-sky-500/50 ring-1 ring-sky-500/30"
                          : "bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isBuyer
                              ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {acc.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-white">{acc.name}</span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                isBuyer
                                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              }`}
                            >
                              {isBuyer ? "Comprador" : "Proveedor"}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] text-emerald-400 font-medium">Activo</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[280px]">
                            {acc.companyName} • {acc.jobTitle}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: INICIAR SESIÓN */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@empresa.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Contraseña</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20"
              >
                {loading ? (
                  <span>Iniciando sesión...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Acceder a Supply-Cloud</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: REGISTRO */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setRole("buyer")}
                  className={`py-1.5 text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-all ${
                    role === "buyer"
                      ? "bg-sky-600 text-white shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Soy Comprador</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("supplier")}
                  className={`py-1.5 text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-all ${
                    role === "supplier"
                      ? "bg-amber-600 text-white shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Factory className="w-3.5 h-3.5" />
                  <span>Soy Proveedor</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Ing. Carlos Salinas"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Empresa</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ej. Aceros del Centro S.A."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Puesto / Cargo</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Ej. Gerente de Suministros"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contacto@empresa.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 mt-2"
              >
                {loading ? (
                  <span>Registrando cuenta...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Crear Cuenta Empresarial</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
