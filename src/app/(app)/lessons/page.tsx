// app/(app)/lessons/page.tsx
'use client';

import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { LANGUAGE_PACKS } from './data';

function highlight(text: string, kw: string) {
  if (!kw) return text;
  const re = new RegExp(
    `(${kw.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')})`,
    'ig'
  );
  return text.split(re).map((seg, i) =>
    seg.toLowerCase() === kw.toLowerCase() ? (
      <mark key={i} className="rounded bg-yellow-200 px-0.5">
        {seg}
      </mark>
    ) : (
      <span key={i}>{seg}</span>
    )
  );
}

async function copyLink(id: string) {
  const href = `${window.location.origin}/lessons/${id}`;
  await navigator.clipboard.writeText(href);
  alert('已複製分享連結：' + href);
}

export default function LessonsPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const initQ = sp.get('q') ?? '';
  const [q, setQ] = useState(initQ);
  const dq = useDeferredValue(q);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (dq) url.searchParams.set('q', dq);
    else url.searchParams.delete('q');
    router.replace(url.toString(), { scroll: false });
  }, [dq, router]);

  const list = useMemo(() => {
    const kw = dq.trim().toLowerCase();
    if (!kw) return LANGUAGE_PACKS;
    return LANGUAGE_PACKS.map((p) => ({
      ...p,
      // 呈現用：符合關鍵字的數量
      matchCount: p.items.filter(
        (it) =>
          p.title.toLowerCase().includes(kw) ||
          it.term.toLowerCase().includes(kw) ||
          it.translation.toLowerCase().includes(kw)
      ).length,
    })).filter((p) => p.matchCount > 0 || p.title.toLowerCase().includes(kw));
  }, [dq]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">語言學習教材</h1>

      <input
        className="w-full rounded border px-3 py-2"
        placeholder="搜尋標題 / 原文 / 翻譯（會同步到 ?q=）"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <ul className="space-y-2">
        {list.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between rounded border p-3"
          >
            <div className="min-w-0">
              <Link className="block hover:underline" href={`/lessons/${p.id}`}>
                {highlight(p.title, dq)}
              </Link>
              <div className="mt-1 text-xs text-gray-500">
                {p.langFrom} → {p.langTo} ・ 共 {p.items.length} 筆
                {dq && typeof (p as any).matchCount === 'number' && (
                  <> ・ 符合 {(p as any).matchCount} 筆</>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                className="rounded bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200"
                href={`/lessons/${p.id}`}
              >
                查看
              </Link>
              <button
                onClick={() => copyLink(p.id)}
                className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:opacity-90"
              >
                複製連結
              </button>
            </div>
          </li>
        ))}
        {list.length === 0 && (
          <li className="rounded border p-3 text-sm text-gray-500">
            沒有符合的結果
          </li>
        )}
      </ul>
    </div>
  );
}
