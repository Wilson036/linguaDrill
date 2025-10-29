// app/(app)/upload/page.tsx
'use client';

import { useRef, useState } from 'react';

type UploadResp = { ok: true; url: string } | { ok: false; error: string };
const base = process.env.NEXT_PUBLIC_API_BASE;

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<
    'idle' | 'ready' | 'uploading' | 'done' | 'error'
  >('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 選檔並立即上傳
  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith('audio/')) {
      alert('請上傳音檔');
      return;
    }
    if (selectedFile.size > 50 * 1024 * 1024) {
      alert('檔案大小不能超過 50MB');
      return;
    }

    setFile(selectedFile);
    setServerUrl(null);
    setStatus('uploading');

    // 立即上傳
    try {
      const fd = new FormData();
      fd.append('file', selectedFile);
      const res = await fetch(`${base}/upload`, { method: 'POST', body: fd });
      const data = (await res.json()) as UploadResp;
      console.log({ data });
      if (!res.ok || !data.ok) {
        throw new Error('上傳失敗');
      }
      setServerUrl(`${base}${data.url}`);
      setStatus('done');
    } catch (e) {
      console.error(e);
      setStatus('error');
      setFile(null);
      alert('上傳失敗，稍後再試');
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

      {serverUrl ? (
        <audio  className="w-full" controls src={serverUrl} />
      ) : null}

      <div className="text-sm text-gray-600">
        狀態：{status}
        {file && ` · 檔案：${file.name}`}
      </div>
    </div>
  );
}
