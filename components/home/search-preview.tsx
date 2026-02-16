"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

export function SearchPreviewSection() {
  const router = useRouter();
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [course, setCourse] = useState("");
  const [teacher, setTeacher] = useState("");

  const departments = ["Computer Systems", "Software", "Electrical", "Civil", "Mechanical"];
  const semesters = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (department) {
      params.set("department", department);
    }

    if (semester) {
      params.set("semester", semester);
    }

    if (course) {
      params.set("course", course);
    }

    if (teacher.trim()) {
      params.set("teacher", teacher.trim());
    }

    router.push(`/past-papers?${params.toString()}`);
  };

  return (
    <section className="border-b border-[#002147]/10 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#002147]">Quick Search Preview</h2>
          <p className="mt-2 text-sm text-black/70">
            Try a fast filter experience before moving to the full archive.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-[#002147]/10 bg-[#f8faff] p-5 shadow-sm md:grid-cols-2 xl:grid-cols-5">
          <label className="text-sm font-medium text-black/80">
            Department
            <select
              aria-label="Select department"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-[#002147]/15 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#002147]/30"
            >
              <option value="">All departments</option>
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
              aria-label="Select semester"
              value={semester}
              onChange={(event) => setSemester(event.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-[#002147]/15 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#002147]/30"
            >
              <option value="">All semesters</option>
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
              aria-label="Search by course"
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              placeholder="e.g. Data Structures"
              className="mt-1 h-11 w-full rounded-lg border border-[#002147]/15 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#002147]/30"
            />
          </label>

          <label className="text-sm font-medium text-black/80">
            Teacher
            <input
              aria-label="Search by teacher"
              value={teacher}
              onChange={(event) => setTeacher(event.target.value)}
              placeholder="e.g. Dr. Ahmed"
              className="mt-1 h-11 w-full rounded-lg border border-[#002147]/15 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#002147]/30"
            />
          </label>

          <button
            type="submit"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#002147] px-4 text-sm font-semibold text-white transition hover:bg-[#001730]"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
