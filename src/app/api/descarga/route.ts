import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SITE_CONFIG } from '@/lib/config';

// Usamos Service Role Key para saltar el RLS y poder leer/escribir ventas con seguridad
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return new NextResponse(
      '<h1>Link inválido</h1><p>Falta el token de descarga.</p>',
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  try {
    // 1. Consultar la venta y hacer JOIN con manuales para traer el nombre del archivo (url_archivo)
    const { data: venta, error } = await supabaseAdmin
      .from('ventas')
      .select('*, manuales(url_archivo)')
      .eq('token_descarga', token)
      .single();

    if (error || !venta) {
      return new NextResponse(
        '<h1>Link inválido</h1><p>No se encontró la compra asociada a este link.</p>',
        { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    // 2. Validar expiración (48 horas por defecto)
    const ahora = new Date();
    const expiracion = new Date(venta.token_expira_en);
    if (ahora > expiracion) {
      return new NextResponse(
        `<h1>Este link ya expiró</h1><p>Contactanos por WhatsApp: <a href="${SITE_CONFIG.whatsapp.linkArgentina}">Argentina</a> o <a href="${SITE_CONFIG.whatsapp.linkEcuador}">Ecuador</a>.</p>`,
        { status: 410, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    // 3. Validar si ya fue descargado
    if (venta.descargado) {
      return new NextResponse(
        `<h1>Este link ya fue usado</h1><p>El manual ya ha sido descargado. Si necesitas ayuda, contactanos por WhatsApp: <a href="${SITE_CONFIG.whatsapp.linkArgentina}">Argentina</a> o <a href="${SITE_CONFIG.whatsapp.linkEcuador}">Ecuador</a>.</p>`,
        { status: 410, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    // 4. Marcar como descargado en la base de datos
    await supabaseAdmin
      .from('ventas')
      .update({ descargado: true })
      .eq('id', venta.id);

    // 5. Generar signed URL del Storage de Supabase (válida por 60 segundos)
    const nombreArchivo = venta.manuales.url_archivo;
    const { data: signedUrlData, error: storageError } = await supabaseAdmin
      .storage
      .from(SITE_CONFIG.bucketName)
      .createSignedUrl(nombreArchivo, 60);

    if (storageError || !signedUrlData) {
      console.error('Error generando URL firmada:', storageError);
      return new NextResponse(
        '<h1>Error del servidor</h1><p>No se pudo generar el link de descarga temporal.</p>',
        { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    // 6. Redirigir al usuario directamente al PDF
    return NextResponse.redirect(signedUrlData.signedUrl);

  } catch (err) {
    console.error('Error procesando la descarga:', err);
    return new NextResponse(
      '<h1>Error interno</h1><p>Ocurrió un error inesperado.</p>',
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}