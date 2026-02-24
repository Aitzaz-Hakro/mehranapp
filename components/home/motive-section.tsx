export function MotiveSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#002147]/80">
          Developed by student for students
        </p>
        <h2 className="mt-2 text-2xl font-bold text-[#002147] sm:text-3xl">Why I built this platform</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-black/75 sm:text-base">
          I built this as a student developer because I was asked by many juniors for past papers,
          and it felt awkward for me to repeatedly ask seniors every time. This platform helps
          bypass that entire process with one trusted place to search.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-lg border border-[#002147]/10 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-black">Real student pain point</h3>
            <p className="mt-2 text-sm leading-6 text-black/75">
              I kept getting requests from juniors for past papers, and I wanted to make that
              access independent, reliable, and fair for everyone.
            </p>
          </article>
          <article className="rounded-lg border border-[#002147]/10 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-black">No more awkward requesting</h3>
            <p className="mt-2 text-sm leading-6 text-black/75">
              Instead of asking seniors every semester, students can directly search by department,
              semester, teacher, and course in seconds.
            </p>
          </article>
          <article className="rounded-lg border border-[#002147]/10 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-black">Drive links were inefficient</h3>
            <p className="mt-2 text-sm leading-6 text-black/75">
              When I received a drive link, I had to open each file one by one just to identify
              which past paper it was. This platform removes that friction.
            </p>
          </article>
          <article className="rounded-lg border border-[#002147]/10 bg-[#f8faff] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-black">Built by student for MUET students</h3>
            <p className="mt-2 text-sm leading-6 text-black/75">
              As a student developer, my motive is simple: save time, reduce dependency, and make
              exam preparation smoother for every junior and senior.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
