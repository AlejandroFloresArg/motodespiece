import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default async function ModeloPage({ params }: { params: { slug: string } }) {
  // 1. Buscar el modelo y la marca relacionada
  const { data: modelo } = await supabase
    .from('modelos')
    .select('*, marcas(nombre, slug)')
    .eq('slug', params.slug)
    .single();

  if (!modelo) {
    notFound();
  }

  // 2. Buscar los manuales activos para este modelo
  const { data: manuales } = await supabase
    .from('manuales')
    .select('*')
    .eq('modelo_id', modelo.id)
    .eq('activo', true)
    .order('creado_en', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera */}
        <div className="mb-10">
          <Link 
            href={`/marca/${modelo.marcas?.slug}`} 
            className="text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 inline-block"
          >
            ← Volver a {modelo.marcas?.nombre}
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {modelo.marcas?.nombre} {modelo.nombre}
          </h1>
          {modelo.cilindrada && (
            <p className="mt-2 text-lg text-gray-600">
              Cilindrada: <span className="font-medium">{modelo.cilindrada}cc</span>
            </p>
          )}
        </div>

        {/* Grilla de Manuales */}
        {manuales && manuales.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {manuales.map((manual) => (
              <div key={manual.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-black hover:shadow-lg transition-all flex flex-col">
                <div className="p-6 flex-grow space-y-4">
                  <span className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-md">
                    {manual.tipo}
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">
                    {manual.titulo}
                  </h2>
                  {manual.descripcion && (
                    <p className="text-sm text-gray-500 line-clamp-3">
                      {manual.descripcion}
                    </p>
                  )}
                </div>
                
                <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <span className="text-2xl font-black text-gray-900">
                    ${manual.precio_ars}
                  </span>
                  <Link 
                    href={`/manual/${manual.id}`}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Ver detalles →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-500 text-lg">No hay manuales cargados para este modelo todavía.</p>
          </div>
        )}
      </div>
    </div>
  );
}