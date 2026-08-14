import modernHouse from "../assets/modern-house-3.png";

export default function HeroSection({ onExplore }) {
  return (
    <section
      id="hero"
      className="relative min-h-screen min-h-dvh flex items-center justify-center px-4 md:px-8 py-12"
    >
      <div className="hero-card max-w-5xl w-full animate-fade-in overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 items-stretch min-h-[440px] md:min-h-[420px]">
          {/* Left — copy */}
          <div className="hero-card-content text-left px-8 py-10 md:px-10 md:py-14 lg:px-12 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-white/70 text-emerald-800 text-xs font-medium mb-6">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
              </svg>
              Premium Real Estate
            </div>

            <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-charcoal leading-[1.15] tracking-tight max-w-md">
              Find your dream home with Estatery
            </h1>

            <p className="mt-5 text-charcoal-muted text-base md:text-[1.05rem] leading-relaxed max-w-sm">
              Discover stunning modern properties with pools, panoramic views, and world-class landscaping — curated for discerning buyers.
            </p>

            <button
              onClick={onExplore}
              className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-900/15 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              Explore Properties
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
              </svg>
            </button>
          </div>

          {/* Right — isometric house */}
          <div className="hero-house-panel relative w-full min-h-[280px] md:min-h-0">
            <img
              src={modernHouse}
              alt="Isometric modern luxury home"
              className="hero-house-image"
              loading="eager"
              decoding="async"
              draggable="false"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <button
          onClick={onExplore}
          aria-label="Scroll to dashboard"
          className="flex flex-col items-center gap-1 text-white/75 hover:text-white transition-colors animate-bounce-subtle"
        >
          <span className="text-xs font-medium tracking-wide">Scroll to explore</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </button>
      </div>
    </section>
  );
}
