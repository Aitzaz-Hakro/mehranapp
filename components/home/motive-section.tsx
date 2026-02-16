export function MotiveSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="text-2xl font-bold text-[#002147] sm:text-3xl">Why this platform exists</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-lg border border-[#002147]/10 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-black">Academic transparency</h3>
            <p className="mt-2 text-sm leading-6 text-black/75">
              Students deserve fair and direct access to historical exam material across departments
              and semesters.
            </p>
          </article>
          <article className="rounded-lg border border-[#002147]/10 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-black">Recognition of achievers</h3>
            <p className="mt-2 text-sm leading-6 text-black/75">
              MUET talent should be visible and celebrated so that current students can learn from
              real success stories.
            </p>
          </article>
          <article className="rounded-lg border border-[#002147]/10 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-black">Stronger student community</h3>
            <p className="mt-2 text-sm leading-6 text-black/75">
              A shared archive encourages collaboration, mentorship, and confidence in academic
              preparation.
            </p>
          </article>
          <article className="rounded-lg border border-[#002147]/10 bg-[#f8faff] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-black">Built with institutional trust</h3>
            <p className="mt-2 text-sm leading-6 text-black/75">
              Minimal design, reliable data, and responsive performance make this platform feel
              professional from the first tap.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
