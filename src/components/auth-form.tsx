'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { setAuthToken } from '@/hooks/use-auth';

const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

// Zod schema for validation
export const authSchema = z.object({
  email: z.email('請輸入有效的 Email 地址'),
  password: z
    .string()
    .min(8, 'Password 至少需要 8 個字元')
    .regex(/[a-z]/, 'Password 必須包含至少一個小寫英文字母')
    .regex(/[A-Z]/, 'Password 必須包含至少一個大寫英文字母')
    .regex(/[0-9]/, 'Password 必須包含至少一個數字')
    .regex(/[^a-zA-Z0-9]/, 'Password 必須包含至少一個特殊符號'),
});

export type AuthFormData = z.infer<typeof authSchema>;

interface AuthFormProps {
  onSuccess?: () => void;
  returnUrl?: string;
  defaultMode?: 'login' | 'register';
}

export default function AuthForm({
  onSuccess,
  returnUrl,
  defaultMode = 'login',
}: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [error, setError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    mode: 'onBlur',
  });

  async function onSubmit(data: AuthFormData) {
    setError('');
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const response = await axios.post(`${API}${endpoint}`, {
        email: data.email.trim(),
        password: data.password,
      });

      if (mode === 'register') {
        // 註冊成功後切換到登入模式
        setMode('login');
        reset();
        return;
      }

      // login 成功
      const token = response.data.access_token;
      setAuthToken(token);

      // 觸發成功回調
      onSuccess?.();

      // 導向原本的頁面或預設頁面
      if (returnUrl) {
        router.push(returnUrl);
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || '發生錯誤';
        setError(message);
      } else {
        setError('無法連線到伺服器');
      }
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">
        {mode === 'login' ? '登入' : '註冊'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm">Email</label>
          <input
            type="email"
            className={`w-full rounded border px-3 py-2 ${
              errors.email ? 'border-red-500' : ''
            }`}
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm">Password</label>
          <input
            type="password"
            className={`w-full rounded border px-3 py-2 ${
              errors.password ? 'border-red-500' : ''
            }`}
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-blue-600 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? '處理中…' : mode === 'login' ? '登入' : '註冊'}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        {mode === 'login' ? '還沒有帳號？' : '已經有帳號了？'}{' '}
        <button
          className="text-blue-600 hover:underline"
          onClick={() => {
            setError('');
            reset();
            setMode(mode === 'login' ? 'register' : 'login');
          }}
        >
          {mode === 'login' ? '去註冊' : '去登入'}
        </button>
      </p>
    </div>
  );
}
