type PaperType = "mid term" | "final term";

export interface AutoFillFieldsResult {
  teacherName?: string;
  type?: PaperType;
  department?: string;
  semester?: string;
  course?: string;
  year?: string;
}

const SUBJECT_ALIASES: Record<string, string> = {
  ds: "Data Structures",
  oop: "Object Oriented Programming",
  db: "Database Systems",
  pf: "Programming Fundamentals",
};

const DEPARTMENT_ALIASES: Record<string, string> = {
  cs: "Computer Science",
  cse: "Computer Systems",
  se: "Software",
  ai: "Artificial Intelligence",
  bba: "BBA",
};

const MID_TOKENS = new Set(["mid", "midterm", "midterms"]);
const FINAL_TOKENS = new Set(["final", "finalterm", "finals"]);

function toWords(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function toTitleCase(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function parseYear(tokens: string[]): string | undefined {
  for (const token of tokens) {
    if (/^20\d{2}$/.test(token)) {
      return token;
    }

    // Handle two-digit year token, for example "23" -> "2023".
    if (/^\d{2}$/.test(token)) {
      return `20${token}`;
    }
  }

  return undefined;
}

function parseType(tokens: string[]): PaperType | undefined {
  for (const token of tokens) {
    if (MID_TOKENS.has(token)) {
      return "mid term";
    }

    if (FINAL_TOKENS.has(token)) {
      return "final term";
    }
  }

  return undefined;
}

function parseSemester(tokens: string[], semesters: string[]): string | undefined {
  let semesterNumber: number | null = null;

  for (const token of tokens) {
    const ordinalMatch = token.match(/^([1-8])(st|nd|rd|th)$/);
    const semMatch = token.match(/^sem(?:ester)?([1-8])$/);

    if (ordinalMatch) {
      semesterNumber = Number(ordinalMatch[1]);
      break;
    }

    if (semMatch) {
      semesterNumber = Number(semMatch[1]);
      break;
    }
  }

  if (semesterNumber === null) {
    return undefined;
  }

  const normalizedSemesters = semesters.map((item) => ({
    original: item,
    normalized: toWords(item),
  }));

  return normalizedSemesters.find((item) => item.normalized.endsWith(String(semesterNumber)))?.original;
}

function parseDepartment(tokens: string[], departments: string[], normalizedName: string): string | undefined {
  const normalizedDepartments = departments.map((item) => ({
    original: item,
    normalized: toWords(item),
  }));

  for (const token of tokens) {
    const aliasMatch = DEPARTMENT_ALIASES[token];
    if (aliasMatch && departments.includes(aliasMatch)) {
      return aliasMatch;
    }
  }

  return normalizedDepartments.find((item) => normalizedName.includes(item.normalized))?.original;
}

function parseCourse(tokens: string[]): string | undefined {
  for (const token of tokens) {
    const aliasMatch = SUBJECT_ALIASES[token];
    if (aliasMatch) {
      return aliasMatch;
    }
  }

  return undefined;
}

function parseTeacherName(tokens: string[]): string | undefined {
  const stopWords = new Set([
    "paper",
    "past",
    "exam",
    "muet",
    "mid",
    "midterm",
    "midterms",
    "final",
    "finalterm",
    "finals",
    "sem",
    "semester",
  ]);

  const teacherTokens = tokens.filter((token) => {
    if (!token) {
      return false;
    }

    if (stopWords.has(token)) {
      return false;
    }

    if (SUBJECT_ALIASES[token] || DEPARTMENT_ALIASES[token]) {
      return false;
    }

    if (/^20\d{2}$/.test(token) || /^\d{2}$/.test(token)) {
      return false;
    }

    if (/^[1-8](st|nd|rd|th)$/.test(token) || /^sem(?:ester)?[1-8]$/.test(token)) {
      return false;
    }

    return true;
  });

  if (teacherTokens.length === 0) {
    return undefined;
  }

  return toTitleCase(teacherTokens.join(" "));
}

function findFirstMetaIndex(tokens: string[]): number {
  let firstMetaIndex = tokens.length;

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const isMetaToken =
      /^20\d{2}$/.test(token) ||
      /^\d{2}$/.test(token) ||
      MID_TOKENS.has(token) ||
      FINAL_TOKENS.has(token) ||
      /^[1-8](st|nd|rd|th)$/.test(token) ||
      /^sem(?:ester)?[1-8]$/.test(token) ||
      Boolean(DEPARTMENT_ALIASES[token]);

    if (isMetaToken) {
      firstMetaIndex = index;
      break;
    }
  }

  return firstMetaIndex;
}

export function autoFillFieldsFromFileName(
  fileName: string,
  departments: string[],
  semesters: string[],
): AutoFillFieldsResult {
  const nameWithoutExtension = fileName.replace(/\.[^.]+$/, "");
  const normalizedName = toWords(nameWithoutExtension);

  if (!normalizedName) {
    return {};
  }

  const tokens = normalizedName.split(" ").filter(Boolean);
  const result: AutoFillFieldsResult = {};

  const parsedYear = parseYear(tokens);
  if (parsedYear) {
    result.year = parsedYear;
  }

  const parsedType = parseType(tokens);
  if (parsedType) {
    result.type = parsedType;
  }

  const parsedDepartment = parseDepartment(tokens, departments, normalizedName);
  if (parsedDepartment) {
    result.department = parsedDepartment;
  }

  const parsedSemester = parseSemester(tokens, semesters);
  if (parsedSemester) {
    result.semester = parsedSemester;
  }

  const firstMetaIndex = findFirstMetaIndex(tokens);

  // For subject, first check aliases like DS/OOP/DB/PF.
  const aliasCourse = parseCourse(tokens);
  if (aliasCourse) {
    result.course = aliasCourse;
  } else {
    // Otherwise, use the leading words before known metadata tokens.
    const subjectTokens = tokens.slice(0, firstMetaIndex).filter(Boolean);
    if (subjectTokens.length > 0) {
      result.course = toTitleCase(subjectTokens.join(" "));
    }
  }

  // Teacher names commonly appear after year/type, so parse the trailing part first.
  const teacherTokens = tokens.slice(firstMetaIndex);
  const parsedTeacherName = parseTeacherName(teacherTokens);
  if (parsedTeacherName) {
    result.teacherName = parsedTeacherName;
  }

  return result;
}