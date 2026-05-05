export const SITE_CONFIG = {
  nombre: 'MotoDespiece',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  descripcion: 'Venta de manuales de taller, despiece y usuario para motocicletas en formato PDF.',
  whatsapp: {
    argentina: '+5491136686878',
    ecuador: '+593989199629',
    linkArgentina: 'https://wa.me/5491136686878',
    linkEcuador: 'https://wa.me/593989199629'
  },
  email: {
    soporte: process.env.RESEND_FROM_EMAIL ?? 'soporte@motodespiece.com'
  },
  moneda: 'ARS',
  horasExpiracionToken: 48,
  bucketName: 'manuales_pdf'
};