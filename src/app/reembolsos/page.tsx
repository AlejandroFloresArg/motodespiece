import { SITE_CONFIG } from '@/lib/config';

export default function ReembolsosPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 text-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Política de Reembolsos</h1>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">1. Naturaleza del Producto</h2>
          <p>
            Debido a que {SITE_CONFIG.nombre} vende bienes digitales intangibles e irrevocables (archivos PDF), <strong>no ofrecemos reembolsos</strong> una vez que el pedido se ha completado y el enlace de descarga ha sido generado o utilizado.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">2. Responsabilidad del Comprador</h2>
          <p>
            Es responsabilidad del cliente leer detenidamente la descripción del producto, verificar la marca, modelo, año y el tipo de manual (taller, despiece o usuario) antes de realizar la compra para asegurarse de que es el documento que necesita.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">3. Excepciones</h2>
          <p>
            Entendemos que pueden ocurrir problemas técnicos. Solo consideraremos solicitudes de reembolso bajo las siguientes circunstancias, siempre que se reporten dentro de las primeras <strong>24 horas</strong> tras la compra:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Archivo dañado o ilegible:</strong> Si el archivo PDF descargado está corrupto y no puede ser abierto, y no podemos proporcionarte una copia funcional.</li>
            <li><strong>Error en la entrega:</strong> Si el enlace de descarga nunca fue generado o enviado por un error en nuestro sistema, y no podemos resolver el envío de forma manual.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">4. Cómo solicitar asistencia</h2>
          <p>
            Si experimentas algún problema técnico con tu manual, por favor contáctanos inmediatamente a través de WhatsApp en <a href={SITE_CONFIG.whatsapp.linkArgentina} className="text-blue-600 hover:underline">Argentina</a> o <a href={SITE_CONFIG.whatsapp.linkEcuador} className="text-blue-600 hover:underline">Ecuador</a> con tu número de comprobante o el email utilizado en la compra. Evaluaremos tu caso y te daremos una solución a la brevedad.
          </p>
        </section>
      </div>
    </div>
  );
}