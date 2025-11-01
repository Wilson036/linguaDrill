// app/(app)/upload/page.tsx
'use client';

import { useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { useAuth, getAuthToken } from '@/hooks/use-auth';
import ProtectedRoute from '@/components/protected-route';

type UploadResp = { ok: true; url: string } | { ok: false; error: string };
const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

function UploadPageContent() {
  const [file, setFile] = useState<File | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<
    'idle' | 'ready' | 'uploading' | 'done' | 'error'
  >('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // 選檔並立即上傳
  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // 驗證檔案類型
    if (!selectedFile.type.startsWith('audio/')) {
      alert('請上傳音檔');
      return;
    }

    // 驗證檔案大小
    if (selectedFile.size > 50 * 1024 * 1024) {
      alert('檔案大小不能超過 50MB');
      return;
    }

    setFile(selectedFile);
    setServerUrl(null);
    setStatus('uploading');

    // 立即上傳
    try {
      const token = getAuthToken();
      if (!token) {
        router.push(`/auth?returnUrl=${encodeURIComponent(pathname)}`);
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post(`${API}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data as UploadResp;

      if (!data.ok) {
        throw new Error('上傳失敗');
      }

      setServerUrl(`${API}${data.url}`);
      setStatus('done');
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem('jwt');
        router.push(`/auth?returnUrl=${encodeURIComponent(pathname)}`);
      } else {
        alert('上傳失敗，請稍後再試');
      }
      setStatus('error');
      setFile(null);
    }
  }

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-xl font-bold">上傳音檔並播放</h1>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={onPick}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={status === 'uploading'}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'uploading' ? '上傳中...' : '選擇音檔'}
      </button>

      {status === 'uploading' && (
        <div className="text-sm text-blue-600">正在上傳檔案...</div>
      )}

      {serverUrl ? <audio className="w-full" controls src={serverUrl} /> : null}

      <div className="text-sm text-gray-600">
        狀態：{status}
        {file && ` · 檔案：${file.name}`}
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <ProtectedRoute redirectToPage={true}>
      <UploadPageContent />
    </ProtectedRoute>
  );
}
