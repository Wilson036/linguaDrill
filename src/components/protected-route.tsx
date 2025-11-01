'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectToPage?: boolean; // true: 導向登入頁面, false: 打開彈窗（需配合外部處理）
  fallback?: ReactNode; // 載入中顯示的內容
}

export default function ProtectedRoute({
  children,
  redirectToPage = true,
  fallback = (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-muted-foreground">載入中...</div>
    </div>
  ),
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth({
    required: true,
    redirectToPage,
  });

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    // 如果不是導向頁面模式，可以在這裡處理（例如顯示提示）
    if (!redirectToPage) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-muted-foreground">請先登入</div>
        </div>
      );
    }
    return null; // useAuth 已經處理導向
  }

  return <>{children}</>;
}
