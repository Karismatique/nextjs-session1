import { NextResponse } from 'next/server'

// On n'importe plus auth() ici pour ne pas exploser la limite de 1 Mo de Vercel 

export function middleware(req: any) {
  const pathname = req.nextUrl.pathname;
  
  if (pathname.startsWith('/api')) {
    const ts = new Date().toISOString().slice(11, 19);
    console.log(`[${ts}] ${req.method.padEnd(6)} ${pathname}`);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/profile/:path*'],
};