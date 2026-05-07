import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { enviarEmailCompra } from '@/lib/email';
import { SITE_CONFIG } from '@/lib/config';
import crypto from 'crypto'; // NUEVO: Importación nativa de Node para criptografía

// Inicializar Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10',
});

// Inicializar Supabase con permisos de administrador
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const headers = request.headers;
    
    const stripeSignature = headers.get('stripe-signature');
    
    // --------------------------------------------------------
    // A) WEBHOOK DE STRIPE
    // --------------------------------------------------------
    if (stripeSignature) {
      let event;
      try {
        event = stripe.webhooks.constructEvent(
          rawBody,
          stripeSignature,
          process.env.STRIPE_WEBHOOK_SECRET as string
        );
      } catch (err: any) {
        console.error(`Error verificando firma de Stripe: ${err.message}`);
        return NextResponse.json({ error: 'Firma inválida' }, { status: 400 });
      }

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const manualId = session.metadata?.manualId;
        const email = session.metadata?.email;
        const pagoId = session.payment_intent as string;
        
        if (manualId && email) {
          await procesarVenta(manualId, email, pagoId);
        }
      }
    } 
    // --------------------------------------------------------
    // B) WEBHOOK DE MERCADOPAGO
    // --------------------------------------------------------
    else {
      // NUEVO: 1. Capturar los headers de seguridad de MP
      const mpSignature = headers.get('x-signature');
      const mpRequestId = headers.get('x-request-id');

      // Si no están los headers, rechazamos la petición inmediatamente (alguien intenta hackearnos)
      if (!mpSignature || !mpRequestId) {
        console.error('Intento de webhook sin firmas de MP');
        return NextResponse.json({ error: 'Firma de Mercado Pago ausente' }, { status: 401 });
      }

      const body = JSON.parse(rawBody);

      // NUEVO: 2. Validación criptográfica HMAC de la firma
      const parts = Object.fromEntries(mpSignature.split(',').map(p => p.split('=')));
      const manifest = `id:${body.data?.id};request-id:${mpRequestId};ts:${parts.ts};`;
      
      const hmac = crypto.createHmac('sha256', process.env.MP_WEBHOOK_SECRET as string);
      hmac.update(manifest);
      const digest = hmac.digest('hex');

      if (digest !== parts.v1) {
        console.error('Firma de Mercado Pago inválida o falsificada');
        return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
      }

      // Si pasamos la firma, procesamos el pago
      if (body.type === 'payment' && body.data?.id) {
        const paymentId = body.data.id;
        
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        });
        
        if (response.ok) {
          const payment = await response.json();
          if (payment.status === 'approved') {
            const manualId = payment.metadata?.manual_id || payment.metadata?.manualId;
            const email = payment.metadata?.email;
            
            if (manualId && email) {
              await procesarVenta(manualId, email, paymentId.toString());
            }
          }
        }
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (error) {
    console.error('Error crítico en el webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Función auxiliar para procesar la venta
async function procesarVenta(manualId: string, email: string, pagoId: string) {
  // NUEVO: 0. Validación Anti-Duplicados (Idempotencia)
  const { data: ventaExistente } = await supabaseAdmin
    .from('ventas')
    .select('id')
    .eq('pago_id', pagoId)
    .single();

  if (ventaExistente) {
    console.log(`⚠️ El pago ${pagoId} ya fue procesado anteriormente. Ignorando duplicado.`);
    return; // Frenamos la ejecución acá, ya no enviamos email ni insertamos nada.
  }

  // 1. Obtener datos del manual
  const { data: manual } = await supabaseAdmin
    .from('manuales')
    .select('titulo, precio_ars')
    .eq('id', manualId)
    .single();

  if (!manual) {
    console.error('Manual no encontrado al procesar webhook:', manualId);
    return;
  }

  // 2. Generar token
  const tokenDescarga = crypto.randomUUID();
  const expiracion = new Date();
  expiracion.setHours(expiracion.getHours() + SITE_CONFIG.horasExpiracionToken);

  // 3. Insertar la venta
  const { error: insertError } = await supabaseAdmin
    .from('ventas')
    .insert({
      manual_id: manualId,
      email_comprador: email,
      pago_id: pagoId,
      token_descarga: tokenDescarga,
      token_expira_en: expiracion.toISOString(),
      descargado: false,
    });

  if (insertError) {
    console.error('Error al insertar venta en DB:', insertError);
    return; 
  }

  // 4. Enviar correo (COMENTADO TEMPORALMENTE PARA MVP MANUAL)
  // try {
  //   await enviarEmailCompra({
  //     emailComprador: email,
  //     tituloManual: manual.titulo,
  //     tokenDescarga: tokenDescarga,
  //     precioARS: manual.precio_ars ?? 0,
  //   });
  // } catch (emailError) {
  //   console.error('Error enviando el email de compra:', emailError);
  // }
}