Next.js App Router 速查表：layout vs template vs 一般元件

這份筆記整理了我們剛剛的討論，方便你在專案中快速決策：「要放 layout？用 template？還是抽成普通元件？」

⸻

TL;DR 心智圖（一句話版）
• 保留外殼與狀態 → 用 layout.tsx（同段導覽不重掛）。
• 每次導覽都重置/轉場 → 用 template.tsx（同段導覽必重掛）。
• 可重用 UI 區塊 → 放 components/\*，視放入位置決定是否重掛（放在 page ⇒ 會重掛；放在 layout ⇒ 不重掛）。

⸻

放置位置與語意

app/
(app)/
layout.tsx // 此段的「持久化外殼」
template.tsx // 此段每次導覽都「重掛載」
page.tsx // 進入此頁時重掛
components/
... // 普通可重用元件（無路由語意）

Route Group（例如 (app), (marketing)）不進 URL，只用來分段與套殼。

⸻

差異對照表

| 面向                                | `app/<segment>/layout.tsx`                               | `app/<segment>/template.tsx`                        | 一般元件（`components/*`）                                          |
| ----------------------------------- | -------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------- |
| **目的**                            | 持久化外殼：同段導覽不重掛，保留 UI/狀態                 | 每次導覽強制重掛載：進出同段就重建子樹              | 可重用的普通 React 元件，沒有路由語意                               |
| **放置位置**                        | 只能在對應 路由段 內                                     | 只能在對應 路由段 內                                | 任意（常見 `components/`、`app/.../_components/`）                  |
| **導覽行為**                        | 不重掛（同段內導覽）                                     | 必重掛（同段內導覽）                                | 取決於父層：在 page 會重掛；在 layout 會持久；或手動改 key 強制重掛 |
| **狀態 / Effect**                   | 同段內保留（播放器不中斷、側欄開合不丟）                 | 每次導覽重置（DOM 重建、state 歸零、effects 重跑）  | 跟隨父層或 key 改變                                                 |
| **資料抓取**                        | 可於 Server Component 中抓資料                           | 也可抓；但每次導覽會重跑（仍受 fetch 快取策略影響） | 視自身型態與所在樹而定                                              |
| **快取 / ISR**                      | 可設定 `export const revalidate = ...`（影響此段與子孫） | 不承載 revalidate 設定                              | 不適用（在 page/layout 設定）                                       |
| **Metadata / SEO**                  | 參與 metadata / generateMetadata 合併                    | 不參與 metadata 合併                                | 不參與                                                              |
| **與 loading/error/not-found**      | 這些檔案放在同一段，以該段為邊界生效                     | 同左                                                | 不影響，由所在段決定                                                |
| **與 Route Groups**                 | 可在 `(group)` 下提供不同殼且不進 URL                    | 同左                                                | 無特別關係                                                          |
| **與 revalidatePath/revalidateTag** | 版型邊界會影響失效範圍（以段為單位）                     | 無直接設定；受上層/頁面失效影響                     | 無                                                                  |
| **Server/Client**                   | 預設 Server（可嵌 Client 子元件）                        | 預設 Server（可嵌 Client 子元件）                   | 可為 Server 或 Client                                               |
| **強制重掛方式**                    | 不建議；價值在於持久                                     | 內建（系統以 unique key 保證重掛）                  | 以變更 key 或置於會重掛的父層（page/template）達成                  |

⸻

常見場景與推薦做法

1. 長駐外殼（播放器不中斷）
   • 在 (app)/layout.tsx 放外殼（Server Component），播放器做成 Client 子元件 放入 layout。
   • 切換 /lessons ↔ /review 時，layout 不重掛，播放器持續播放。

2. 轉場動畫與重置表單
   • 在 (app)/template.tsx 包一層動畫容器或初始化邏輯：

// app/(app)/template.tsx
import type { ReactNode } from 'react';
export default function Template({ children }: { children: ReactNode }) {
return <div className="animate-in fade-in duration-200">{children}</div>;
}

    •	換頁就會重掛載這層與子孫：動畫重跑、表單重置、pageview 重新打點。

3. 只有查詢參數變更也想重掛
   • 另包一層 Client 元件，手動以 pathname + searchParams 當 key：

'use client'
import { usePathname, useSearchParams } from 'next/navigation';
export default function ResetOnQuery({ children }: { children: React.ReactNode }) {
const pathname = usePathname();
const sp = useSearchParams();
const key = `${pathname}?${sp.toString()}`;
return <div key={key}>{children}</div>;
}

    •	放在 page 或 template 裡使用即可。

4. 抽共用外殼到 components/，但由 layout 掛載

// components/Shell.tsx (Server Component)
import type { ReactNode } from 'react';
import TopNav from '@/components/TopNav';
export default function Shell({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
return (
<div className="min-h-dvh grid grid-rows-[auto_1fr]">
<TopNav />
<div className="grid md:grid-cols-[240px_1fr]">
<aside className="hidden md:block border-r p-4">{aside}</aside>
<main className="p-4">{children}</main>
</div>
</div>
);
}

// app/(app)/layout.tsx
import type { ReactNode } from 'react';
import Shell from '@/components/Shell';
export default function Layout({ children }: { children: ReactNode }) {
return (
<Shell aside={
<ul className="text-sm space-y-1">
<li><a href="/lessons">Lessons</a></li>
<li><a href="/review">Review</a></li>
</ul>
}>
{children}
</Shell>
);
}

⸻

revalidate 與邊界
• 在 page 或 layout 匯出 export const revalidate = 60 ⇒ 此段與其子孫會以增量方式再生。
• 送出 Server Action 後以 revalidatePath('/lessons') / revalidateTag('lesson:123') ⇒ 以段/標籤為單位失效，再由下一次請求重生。

心法：把「需要共享的快取策略」放在 layout；「頁面特有的快取」放在 page。

⸻

常見坑點 1. 把 layout.tsx 移到 components/：失去路由語意，只是普通元件，不會自動套用。2. 把所有東西都塞進 layout：導致過度持久、狀態不易重置；需要重置的請放在 page 或 template。3. 以為 (group) 會出現在 URL：括號分組不入徑，只用於分段與套殼。4. 想靠 layout 觸發轉場：layout 不會在同段內導覽重掛，請改用 template 或自行以 key 控制。5. 在 Client 元件內直接讀環境變數：需用 NEXT*PUBLIC* 前綴；其餘只在伺服器端可讀。

⸻

小抄（檔案 → URL）

app/(marketing)/page.tsx -> /
app/(app)/lessons/page.tsx -> /lessons
app/(app)/review/page.tsx -> /review
app/(modals)/@modal/(..)lessons/[id]/dictionary/[w]/page.tsx -> /lessons/[id]/dictionary/[w]（攔截為 modal）

⸻

何時選用誰？（決策樹）1. 是否需要在同段導覽時保留外殼/狀態？→ 需要：layout；不需要：往下。2. 是否需要在切頁時重置/轉場？→ 需要：template；不需要：用 page + 普通元件即可。3. UI 是否在多處重用？→ 抽到 components/\*，由需要的 layout 或 page 引用。

⸻
