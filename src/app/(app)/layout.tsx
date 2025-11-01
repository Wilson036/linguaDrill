import type { ReactNode } from 'react';
import AppNav from '@/components/app-nav';
import { Probe } from '@/components/Probe';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr]">
      <Probe name="(app) layout" />
      <AppNav />
      <div className="grid md:grid-cols-[240px_1fr]">
        <aside className="hidden space-y-2 border-r p-4 md:block">
          <p className="text-muted-foreground text-sm">快速導覽</p>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="/lessons" className="hover:underline">
                所有課程
              </a>
            </li>
            <li>
              <a href="/review" className="hover:underline">
                今日複習
              </a>
            </li>
            <li>
              <a href="/upload" className="hover:underline">
                上傳教材
              </a>
            </li>
          </ul>
        </aside>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
