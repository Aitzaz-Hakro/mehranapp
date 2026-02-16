export function AchievementSkeleton() {
  return (
    <div className="rounded-lg border border-[#002147]/10 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="size-16 animate-pulse rounded-lg bg-[#dfe7f3]" />
        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-[#dfe7f3]" />
          <div className="h-3 w-24 animate-pulse rounded bg-[#e8edf6]" />
        </div>
      </div>
      <div className="mt-4 h-4 w-40 animate-pulse rounded bg-[#dfe7f3]" />
      <div className="mt-2 h-3 w-full animate-pulse rounded bg-[#edf2f9]" />
      <div className="mt-1 h-3 w-4/5 animate-pulse rounded bg-[#edf2f9]" />
    </div>
  );
}
