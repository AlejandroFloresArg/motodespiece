import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default async function MarcaPage({ params }: { params: { slug: string } }) {
  // 1. Buscar la marca
  const { data: marca } = await supabase
    .from('marcas')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!marca) {
    notFound();
  }

  // 2. Buscar los modelos de esta marca
  const { data: modelos } = await supabase
    .from('modelos')
    .select('*, manuales(count)')
    .eq('marca_id', marca.id)
    .order('cilindrada', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera */}
        <div className="mb-10">
          <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight capitalize">
            {marca.nombre}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Seleccioná tu modelo para ver los manuales disponibles.
          </p>
        </div>

        {/* Grilla de Modelos en Tarjetas */}
        {modelos && modelos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modelos.map((modelo) => {
              // Extraer el conteo de manuales de forma segura
              const countManuales = modelo.manuales?.[0]?.count || 0;

              return (
                <div key={modelo.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-black hover:shadow-lg transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-bold text-gray-900">{modelo.nombre}</h2>
                      {modelo.cilindrada && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {modelo.cilindrada} cc
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-6">
                      {countManuales} {countManuales === 1 ? 'manual' : 'manuales'} disponible{countManuales !== 1 && 's'}
                    </p>
                  </div>
                  
                  <Link 
                    href={`/modelo/${modelo.slug}`}
                    className="w-full text-center bg-gray-50 hover:bg-black hover:text-white text-gray-900 font-semibold py-2.5 px-4 rounded-lg border border-gray-200 hover:border-black transition-colors"
                  >
                    Ver manuales →
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-500 text-lg">Próximamente agregaremos modelos para {marca.nombre}.</p>
          </div>
        )}
      </div>
    </div>
  );
}