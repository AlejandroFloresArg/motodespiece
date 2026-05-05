import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SITE_CONFIG } from "@/lib/config";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${SITE_CONFIG.nombre} | Manuales de Taller en PDF`,
  description: SITE_CONFIG.descripcion,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const anioActual = new Date().getFullYear();

  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50 text-gray-900`}>
        <Navbar />
        
        {/* El contenido principal de cada página va aquí */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer Global */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Columna 1: Info */}
              <div>
                <span className="text-xl font-bold text-gray-900 tracking-tight block mb-4">
                  {SITE_CONFIG.nombre}
                </span>
                <p className="text-sm text-gray-500 max-w-xs">
                  Tu biblioteca digital de manuales de taller, despiece y usuario para motocicletas.
                </p>
              </div>

              {/* Columna 2: Enlaces Legales */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  Información Legal
                </h3>
                <ul className="space-y-3 text-sm text-gray-500">
                  <li>
                    <Link href="/terminos" className="hover:text-gray-900 transition-colors">Términos y Condiciones</Link>
                  </li>
                  <li>
                    <Link href="/privacidad" className="hover:text-gray-900 transition-colors">Política de Privacidad</Link>
                  </li>
                  <li>
                    <Link href="/reembolsos" className="hover:text-gray-900 transition-colors">Política de Reembolsos</Link>
                  </li>
                  <li>
                    <Link href="/faq" className="hover:text-gray-900 transition-colors">Preguntas Frecuentes (FAQ)</Link>
                  </li>
                </ul>
              </div>

              {/* Columna 3: Contacto */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  Contacto y Soporte
                </h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a 
                      href={SITE_CONFIG.whatsapp.linkArgentina} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      WhatsApp Argentina 🇦🇷
                    </a>
                  </li>
                  <li>
                    <a 
                      href={SITE_CONFIG.whatsapp.linkEcuador} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      WhatsApp Ecuador 🇪🇨
                    </a>
                  </li>
                  <li>
                    <a 
                      href={`mailto:${SITE_CONFIG.email.soporte}`}
                      className="text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {SITE_CONFIG.email.soporte}
                    </a>
                  </li>
                </ul>
              </div>

            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">
                &copy; {anioActual} {SITE_CONFIG.nombre}. Todos los derechos reservados.
              </p>
              <p className="text-xs text-gray-400 mt-2 sm:mt-0">
                Pagos seguros procesados por MercadoPago y Stripe.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}