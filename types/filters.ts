export interface PastPaperFilters {
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
  semesters?: string[];
  courses?: string[];
  achievementTitles?: string[];
}
