import type { PastPaper } from "@/types/database";

export function PastPaperCard({ paper }: { paper: PastPaper }) {
  return (
    <article className="rounded-lg border border-[#002147]/12 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-[#002147]">{paper.course}</h3>
          <p className="mt-1 text-sm text-black/75">{paper.teacher_name}</p>
        </div>
        <span className="rounded-lg bg-[#f3f6fb] px-2.5 py-1 text-xs font-semibold text-[#002147]">
          {paper.year}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-black/70">
        <p>Department: {paper.department}</p>
        <p>Semester: {paper.semester}</p>
      </div>
      <a
        href={paper.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex rounded-lg bg-[#002147] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#001730]"
      >
        Download PDF
      </a>
    </article>
  );
}
