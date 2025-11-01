// Cookie 管理工具
const TOKEN_COOKIE_NAME = 'auth_token';

export function setAuthCookie(token: string) {
  // 設置 cookie（7 天過期）
  const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days
  const expires = new Date(Date.now() + expiresIn);

  document.cookie = `${TOKEN_COOKIE_NAME}=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
}

export function getAuthCookie(): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split('; ');
  const tokenCookie = cookies.find((cookie) =>
    cookie.startsWith(`${TOKEN_COOKIE_NAME}=`)
  );

  if (!tokenCookie) return null;
  return tokenCookie.split('=')[1];
}

export function clearAuthCookie() {
  document.cookie = `${TOKEN_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
