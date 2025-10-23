# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lingua Drill is a language learning application built with Next.js 15 (App Router) and React 19. The application uses advanced Next.js routing features including parallel routes, intercepting routes, and route groups to create a sophisticated modal-based user experience.

## Commands

**Development:**

```bash
npm run dev           # Start dev server with Turbopack
npm run build         # Build for production with Turbopack
npm start             # Start production server
npm run lint          # Run ESLint
```

## Architecture

### Route Groups and Organization

The app uses Next.js route groups to organize pages into distinct sections:

- `(marketing)/` - Public-facing marketing pages (landing page at `/`)
- `(app)/` - Authenticated application pages (dashboard, lessons, review)
- `app/` - Additional app-specific layouts (separate from route groups)

### Parallel Routes with Intercepting Routes

The `/lessons` section demonstrates a sophisticated routing pattern using **parallel routes** combined with **intercepting routes**:

**Key files:**

- `src/app/(app)/lessons/layout.tsx` - Defines the `modal` parallel slot
- `src/app/(app)/lessons/@modal/(.)[id]/page.tsx` - Intercepts `/lessons/[id]` navigation and renders as modal
- `src/app/(app)/lessons/[id]/page.tsx` - Full-page fallback when accessed directly or refreshed
- `src/app/(app)/lessons/@modal/default.tsx` - Default content when no modal is active

**How it works:**

1. Clicking a lesson link from `/lessons` navigates to `/lessons/[id]`
2. The `(.)` prefix intercepts this navigation and renders the `@modal` slot as an overlay
3. Direct URL access or refresh loads the full page version from `[id]/page.tsx`
4. The modal can be closed with `router.back()` to return to the list

### State Management

- **Zustand** is used for client-side state management
- Store files are located in `src/store/`
- `src/store/modal.ts` - Modal state management with `useModalStore` (type, id, data payload)

### Layout Hierarchy

1. `src/app/layout.tsx` - Root layout (HTML, fonts, global styles)
2. `src/app/(app)/layout.tsx` - App section layout with `AppNav` and sidebar
3. `src/app/(app)/template.tsx` - Template for animation effects (remounts on navigation)
4. Route-specific layouts like `src/app/(app)/lessons/layout.tsx`

**Important:** Templates remount on every navigation, layouts persist. Use templates for animations.

### Path Aliases

- `@/*` maps to `src/*` (configured in `tsconfig.json`)
- Use `@/components`, `@/lib`, `@/store` for imports

### Styling

- **Tailwind CSS v4** with PostCSS
- **tw-animate-css** for animation utilities
- Utility libraries: `clsx`, `tailwind-merge`, `class-variance-authority`
- Global styles in `src/app/globals.css`

### Components

- `src/components/app-nav.tsx` - Main navigation component
- `src/components/Probe.tsx` - Debug component for tracking mount/unmount lifecycle
- Component utilities in `src/lib/utils.ts`

### Async Params Handling

**Next.js 15 requires awaiting params in Server Components:**

```tsx
// ✅ Correct
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div>Lesson {id}</div>;
}

// ❌ Incorrect (Next.js 14 style)
export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  return <div>Lesson {id}</div>;
}
```

Client components can use `useParams()` hook directly without awaiting.

## Key Technologies

- **Framework:** Next.js 15.5.6 with App Router
- **React:** 19.1.0
- **TypeScript:** 5.x with strict mode
- **Styling:** Tailwind CSS v4
- **State:** Zustand 5.x
- **Icons:** lucide-react
- **Build tool:** Turbopack (enabled via `--turbopack` flag)
- **Package manager:** npm (note: pnpm-lock.yaml exists but package.json scripts use npm)

## Development Notes

- Language: Application UI is in Traditional Chinese (`zh-TW`)
- The `Probe` component is used for debugging lifecycle events (mount/unmount logging)
- All route groups use parentheses syntax to organize without affecting URL structure
- Modal patterns use intercepting routes `(.)` for in-app navigation vs direct access
