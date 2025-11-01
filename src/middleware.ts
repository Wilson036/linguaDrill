import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  protectedRoutes,
  authRoutes,
  DEFAULT_REDIRECT,
  LOGIN_PAGE,
} from './config/routes';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 從 cookie 取得 token
  const token = request.cookies.get('auth_token')?.value;

  // 檢查是否為受保護的路由
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 檢查是否為登入相關路由
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // 1. 如果是受保護的路由且沒有 token，導向登入頁
  if (isProtectedRoute && !token) {
    const url = new URL(LOGIN_PAGE, request.url);
    url.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(url);
  }

  // 2. 如果已登入且訪問登入頁，導向預設頁面
  if (isAuthRoute && token) {
    // 檢查是否有 returnUrl
    const returnUrl = request.nextUrl.searchParams.get('returnUrl');
    const redirectUrl = returnUrl || DEFAULT_REDIRECT;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

// 設定 middleware 要處理的路徑
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
