'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

// Inicializamos el cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function ManualDetailPage({ params }: { params: { id: string } }) {
  const [manual, setManual] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // 1. Cargar los datos del manual al entrar a la página
  useEffect(() => {
    async function fetchManual() {
      const { data, error } = await supabase
        .from('manuales')
        .select(`
          *,
          modelos (
            nombre,
            slug,
            marcas (
              nombre,
              slug
            )
          )
        `)
        .eq('id', params.id)
        .single();

      if (error || !data) {
        setLoadingData(false);
        return;
      }

      setManual(data);
      setLoadingData(false);
    }

    fetchManual();
  }, [params.id]);

  // 2. Función para procesar el pago automático
  const handleComprar = async () => {
    setIsRedirecting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: manual.id }), // Mandamos el ID a nuestra API
      });

      const data = await res.json();

      if (data.url) {
        // Redirigimos al Checkout Pro de Mercado Pago
        window.location.href = data.url;
      } else {
        throw new Error('No se pudo generar el link de pago');
      }
    } catch (error) {
      console.error(error);
      alert("Hubo un error al iniciar el pago. Por favor, intenta de nuevo o contáctanos por WhatsApp.");
      setIsRedirecting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Cargando información del manual...</p>
      </div>
    );
  }

  if (!manual) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 sm:p-12">
          
          {/* Navegación (Breadcrumbs) */}
          <nav className="flex text-sm text-gray-500 mb-10 space-x-2">
            <Link href="/" className="hover:text-black transition-colors">Inicio</Link>
            <span>/</span>
            <Link href={`/marca/${manual.modelos?.marcas?.slug}`} className="hover:text-black transition-colors">
              {manual.modelos?.marcas?.nombre}
            </Link>
            <span>/</span>
            <Link href={`/modelo/${manual.modelos?.slug}`} className="hover:text-black transition-colors">
              {manual.modelos?.nombre}
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Columna Izquierda: Información */}
            <div>
              <span className="inline-block px-3 py-1 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider rounded-md mb-5">
                {manual.tipo}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
                {manual.titulo}
              </h1>
              
              <div className="prose prose-sm text-gray-600 mb-8 whitespace-pre-wrap text-base leading-relaxed">
                {manual.descripcion || "Catálogo completo para este modelo. Incluye despiece detallado para facilitar la reparación."}
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Detalles Técnicos</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-medium">Marca:</span>
                    <span className="font-semibold text-gray-900">{manual.modelos?.marcas?.nombre}</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-medium">Modelo:</span>
                    <span className="font-semibold text-gray-900">{manual.modelos?.nombre}</span>
                  </li>
                  <li className="flex justify-between pt-1">
                    <span className="font-medium">Formato:</span>
                    <span className="font-semibold text-blue-600">PDF Digital</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Columna Derecha: Pago */}
            <div className="bg-white border-2 border-gray-100 p-8 rounded-2xl shadow-sm flex flex-col justify-center sticky top-8">
              <div className="text-center mb-8">
                <p className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wide">Precio total</p>
                <p className="text-6xl font-black text-gray-900 tracking-tighter">${manual.precio_ars}</p>
              </div>

              {/* BOTÓN AUTOMÁTICO DE MERCADO PAGO */}
              <button 
                onClick={handleComprar}
                disabled={isRedirecting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:-translate-y-1 mb-4 flex justify-center items-center text-lg disabled:bg-gray-400"
              >
                {isRedirecting ? (
                  "Cargando pago..."
                ) : (
                  "Pagar con Mercado Pago"
                )}
              </button>

              {/* OPCIÓN SECUNDARIA: WHATSAPP */}
              <a 
                href={`https://wa.me/541136686878?text=${encodeURIComponent(
                  `Hola! Prefiero pagar por transferencia el ${manual.titulo} ($${manual.precio_ars}). Me pasas los datos?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border-2 border-gray-200 text-gray-700 font-bold py-3 px-8 rounded-xl hover:bg-gray-50 transition-all flex justify-center items-center text-sm mb-6"
              >
                Pagar por Transferencia / WhatsApp
              </a>

              <div className="space-y-4 text-xs text-gray-500 bg-gray-50 p-4 rounded-xl">
                <div className="flex items-start">
                  <svg className="w-4 h-4 mr-3 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <p><strong>Entrega automática</strong>. Recibes el link de descarga apenas se acredita el pago.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}