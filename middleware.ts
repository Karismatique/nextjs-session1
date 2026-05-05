// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  if (pathname.startsWith('/api')) {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
    console.log(`[${timestamp}] ${method.padEnd(6)} ${pathname}`);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};