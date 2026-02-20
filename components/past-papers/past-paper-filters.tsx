"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import type { PastPaperFilters } from "@/types/filters";

interface PastPaperFilterProps {
  filters: PastPaperFilters;
  departments: string[];
  types: string[];
  semesters: string[];
  courses: string[];
}

export function PastPaperFilters({ filters, departments, types, semesters, courses }: PastPaperFilterProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [type, setType] = useState(filters.type ?? "");
  const [department, setDepartment] = useState(filters.department ?? "");
  const [semester, setSemester] = useState(filters.semester ?? "");
  const [course, setCourse] = useState(filters.course ?? "");
  const [teacher, setTeacher] = useState(filters.teacher ?? "");

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (department) {
      params.set("department", department);
    }

    if (type) {
      params.set("type", type);
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

    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(url, { scroll: false });
  };

  const resetAll = () => {
    setType("");
    setDepartment("");
    setSemester("");
    setCourse("");
    setTeacher("");
  };

  return (
    <>
      <details className="rounded-lg border border-[#002147]/10 bg-white p-4 shadow-sm lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-[#002147]">
          <span>Filters</span>
          <span aria-hidden="true" className="inline-flex items-center">
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </summary>
        <div className="mt-4 space-y-4">
          <FilterFields
            type={type}
            department={department}
            semester={semester}
            course={course}
            teacher={teacher}
            types={types}
            departments={departments}
            semesters={semesters}
            courses={courses}
            setType={setType}
            setDepartment={setDepartment}
            setSemester={setSemester}
            setCourse={setCourse}
            setTeacher={setTeacher}
          />
          <button
            type="button"
            onClick={applyFilters}
            className="h-10 rounded-lg bg-[#002147] px-3 text-sm font-semibold text-white"
          >
            Search
          </button>
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
          type={type}
          department={department}
          semester={semester}
          course={course}
          teacher={teacher}
          types={types}
          departments={departments}
          semesters={semesters}
          courses={courses}
          setType={setType}
          setDepartment={setDepartment}
          setSemester={setSemester}
          setCourse={setCourse}
          setTeacher={setTeacher}
        />
        <button
          type="button"
          onClick={applyFilters}
          className="mt-4 h-10 w-full rounded-lg bg-[#002147] px-3 text-sm font-semibold text-white"
        >
          Search
        </button>
      </aside>
    </>
  );
}

interface FilterFieldsProps {
  type: string;
  department: string;
  semester: string;
  course: string;
  teacher: string;
  types: string[];
  departments: string[];
  semesters: string[];
  courses: string[];
  setType: (value: string) => void;
  setDepartment: (value: string) => void;
  setSemester: (value: string) => void;
  setCourse: (value: string) => void;
  setTeacher: (value: string) => void;
}

function FilterFields({
  type,
  department,
  semester,
  course,
  teacher,
  types,
  departments,
  semesters,
  courses,
  setType,
  setDepartment,
  setSemester,
  setCourse,
  setTeacher,
}: FilterFieldsProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-black/80">
        Type
        <select
          aria-label="Filter by type"
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="mt-1 h-10 w-full rounded-lg border border-[#002147]/15 bg-white px-3 text-sm"
        >
          <option value="">All types</option>
          {types.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

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
