export default function Page() {
    return (
      <main className="min-h-dvh grid place-items-center px-6">
        <section className="max-w-2xl text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">LinguaDrill</h1>
          <p className="text-muted-foreground">
            上傳音檔＋字幕，一邊聽一邊點字查字；把單字加入生字本，之後用 Leitner 間隔複習。
          </p>
          <a
            href="/lessons"
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 border hover:bg-muted"
          >
            進入課程
          </a>
        </section>
      </main>
    );
  }