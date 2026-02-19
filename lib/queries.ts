import { createClient } from "@/lib/supabase/server";
import { MUET_DEPARTMENTS, MUET_SEMESTERS } from "@/lib/constants";
import { normalizeSearchParam } from "@/lib/utils";
import type { Achievement, PastPaper } from "@/types/database";
import type { AchievementFilters, PastPaperFilters } from "@/types/filters";

function uniqueSorted(values: string[]) {
  const normalizedValueMap = new Map<string, string>();

  for (const rawValue of values) {
    const value = rawValue.trim();

    if (!value) {
      continue;
    }

    const normalizedKey = value.toLocaleLowerCase();

    if (!normalizedValueMap.has(normalizedKey)) {
      normalizedValueMap.set(normalizedKey, value);
    }
  }

  return Array.from(normalizedValueMap.values()).sort((a, b) => a.localeCompare(b));
}

export function parsePastPaperFilters(raw?: Record<string, string | string[] | undefined>): PastPaperFilters {
  const typeValue = normalizeSearchParam(raw?.type);

  return {
    type: typeValue === "mid term" || typeValue === "final term" ? typeValue : undefined,
    department: normalizeSearchParam(raw?.department),
    semester: normalizeSearchParam(raw?.semester),
    course: normalizeSearchParam(raw?.course),
    teacher: normalizeSearchParam(raw?.teacher),
  };
}

export function parseAchievementFilters(raw?: Record<string, string | string[] | undefined>): AchievementFilters {
  return {
    department: normalizeSearchParam(raw?.department),
    student: normalizeSearchParam(raw?.student),
    title: normalizeSearchParam(raw?.title),
  };
}

export async function getPastPaperOptions() {
  const supabase = await createClient();

  const [{ data: departments }, { data: types }, { data: semesters }, { data: courses }, { data: departmentCourseRows }] = await Promise.all([
    supabase.from("past_papers").select("department"),
    supabase.from("past_papers").select("type"),
    supabase.from("past_papers").select("semester"),
    supabase.from("past_papers").select("course"),
    supabase.from("past_papers").select("department, course"),
  ]);

  const normalizedDepartments = uniqueSorted([
    ...MUET_DEPARTMENTS,
    ...(departments ?? []).map((row) => row.department),
  ]);

  const canonicalDepartmentByKey = new Map(
    normalizedDepartments.map((department) => [department.toLocaleLowerCase(), department]),
  );

  const departmentCourses = (departmentCourseRows ?? []).reduce<Record<string, string[]>>((acc, row) => {
    const departmentValue = row.department.trim();
    const courseValue = row.course.trim();

    if (!departmentValue || !courseValue) {
      return acc;
    }

    const normalizedDepartmentKey = departmentValue.toLocaleLowerCase();
    const canonicalDepartment = canonicalDepartmentByKey.get(normalizedDepartmentKey) ?? departmentValue;

    if (!acc[canonicalDepartment]) {
      acc[canonicalDepartment] = [];
    }

    acc[canonicalDepartment].push(courseValue);
    return acc;
  }, {});

  const normalizedDepartmentCourses = Object.fromEntries(
    Object.entries(departmentCourses).map(([department, departmentCourseList]) => [
      department,
      uniqueSorted(departmentCourseList),
    ]),
  );

  return {
    departments: normalizedDepartments,
    types: uniqueSorted((types ?? []).map((row) => row.type)),
    semesters: uniqueSorted([...MUET_SEMESTERS, ...(semesters ?? []).map((row) => row.semester)]),
    courses: uniqueSorted((courses ?? []).map((row) => row.course)),
    departmentCourses: normalizedDepartmentCourses,
  };
}

export async function getAchievementOptions() {
  const supabase = await createClient();

  const [{ data: departments }, { data: titles }] = await Promise.all([
    supabase.from("achievements").select("department"),
    supabase.from("achievements").select("achievement_title"),
  ]);

  return {
    departments: uniqueSorted((departments ?? []).map((row) => row.department)),
    achievementTitles: uniqueSorted((titles ?? []).map((row) => row.achievement_title)),
  };
}

export async function getPastPapers(filters: PastPaperFilters): Promise<PastPaper[]> {
  const supabase = await createClient();

  let query = supabase
    .from("past_papers")
    .select("*")
    .order("year", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.department) {
    query = query.eq("department", filters.department);
  }

  if (filters.type) {
    query = query.eq("type", filters.type);
  }

  if (filters.semester) {
    query = query.eq("semester", filters.semester);
  }

  if (filters.course) {
    query = query.eq("course", filters.course);
  }

  if (filters.teacher) {
    query = query.ilike("teacher_name", `%${filters.teacher}%`);
  }

  const { data, error } = await query.returns<PastPaper[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getAchievements(filters: AchievementFilters): Promise<Achievement[]> {
  const supabase = await createClient();

  let query = supabase
    .from("achievements")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.department) {
    query = query.eq("department", filters.department);
  }

  if (filters.student) {
    query = query.ilike("student_name", `%${filters.student}%`);
  }

  if (filters.title) {
    query = query.ilike("achievement_title", `%${filters.title}%`);
  }

  const { data, error } = await query.returns<Achievement[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
