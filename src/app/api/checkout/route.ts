import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

// Inicializar Mercado Pago con la llave que generaste recién
const mpClient = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN as string 
});

// Inicializar Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Usamos 'id' para que coincida con lo que manda el botón
    const { id } = body; 

    // 1. Consultar Supabase: Traemos el precio real de la base de datos (por seguridad)
    const { data: manual, error: dbError } = await supabase
      .from('manuales')
      .select('titulo, precio_ars, activo')
      .eq('id', id)
      .single();

    if (dbError || !manual) {
      return NextResponse.json({ error: 'Manual no encontrado' }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // 2. Crear la orden de pago en Mercado Pago
    const preference = new Preference(mpClient);
    const result = await preference.create({
      body: {
        items: [
          {
            id: id,
            title: manual.titulo,
            unit_price: Number(manual.precio_ars),
            quantity: 1,
            currency_id: 'ARS',
          }
        ],
        back_urls: {
          success: `${appUrl}/exito`,
          failure: `${appUrl}/error-pago`,
          pending: `${appUrl}/exito`
        },
        auto_return: 'approved',
      }
    });

    // Devolvemos la URL de pago oficial
    return NextResponse.json({ url: result.init_point });

  } catch (error: any) {
    console.error('Error procesando el checkout:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar el pago' }, 
      { status: 500 }
    );
  }
}