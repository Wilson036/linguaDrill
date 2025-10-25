// app/(app)/lessons/@modal/(.)[id]/page.tsx
'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { createLesson } from '../../action';

export default function LessonModal() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>(); // ← 從 hook 取得 id
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await createLesson({ comment });
    } catch (error) {
      console.error(error);
    }
  };

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

        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="comment"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              留言
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="請輸入你的留言..."
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            送出留言
          </button>
        </form>

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
