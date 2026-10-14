import { NextResponse } from 'next/server';

export function middleware(request) {
  var path = request.nextUrl.pathname;
  
  // Only protect /admin routes, exclude /admin/login
  if (path.startsWith('/admin') && path !== '/admin/login') {
    var token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export var config = {
  matcher: ['/admin/:path*'],
};
