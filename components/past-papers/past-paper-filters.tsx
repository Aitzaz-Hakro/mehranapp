"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { PastPaperFilters } from "@/types/filters";

interface PastPaperFilterProps {
  filters: PastPaperFilters;
  departments: string[];
  semesters: string[];
  courses: string[];
}

export function PastPaperFilters({ filters, departments, semesters, courses }: PastPaperFilterProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [department, setDepartment] = useState(filters.department ?? "");
  const [semester, setSemester] = useState(filters.semester ?? "");
  const [course, setCourse] = useState(filters.course ?? "");
  const [teacher, setTeacher] = useState(filters.teacher ?? "");

  const query = useMemo(
    () => ({ department, semester, course, teacher }),
    [department, semester, course, teacher],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const params = new URLSearchParams();

      if (query.department) {
        params.set("department", query.department);
      }

      if (query.semester) {
        params.set("semester", query.semester);
      }

      if (query.course) {
        params.set("course", query.course);
      }

      if (query.teacher.trim()) {
        params.set("teacher", query.teacher.trim());
      }

      const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(url, { scroll: false });
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [pathname, query, router]);

  const resetAll = () => {
    setDepartment("");
    setSemester("");
    setCourse("");
    setTeacher("");
  };

  return (
    <>
      <details className="rounded-lg border border-[#002147]/10 bg-white p-4 shadow-sm lg:hidden">
        <summary className="cursor-pointer list-none text-sm font-semibold text-[#002147]">
          Filters
        </summary>
        <div className="mt-4 space-y-4">
          <FilterFields
            department={department}
            semester={semester}
            course={course}
            teacher={teacher}
            departments={departments}
            semesters={semesters}
            courses={courses}
            setDepartment={setDepartment}
            setSemester={setSemester}
            setCourse={setCourse}
            setTeacher={setTeacher}
          />
          <button
            type="button"
            onClick={resetAll}
            className="h-10 rounded-lg border border-[#002147]/20 px-3 text-sm font-semibold text-[#002147]"
          >
            Reset filters
          </button>
        </div>
      </details>

      <aside className="sticky top-20 hidden h-fit rounded-lg border border-[#002147]/10 bg-white p-4 shadow-sm lg:block">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#002147]">Filter results</h2>
          <button
            type="button"
            onClick={resetAll}
            className="text-xs font-semibold text-[#002147] hover:underline"
          >
            Reset
          </button>
        </div>
        <FilterFields
          department={department}
          semester={semester}
          course={course}
          teacher={teacher}
          departments={departments}
          semesters={semesters}
          courses={courses}
          setDepartment={setDepartment}
          setSemester={setSemester}
          setCourse={setCourse}
          setTeacher={setTeacher}
        />
      </aside>
    </>
  );
}

interface FilterFieldsProps {
  department: string;
  semester: string;
  course: string;
  teacher: string;
  departments: string[];
  semesters: string[];
  courses: string[];
  setDepartment: (value: string) => void;
  setSemester: (value: string) => void;
  setCourse: (value: string) => void;
  setTeacher: (value: string) => void;
}

function FilterFields({
  department,
  semester,
  course,
  teacher,
  departments,
  semesters,
  courses,
  setDepartment,
  setSemester,
  setCourse,
  setTeacher,
}: FilterFieldsProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-black/80">
        Department
        <select
          aria-label="Filter by department"
          value={department}
          onChange={(event) => setDepartment(event.target.value)}
          className="mt-1 h-10 w-full rounded-lg border border-[#002147]/15 bg-white px-3 text-sm"
        >
          <option value="">All departments</option>
          {departments.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-black/80">
        Semester
        <select
          aria-label="Filter by semester"
          value={semester}
          onChange={(event) => setSemester(event.target.value)}
          className="mt-1 h-10 w-full rounded-lg border border-[#002147]/15 bg-white px-3 text-sm"
        >
          <option value="">All semesters</option>
          {semesters.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-black/80">
        Course
        <select
          aria-label="Filter by course"
          value={course}
          onChange={(event) => setCourse(event.target.value)}
          className="mt-1 h-10 w-full rounded-lg border border-[#002147]/15 bg-white px-3 text-sm"
        >
          <option value="">All courses</option>
          {courses.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-black/80">
        Teacher name
        <input
          aria-label="Filter by teacher"
          value={teacher}
          onChange={(event) => setTeacher(event.target.value)}
          placeholder="Search teacher"
          className="mt-1 h-10 w-full rounded-lg border border-[#002147]/15 bg-white px-3 text-sm"
        />
      </label>
    </div>
  );
}
