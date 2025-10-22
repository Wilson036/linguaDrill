import { Probe } from "@/components/Probe";
import type { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <div className="fade-enter">
      <Probe name="(app) template" />
      {children}
    </div>
  );
}