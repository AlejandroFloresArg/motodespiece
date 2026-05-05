// src/app/api/buscar/route.ts
// Endpoint: GET /api/buscar?q=termino
// Llama a la función PostgreSQL buscar_manuales() definida en el SQL de Supabase

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim() ?? ''

  if (q.length < 2) {
    return NextResponse.json({ resultados: [] })
  }

  const { data, error } = await supabase.rpc('buscar_manuales', { termino: q })

  if (error) {
    console.error('[buscar]', error)
    return NextResponse.json({ resultados: [] }, { status: 500 })
  }

  return NextResponse.json({ resultados: data ?? [] })
}
