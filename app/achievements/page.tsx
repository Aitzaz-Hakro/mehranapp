import type { Metadata } from "next";

import { AchievementCard } from "@/components/achievements/achievement-card";
import { AchievementFiltersPanel } from "@/components/achievements/achievement-filters";
import { EmptyState } from "@/components/ui/state";
import {
  getAchievementOptions,
  getAchievements,
  parseAchievementFilters,
} from "@/lib/queries";

export const metadata: Metadata = {
  title: "Achievements | Mehran APP",
  description: "Explore successful MUET students and their academic or professional achievements.",
};

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function AchievementsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filters = parseAchievementFilters(params);

  const [options, achievements] = await Promise.all([
    getAchievementOptions(),
    getAchievements(filters),
  ]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#002147]">Achievements</h1>
        <p className="mt-2 text-sm text-black/70">
          Discover MUET students who have delivered remarkable academic and career milestones.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <AchievementFiltersPanel
          filters={filters}
          departments={options.departments}
          titles={options.achievementTitles ?? []}
        />

        <div>
          <p className="mb-4 text-sm text-black/65">{achievements.length} achiever(s) found</p>

          {achievements.length === 0 ? (
            <EmptyState
              title="No achievements matched your filters"
              description="Try broadening the search criteria to view more student achievements."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
