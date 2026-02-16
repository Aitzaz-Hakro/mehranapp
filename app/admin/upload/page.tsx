import { redirect } from "next/navigation";

import { UploadPaperForm } from "@/components/admin/upload-paper-form";
import { createClient } from "@/lib/supabase/server";

const departments = ["Computer Systems", "Software", "Electrical", "Civil", "Mechanical"];
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
    redirect("/login?next=/admin/upload");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-[#002147]">Admin Upload</h1>
      <p className="mb-6 text-sm text-black/70">
        Upload and publish authenticated MUET past papers to the student archive.
      </p>
      <UploadPaperForm departments={departments} semesters={semesters} />
    </section>
  );
}
