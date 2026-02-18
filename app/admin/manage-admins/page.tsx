import { redirect } from "next/navigation";

import { ManageAdminsPanel } from "@/components/admin/manage-admins-panel";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ManageAdminsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent("/admin/manage-admins")}`);
  }

  const superAdminEmail =
    process.env.SUPER_ADMIN_EMAIL?.toLowerCase() ??
    process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL?.toLowerCase();

  const isSuperAdminByEmail = Boolean(
    superAdminEmail && user.email?.toLowerCase() === superAdminEmail,
  );
  const isSuperAdminByMetadata = user.app_metadata?.is_super_admin === true;

  const { data: isSuperAdminByAuth } = await supabase.rpc("is_current_user_super_admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isSuperAdminByRole = profile?.role === "super_admin";

  if (!isSuperAdminByEmail && !isSuperAdminByMetadata && !isSuperAdminByRole && !isSuperAdminByAuth) {
    redirect("/");
  }

  const { data: admins } = await supabase.rpc("get_admin_users");

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-[#002147]">Manage Admins</h1>
      <p className="mb-6 text-sm text-black/70">
        Add or remove admins and review uploaded files by each admin.
      </p>
      <ManageAdminsPanel initialAdmins={admins ?? []} />
    </section>
  );
}