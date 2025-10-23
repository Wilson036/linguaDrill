// app/(app)/lessons/@modal/(.)[id]/page.tsx
'use client';

import { useRouter, useParams } from 'next/navigation';

export default function LessonModal() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();  // ← 從 hook 取得 id

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={() => router.back()}
    >
      <div
        className="max-w-lg rounded bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-2 text-lg font-semibold">Lesson #{id}</h2>
        <p className="text-sm text-gray-600">
          這是以 <code>@modal</code> 插槽 + <code>(.)</code> 攔截的 Modal 版本。
        </p>
        <div className="mt-4">
          <button
            className="rounded bg-blue-600 px-3 py-1 text-white"
            onClick={() => router.back()}
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}