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
              <a href={`/lessons/${l.id}`} className="flex justify-between">
                <span>{l.title}</span>
                <span className="text-xs text-muted-foreground uppercase">{l.language}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          * 明天（Day 2）會把這裡換成資料庫讀取。
        </p>
      </section>
    );
  }