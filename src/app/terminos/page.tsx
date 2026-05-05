import { SITE_CONFIG } from '@/lib/config';

export default function TerminosPage() {
  const ultimaActualizacion = "3 de mayo de 2026"; // Fecha actual

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 text-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Términos y Condiciones</h1>
        <p className="text-sm text-gray-500">Última actualización: {ultimaActualizacion}</p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">1. Descripción del Servicio</h2>
          <p>
            {SITE_CONFIG.nombre} ofrece la venta y distribución digital de manuales de taller, despiece y usuario para motocicletas en formato PDF. Al realizar una compra, aceptas estos términos.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">2. Productos Digitales</h2>
          <p>
            Todos los productos ofrecidos son estrictamente digitales (archivos PDF). No se enviará ningún producto físico. Una vez confirmado el pago, recibirás un enlace de descarga válido por {SITE_CONFIG.horasExpiracionToken} horas.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">3. Uso Permitido</h2>
          <p>
            La compra de un manual otorga una licencia de uso personal, intransferible y no exclusiva. El usuario puede descargar, almacenar e imprimir el archivo únicamente para su propio uso.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">4. Prohibiciones</h2>
          <p>
            Queda estrictamente prohibido:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Redistribuir, compartir o publicar el archivo PDF en internet o cualquier otro medio.</li>
            <li>Revender el manual, ya sea en formato digital o impreso.</li>
            <li>Modificar, alterar o extraer el contenido del manual para crear obras derivadas.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">5. Exclusión de Garantías</h2>
          <p>
            Los manuales se proporcionan "tal cual". {SITE_CONFIG.nombre} no garantiza que la información contenida sea exacta, completa o esté libre de errores. No asumimos responsabilidad por daños al vehículo, lesiones personales o pérdidas económicas derivadas del uso de la información contenida en los manuales. Es responsabilidad del usuario poseer los conocimientos mecánicos adecuados.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">6. Contacto</h2>
          <p>
            Para consultas relacionadas con estos términos, contáctanos a través de WhatsApp en <a href={SITE_CONFIG.whatsapp.linkArgentina} className="text-blue-600 hover:underline">Argentina</a> o <a href={SITE_CONFIG.whatsapp.linkEcuador} className="text-blue-600 hover:underline">Ecuador</a>.
          </p>
        </section>
      </div>
    </div>
  );
}