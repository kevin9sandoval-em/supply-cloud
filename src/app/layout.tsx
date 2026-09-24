import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Supply-Cloud | Plataforma B2B de Gestión de Adquisiciones y Cotizaciones',
  description: 'Automatiza tus catálogos, fotos de productos y cotizaciones a ciegas de proveedores con comparativo multimoneda en tiempo real.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full bg-slate-950 text-slate-100">
      <body className="min-h-full flex flex-col font-sans antialiased bg-slate-950 text-slate-100">
        <AppProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-300">Supply-Cloud</span>
                <span>• Infraestructura B2B de Compras Industriales</span>
              </div>
              <div>Subasta a ciegas garantizada • Motor Multimoneda USD / MXN / EUR</div>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
