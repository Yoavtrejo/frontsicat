import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Obtenemos el token del almacenamiento (en Middleware se usan Cookies)
  // Nota: Para que el middleware lea el token, debemos guardarlo como Cookie al loguear
  const token = request.cookies.get('access_token');

  // 2. Definimos las rutas que queremos proteger
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const isMapaRoute = request.nextUrl.pathname.startsWith('/mapa');
  const isLoginRoute = request.nextUrl.pathname === '/login';

  // 3. Lógica de redirección
  if ((isDashboardRoute || isMapaRoute) && !token) {
    // Si intenta entrar a una ruta protegida sin token, al login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isLoginRoute && token) {
    // Si ya está logueado e intenta ir al login, al dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// 4. Configuramos en qué rutas se debe ejecutar el middleware
export const config = {
  matcher: ['/dashboard/:path*', '/mapa/:path*', '/login'],
};