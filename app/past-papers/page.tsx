import type { Metadata } from "next";

import { PastPaperFilters } from "@/components/past-papers/past-paper-filters";
import { PastPaperCard } from "@/components/past-papers/past-paper-card";
import { EmptyState } from "@/components/ui/state";
import { getPastPaperOptions, getPastPapers, parsePastPaperFilters } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Past Papers | MUET Scholar Archive",
  description: "Search and download MUET past papers by department, semester, course, and teacher.",
};

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function PastPapersPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filters = parsePastPaperFilters(params);

  const [options, papers] = await Promise.all([getPastPaperOptions(), getPastPapers(filters)]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#002147]">Past Papers</h1>
        <p className="mt-2 text-sm text-black/70">
          Filter by type, teacher, department, semester, and course to find the right paper instantly.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <PastPaperFilters
          filters={filters}
          departments={options.departments}
          types={options.types ?? []}
          semesters={options.semesters ?? []}
          courses={options.courses ?? []}
        />

        <div>
          <p className="mb-4 text-sm text-black/65">{papers.length} result(s) found</p>

          {papers.length === 0 ? (
            <EmptyState
              title="No papers matched your filters"
              description="Try removing one or more filters to explore a broader result set."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {papers.map((paper) => (
                <PastPaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
