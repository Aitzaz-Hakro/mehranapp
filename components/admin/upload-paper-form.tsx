"use client";

import { type FormEvent, useState } from "react";

import { createClient } from "@/lib/supabase/client";

interface UploadFormProps {
  departments: string[];
  semesters: string[];
}

export function UploadPaperForm({ departments, semesters, }: UploadFormProps) {
  const [teacherName, setTeacherName] = useState("");
  const [type, setType] = useState<"mid term" | "final term" | "">("");
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
      setMessage("Please choose a PDF or image file before uploading.");
      return;
    }

    if (!type) {
      setMessage("Please select paper type before uploading.");
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
        type,
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
      setType("");
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
      <p className="mt-1 text-sm text-black/70">Upload flow connected to Supabase Storage.</p>

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
          Type
          <select
            value={type}
            onChange={(event) => setType(event.target.value as "mid term" | "final term" | "")}
            required
            className="mt-1 h-11 w-full rounded-lg border border-[#002147]/15 px-3"
          >
            <option value="">Select type</option>
            <option value="mid term">mid term</option>
            <option value="final term">final term</option>
          </select>
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
          Batch
          <input
            type="number"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            required
            min={2019}
            max={2030}
            className="mt-1 h-11 w-full rounded-lg border border-[#002147]/15 px-3"
          />
        </label>

        <div className="sm:col-span-2">
          <p className="text-sm font-medium text-black/80">Upload File</p>
          <label
            htmlFor="paper-file"
            className="mt-1 flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#002147]/25 bg-[#f3f6fb] px-4 py-5 text-center"
          >
            <span className="text-sm font-semibold text-[#002147]">Click to choose file</span>
            <span className="mt-1 text-xs text-black/70">PDF, PNG, JPG, JPEG</span>
            <span className="mt-2 text-xs text-black/75">{file ? file.name : "No file selected"}</span>
          </label>
          <input
            id="paper-file"
            type="file"
            accept="application/pdf,image/png,image/jpeg"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            required
            className="sr-only"
          />
        </div>
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
