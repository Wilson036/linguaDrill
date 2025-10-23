export default function LessonsLayout({
    children,
    modal, // 對應資料夾 @modal
  }: {
    children: React.ReactNode;
    modal: React.ReactNode;
  }) {
    return (
      <div className="relative p-6">
        {children}
        {modal /* 疊在上層的 Modal Slot */}
      </div>
    );
  }