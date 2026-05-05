'use client'; // Necesitamos esto porque usamos window.history.back()

import { SITE_CONFIG } from '@/lib/config';

export default function ErrorPagoPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          {/* Ícono de Error Rojo */}
          <svg className="w-24 h-24 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Algo salió mal</h1>
        <p className="text-gray-600 text-lg">
          Ocurrió un problema con el pago y no se realizó ningún cobro. Por favor, intentá nuevamente.
        </p>
        <div className="pt-4 flex flex-col space-y-3">
          <button 
            onClick={() => window.history.back()}
            className="bg-black text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors w-full"
          >
            Intentar de nuevo
          </button>
        </div>
        
        <div className="pt-8 border-t border-gray-100 mt-8 text-sm text-gray-500">
          <p className="mb-2">¿Necesitás ayuda?</p>
          <div className="flex justify-center space-x-4">
            <a href={SITE_CONFIG.whatsapp.linkArgentina} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
              WhatsApp 🇦🇷
            </a>
            <a href={SITE_CONFIG.whatsapp.linkEcuador} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
              WhatsApp 🇪🇨
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}