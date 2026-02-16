"use client";

import { InlineErrorState } from "@/components/ui/state";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <InlineErrorState
        title="Unable to load past papers"
        description="There was a temporary issue while retrieving data from the archive."
      />
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-lg bg-[#002147] px-4 py-2 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </section>
  );
}
