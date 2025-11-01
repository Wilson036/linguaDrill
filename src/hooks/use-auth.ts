'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

interface UseAuthOptions {
  required?: boolean; // 是否需要登入
  redirectToPage?: boolean; // true: 導向登入頁面, false: 打開彈窗
  onUnauthorized?: () => void; // 未授權時的回調
}

export function useAuth(options: UseAuthOptions = {}) {
  const { required = false, redirectToPage = false, onUnauthorized } = options;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // 檢查並驗證 token
  const checkAuth = async () => {
    const token = localStorage.getItem('jwt');

    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);

      if (required) {
        handleUnauthorized();
      }
      return false;
    }

    try {
      // 驗證 token 是否有效（呼叫後端 API）
      const response = await axios.get(`${API}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsAuthenticated(true);
      setUser(response.data);
      setIsLoading(false);
      return true;
    } catch (error) {
      // Token 無效或過期
      console.error('Auth check failed:', error);
      localStorage.removeItem('jwt');
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);

      if (required) {
        handleUnauthorized();
      }
      return false;
    }
  };

  // 處理未授權
  const handleUnauthorized = () => {
    if (onUnauthorized) {
      onUnauthorized();
    } else if (redirectToPage) {
      // 導向登入頁面
      router.push(`/auth?returnUrl=${encodeURIComponent(pathname)}`);
    }
    // 如果 redirectToPage = false，可以由外部處理（例如打開彈窗）
  };

  // 登出
  const logout = () => {
    localStorage.removeItem('jwt');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/');
  };

  // 更新認證狀態（登入後呼叫）
  const refreshAuth = async () => {
    await checkAuth();
  };

  // 初始化檢查
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isAuthenticated,
    isLoading,
    user,
    logout,
    refreshAuth,
    checkAuth,
  };
}

// 簡化版本：只檢查 token 是否存在（不驗證有效性）
export function useAuthToken() {
  const [hasToken, setHasToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    setHasToken(!!token);
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('jwt');
    setHasToken(false);
  };

  const refreshToken = () => {
    const token = localStorage.getItem('jwt');
    setHasToken(!!token);
  };

  return {
    hasToken,
    isLoading,
    logout,
    refreshToken,
  };
}

// 獲取 token（用於 API 請求）
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jwt');
}

// 設置 token（同時存到 localStorage 和 cookie）
export function setAuthToken(token: string) {
  if (typeof window === 'undefined') return;

  // 存到 localStorage
  localStorage.setItem('jwt', token);

  // 同時存到 cookie（給 middleware 用）
  const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days
  const expires = new Date(Date.now() + expiresIn);
  document.cookie = `auth_token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
}

// 清除 token（同時清除 localStorage 和 cookie）
export function clearAuthToken() {
  if (typeof window === 'undefined') return;

  // 清除 localStorage
  localStorage.removeItem('jwt');

  // 清除 cookie
  document.cookie =
    'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
