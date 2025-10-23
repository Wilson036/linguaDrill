'use client';

import { useModalStore } from '@/store/modal';

export default function DefaultModal() {
  const { open, payload, closeModal } = useModalStore();
  if (!open) return null;

  // 你可以依 payload.type 做不同樣式 / 不同內容
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      role="dialog"
      aria-modal="true"
      onClick={closeModal}
    >
      <div
        className="max-w-lg rounded bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-2 text-lg font-semibold">
          {payload?.type ?? 'Modal'}
        </h2>
        <pre className="overflow-auto rounded bg-gray-50 p-2 text-xs">
          {JSON.stringify(payload, null, 2)}
        </pre>

        <div className="mt-4 flex gap-2">
          <button
            className="rounded bg-gray-200 px-3 py-1"
            onClick={closeModal}
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}
