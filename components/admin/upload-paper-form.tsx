"use client";

import { type FormEvent, useState } from "react";

import { createClient } from "@/lib/supabase/client";

interface UploadFormProps {
  departments: string[];
  semesters: string[];
}

export function UploadPaperForm({ departments, semesters }: UploadFormProps) {
  const [teacherName, setTeacherName] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setMessage("Please choose a PDF file before uploading.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const supabase = createClient();

    try {
      const filePath = `past-papers/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("papers")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicData } = supabase.storage.from("papers").getPublicUrl(filePath);

      const { error: insertError } = await supabase.from("past_papers").insert({
        teacher_name: teacherName,
        department,
        semester,
        course,
        year: Number(year),
        file_url: publicData.publicUrl,
      });

      if (insertError) {
        throw insertError;
      }

      setMessage("Past paper uploaded successfully.");
      setTeacherName("");
      setDepartment("");
      setSemester("");
      setCourse("");
      setYear("");
      setFile(null);
    } catch (error) {
      const fallbackMessage = "Upload failed. Please verify your input and storage configuration.";
      setMessage(error instanceof Error ? error.message : fallbackMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-[#002147]/10 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[#002147]">Upload Past Paper</h2>
      <p className="mt-1 text-sm text-black/70">Admin-only upload flow connected to Supabase Storage.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-black/80">
          Teacher Name
          <input
            value={teacherName}
            onChange={(event) => setTeacherName(event.target.value)}
            required
            className="mt-1 h-11 w-full rounded-lg border border-[#002147]/15 px-3"
          />
        </label>

        <label className="text-sm font-medium text-black/80">
          Department
          <select
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            required
            className="mt-1 h-11 w-full rounded-lg border border-[#002147]/15 px-3"
          >
            <option value="">Select department</option>
            {departments.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-black/80">
          Semester
          <select
            value={semester}
            onChange={(event) => setSemester(event.target.value)}
            required
            className="mt-1 h-11 w-full rounded-lg border border-[#002147]/15 px-3"
          >
            <option value="">Select semester</option>
            {semesters.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-black/80">
          Course
          <input
            value={course}
            onChange={(event) => setCourse(event.target.value)}
            required
            className="mt-1 h-11 w-full rounded-lg border border-[#002147]/15 px-3"
          />
        </label>

        <label className="text-sm font-medium text-black/80">
          Year
          <input
            type="number"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            required
            min={2000}
            max={2100}
            className="mt-1 h-11 w-full rounded-lg border border-[#002147]/15 px-3"
          />
        </label>

        <label className="text-sm font-medium text-black/80">
          PDF file
          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            required
            className="mt-1 block w-full text-sm"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex h-11 items-center rounded-lg bg-[#002147] px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Uploading..." : "Upload Paper"}
      </button>

      {message ? <p className="mt-3 text-sm text-black/75">{message}</p> : null}
    </form>
  );
}
