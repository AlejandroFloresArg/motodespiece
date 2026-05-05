import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const archivo = searchParams.get('archivo')

  if (!archivo) {
    return new Response('Falta el nombre del archivo', { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
  )

  const { data, error } = await supabase
    .storage
    .from('manuales_pdf')
    .createSignedUrl(archivo, 60)

  if (error || !data) {
    console.error(error);
    return new Response('Error al generar la descarga', { status: 500 })
  }

  return NextResponse.redirect(data.signedUrl)
}