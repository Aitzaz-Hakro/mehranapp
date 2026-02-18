import { UploadPaperForm } from "@/components/admin/upload-paper-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const departments = [
   "Computer Systems",
   "Computer Science",
   "Artificial Intelligence",
   "Cyber Security",
   "Telecommunication",
   "BBA",
   "Textile",
   "Architecture", 
   "Mathematics", 
   "English", 
   "Electronics",
   "Petroleum & NG",
   "Chemical",  
   "Metallurgy",
   "Minning",
   "Industrial",
   "Biomedical",
   "Environmental Engineering",
   "Environmental Science",
   "City Regional Planning",
   "Mechatronics",
   "Software", 
   "Electrical",
   "Civil", 
   "Mechanical",
     ];
const semesters = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
];

export const dynamic = "force-dynamic";

export default async function AdminUploadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent("/admin/upload")}`);
  }

  const superAdminEmail =
    process.env.SUPER_ADMIN_EMAIL?.toLowerCase() ??
    process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL?.toLowerCase();

  const isSuperAdminByEmail = Boolean(
    superAdminEmail && user.email?.toLowerCase() === superAdminEmail,
  );
  const isSuperAdminByMetadata = user.app_metadata?.is_super_admin === true;
  const { data: canUploadByRpc } = await supabase.rpc("is_current_user_uploader");

  const { data: isSuperAdminByAuth } = await supabase.rpc("is_current_user_super_admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isSuperAdminByRole = profile?.role === "super_admin";
  const isSuperAdmin =
    isSuperAdminByEmail ||
    isSuperAdminByMetadata ||
    isSuperAdminByRole ||
    Boolean(isSuperAdminByAuth);
  const isAdmin = profile?.role === "admin" || Boolean(canUploadByRpc);

  if (!isSuperAdmin && !isAdmin) {
    redirect("/");
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-[#002147]">Admin Upload</h1>
      <p className="mb-6 text-sm text-black/70">
        Upload and publish MUET past papers to the student archive.
      </p>
      <UploadPaperForm departments={departments} semesters={semesters} />
    </section>
  );
}
