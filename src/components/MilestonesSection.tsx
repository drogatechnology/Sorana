import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MILESTONES = [
  {
    year: "2001",
    index: "01",
    tag: "Origins",
    heading: "Where It\nBegan",
    body: "Born from a passion for precision, Sorana's founding team built deep technical expertise in automotive glass — servicing Addis Ababa's growing vehicle fleet and earning a reputation for unmatched accuracy.",
    stat: null as string | null,
    accentEven: true,
  },
  {
    year: "2008",
    index: "02",
    tag: "Expansion",
    heading: "Into\nArchitecture",
    body: "As Ethiopia's construction sector surged, Sorana pivoted its craft toward buildings — supplying tempered and laminated glass to hotels, hospitals, and high-rises reshaping Addis Ababa's skyline.",
    stat: null as string | null,
    accentEven: false,
  },
  {
    year: "2017",
    index: "03",
    tag: "Founding",
    heading: "Formally\nEstablished",
    body: "Sorana Glass is registered under its current legal structure, consolidating decades of operational history and positioning the business for full-scale industrial growth.",
    stat: null as string | null,
    accentEven: true,
  },
  {
    year: "2022",
    index: "04",
    tag: "Technology",
    heading: "North Glass\nUpgrade",
    body: "A landmark investment: four advanced tempering furnaces including a new North Glass unit — pushing daily production capacity to 2,000 m² and cutting lead times in half.",
    stat: "2,000 m²/day",
    accentEven: false,
  },
  {
    year: "2024",
    index: "05",
    tag: "Vision",
    heading: "Ethiopia's\nMost Advanced",
    body: "Over 200 completed projects. 80+ specialists. Four tempering lines. Sorana stands as Ethiopia's most fully integrated glass processor — and sets its sights on becoming a continental leader.",
    stat: "200+ Projects",
    accentEven: true,
  },
];

// ─── Mobile: vertical stacked timeline ───────────────────────────────────────
function MobileTimeline() {
  return (
    <>
      <style>{`
        .mob-section {
          background: #f7f7f5;
          padding: 3rem 1.5rem 4rem;
        }
        .mob-header {
          margin-bottom: 3rem;
        }
        .mob-eyebrow {
          color: #0A7C3F;
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          font-family: system-ui, sans-serif;
          margin-bottom: 8px;
        }
        .mob-title {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(1.6rem, 7vw, 2.2rem);
          font-weight: 400;
          letter-spacing: -0.02em;
          line-height: 1.05;
          color: #111;
        }
        .mob-timeline {
          position: relative;
          padding-left: 32px;
        }
        /* Continuous vertical line */
        .mob-timeline::before {
          content: '';
          position: absolute;
          left: 7px;
          top: 12px;
          bottom: 12px;
          width: 1px;
          background: rgba(0,0,0,0.1);
        }
        .mob-item {
          position: relative;
          margin-bottom: 3rem;
        }
        .mob-item:last-child {
          margin-bottom: 0;
        }
        /* Dot on the line */
        .mob-dot {
          position: absolute;
          left: -28px;
          top: 5px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 1.5px solid;
          background: #f7f7f5;
          flex-shrink: 0;
        }
        .mob-year {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(2.4rem, 12vw, 4rem);
          line-height: 0.88;
          letter-spacing: -0.04em;
          color: #111;
          margin-bottom: 10px;
        }
        .mob-tag {
          display: inline-block;
          padding: 3px 12px;
          border-radius: 99px;
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-family: system-ui, sans-serif;
          margin-bottom: 14px;
        }
        .mob-heading {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(1.4rem, 6vw, 1.9rem);
          font-weight: 400;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: #111;
          margin-bottom: 10px;
          white-space: pre-line;
        }
        .mob-body {
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 0.875rem;
          color: #666662;
          line-height: 1.72;
        }
        .mob-stat {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(1.3rem, 5vw, 1.7rem);
          letter-spacing: -0.02em;
          margin-top: 16px;
          display: inline-block;
          padding-bottom: 6px;
          border-bottom: 2px solid;
        }
        .mob-counter {
          font-family: system-ui, sans-serif;
          font-size: 10px;
          letter-spacing: 0.15em;
          color: rgba(0,0,0,0.22);
          margin-bottom: 14px;
        }
      `}</style>
      <div className="mob-section">
        <div className="mob-header">
          <p className="mob-eyebrow">Our History</p>
          <h2 className="mob-title">Two Decades of Glass</h2>
        </div>

        <div className="mob-timeline">
          {MILESTONES.map((m, i) => {
            const accent   = m.accentEven ? "#0A7C3F" : "#C5601A";
            const accentBg = m.accentEven ? "rgba(10,124,63,0.08)" : "rgba(197,96,26,0.09)";

            return (
              <div key={i} className="mob-item">
                {/* Dot */}
                <span
                  className="mob-dot"
                  style={{ borderColor: accent, background: i === 0 ? accent : "#f7f7f5" }}
                />

                {/* Counter */}
                <p className="mob-counter">
                  {m.index} / {MILESTONES.length.toString().padStart(2, "0")}
                </p>

                {/* Year */}
                <div className="mob-year">{m.year}</div>

                {/* Tag */}
                <span
                  className="mob-tag"
                  style={{ background: accentBg, color: accent }}
                >
                  {m.tag}
                </span>

                {/* Heading */}
                <h3 className="mob-heading">{m.heading}</h3>

                {/* Body */}
                <p className="mob-body">{m.body}</p>

                {/* Stat */}
                {m.stat && (
                  <span
                    className="mob-stat"
                    style={{ color: accent, borderColor: accent }}
                  >
                    {m.stat}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── Desktop: original pinned scroll ─────────────────────────────────────────
function DesktopTimeline() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const stickyRef   = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !stickyRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".ms-card");
      const dots  = gsap.utils.toArray<HTMLElement>(".ms-dot");
      const total = MILESTONES.length;

      gsap.set(cards, { autoAlpha: 0, y: 48 });
      gsap.set(cards[0], { autoAlpha: 1, y: 0 });
      dots[0]?.classList.add("ms-active");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * (total - 1) * 1.2}`,
          scrub: 0.9,
          pin: stickyRef.current,
          pinSpacing: true,
          onUpdate(self) {
            if (progressRef.current)
              progressRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });

      for (let i = 1; i < total; i++) {
        const seg = i - 1;
        tl
          .to(cards[seg], { autoAlpha: 0, y: -40, duration: 0.28, ease: "power2.in" }, seg)
          .to(cards[i],   { autoAlpha: 1, y: 0,   duration: 0.3,  ease: "power2.out" }, seg + 0.22)
          .call(
            () => dots.forEach((d, di) => d.classList.toggle("ms-active", di === i)),
            undefined,
            seg + 0.28
          );
      }

      tl.to({}, { duration: 0.5 });
      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        .ms-active {
          background-color: #0A7C3F !important;
          transform: scale(1.7);
        }
        .ms-year-num {
          font-size: clamp(7rem, 11vw, 16rem);
          line-height: 0.88;
          letter-spacing: -0.04em;
          color: #111;
          user-select: none;
          display: block;
        }
        .ms-tag {
          display: inline-block;
          padding: 4px 14px;
          border-radius: 99px;
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          font-family: system-ui, sans-serif;
          margin-top: 18px;
        }
        .ms-rule {
          width: 1px;
          align-self: stretch;
          margin: 0 52px;
          flex-shrink: 0;
        }
        .ms-heading {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(2rem, 4.5vw, 3.8rem);
          font-weight: 400;
          letter-spacing: -0.025em;
          line-height: 1.06;
          color: #111;
          margin-bottom: 20px;
          white-space: pre-line;
        }
        .ms-body {
          font-family: system-ui, -apple-system, sans-serif;
          font-size: clamp(0.875rem, 1.3vw, 1rem);
          color: #555551;
          line-height: 1.75;
          max-width: 44ch;
        }
        .ms-stat {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(1.5rem, 2.8vw, 2.3rem);
          letter-spacing: -0.02em;
        }
      `}</style>

      <div ref={sectionRef} className="relative bg-white">
        <div
          ref={stickyRef}
          className="h-screen w-full overflow-hidden relative"
          style={{ background: "#f7f7f5" }}
        >
          {/* Progress bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "rgba(0,0,0,0.07)", zIndex: 20 }}>
            <div
              ref={progressRef}
              style={{ height: "100%", background: "#0A7C3F", transformOrigin: "left", transform: "scaleX(0)" }}
            />
          </div>

          <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div
              style={{
                padding: "clamp(2rem,4vw,3rem) clamp(2rem,6vw,6rem) 1.5rem",
                borderBottom: "1px solid rgba(0,0,0,0.07)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p style={{ color: "#0A7C3F", fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", fontFamily: "system-ui,sans-serif", marginBottom: 8 }}>
                  Our History
                </p>
                <h2 style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: "clamp(1.7rem,3.2vw,2.6rem)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1, color: "#111" }}>
                  Two Decades of Glass
                </h2>
              </div>

              {/* Dots */}
              <div style={{ display: "flex", gap: 10, paddingBottom: 4 }}>
                {MILESTONES.map((_, i) => (
                  <span
                    key={i}
                    className="ms-dot"
                    style={{ display: "block", width: 6, height: 6, borderRadius: "50%", background: "rgba(0,0,0,0.13)", transition: "all 0.5s" }}
                  />
                ))}
              </div>
            </div>

            {/* Cards */}
            <div style={{ flex: 1, position: "relative" }}>
              {MILESTONES.map((m, i) => {
                const accent   = m.accentEven ? "#0A7C3F" : "#C5601A";
                const accentBg = m.accentEven ? "rgba(10,124,63,0.08)" : "rgba(197,96,26,0.09)";

                return (
                  <div
                    key={i}
                    className="ms-card"
                    style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        padding: "0 clamp(2rem,6vw,6rem)",
                      }}
                    >
                      {/* Left: Big year + tag */}
                      <div style={{ width: "clamp(200px,30%,380px)", flexShrink: 0 }}>
                        <span className="ms-year-num">{m.year}</span>
                        <span className="ms-tag" style={{ background: accentBg, color: accent }}>
                          {m.tag}
                        </span>
                      </div>

                      {/* Vertical rule */}
                      <div className="ms-rule" style={{ background: `${accent}22` }} />

                      {/* Right: text block */}
                      <div style={{ maxWidth: 520 }}>
                        <p style={{ fontFamily: "system-ui,sans-serif", fontSize: 11, letterSpacing: "0.15em", color: "rgba(0,0,0,0.22)", marginBottom: 18 }}>
                          {m.index} / {MILESTONES.length.toString().padStart(2, "0")}
                        </p>
                        <h3 className="ms-heading">{m.heading}</h3>
                        <p className="ms-body">{m.body}</p>
                        {m.stat && (
                          <div style={{ display: "inline-block", marginTop: 28, paddingBottom: 10, borderBottom: `2px solid ${accent}` }}>
                            <span className="ms-stat" style={{ color: accent }}>{m.stat}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Root: pick layout based on viewport ─────────────────────────────────────
export function MilestonesSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile ? <MobileTimeline /> : <DesktopTimeline />;
}