"use client";

import Link from "next/link";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

type AdminProfile = {
  id: string;
  role: string;
  created_at: string;
  admin_for_department: string | null;
  email: string | null;
  display_name: string | null;
};

type UploadedPaper = {
  id: string;
  teacher_name: string;
  course: string;
  year: number;
  file_url: string;
  created_at: string;
};

export function ManageAdminsPanel({ initialAdmins }: { initialAdmins: AdminProfile[] }) {
  const [admins, setAdmins] = useState<AdminProfile[]>(initialAdmins);
  const [userId, setUserId] = useState("");
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingPaperId, setIsDeletingPaperId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminProfile | null>(null);
  const [departmentDraft, setDepartmentDraft] = useState("");
  const [uploadedPapers, setUploadedPapers] = useState<UploadedPaper[]>([]);
  const [isLoadingPapers, setIsLoadingPapers] = useState(false);

  const supabase = createClient();

  const loadAdmins = async () => {
    setIsLoadingAdmins(true);

    const { data, error } = await supabase.rpc("get_admin_users");

    if (error) {
      setMessage(error.message);
      setAdmins([]);
      setIsLoadingAdmins(false);
      return;
    }

    setAdmins(data ?? []);
    setIsLoadingAdmins(false);
  };

  const addAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (!userId.trim()) {
      setMessage("Please enter a user ID.");
      return;
    }

    setIsSaving(true);

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: userId.trim(), role: "admin" }, { onConflict: "id" });

    if (error) {
      setMessage(error.message);
      setIsSaving(false);
      return;
    }

    setMessage("Admin added successfully.");
    setUserId("");
    await loadAdmins();
    setIsSaving(false);
  };

  const removeAdmin = async (adminId: string) => {
    setMessage(null);
    setIsSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({ role: "student" })
      .eq("id", adminId)
      .eq("role", "admin");

    if (error) {
      setMessage(error.message);
      setIsSaving(false);
      return;
    }

    if (selectedAdmin?.id === adminId) {
      setSelectedAdmin(null);
      setUploadedPapers([]);
    }

    setMessage("Admin removed successfully.");
    await loadAdmins();
    setIsSaving(false);
  };

  const openAdminProfile = async (admin: AdminProfile) => {
    setSelectedAdmin(admin);
    setUploadedPapers([]);
    setIsLoadingPapers(true);

    const { data, error } = await supabase
      .from("past_papers")
      .select("id, teacher_name, course, year, file_url, created_at")
      .eq("uploaded_by", admin.id)
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      setIsLoadingPapers(false);
      return;
    }

    setUploadedPapers(data ?? []);
    setIsLoadingPapers(false);
    setDepartmentDraft(admin.admin_for_department ?? "");
  };

  const saveDepartment = async () => {
    if (!selectedAdmin) {
      return;
    }

    setIsSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from("profiles")
      .update({ admin_for_department: departmentDraft.trim() || null })
      .eq("id", selectedAdmin.id);

    if (error) {
      setMessage(error.message);
      setIsSaving(false);
      return;
    }

    setSelectedAdmin((current) =>
      current
        ? {
            ...current,
            admin_for_department: departmentDraft.trim() || null,
          }
        : current,
    );
    setAdmins((current) =>
      current.map((admin) =>
        admin.id === selectedAdmin.id
          ? { ...admin, admin_for_department: departmentDraft.trim() || null }
          : admin,
      ),
    );
    setMessage("Admin department updated successfully.");
    setIsSaving(false);
  };

  const getStoragePathFromPublicUrl = (publicUrl: string) => {
    try {
      const parsed = new URL(publicUrl);
      const marker = "/object/public/papers/";
      const markerIndex = parsed.pathname.indexOf(marker);

      if (markerIndex === -1) {
        return null;
      }

      return decodeURIComponent(parsed.pathname.slice(markerIndex + marker.length));
    } catch {
      return null;
    }
  };

  const deleteUploadedFile = async (paper: UploadedPaper) => {
    if (!selectedAdmin) {
      return;
    }

    setMessage(null);
    setIsDeletingPaperId(paper.id);

    const storagePath = getStoragePathFromPublicUrl(paper.file_url);

    const { error: deletePaperError } = await supabase
      .from("past_papers")
      .delete()
      .eq("id", paper.id)
      .eq("uploaded_by", selectedAdmin.id);

    if (deletePaperError) {
      setMessage(deletePaperError.message);
      setIsDeletingPaperId(null);
      return;
    }

    if (storagePath) {
      await supabase.storage.from("papers").remove([storagePath]);
    }

    setUploadedPapers((current) => current.filter((item) => item.id !== paper.id));
    setMessage("File deleted successfully.");
    setIsDeletingPaperId(null);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={addAdmin} className="rounded-lg border border-[#002147]/10 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#002147]">Add New Admin</h2>
        <p className="mt-1 text-sm text-black/70">Enter the user ID of an existing signed-in user.</p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder="User UUID"
            className="h-11 w-full rounded-lg border border-[#002147]/15 px-3"
          />
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[#002147] px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Add Admin
          </button>
        </div>
      </form>

      <div className="rounded-lg border border-[#002147]/10 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#002147]">Current Admins</h2>

        {isLoadingAdmins ? (
          <p className="mt-3 text-sm text-black/70">Loading admins...</p>
        ) : admins.length === 0 ? (
          <p className="mt-3 text-sm text-black/70">No admins found.</p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="rounded-lg border border-[#002147]/10 bg-[#f8f9fc] p-4"
              >
                <button
                  type="button"
                  onClick={() => void openAdminProfile(admin)}
                  className="text-left text-sm font-semibold text-[#002147] underline-offset-2 hover:underline"
                >
                  Admin for department: {admin.admin_for_department || "Not assigned"}
                </button>
                <p className="mt-2 text-sm font-medium text-black/85">
                  {admin.display_name || "No display name"}
                </p>
                <p className="mt-1 break-all text-xs text-black/70">{admin.email || "No email"}</p>
                <p className="mt-2 break-all text-xs text-black/70">{admin.id}</p>
                <button
                  type="button"
                  onClick={() => void removeAdmin(admin.id)}
                  disabled={isSaving}
                  className="mt-3 inline-flex h-9 items-center rounded-lg border border-[#002147]/20 px-3 text-xs font-semibold text-[#002147] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Remove Admin
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {message ? <p className="text-sm text-black/75">{message}</p> : null}

      {selectedAdmin ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-[#002147]">Admin Uploaded Files</h3>
                <p className="mt-1 text-sm font-medium text-black/85">
                  {selectedAdmin.display_name || "No display name"}
                </p>
                <p className="mt-1 break-all text-xs text-black/70">{selectedAdmin.email || "No email"}</p>
                <p className="mt-1 break-all text-xs text-black/70">{selectedAdmin.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAdmin(null)}
                className="rounded-lg border border-[#002147]/20 px-3 py-1 text-xs font-semibold text-[#002147]"
              >
                Close
              </button>
            </div>

            <div className="mt-4 rounded-lg border border-[#002147]/10 p-3">
              <p className="text-xs font-semibold text-[#002147]">Admin for department</p>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  value={departmentDraft}
                  onChange={(event) => setDepartmentDraft(event.target.value)}
                  placeholder="Department name"
                  className="h-10 w-full rounded-lg border border-[#002147]/15 px-3 text-sm"
                />
                <button
                  type="button"
                  onClick={() => void saveDepartment()}
                  disabled={isSaving}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-[#002147] px-3 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Save
                </button>
              </div>
            </div>

            {isLoadingPapers ? (
              <p className="mt-4 text-sm text-black/70">Loading uploaded files...</p>
            ) : uploadedPapers.length === 0 ? (
              <p className="mt-4 text-sm text-black/70">No files uploaded by this admin yet.</p>
            ) : (
              <div className="mt-4 space-y-2">
                {uploadedPapers.map((paper) => (
                  <div key={paper.id} className="rounded-lg border border-[#002147]/10 p-3">
                    <p className="text-sm font-semibold text-[#002147]">{paper.course}</p>
                    <p className="mt-1 text-xs text-black/75">
                      {paper.teacher_name} • {paper.year}
                    </p>
                    <Link
                      href={paper.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex text-xs font-semibold text-[#002147] underline underline-offset-2"
                    >
                      Open File
                    </Link>
                    <button
                      type="button"
                      onClick={() => void deleteUploadedFile(paper)}
                      disabled={isDeletingPaperId === paper.id}
                      className="mt-2 ml-3 inline-flex text-xs font-semibold text-[#002147] underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isDeletingPaperId === paper.id ? "Deleting..." : "Delete File"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}