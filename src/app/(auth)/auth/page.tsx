'use client';

import { useSearchParams } from 'next/navigation';
import AuthForm from '@/components/auth-form';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <AuthForm returnUrl={returnUrl} />
      </div>
    </div>
  );
}
