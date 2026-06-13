import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

// Removed high-res local image imports to improve load time

type PairEntry = { imgs: [string, string]; name: string; category: string };

const ALL_PAIRS: PairEntry[] = [
  { imgs: [
      "https://images.pexels.com/photos/20677918/pexels-photo-20677918.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/68724/pexels-photo-68724.jpeg?auto=compress&cs=tinysrgb&w=400"],
    name: "Tempered Glass", category: "Architectural" },
  { imgs: [
      "https://images.unsplash.com/photo-1737316992965-c9f22680c40f?w=400&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1764670587705-0508e724b929?w=400&q=75&auto=format&fit=crop"],
    name: "Frosted Glass", category: "Decorative" },
  { imgs: [
      "https://images.unsplash.com/photo-1765766600513-5a9ae1440de9?w=400&q=75&auto=format&fit=crop",
      "https://images.pexels.com/photos/6436749/pexels-photo-6436749.jpeg?auto=compress&cs=tinysrgb&w=400"],
    name: "Frameless Partitions", category: "Interior" },
  { imgs: [
      "https://images.pexels.com/photos/7546284/pexels-photo-7546284.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/8082556/pexels-photo-8082556.jpeg?auto=compress&cs=tinysrgb&w=400"],
    name: "Shower Enclosures", category: "Bathroom" },
  { imgs: [
      "https://images.unsplash.com/photo-1616385968568-7e9400871a40?w=400&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540981992196-5827f2f4566e?w=400&q=75&auto=format&fit=crop"],
    name: "Laminated Glass", category: "Security" },
  { imgs: [
      "https://images.pexels.com/photos/4839258/pexels-photo-4839258.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/11950154/pexels-photo-11950154.jpeg?auto=compress&cs=tinysrgb&w=400"],
    name: "Auto Glass", category: "Automotive" },
  { imgs: [
      "https://images.pexels.com/photos/33530412/pexels-photo-33530412.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/33530415/pexels-photo-33530415.jpeg?auto=compress&cs=tinysrgb&w=400"],
    name: "Bulletproof Glass", category: "Security" },
  { imgs: [
      "https://images.unsplash.com/photo-1614959541579-c01f9b605f79?w=400&q=75&auto=format&fit=crop",
      "https://images.pexels.com/photos/18836811/pexels-photo-18836811.jpeg?auto=compress&cs=tinysrgb&w=400"],
    name: "Printed Glass", category: "Decorative" },
  { imgs: [
      "https://images.unsplash.com/photo-1570347809976-0a4abd0aa811?w=400&q=75&auto=format&fit=crop",
      "https://images.pexels.com/photos/14303756/pexels-photo-14303756.jpeg?auto=compress&cs=tinysrgb&w=400"],
    name: "Sandblasted Glass", category: "Frosted" },
];

const STRIPS = [
  { start: 0, dir:  1, speed: 38 },
  { start: 3, dir: -1, speed: 30 },
  { start: 6, dir:  1, speed: 44 },
] as const;

const CYCLE_PX = 2916;

function buildStripPairs(start: number, count = 6): PairEntry[] {
  return Array.from({ length: count }, (_, i) => ALL_PAIRS[(start + i) % ALL_PAIRS.length]);
}

export function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple fade in on load without GSAP scroll triggers
    const els = contentRef.current?.querySelectorAll<HTMLElement>(".hero-animate");
    if (els?.length) {
      els.forEach((el, i) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(36px)";
        el.style.transition = `all 1s cubic-bezier(0.215, 0.61, 0.355, 1) ${i * 0.14 + 0.1}s`;
      });

      const startAnim = () => {
        requestAnimationFrame(() => {
          els.forEach((el) => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          });
        });
      };

      const hasLoaded = sessionStorage.getItem('loadingScreenDone');
      if (hasLoaded) {
        setTimeout(startAnim, 100);
      } else {
        window.addEventListener('loadingScreenExiting', startAnim, { once: true });
      }
    }
  }, []);

  return (
    <section id="hero" className="relative h-[100dvh] overflow-hidden bg-[#032111]">
      {/* ── Diagonal image strips ──────────────────────────────────────────── */}
      <div className="hero-strips-wrapper">
        {STRIPS.map((strip, si) => {
          const base     = buildStripPairs(strip.start);
          const allPairs = [...base, ...base]; // duplicate for seamless loop

          return (
            <div
              key={si}
              className={`hero-strip ${strip.dir > 0 ? "hero-strip-ltr" : "hero-strip-rtl"}`}
              style={{ animationDuration: `${strip.speed}s` }}
            >
              {allPairs.map((pair, pi) => (
                <div key={pi} className="hero-pair">
                  <img src={pair.imgs[0]} alt="" aria-hidden="true" loading="eager" decoding="async" className="hero-pair-img" />
                  <img src={pair.imgs[1]} alt="" aria-hidden="true" loading="eager" decoding="async" className="hero-pair-img" />
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* ── Brand-colour overlay ───────────────────── */}
      <div className="hero-overlay" aria-hidden="true" style={{ opacity: 0.6 }} />

      {/* ── Dark scrim for text legibility ────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 6, background: "linear-gradient(to bottom, rgba(10,20,15,0.65) 0%, rgba(10,20,15,0.45) 100%)" }}
        aria-hidden="true"
      />

      {/* ── Hero text content ──────────────────────────────────────────────── */}
      <div
        ref={contentRef}
        className="relative flex h-full flex-col items-center justify-center text-center px-6"
        style={{ zIndex: 10 }}
      >
        {/* Badge */}
        <span className="hero-animate inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
          <span className="h-1.5 w-1.5 rounded-full bg-[#E87732]" />
          Sorana Glass
        </span>

        {/* Headline */}
        <h1 className="hero-animate mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.07] text-white text-balance md:text-7xl">
          Engineering Right Into Ethiopia's{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #E87732, #f9a05a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Finest Spaces
          </span>
          .
        </h1>

        {/* Sub-copy */}
        <p className="hero-animate mt-6 max-w-2xl text-base text-white/70 md:text-lg">
          Over 20 years of glass craftsmanship. From tempered facades to frameless
          showers and automotive windshields — processed, finished and installed in Addis Ababa.
        </p>

        {/* CTAs */}
        <div className="hero-animate mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-[#0A7C3F] px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#0b9048] hover:scale-[1.03] active:scale-[0.98]"
          >
            Contact Us <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-[1.03] active:scale-[0.98]"
          >
            Explore Products
          </Link>
        </div>
      </div>

      <style>{`:root { --hero-cycle: ${CYCLE_PX}px; }`}</style>
    </section>
  );
}
