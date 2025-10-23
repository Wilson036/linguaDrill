// app/(app)/lessons/@modal/loading.tsx
export default function ModalLoading() {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30">
        <div className="rounded bg-white p-4 shadow">Loading…</div>
      </div>
    );
  }