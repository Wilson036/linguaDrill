// app/(app)/lessons/[id]/page.tsx
export default async function LessonFullPage({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const { id } = await params;        // ← 關鍵：先 await 再取用 id
  
    // 模擬慢資料
    await new Promise((r) => setTimeout(r, 500));
  
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-bold">Lesson #{id}（完整頁）</h1>
        <p className="text-gray-600">
          直接以網址列開啟或重整時，會看到完整頁而不是 modal。
        </p>
      </div>
    );
  }