'use client';

import { useState } from 'react';
import { SITE_CONFIG } from '@/lib/config';

const preguntasFrecuentes = [
  {
    pregunta: "¿Cómo descargo el manual?",
    respuesta: "Una vez completado el pago, recibirás automáticamente un correo electrónico con un enlace único y seguro para descargar tu manual en formato PDF."
  },
  {
    pregunta: "¿En qué formato está?",
    respuesta: "Todos nuestros manuales se entregan en formato PDF de alta calidad. Es el formato estándar y universal."
  },
  {
    pregunta: "¿Funciona en celular y tablet?",
    respuesta: "Sí, absolutamente. Al ser un archivo PDF, podés abrirlo, leerlo y hacer zoom sin problemas en cualquier teléfono inteligente (Android o iPhone), tablet o computadora."
  },
  {
    pregunta: "¿Cuánto tarda en llegar el email?",
    respuesta: "El envío es automático. Deberías recibir el correo con el enlace de descarga en un par de minutos tras la confirmación del pago. Recordá siempre revisar tu carpeta de Spam o Correo no deseado."
  },
  {
    pregunta: "¿Puedo imprimir el manual?",
    respuesta: "Sí. Una vez descargado el archivo PDF en tu dispositivo, podés imprimir las páginas que necesites o el manual completo para llevarlo a tu taller."
  },
  {
    pregunta: "¿Qué pasa si no me llegó el email?",
    respuesta: "Si pasaron más de 15 minutos, el pago se debitó de tu cuenta y no encontrás el correo ni en la carpeta de Spam, contactanos por WhatsApp y te enviaremos el manual de forma directa tras verificar tu compra."
  },
  {
    pregunta: "¿Cuánto tiempo tengo para descargar?",
    respuesta: `El enlace de descarga que recibís por correo es válido por ${SITE_CONFIG.horasExpiracionToken} horas por motivos de seguridad. Te recomendamos descargar y guardar el archivo PDF en tu dispositivo apenas recibas el correo.`
  },
  {
    pregunta: "¿Puedo pedir reembolso?",
    respuesta: "Al tratarse de un producto digital (archivo PDF) irrevocable, no ofrecemos reembolsos una vez enviado el enlace, salvo excepciones por fallas técnicas comprobables dentro de las primeras 24 horas. Podés leer los detalles en nuestra Política de Reembolsos."
  },
  {
    pregunta: "¿Cómo me contacto si hay un problema?",
    respuesta: `Podés escribirnos directamente a nuestro WhatsApp haciendo clic en los enlaces de Argentina o Ecuador al pie de la página, o respondiendo al correo electrónico donde recibiste tu compra.`
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Preguntas Frecuentes</h1>
          <p className="mt-4 text-gray-600">
            Resolvé tus dudas rápidamente sobre el proceso de compra y descarga.
          </p>
        </div>

        <div className="space-y-4">
          {preguntasFrecuentes.map((faq, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-opacity-50"
                onClick={() => toggleAccordion(index)}
                aria-expanded={openIndex === index}
              >
                <span className="font-medium text-gray-900">{faq.pregunta}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.respuesta}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-700">
            ¿No encontraste lo que buscabas?
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <a 
              href={SITE_CONFIG.whatsapp.linkArgentina} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-black font-semibold hover:underline"
            >
              WhatsApp 🇦🇷
            </a>
            <a 
              href={SITE_CONFIG.whatsapp.linkEcuador} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-black font-semibold hover:underline"
            >
              WhatsApp 🇪🇨
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}