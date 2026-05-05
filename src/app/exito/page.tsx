import Link from 'next/link';

export default function ExitoPage({ 
  searchParams 
}: { 
  searchParams: { payment_id?: string, status?: string } 
}) {
  // Capturamos el número de transacción que manda Mercado Pago en la URL
  const paymentId = searchParams.payment_id;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          {/* Ícono de Check Verde (Tu original) */}
          <svg className="w-24 h-24 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">¡Gracias por tu compra!</h1>
        
        {/* Tu texto original (excelente para descarga de PDFs) */}
        <p className="text-gray-600 text-lg">
          Te enviamos un email con el link de descarga. Revisá también la carpeta de spam o correo no deseado.
        </p>

        {/* NUEVO: Mostramos el número de recibo si Mercado Pago lo envió */}
        {paymentId && (
          <div className="bg-gray-50 rounded-xl p-4 mt-4 border border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-1">Número de transacción</p>
            <p className="text-xl font-mono font-bold text-gray-900">#{paymentId}</p>
          </div>
        )}

        <div className="pt-6 space-y-3">
          <Link 
            href="/" 
            className="inline-block bg-black text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors w-full"
          >
            Volver al inicio
          </Link>
          
          {/* NUEVO: Botón de soporte por WhatsApp con el número de orden */}
          <a 
            href={`https://wa.me/541136686878?text=${encodeURIComponent(
              `Hola! Acabo de hacer una compra en MotoDespiece. Mi número de transacción es #${paymentId || 'pendiente'}. Tengo una consulta sobre el envío del email.`
            )}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-white border-2 border-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors w-full text-sm"
          >
            ¿No te llegó el correo? Escribinos
          </a>
        </div>
      </div>
    </div>
  );
}