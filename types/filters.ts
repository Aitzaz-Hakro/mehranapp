export interface PastPaperFilters {
  type?: "Mid term" | "Final term";
  department?: string;
  semester?: string;
  course?: string;
  teacher?: string;
}

export interface AchievementFilters {
  department?: string;
  student?: string;
  title?: string;
}

export interface SelectOptions {
  departments: string[];
  types?: string[];
  semesters?: string[];
  courses?: string[];
  departmentCourses?: Record<string, string[]>;
  achievementTitles?: string[];
}
