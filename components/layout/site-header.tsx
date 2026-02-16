"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#002147]/10 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo.png" 
            alt={SITE_NAME} 
            width={2000} 
            height={2080} 
            className="h-8 w-auto" 
          />
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-[#002147] text-white"
                    : "text-black/80 hover:bg-[#f3f6fb] hover:text-[#002147]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((value) => !value)}
          className="inline-flex rounded-lg border border-[#002147]/20 p-2 text-[#002147] md:hidden"
        >
          <span className="sr-only">Toggle mobile navigation</span>
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden="true">
            {isMenuOpen ? (
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 4a1 1 0 100 2h12a1 1 0 100-2H4z"
                clipRule="evenodd"
              />
            )}
          </svg>
        </button>
      </div>

      {isMenuOpen ? (
        <nav aria-label="Mobile navigation" className="border-t border-[#002147]/10 bg-white p-3 md:hidden">
          <ul className="space-y-1">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm font-medium",
                      isActive
                        ? "bg-[#002147] text-white"
                        : "text-black/80 hover:bg-[#f3f6fb] hover:text-[#002147]",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
