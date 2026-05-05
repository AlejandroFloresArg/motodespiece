// src/app/modelo/[slug]/page.tsx
// Muestra todos los manuales disponibles para un modelo específico

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Manual, Modelo } from '@/types'
import { TIPO_COLOR, TIPO_LABEL, formatPrecio } from '@/types'

export const revalidate = 3600

async function getModelo(slug: string) {
  const { data } = await supabase
    .from('modelos')
    .select('*, marca:marcas(*)')
    .eq('slug', slug)
    .single()
  return data as (Modelo & { marca: { nombre: string; slug: string; logo_url: string | null } }) | null
}

async function getManuales(modeloId: string): Promise<Manual[]> {
  const { data } = await supabase
    .from('manuales')
    .select('*')
    .eq('modelo_id', modeloId)
    .eq('activo', true)
    .order('tipo')
    .order('anio', { ascending: false })
  return (data as Manual[]) ?? []
}

export default async function ModeloPage({ params }: { params: { slug: string } }) {
  const modelo = await getModelo(params.slug)
  if (!modelo) notFound()

  const manuales = await getManuales(modelo.id)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-600 transition-colors">Inicio</Link>
        <span className="mx-2">·</span>
        <Link href={`/marca/${modelo.marca.slug}`} className="hover:text-gray-600 transition-colors">
          {modelo.marca.nombre}
        </Link>
        <span className="mx-2">·</span>
        <span className="text-gray-700 font-medium">{modelo.nombre}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          {modelo.marca.nombre} {modelo.nombre}
        </h1>
        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
          {modelo.cilindrada && <span>{modelo.cilindrada} cc</span>}
          <span>·</span>
          <span>{manuales.length} manual{manuales.length !== 1 ? 'es' : ''}</span>
        </div>
        {modelo.alias.length > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            También conocido como: {modelo.alias.join(', ')}
          </p>
        )}
      </div>

      {/* Manuales */}
      {manuales.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p>No hay manuales disponibles para este modelo aún.</p>
          <Link href={`/marca/${modelo.marca.slug}`}
            className="mt-4 inline-block text-sm text-blue-500 hover:underline">
            ← Ver otros modelos de {modelo.marca.nombre}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {manuales.map(manual => (
            <Link
              key={manual.id}
              href={`/manual/${manual.id}`}
              className="card-manual group flex flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${TIPO_COLOR[manual.tipo]}`}>
                  {TIPO_LABEL[manual.tipo]}
                </span>
                {manual.nuevo && (
                  <span className="text-xs bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full font-medium">
                    Nuevo
                  </span>
                )}
              </div>

              <div className="flex-1">
                <h2 className="font-semibold text-gray-900 text-sm leading-snug
                               group-hover:text-blue-600 transition-colors line-clamp-2">
                  {manual.titulo}
                </h2>
                {manual.descripcion && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                    {manual.descripcion}
                  </p>
                )}
                {manual.anio && (
                  <p className="text-xs text-gray-400 mt-1">Año: {manual.anio}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <span className="font-bold text-gray-900 text-base">
                  {formatPrecio(manual.precio_ars)}
                </span>
                <span className="text-xs font-semibold text-white bg-gray-900 px-3 py-1.5
                                 rounded-lg group-hover:bg-gray-700 transition-colors">
                  Comprar
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
