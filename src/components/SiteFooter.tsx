import { useRef, useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
export function SiteFooter() {
  const slideRef      = useRef<HTMLDivElement>(null);
  const soranaRef     = useRef<HTMLDivElement>(null);
  const bottomBarRef  = useRef<HTMLDivElement>(null);

  const [visible,  setVisible]  = useState(false);

  /* ── Scroll-driven slide + nav capsule travel ───────────────────────────
     Phase 1 (progress 0→0.5): footer image slides in from top, capsule
       rides with it (inside slideRef) — it appears at the top of the image.
     Phase 2 (progress 0.5→1): footer is fully in place; capsule travels
       downward to its resting spot near the bottom of the viewport.
  ───────────────────────────────────────────────────────────────────────── */
  const router = useRouterState();
  const pathname = router.location.pathname;

  useEffect(() => {
    const slide     = slideRef.current;
    const sorana    = soranaRef.current;
    const bottomBar = bottomBarRef.current;
    const siteHeader = document.getElementById("site-header");
    if (!slide || !sorana || !bottomBar) return;

    // Initial states
    gsap.set(slide,     { yPercent: -100 });
    gsap.set(sorana,    { opacity: 0, scale: 1.08 });
    gsap.set(bottomBar, { opacity: 0, y: 16 });
    if (siteHeader) {
      gsap.set(siteHeader, { y: 0 });
    }
    
    setVisible(false);

    let st: ScrollTrigger | null = null;
    let pinnedTl: gsap.core.Timeline | null = null;
    let bottomActivated = false;
    let rafId: number;

    const buildTimeline = () => {
      const tl = gsap.timeline({ paused: true });

      // Phase 1 (0→0.5): slide the footer image in from the top
      tl.to(slide,     { yPercent: 0, ease: "none" },          0);
      tl.to(sorana,    { opacity: 1, scale: 1, ease: "none" }, 0.35);
      tl.to(bottomBar, { opacity: 1, y: 0, ease: "none" },     0.55);

      // Animate the site header downward simultaneously with the footer image
      const vpH   = window.innerHeight;
      const capH  = 48;
      const padB  = 20; // padding from bottom
      const targetY = vpH - capH - padB - 24;
      const durationN = 0.5 * (targetY / vpH);
      const startT = 0.5 - durationN;

      if (siteHeader) {
        tl.to(siteHeader, { y: targetY, ease: "none", duration: durationN }, startT);
      }

      return tl;
    };

    const PINNED_FOOTER_ROUTES = ["/about", "/projects"];

    const handlePinnedFooter = (event: Event) => {
      if (!pinnedTl) pinnedTl = buildTimeline();

      const { progress, visible: show, enterBack } =
        (event as CustomEvent<{ progress: number; visible?: boolean; enterBack?: boolean; leave?: boolean }>).detail;

      const clampedProgress = Math.min(Math.max(progress, 0), 1);
      pinnedTl.progress(clampedProgress);
      setVisible(show ?? clampedProgress > 0);

      if (enterBack) {
        bottomActivated = false;
        window.dispatchEvent(new Event("footer-bottom-leave"));
        return;
      }

      // onLeave often never fires when the page ends exactly at the pin zone,
      // so activate the bottom navbar once the footer animation completes.
      if (clampedProgress >= 0.99) {
        if (!bottomActivated) {
          bottomActivated = true;
          window.dispatchEvent(new Event("footer-bottom-enter"));
        }
      } else if (bottomActivated && clampedProgress < 0.85) {
        bottomActivated = false;
        window.dispatchEvent(new Event("footer-bottom-leave"));
      }
    };

    const init = () => {
      if (PINNED_FOOTER_ROUTES.includes(pathname)) {
        window.addEventListener("pinned-footer-progress", handlePinnedFooter);
        return;
      }

      const sections = document.querySelectorAll("main section");
      const triggerElement =
        document.getElementById("industries-section") ||
        document.getElementById("products-gallery") ||
        (sections.length ? sections[sections.length - 1] : null);

      if (!triggerElement) {
        rafId = requestAnimationFrame(init);
        return;
      }

      const tl = buildTimeline();
      tl.eventCallback("onUpdate", () => setVisible(tl.progress() > 0));

      st = ScrollTrigger.create({
        trigger: triggerElement,
        start: "bottom 180%",
        end: "bottom 105%",
        scrub: 1.0,
        animation: tl,
        onEnter: () => setVisible(true),
        onEnterBack: () => {
          setVisible(true);
          window.dispatchEvent(new Event("footer-bottom-leave"));
        },
        onLeaveBack: () => setVisible(false),
        onLeave: () => window.dispatchEvent(new Event("footer-bottom-enter")),
      });
    };

    rafId = requestAnimationFrame(init);

    return () => {
      cancelAnimationFrame(rafId);
      st?.kill();
      window.removeEventListener("pinned-footer-progress", handlePinnedFooter);
      pinnedTl = null;
    };
  }, [pathname]);

  return (
    <>
      {/* Fixed shell */}
      <div style={{
        position: "fixed", inset: 0,
        zIndex: 40, overflow: "hidden",
        pointerEvents: visible ? "auto" : "none",
      }}>
        {/* THE SLIDE DIV — travels from -100vh → 0 */}
        <div
          ref={slideRef}
          style={{ position: "absolute", inset: 0, willChange: "transform" }}
        >
          {/* Background image */}
          <img
            src="https://images.pexels.com/photos/13772063/pexels-photo-13772063.jpeg"
            alt="Glass architecture"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Scrim */}
          <div className="footer-scrim" style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(170deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.58) 100%)",
          }} />



        </div>
        {/* /slideRef */}

        {/* SORANA title — inside fixed shell but OUTSIDE slide */}
        <div ref={soranaRef} className="footer-sorana" style={{
          position: "absolute", inset: 0, zIndex: 5,
          pointerEvents: "none", userSelect: "none", opacity: 0,
        }}>
          {["S", "O", "R", "A", "N", "A"].map((letter, i) => (
            <span key={i} className="footer-sorana-letter" style={{
              display: "inline-block",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700, lineHeight: 0.8,
              background: "linear-gradient(130deg, rgba(10,124,63,0.85) 0%, rgba(232,119,50,0.85) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              color: "transparent",
            }}>{letter}</span>
          ))}
        </div>

        {/* Bottom bar — inside fixed shell but OUTSIDE slide */}
        <div ref={bottomBarRef} className="footer-bottom" style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 6, opacity: 0,
        }}>
          <div className="footer-bottom-container">
            <div className="footer-bottom-left">
              <span className="footer-copyright">©{new Date().getFullYear()}, Sorana Glass</span>
              <div className="footer-socials">
                {["Instagram", "LinkedIn", "YouTube"].map(s => (
                  <a key={s} href="#" className="hover:text-white transition-colors">{s}</a>
                ))}
              </div>
            </div>
            <div className="footer-bottom-right">
              <Link to="/" className="footer-privacy hover:text-white transition-colors">Privacy policy</Link>
              <Link to="/" className="footer-terms hover:text-white transition-colors">Terms & conditions</Link>
              <span className="footer-crafted hidden lg:inline">Crafted with precision</span>
            </div>
          </div>
        </div>

      </div>
      {/* /fixed shell */}
    </>
  );
}