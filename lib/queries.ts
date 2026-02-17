import { createClient } from "@/lib/supabase/server";
import { normalizeSearchParam } from "@/lib/utils";
import type { Achievement, PastPaper } from "@/types/database";
import type { AchievementFilters, PastPaperFilters } from "@/types/filters";

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
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

  const [{ data: departments }, { data: types }, { data: semesters }, { data: courses }] = await Promise.all([
    supabase.from("past_papers").select("department"),
    supabase.from("past_papers").select("type"),
    supabase.from("past_papers").select("semester"),
    supabase.from("past_papers").select("course"),
  ]);

  return {
    departments: uniqueSorted((departments ?? []).map((row) => row.department)),
    types: uniqueSorted((types ?? []).map((row) => row.type)),
    semesters: uniqueSorted((semesters ?? []).map((row) => row.semester)),
    courses: uniqueSorted((courses ?? []).map((row) => row.course)),
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
