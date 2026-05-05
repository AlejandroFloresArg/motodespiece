import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Evita que Next.js guarde la página en caché para siempre, 
// así cuando agregues un manual nuevo, aparece al instante.
export const revalidate = 0; 

// Inicializamos Supabase para obtener los datos
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function HomePage() {
  // 1. Obtener todas las marcas ordenadas
  const { data: marcas } = await supabase
    .from('marcas')
    .select('*')
    .order('orden', { ascending: true });

  // 2. Obtener los últimos 8 manuales marcados como "nuevos" y que estén activos
  const { data: recientes } = await supabase
    .from('manuales')
    .select(`
      id, titulo, precio_ars, tipo, url_archivo,
      modelos ( nombre, marcas ( nombre ) )
    `)
    .eq('nuevo', true)
    .eq('activo', true)
    .order('creado_en', { ascending: false })
    .limit(8);

  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. HERO SECTION CON ÍCONOS DE CONFIANZA */}
      <section className="bg-gray-50 border-b border-gray-100 py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Manuales de motos en PDF
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Taller, despiece y usuario. Descarga instantánea en alta calidad para que vuelvas a la ruta lo antes posible.
          </p>
          
          {/* Badges de confianza */}
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            <div className="flex items-center text-sm font-medium text-gray-700">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Descarga instantánea
            </div>
            <div className="flex items-center text-sm font-medium text-gray-700">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              PDF Alta calidad
            </div>
            <div className="flex items-center text-sm font-medium text-gray-700">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Soporte WhatsApp
            </div>
          </div>
        </div>
      </section>

      {/* 2. GRILLA DE MARCAS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center tracking-tight">
          Buscá por Marca
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {marcas?.map((marca) => (
            <Link 
              key={marca.id} 
              href={`/marca/${marca.slug}`}
              className="group flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:border-black hover:shadow-md transition-all"
            >
              <span className="font-semibold text-gray-700 group-hover:text-black">
                {marca.nombre}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. RECIÉN AGREGADOS */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Recién Agregados
            </h2>
          </div>

          {recientes && recientes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recientes.map((manual) => (
                <Link 
                  key={manual.id} 
                  href={`/manual/${manual.id}`}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-black hover:shadow-lg transition-all flex flex-col"
                >
                  <div className="p-5 flex-grow space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="inline-block px-2.5 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded">
                        {manual.tipo}
                      </span>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        {/* @ts-ignore - Evitamos el error de tipado estricto en el renderizado rápido */}
                        {manual.modelos?.marcas?.nombre} {manual.modelos?.nombre}
                      </p>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">
                        {manual.titulo}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="px-5 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <span className="text-xl font-black text-gray-900">
                      ${manual.precio_ars}
                    </span>
                    <span className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                      Ver detalle →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500">Aún no hay manuales cargados.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}