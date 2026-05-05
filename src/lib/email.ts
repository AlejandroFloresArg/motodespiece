import { Resend } from 'resend';
import { SITE_CONFIG } from './config';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EnviarEmailProps {
  emailComprador: string;
  tituloManual: string;
  tokenDescarga: string;
  precioARS: number;
}

export async function enviarEmailCompra({ 
  emailComprador, 
  tituloManual, 
  tokenDescarga, 
  precioARS 
}: EnviarEmailProps) {
  const linkDescarga = `${SITE_CONFIG.url}/api/descarga?token=${tokenDescarga}`;
  const formatoPrecio = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(precioARS);

  try {
    const { data, error } = await resend.emails.send({
      from: `MotoDespiece <${SITE_CONFIG.email.soporte}>`,
      to: [emailComprador],
      subject: `Tu manual de ${tituloManual} ya está listo`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h1 style="color: #111; text-align: center;">¡Gracias por tu compra!</h1>
          <p>Hola,</p>
          <p>Has adquirido el manual: <strong>${tituloManual}</strong> por un valor de <strong>${formatoPrecio}</strong>.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${linkDescarga}" 
               style="background-color: #000; color: #fff; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
               DESCARGAR MANUAL PDF
            </a>
          </div>

          <p style="font-size: 14px; color: #666; text-align: center;">
            ⚠️ Este link es de un solo uso y expirará en ${SITE_CONFIG.horasExpiracionToken} horas.
          </p>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          
          <p style="font-size: 13px; color: #888;">
            Si tienes problemas con la descarga, contáctanos por WhatsApp:
            <br>
            🇦🇷 <a href="${SITE_CONFIG.whatsapp.linkArgentina}">WhatsApp Argentina</a>
            <br>
            🇪🇨 <a href="${SITE_CONFIG.whatsapp.linkEcuador}">WhatsApp Ecuador</a>
          </p>
          
          <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #aaa;">
            © ${new Date().getFullYear()} MotoDespiece. Todos los derechos reservados.
          </footer>
        </div>
      `,
    });

    if (error) {
      console.error('Error enviando email con Resend:', error);
    }
    
    return { success: true, data };
  } catch (err) {
    // Logueamos pero no lanzamos excepción para no romper el webhook
    console.error('Excepción al enviar email:', err);
    return { success: false, error: err };
  }
}