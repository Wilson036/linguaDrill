'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/lessons", label: "Lessons" },
  { href: "/review",  label: "Review"  },
  { href: "/",        label: "Home"    },
];

export default function AppNav() {
  const pathname = usePathname();
  return (
    <nav className="h-12 border-b flex items-center gap-3 px-4">
      <span className="font-semibold">LinguaDrill</span>
      <div className="flex items-center gap-2 text-sm">
        {links.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className={`px-2 py-1 rounded hover:bg-muted ${
              pathname === l.href ? "bg-muted font-medium" : ""
            }`}
          >{l.label}</Link>
        ))}
      </div>
    </nav>
  );
}