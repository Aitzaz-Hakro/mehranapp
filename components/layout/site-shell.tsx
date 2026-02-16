import type { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/site-header";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-black">
      <SiteHeader />
      <main>{children}</main>
    </div>
  );
}
