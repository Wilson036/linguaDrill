import type { ReactNode } from "react";
import AppNav from "@/component/app-nav";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr]">
      <AppNav />
      <div className="grid md:grid-cols-[240px_1fr]">
        <aside className="hidden md:block border-r p-4 space-y-2">
          <p className="text-sm text-muted-foreground">快速導覽</p>
          <ul className="space-y-1 text-sm">
            <li><a href="/lessons" className="hover:underline">所有課程</a></li>
            <li><a href="/review" className="hover:underline">今日複習</a></li>
          </ul>
        </aside>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}