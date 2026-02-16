import { PrimaryLinkButton, SecondaryLinkButton } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="border-b border-[#002147]/10 bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#002147]/80">
            Academic Archive Platform
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-black sm:text-5xl">
            Find Every Past Paper. Discover Every Achiever.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-black/75 sm:text-lg">
            Search past papers by teacher, department, semester or course. Celebrate MUET&apos;s
            brightest minds.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryLinkButton href="/past-papers">Search Past Papers</PrimaryLinkButton>
            <SecondaryLinkButton href="/achievements">Explore Achievements</SecondaryLinkButton>
          </div>
        </div>

        <div className="rounded-lg border border-[#002147]/15 bg-[#f6f8fc] p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-[#002147]">Built for MUET students</h2>
          <p className="mt-3 text-sm leading-6 text-black/75">
            Fast search, reliable records, and a clean institutional experience designed for daily
            academic use.
          </p>
          <ul className="mt-5 space-y-3 text-sm text-black/80">
            <li className="rounded-lg bg-white px-3 py-2">Curated departmental past papers</li>
            <li className="rounded-lg bg-white px-3 py-2">Achievement recognition archive</li>
            <li className="rounded-lg bg-white px-3 py-2">Mobile-first and accessible by design</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
