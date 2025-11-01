// app/(app)/lessons/[id]/page.tsx
import { getPack } from '../data';

export default async function LessonDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // 新版 Next 建議 await params
  const pack = await getPack(id);

  if (!pack) {
    return <div className="p-6 text-sm text-red-600">找不到此教材。</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">
        {pack.title}{' '}
        <span className="text-sm text-gray-500">
          ({pack.langFrom} → {pack.langTo})
        </span>
      </h1>
      <ul className="space-y-2">
        {pack.items.map((it) => (
          <li key={it.id} className="rounded border p-3">
            <div className="font-medium">
              {it.term}{' '}
              <span className="text-gray-500">— {it.translation}</span>
            </div>
            {it.pos && (
              <div className="mt-0.5 text-xs text-gray-500">詞性：{it.pos}</div>
            )}
            {(it.exampleFrom || it.exampleTo) && (
              <div className="mt-1 text-sm">
                {it.exampleFrom && <div>📘 {it.exampleFrom}</div>}
                {it.exampleTo && <div>📗 {it.exampleTo}</div>}
              </div>
            )}
            {!!it.tags?.length && (
              <div className="mt-1 flex flex-wrap gap-1">
                {it.tags!.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
