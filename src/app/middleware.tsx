import { NextResponse } from 'next/server';
import basicAuth from 'basic-auth';

export function middleware(req: Request) {
  const { headers } = req;
  const credentials = basicAuth(req);
  
  const PASSWORD = process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD;
  
  if (credentials?.pass === PASSWORD) {
    return NextResponse.next();
  }
  
  return new NextResponse('Authentication required', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' } });
}

export const config = {
  matcher: ['/pages/**', '/another-protected/**'],
};
