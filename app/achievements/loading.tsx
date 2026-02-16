import { AchievementSkeleton } from "@/components/achievements/achievement-skeleton";

export default function LoadingAchievements() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-[#dfe7f3]" />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="hidden h-64 animate-pulse rounded-lg bg-[#eef3fa] lg:block" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <AchievementSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
