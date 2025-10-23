export default function Page() {
  return (
    <main className="grid min-h-dvh place-items-center px-6">
      <section className="max-w-2xl space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">LinguaDrill</h1>
        <p className="text-muted-foreground">
          上傳音檔＋字幕，一邊聽一邊點字查字；把單字加入生字本，之後用 Leitner
          間隔複習。
        </p>
        <a
          href="/lessons"
          className="hover:bg-muted inline-flex items-center justify-center rounded-lg border px-4 py-2"
        >
          進入課程
        </a>
      </section>
    </main>
  );
}
