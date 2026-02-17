"use client";

import type { PastPaper } from "@/types/database";

export function PastPaperCard({ paper }: { paper: PastPaper }) {
  const semesterNumber = paper.semester.match(/\d+/)?.[0] ?? paper.semester;

  const getDownloadFilename = () => {
    try {
      const url = new URL(paper.file_url);
      const rawName = url.pathname.split("/").pop() ?? "file";
      const decodedName = decodeURIComponent(rawName);
      return decodedName || "file";
    } catch {
      return "file";
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(paper.file_url);

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = getDownloadFilename();
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(paper.file_url, "_blank", "noopener,noreferrer");
    }
  };

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
        <p>Semester: {semesterNumber}</p>
        <p>Type: {paper.type}</p>
      </div>
      <button
        type="button"
        onClick={handleDownload}
        className="mt-4 inline-flex rounded-lg bg-[#002147] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#001730]"
      >
        Download File
      </button>
    </article>
  );
}
