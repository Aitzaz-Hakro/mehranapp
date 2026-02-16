export function PastPaperSkeleton() {
  return (
    <div className="rounded-lg border border-[#002147]/10 bg-white p-5 shadow-sm">
      <div className="h-5 w-40 animate-pulse rounded bg-[#dfe7f3]" />
      <div className="mt-3 h-4 w-32 animate-pulse rounded bg-[#e8edf6]" />
      <div className="mt-4 h-3 w-full animate-pulse rounded bg-[#edf2f9]" />
      <div className="mt-4 h-9 w-28 animate-pulse rounded bg-[#dfe7f3]" />
    </div>
  );
}
