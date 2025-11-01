'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useAuthToken } from '@/hooks/use-auth';
import AuthModal from './auth-modal';

const links = [
  { href: '/lessons', label: 'Lessons' },
  { href: '/review', label: 'Review' },
  { href: '/upload', label: 'Upload' },
  { href: '/', label: 'Home' },
];

export default function AppNav() {
  const pathname = usePathname();
  const { hasToken, logout, refreshToken } = useAuthToken();
  const { isAuthModalOpen, returnUrl, openAuthModal, closeAuthModal } =
    useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const handleLogin = () => {
    openAuthModal(pathname);
  };

  const handleAuthSuccess = () => {
    refreshToken();
  };

  return (
    <>
      <nav className="flex h-12 items-center gap-3 border-b px-4">
        <span className="font-semibold">LinguaDrill</span>
        <div className="flex flex-1 items-center gap-2 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`hover:bg-muted rounded px-2 py-1 ${
                pathname === l.href ? 'bg-muted font-medium' : ''
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {hasToken ? (
            <button
              onClick={handleLogout}
              className="hover:bg-muted flex items-center gap-1 rounded px-3 py-1 text-sm"
            >
              <LogOut className="h-4 w-4" />
              登出
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="hover:bg-muted flex items-center gap-1 rounded px-3 py-1 text-sm"
            >
              <User className="h-4 w-4" />
              登入
            </button>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onSuccess={handleAuthSuccess}
        returnUrl={returnUrl || undefined}
      />
    </>
  );
}
