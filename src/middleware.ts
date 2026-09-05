import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PORTFOLIO_USER = 'Admin';
const PORTFOLIO_PASS = 'admin123';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. PORTFOLIO GATE - Check for access cookie on ALL routes except gate, login, api, static
  const isGateRoute = pathname === '/gate';
  const isLoginRoute = pathname === '/login';
  const isApiRoute = pathname.startsWith('/api/');
  const isStaticRoute = pathname.startsWith('/_next/') || pathname.startsWith('/static/') || pathname.includes('.');
  const isPublicRoute = isGateRoute || isLoginRoute || isApiRoute || isStaticRoute;

  const hasPortfolioAccess = request.cookies.get('portfolio_access')?.value === 'true';

  if (!isPublicRoute && !hasPortfolioAccess) {
    const callbackUrl = request.nextUrl.pathname + request.nextUrl.search;
    return NextResponse.redirect(new URL(`/gate?callbackUrl=${encodeURIComponent(callbackUrl)}`, request.url));
  }

  // 2. EXISTING JWT AUTH for dashboard/mapa routes
  const token = request.cookies.get('access_token');
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isMapaRoute = pathname.startsWith('/mapa');

  if ((isDashboardRoute || isMapaRoute) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};