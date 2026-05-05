import { SITE_CONFIG } from '@/lib/config';

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 text-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Política de Privacidad</h1>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">1. Información que recopilamos</h2>
          <p>
            En {SITE_CONFIG.nombre} recopilamos la mínima información necesaria para procesar tu pedido. Al realizar una compra, únicamente solicitamos tu <strong>dirección de correo electrónico</strong>. Los datos de pago (tarjetas, cuentas) son procesados de forma segura por MercadoPago o Stripe; nosotros no almacenamos esa información financiera.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">2. Uso de la información</h2>
          <p>
            Utilizamos tu correo electrónico exclusivamente para:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Enviarte el comprobante de pago y el enlace de descarga del manual.</li>
            <li>Brindarte soporte técnico en caso de que tengas problemas con la descarga.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">3. Protección de datos</h2>
          <p>
            No vendemos, alquilamos ni compartimos tu dirección de correo electrónico con terceros bajo ninguna circunstancia, excepto cuando sea estrictamente necesario para procesar el pago a través de nuestras pasarelas autorizadas.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">4. Retención y Eliminación</h2>
          <p>
            Conservamos el registro de tu compra en nuestra base de datos para poder brindarte soporte futuro si pierdes el archivo. Si deseas que eliminemos tu correo electrónico y registro de compra de nuestros sistemas, puedes solicitarlo en cualquier momento contactándonos a {SITE_CONFIG.email.soporte} o mediante nuestros canales de WhatsApp.
          </p>
        </section>
      </div>
    </div>
  );
}