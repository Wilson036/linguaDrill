import Link from "next/link";

export default async function LessonsPage() {
    // Day 1 先放假資料；Day 2 會接 Prisma/DB
    const lessons = [
      { id: "demo-en", title: "Demo (EN) – Airport Check-in", language: "en" },
      { id: "demo-ja", title: "Demo (JA) – コンビニ会話", language: "ja" },
    ];
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Lessons</h2>
        <ul className="divide-y rounded border">
          {lessons.map(l => (
            <li key={l.id} className="p-4 hover:bg-muted/50">
            <Link
              className="block rounded border p-3 hover:bg-gray-50"
              href={`/lessons/${l.id}`}
            >
              {l.title}
            </Link>
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-500">
        點清單項目會以 <strong>Modal</strong> 打開，但 URL 仍會變成 /lessons/[id]。
      </p>
      </section>
    );
  }