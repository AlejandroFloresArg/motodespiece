import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    // Si no hay header de autorización, mostramos el popup nativo del navegador
    return new NextResponse('Autenticación requerida', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Panel de Administración MotoDespiece"',
      },
    });
  }

  // Decodificar las credenciales que vienen en Base64
  const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  const user = auth[0];
  const pass = auth[1];

  const validUser = 'admin';
  const validPass = process.env.ADMIN_PASSWORD;

  // Validar usuario y contraseña
  if (user === validUser && pass === validPass) {
    return NextResponse.next();
  }

  // Si se ingresa mal la contraseña
  return new NextResponse('Credenciales inválidas', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Panel de Administración MotoDespiece"',
    },
  });
}

// Configurar en qué rutas específicas se ejecuta esta protección
export const config = {
  matcher: '/admin/:path*',
};