export default function ReviewPage() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Review</h2>
      <p className="text-muted-foreground">
        這裡會顯示「今天到期」要複習的單字。Day 7/8 會接上 Leitner。
      </p>
      <div className="rounded border p-6">
        <p className="text-muted-foreground text-sm">目前沒有到期的單字。</p>
      </div>
    </section>
  );
}
