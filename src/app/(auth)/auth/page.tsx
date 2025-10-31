'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

// Zod schema for validation
const authSchema = z.object({
  email: z.email('請輸入有效的 Email 地址'),
  password: z
    .string()
    .min(8, 'Password 至少需要 8 個字元')
    .regex(/[a-z]/, 'Password 必須包含至少一個小寫英文字母')
    .regex(/[A-Z]/, 'Password 必須包含至少一個大寫英文字母')
    .regex(/[0-9]/, 'Password 必須包含至少一個數字')
    .regex(/[^a-zA-Z0-9]/, 'Password 必須包含至少一個特殊符號'),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
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
        // 註冊成功後可以直接幫他登入一次，或顯示「請登入」
        // 這裡我們簡單點：幫他切去 login
        setMode('login');
        reset();
        return;
      }

      // login 成功
      const token = response.data.access_token; // 後端就是這樣回的
      // ⬜ 存起來（先用 localStorage）
      localStorage.setItem('jwt', token);

      // 跳去上傳頁
      router.push('/upload');
    } catch (err: unknown) {
      console.error(err);
      // axios 錯誤處理
      if (axios.isAxiosError(err)) {
        // ⬜ 根據後端錯誤顯示，例如 EMAIL_TAKEN 或 INVALID_CREDENTIALS
        const message = err.response?.data?.message || '發生錯誤';
        setError(message);
      } else {
        setError('無法連線到伺服器');
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded bg-white p-6 shadow">
        <h1 className="mb-4 text-xl font-bold">
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
            className="w-full rounded bg-blue-600 py-2 text-white disabled:opacity-50"
          >
            {isSubmitting ? '處理中…' : mode === 'login' ? '登入' : '註冊'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          {mode === 'login' ? '還沒有帳號？' : '已經有帳號了？'}{' '}
          <button
            className="text-blue-600"
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
    </div>
  );
}