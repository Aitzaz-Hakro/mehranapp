const currentYear = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="border-t border-[#001730] bg-[#002147] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-6 text-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="font-semibold text-white">Developed by AItzaz Hassan (23CS)</p>
          <p className="mt-1 text-white/80">© {currentYear} Mehran APP. All rights reserved.</p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://www.linkedin.com/in/aitzazhassan2005"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="rounded-lg border border-white/30 px-3 py-1.5 font-medium text-white hover:bg-white/10"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/Aitzaz-Hakro"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="rounded-lg border border-white/30 px-3 py-1.5 font-medium text-white hover:bg-white/10"
          >
            GitHub
          </a>
       
        </div>
      </div>
    </footer>
  );
}