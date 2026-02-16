import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const baseClassName =
  "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002147]/40";

interface ButtonProps {
  children: ReactNode;
  className?: string;
}

export function PrimaryLinkButton({ children, className, href }: ButtonProps & { href: string }) {
  return (
    <Link
      href={href}
      className={cn(
        baseClassName,
        "bg-[#002147] text-white hover:bg-[#001730]",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function SecondaryLinkButton({ children, className, href }: ButtonProps & { href: string }) {
  return (
    <Link
      href={href}
      className={cn(
        baseClassName,
        "border border-[#002147]/20 bg-white text-[#002147] hover:bg-[#f3f6fb]",
        className,
      )}
    >
      {children}
    </Link>
  );
}
