// 路由配置

// 需要登入的路由
export const protectedRoutes = [
  '/upload',
  '/dashboard',
  // 可以繼續添加其他需要保護的路由
];

// 公開路由（不需要登入）
export const publicRoutes = [
  '/',
  '/lessons',
  '/review',
  '/auth',
  // 可以繼續添加其他公開路由
];

// 登入後不應訪問的路由（例如登入頁）
export const authRoutes = ['/auth'];

// 預設登入後導向的頁面
export const DEFAULT_REDIRECT = '/dashboard';

// 登入頁面
export const LOGIN_PAGE = '/auth';
