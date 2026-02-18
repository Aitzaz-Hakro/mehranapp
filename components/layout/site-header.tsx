"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [canUpload, setCanUpload] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL?.toLowerCase();

    const resolveUploadAccess = async (
      user: { id: string; email?: string | null; app_metadata?: Record<string, unknown> } | null,
    ) => {
      if (!user) {
        setCanUpload(false);
        setIsSuperAdmin(false);
        return;
      }

      const userEmail = user.email?.toLowerCase();
      const hasSuperAdminMetadata = user.app_metadata?.is_super_admin === true;
      const hasSuperAdminEmailAccess = Boolean(superAdminEmail && userEmail === superAdminEmail);
      const { data: canUploadByRpc } = await supabase.rpc("is_current_user_uploader");

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      const { data: isSuperAdminByAuth } = await supabase.rpc("is_current_user_super_admin");
      const hasUploaderAccess = Boolean(canUploadByRpc);

      if (error) {
        const hasSuperAdminAccess =
          hasSuperAdminEmailAccess || hasSuperAdminMetadata || Boolean(isSuperAdminByAuth);
        setCanUpload(hasUploaderAccess || hasSuperAdminAccess);
        setIsSuperAdmin(hasSuperAdminAccess);
        return;
      }

      const hasSuperAdminRole = profile?.role === "super_admin";
      const hasSuperAdminAccess =
        hasSuperAdminEmailAccess ||
        hasSuperAdminMetadata ||
        hasSuperAdminRole ||
        Boolean(isSuperAdminByAuth);

      setIsSuperAdmin(hasSuperAdminAccess);
      setCanUpload(hasUploaderAccess || profile?.role === "admin" || hasSuperAdminAccess);
    };

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setIsSignedIn(Boolean(user));
      await resolveUploadAccess(user);
      setIsLoadingAuth(false);
    };

    void loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void (async () => {
        setIsSignedIn(Boolean(session?.user));
        await resolveUploadAccess(session?.user ?? null);
        setIsLoadingAuth(false);
      })();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsSignedIn(false);
    setCanUpload(false);
    setIsSuperAdmin(false);
    setIsMenuOpen(false);
    window.location.assign("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#001730] bg-[#002147]/95 text-white backdrop-blur-sm">
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
                    ? "bg-white text-[#002147]"
                    : "text-white/90 hover:bg-white/10 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}

          {isLoadingAuth || !canUpload ? null : (
            <Link
              href="/admin/upload"
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition",
                pathname === "/admin/upload"
                  ? "bg-white text-[#002147]"
                  : "text-white/90 hover:bg-white/10 hover:text-white",
              )}
            >
              Upload PP
            </Link>
          )}

          {isLoadingAuth || !isSuperAdmin ? null : (
            <Link
              href="/admin/manage-admins"
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition",
                pathname === "/admin/manage-admins"
                  ? "bg-white text-[#002147]"
                  : "text-white/90 hover:bg-white/10 hover:text-white",
              )}
            >
              Manage Admins
            </Link>
          )}

          {isLoadingAuth ? null : isSignedIn ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-lg border border-white/30 px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white"
            >
              Sign out
            </button>
          ) : (
            <Link
              href={`/login?next=${encodeURIComponent(pathname || "/")}`}
              className="rounded-lg border border-white/30 px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white"
            >
              Sign in
            </Link>
          )}
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((value) => !value)}
          className="inline-flex rounded-lg border border-white/30 p-2 text-white md:hidden"
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
        <nav aria-label="Mobile navigation" className="border-t border-white/20 bg-[#002147] p-3 md:hidden">
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
                        ? "bg-white text-[#002147]"
                        : "text-white/90 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}

            {isLoadingAuth || !canUpload ? null : (
              <li>
                <Link
                  href="/admin/upload"
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm font-medium",
                    pathname === "/admin/upload"
                      ? "bg-white text-[#002147]"
                      : "text-white/90 hover:bg-white/10 hover:text-white",
                  )}
                >
                  Upload PP
                </Link>
              </li>
            )}

            {isLoadingAuth || !isSuperAdmin ? null : (
              <li>
                <Link
                  href="/admin/manage-admins"
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm font-medium",
                    pathname === "/admin/manage-admins"
                      ? "bg-white text-[#002147]"
                      : "text-white/90 hover:bg-white/10 hover:text-white",
                  )}
                >
                  Manage Admins
                </Link>
              </li>
            )}

            {isLoadingAuth ? null : (
              <li>
                {isSignedIn ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white"
                  >
                    Sign out
                  </button>
                ) : (
                  <Link
                    href={`/login?next=${encodeURIComponent(pathname || "/")}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white"
                  >
                    Sign in
                  </Link>
                )}
              </li>
            )}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
