// src/app/manual/[id]/page.tsx
// Página de detalle de manual: descripción + botón de compra

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Manual } from '@/types'
import { TIPO_COLOR, TIPO_LABEL, formatPrecio } from '@/types'
import BuyButton from '@/components/BuyButton'

export const revalidate = 3600

async function getManual(id: string): Promise<Manual | null> {
  const { data } = await supabase
    .from('manuales')
    .select('*, modelo:modelos(*, marca:marcas(*))')
    .eq('id', id)
    .eq('activo', true)
    .single()
  return data as Manual | null
}

export default async function ManualPage({ params }: { params: { id: string } }) {
  const manual = await getManual(params.id)
  if (!manual) notFound()

  const marca = manual.modelo?.marca
  const modelo = manual.modelo

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-600">Inicio</Link>
        <span className="mx-2">·</span>
        <Link href={`/marca/${marca?.slug}`} className="hover:text-gray-600">{marca?.nombre}</Link>
        <span className="mx-2">·</span>
        <Link href={`/modelo/${modelo?.slug}`} className="hover:text-gray-600">{modelo?.nombre}</Link>
        <span className="mx-2">·</span>
        <span className="text-gray-700 font-medium truncate">{manual.titulo}</span>
      </nav>

      <div className="border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">

        {/* Badges */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${TIPO_COLOR[manual.tipo]}`}>
            {TIPO_LABEL[manual.tipo]}
          </span>
          {manual.nuevo && (
            <span className="text-xs bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full font-medium">
              Recién agregado
            </span>
          )}
          {manual.anio && (
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
              {manual.anio}
            </span>
          )}
        </div>

        {/* Título */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug mb-2">
          {manual.titulo}
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          {marca?.nombre} · {modelo?.nombre}
          {modelo?.cilindrada ? ` · ${modelo.cilindrada} cc` : ''}
        </p>

        {/* Descripción */}
        {manual.descripcion && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Descripción</h2>
            <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
              {manual.descripcion}
            </p>
          </div>
        )}

        {/* Lo que incluye */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">¿Qué incluye?</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            {[
              'Archivo PDF de alta calidad',
              'Descarga instantánea después del pago',
              'Link de respaldo enviado por email',
              'Acceso para siempre — sin suscripción',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Precio + CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-xs text-gray-400 mb-1">Precio</p>
            <p className="text-3xl font-bold text-gray-900">{formatPrecio(manual.precio_ars)}</p>
          </div>
          <BuyButton manualId={manual.id} titulo={manual.titulo} precio={manual.precio_ars} />
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href={`/modelo/${modelo?.slug}`}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Ver todos los manuales de {modelo?.nombre}
        </Link>
      </div>
    </div>
  )
}
