"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import type { AchievementFilters } from "@/types/filters";

interface AchievementFilterProps {
  filters: AchievementFilters;
  departments: string[];
  titles: string[];
}

export function AchievementFiltersPanel({ filters, departments, titles }: AchievementFilterProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [department, setDepartment] = useState(filters.department ?? "");
  const [student, setStudent] = useState(filters.student ?? "");
  const [title, setTitle] = useState(filters.title ?? "");

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (department) {
      params.set("department", department);
    }

    if (student.trim()) {
      params.set("student", student.trim());
    }

    if (title) {
      params.set("title", title);
    }

    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(url, { scroll: false });
  };

  const resetAll = () => {
    setDepartment("");
    setStudent("");
    setTitle("");
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
            student={student}
            title={title}
            departments={departments}
            titles={titles}
            setDepartment={setDepartment}
            setStudent={setStudent}
            setTitle={setTitle}
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
          <h2 className="text-sm font-semibold text-[#002147]">Filter achievers</h2>
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
          student={student}
          title={title}
          departments={departments}
          titles={titles}
          setDepartment={setDepartment}
          setStudent={setStudent}
          setTitle={setTitle}
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
  department: string;
  student: string;
  title: string;
  departments: string[];
  titles: string[];
  setDepartment: (value: string) => void;
  setStudent: (value: string) => void;
  setTitle: (value: string) => void;
}

function FilterFields({
  department,
  student,
  title,
  departments,
  titles,
  setDepartment,
  setStudent,
  setTitle,
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
        Student Name
        <input
          aria-label="Filter by student"
          value={student}
          onChange={(event) => setStudent(event.target.value)}
          placeholder="Search student"
          className="mt-1 h-10 w-full rounded-lg border border-[#002147]/15 bg-white px-3 text-sm"
        />
      </label>

      <label className="block text-sm font-medium text-black/80">
        Achievement Name
        <select
          aria-label="Filter by achievement"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-1 h-10 w-full rounded-lg border border-[#002147]/15 bg-white px-3 text-sm"
        >
          <option value="">All achievements</option>
          {titles.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
