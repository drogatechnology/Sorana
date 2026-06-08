import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from '@tanstack/react-router';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
const INDUSTRIES = [
  {
    name: 'Hotels & Resorts',
    tag: 'Hospitality',
    index: '01',
    description: 'Frameless glass facades, mirror walls, and custom-etched panels that define luxury spaces — from lobby atriums to rooftop enclosures.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=85&fit=crop',
  },
  {
    name: 'High-Rise Buildings',
    tag: 'Architecture',
    index: '02',
    description: 'Structural curtain walls, insulated glass units, and tempered safety glazing engineered for Ethiopia\'s tallest commercial towers.',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=85&fit=crop',
  },
  {
    name: 'Hospitals',
    tag: 'Healthcare',
    index: '03',
    description: 'Anti-bacterial laminated glass, radiation-shielding panels, and hygienic partition systems manufactured to clinical standards.',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1400&q=85&fit=crop',
  },
  {
    name: 'Museums & Cultural',
    tag: 'Culture',
    index: '04',
    description: 'UV-filtering display cases, anti-reflective exhibition glass, and architecturally significant glazing that protects collections.',
    image: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=1400&q=85&fit=crop',
  },
  {
    name: 'Villas & Residential',
    tag: 'Residential',
    index: '05',
    description: 'Shower enclosures, pool fencing, balustrades, and bespoke interior glass elements crafted for private homes and luxury villas.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=85&fit=crop',
  },
  {
    name: 'Industrial Facilities',
    tag: 'Industrial',
    index: '06',
    description: 'Impact-resistant, thermally stable glazing for factories, laboratories, and production facilities where performance is non-negotiable.',
    image: 'https://images.pexels.com/photos/5442128/pexels-photo-5442128.jpeg',
  },
];

export function IndustriesSection() {
  const sectionRef     = useRef<HTMLElement>(null);
  const stickyRef      = useRef<HTMLDivElement>(null);
  const imageLayersRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleLayersRef = useRef<(HTMLDivElement | null)[]>([]);
  // One overlay layer per industry — text lives INSIDE the layer, moves with the wipe
  const overlayLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const circleRefs       = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      const totalSteps = INDUSTRIES.length - 1;

      function getClip(i: number, sp: number) {
        let topClip = 100, bottomClip = 0;
        const revealStart = (i - 1) / totalSteps;
        const revealEnd   = i / totalSteps;
        const hideStart   = i / totalSteps;
        const hideEnd     = (i + 1) / totalSteps;

        if (i === 0) {
          topClip = 0;
          if (sp >= hideEnd) {
            bottomClip = 100;
          } else if (sp > hideStart) {
            const p = (sp - hideStart) / (hideEnd - hideStart);
            bottomClip = gsap.utils.clamp(0, 1, gsap.parseEase('power2.inOut')(p)) * 100;
          }
        } else {
          if (sp <= revealStart) {
            topClip = 100; bottomClip = 0;
          } else if (sp >= hideEnd) {
            topClip = 0; bottomClip = 100;
          } else if (sp > revealStart && sp <= revealEnd) {
            const p = (sp - revealStart) / (revealEnd - revealStart);
            topClip = (1 - gsap.utils.clamp(0, 1, gsap.parseEase('power2.inOut')(p))) * 100;
            bottomClip = 0;
          } else if (sp > hideStart && sp < hideEnd) {
            const p = (sp - hideStart) / (hideEnd - hideStart);
            topClip = 0;
            bottomClip = gsap.utils.clamp(0, 1, gsap.parseEase('power2.inOut')(p)) * 100;
          }
        }
        return { topClip, bottomClip };
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom 200%',
        scrub: 1.2,
        snap: {
          snapTo: (value) => {
            const stepSize = 1 / totalSteps;
            return Math.round(value / stepSize) * stepSize;
          },
          duration: { min: 0.2, max: 0.6 },
          ease: 'power2.inOut',
        },
        onUpdate: (self) => {
          const sp = self.progress;

          INDUSTRIES.forEach((_, i) => {
            const { topClip, bottomClip } = getClip(i, sp);
            const clipVal = `inset(${topClip}% 0 ${bottomClip}% 0)`;

            // Image wipe
            if (imageLayersRef.current[i])
              imageLayersRef.current[i]!.style.clipPath = clipVal;

            // Big title wipe (left side)
            if (titleLayersRef.current[i])
              titleLayersRef.current[i]!.style.clipPath = clipVal;

            // Overlay layer — text is INSIDE this div, so it wipes with the layer.
            // Exact same clip = text and image are frame-perfectly synced.
            if (overlayLayerRefs.current[i])
              overlayLayerRefs.current[i]!.style.clipPath = clipVal;

            // Circle fill
            const circle = circleRefs.current[i];
            if (circle) {
              let pCircle = 0;
              if (i === 0) {
                const stepEnd = 1 / totalSteps;
                if (sp <= 0) pCircle = 1;
                else if (sp >= stepEnd) pCircle = 0;
                else pCircle = 1 - (sp / stepEnd);
              } else {
                const stepStart   = (i - 1) / totalSteps;
                const stepEnd     = i / totalSteps;
                const nextStepEnd = (i + 1) / totalSteps;
                if (sp <= stepStart) pCircle = 0;
                else if (sp >= stepEnd) {
                  if (i === totalSteps) pCircle = 1;
                  else pCircle = sp >= nextStepEnd ? 0 : 1 - ((sp - stepEnd) / (nextStepEnd - stepEnd));
                } else {
                  pCircle = (sp - stepStart) / (stepEnd - stepStart);
                }
              }
              const e = gsap.utils.clamp(0, 1, gsap.parseEase('power2.inOut')(pCircle));
              circle.style.strokeDashoffset = String(31.415 * (1 - e));
            }
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="industries-section"
        className="ids-section"
        aria-label="Industries we serve"
        style={{ height: `${INDUSTRIES.length * 100}vh` }}
      >
        <div ref={stickyRef} className="ids-sticky">

          {/* ── Image stack ────────────────────────────────────── */}
          <div className="ids-images" aria-hidden="true">
            {INDUSTRIES.map((ind, i) => (
              <div
                key={ind.name}
                ref={(el) => { imageLayersRef.current[i] = el; }}
                className="ids-img-layer"
                style={{ zIndex: i }}
              >
                <img src={ind.image} alt={ind.name} className="ids-img" />
                <div className="ids-img-overlay" />
              </div>
            ))}
          </div>

          <div className="ids-grain" aria-hidden="true" />

          {/* ── Left: big title stack ──────────────────────────── */}
          <div className="ids-title-col">
            {INDUSTRIES.map((ind, i) => (
              <div
                key={ind.name}
                ref={el => { titleLayersRef.current[i] = el; }}
                className="ids-title-layer"
                style={{ zIndex: i }}
              >
                <h2 className="ids-title">{ind.name}</h2>
              </div>
            ))}
          </div>

          {/*
            ── Right: overlay layers ─────────────────────────────
            Each layer is a full-height column occupying the right panel.
            It contains the dot list with this industry's name already highlighted.
            Because the name text LIVES INSIDE the layer, when the layer wipes
            in (top→down) or wipes out (bottom→up), the name travels with it —
            exactly like the hero card technique.
          */}
          <div className="ids-right-col">
            {INDUSTRIES.map((ind, i) => (
              <div
                key={ind.name}
                ref={(el) => { overlayLayerRefs.current[i] = el; }}
                className="ids-overlay-layer"
                style={{
                  zIndex: i,
                  clipPath: i === 0 ? 'inset(0% 0 0% 0)' : 'inset(100% 0 0% 0)',
                }}
              >
                {/* Description box — lives INSIDE the clipped overlay layer,
                    so it wipes perfectly in sync with the background movement */}
                <div className="ids-desc-box">
                  {/* <span className="ids-desc-tag">{ind.tag}</span>
                  <p className="ids-desc-text">{ind.description}</p> */}
                </div>

                <ul className="ids-list">
                  {INDUSTRIES.map((row, j) => (
                    <li key={row.name} className="ids-list-item">

                      {/* Only draw the animated circle on the matching row */}
                      <div className="ids-list-circle-wrapper">
                        {j === i ? (
                          <svg viewBox="0 0 12 12" width="12" height="12" style={{ display: 'block', overflow: 'visible' }}>
                            <circle cx="6" cy="6" r="5" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
                            <circle
                              ref={(el) => {
                                // Only register once per industry (from layer i===j)
                                if (i === j) circleRefs.current[j] = el;
                              }}
                              cx="6" cy="6" r="5"
                              stroke="#fff" strokeWidth="1.5" fill="none"
                              strokeDasharray="31.415"
                              strokeDashoffset={j === 0 ? '0' : '31.415'}
                              transform="rotate(-90 6 6)"
                            />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 12 12" width="12" height="12" style={{ display: 'block', overflow: 'visible' }}>
                            <circle cx="6" cy="6" r="5" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
                          </svg>
                        )}
                      </div>

                      <span
                        className="ids-list-name"
                        style={{ opacity: j === i ? 1 : 0.35 }}
                      >
                        {row.name.toUpperCase()}
                      </span>

                    </li>
                  ))}
                </ul>

                <Link to="/projects" className="ids-cta">SEE ALL PROJECTS</Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      <style>{`
        .ids-section { position: relative; z-index: 25; }
        .ids-sticky { position: sticky; top: 0; height: 100vh; width: 100%; overflow: hidden; }

        /* Images */
        .ids-images { position: absolute; inset: 0; z-index: 0; }
        .ids-img-layer { position: absolute; inset: 0; clip-path: inset(100% 0 0 0); will-change: clip-path; }
        .ids-img-layer:first-child { clip-path: inset(0 0 0 0); }
        .ids-img { width: 100%; height: 100%; object-fit: cover; }
        .ids-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%); }

        /* Grain */
        .ids-grain { position: absolute; inset: 0; z-index: 1; pointer-events: none; opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 160px; }

        /* Left title column — full-viewport stacked layers, same as image layers
           so clip-path percentages operate on the same physical height */
        .ids-title-col {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
        }
        .ids-title-layer {
          position: absolute;
          inset: 0;
          clip-path: inset(100% 0 0 0);
          will-change: clip-path;
          /* Text sits at bottom-left, same position as before */
          display: flex;
          align-items: flex-end;
          padding-bottom: clamp(2rem, 5vw, 4rem);
          padding-left: clamp(2rem, 5vw, 4rem);
          max-width: 70%;
        }
        .ids-title-layer:first-child { clip-path: inset(0 0 0 0); }
        .ids-title { font-size: clamp(3rem, 10vw, 8rem); font-weight: 400; line-height: 0.9;
          letter-spacing: -0.02em; color: #fff; text-transform: uppercase;
          font-family: var(--font-display, 'Georgia', serif); margin: 0; }

        /*
          Right overlay column — stacked layers, each full height of the right panel.
          Text content (dot list + name) lives INSIDE each layer.
          clip-path wipes the whole layer (background + text) as one unit.
        */
        .ids-right-col {
          position: absolute;
          z-index: 4;
          bottom: clamp(2rem, 5vw, 4rem);
          right: clamp(2rem, 5vw, 4rem);
          min-width: 250px;
        }
        .ids-overlay-layer {
          position: absolute;
          bottom: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2rem;
          will-change: clip-path;
        }
        .ids-overlay-layer:first-child { position: relative; }

        /* List */
        .ids-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.6rem; }
        .ids-list-item { display: flex; align-items: center; gap: 0.75rem; }
        .ids-list-circle-wrapper { width: 12px; height: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .ids-list-name { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em; color: #fff; white-space: nowrap; }

        .ids-cta { display: inline-flex; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em;
          text-transform: uppercase; color: #fff; text-decoration: none;
          padding-bottom: 4px; border-bottom: 1px solid #fff; transition: opacity 0.25s; }
        .ids-cta:hover { opacity: 0.7; }

        /* Description box — inside each overlay layer so it wipes in sync */
        .ids-desc-box {
          width: 260px;
          padding: 0.01rem 1.25rem;
          background: rgba(255, 255, 255, 0.08);
          -webkit-backdrop-filter: blur(12px);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .ids-desc-tag {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
        }
        .ids-desc-text {
          font-size: 0.8rem;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
        }

        @media (max-width: 768px) {
          .ids-title-layer { 
            max-width: 100%; 
            padding: 0; /* Remove padding */
            justify-content: center;
            align-items: center; /* Perfectly center vertically */
          }
          .ids-title { 
            font-size: 3.75rem; 
            text-align: center;
          }
          .ids-right-col { 
            left: 0;
            right: 0;
            bottom: auto;
            top: calc(50% + 3.75rem); /* Start below the centered title with a gap */
            display: flex;
            justify-content: center;
          }
          .ids-overlay-layer {
            left: 0;
            right: 0;
            align-items: center;
          }
          .ids-desc-box {
            text-align: center;
            width: 90%; /* Slight tweak for fit */
          }
          .ids-desc-tag {
            font-size: 0.85rem; 
          }
          .ids-desc-text {
            font-size: 1rem; 
            line-height: 1.6;
          }
          .ids-list {
            align-items: center;
          }
          .ids-list-name {
            font-size: 1rem; 
          }
          .ids-cta {
            font-size: 0.9rem; 
          }
        }
      `}</style>
    </>
  );
}