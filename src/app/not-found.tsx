import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-4">
      <div className="text-center space-y-6">
        <h1 className="text-8xl font-bold text-gray-100">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Esta página no existe</h2>
        <p className="text-gray-500 max-w-sm mx-auto">
          Parece que el enlace está roto o la página que buscás fue eliminada.
        </p>
        <div className="pt-6">
          <Link 
            href="/" 
            className="inline-block bg-black text-white font-medium px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}