import { useState, useEffect, useRef } from "react";

const MILESTONES = [
  {
    year: "2001",
    tag: "Origins",
    heading: "Where It Began",
    body: "Born from a passion for precision, Sorana's founding team built deep technical expertise in automotive glass — servicing Addis Ababa's growing vehicle fleet and earning a reputation for unmatched accuracy.",
    stat: null as string | null,
    accent: "#0A7C3F",
    tagBg: "rgba(10,124,63,0.08)",
  },
  {
    year: "2008",
    tag: "Expansion",
    heading: "Into Architecture",
    body: "As Ethiopia's construction sector surged, Sorana pivoted its craft toward buildings — supplying tempered and laminated glass to hotels, hospitals, and high-rises reshaping Addis Ababa's skyline.",
    stat: null as string | null,
    accent: "#C5601A",
    tagBg: "rgba(197,96,26,0.09)",
  },
  {
    year: "2022",
    tag: "Technology",
    heading: "North Glass Addition",
    body: "Building on our 25-year history of tempering operations, we made a landmark addition: a new advanced North Glass tempering furnace — pushing daily capacity to 2,000 m² across our 4 furnaces.",
    stat: "2,000 m²/day",
    accent: "#0A7C3F",
    tagBg: "rgba(10,124,63,0.08)",
  },
  {
    year: "2024",
    tag: "Vision",
    heading: "Ethiopia's Most Advanced",
    body: "Over 200 completed projects. 80+ specialists. Four tempering lines. Sorana stands as Ethiopia's most fully integrated glass processor — and sets its sights on becoming a continental leader.",
    stat: "200+ Projects",
    accent: "#C5601A",
    tagBg: "rgba(197,96,26,0.09)",
  },
];

const DURATION = 5000;

export function MilestonesSection() {
  const [active, setActive] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Stores when the CURRENT slide started playing
  const startTimeRef = useRef<number>(Date.now());
  // Stores how much time elapsed before we paused (so pause/resume doesn't jump)
  const elapsedBeforePauseRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // Manual jump — resets the timeline markers safely
  const goTo = (index: number) => {
    setActive(index);
    setAnimKey((k) => k + 1);
    setProgress(0);
    startTimeRef.current = Date.now();
    elapsedBeforePauseRef.current = 0;
  };

  useEffect(() => {
    if (paused) {
      // Record exactly how far along we were when the user hovered over the container
      elapsedBeforePauseRef.current += Date.now() - startTimeRef.current;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    // Adjust start time to account for previous elapsed runtime before pause
    startTimeRef.current = Date.now() - elapsedBeforePauseRef.current;

    const tick = () => {
      const totalElapsed = Date.now() - startTimeRef.current;
      
      if (totalElapsed >= DURATION) {
        // Slide duration met: Reset clock parameters and move to the next slide safely
        startTimeRef.current = Date.now();
        elapsedBeforePauseRef.current = 0;
        setProgress(0);
        setActive((prev) => {
          const nextIndex = (prev + 1) % MILESTONES.length;
          setAnimKey((k) => k + 1);
          return nextIndex;
        });
      } else {
        // Keep counting up progress bar safely 
        setProgress(totalElapsed / DURATION);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [paused, active]); // Sync loop dynamically with active updates and pause states

  const m = MILESTONES[active];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');
        .ms-section {
          font-family: system-ui, -apple-system, sans-serif;
          padding: 4rem 0 5rem;
          width: 100%;
          box-sizing: border-box;
        }
        .ms-inner {
          width: 100%;
          padding: 0 clamp(1.5rem, 5vw, 4rem);
          box-sizing: border-box;
          position: relative;
        }
        .ms-header { margin-bottom: 3.5rem; }
        .ms-eyebrow {
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.35);
          margin-bottom: 10px;
        }
        .ms-title {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 400;
          letter-spacing: -0.02em;
          line-height: 1.05;
          color: #111;
          margin: 0;
        }
        .ms-track {
          display: flex;
          position: relative;
          margin-bottom: 3rem;
        }
        .ms-track::before {
          content: '';
          position: absolute;
          top: 18px;
          left: 18px;
          right: 18px;
          height: 1px;
          background: rgba(0,0,0,0.1);
          z-index: 0;
        }
        .ms-stop {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          position: relative;
          z-index: 1;
        }
        .ms-stop-dot {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid rgba(0,0,0,0.12);
          background: #f7f7f5;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.35s ease, border-color 0.35s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1), color 0.35s ease;
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 0.75rem;
          color: rgba(0,0,0,0.3);
        }
        .ms-stop-dot.active {
          border-color: transparent;
          color: #fff;
          transform: scale(1.15);
        }
        .ms-stop-year {
          font-size: 11px;
          letter-spacing: 0.08em;
          color: rgba(0,0,0,0.35);
          transition: color 0.3s, font-weight 0.3s;
        }
        .ms-stop.active .ms-stop-year { color: #111; font-weight: 600; }
        .ms-card-wrap {
          position: relative;
          min-height: 260px;
          overflow: hidden;
        }
        .ms-card {
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          gap: 0 clamp(2rem, 5vw, 4rem);
          align-items: center;
          min-height: 260px;
          width: 100%;
        }
        .ms-card-enter {
          animation: ms-enter 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes ms-enter {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ms-card-enter .ms-big-year  { animation: ms-enter 0.5s 0.04s cubic-bezier(0.22,1,0.36,1) both; }
        .ms-card-enter .ms-tag       { animation: ms-enter 0.5s 0.10s cubic-bezier(0.22,1,0.36,1) both; }
        .ms-card-enter .ms-heading   { animation: ms-enter 0.5s 0.08s cubic-bezier(0.22,1,0.36,1) both; }
        .ms-card-enter .ms-body      { animation: ms-enter 0.5s 0.14s cubic-bezier(0.22,1,0.36,1) both; }
        .ms-card-enter .ms-stat      { animation: ms-enter 0.5s 0.20s cubic-bezier(0.22,1,0.36,1) both; }
        .ms-card-enter .ms-divider   { animation: ms-divider-grow 0.6s 0.06s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes ms-divider-grow {
          from { transform: scaleY(0); opacity: 0; }
          to   { transform: scaleY(1); opacity: 1; }
        }
        .ms-left { display: flex; flex-direction: column; gap: 14px; }
        .ms-big-year {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(5rem, 11vw, 9rem);
          line-height: 0.88;
          letter-spacing: -0.04em;
          color: #111;
        }
        .ms-tag {
          display: inline-block;
          padding: 4px 14px;
          border-radius: 99px;
          font-size: 9px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          align-self: flex-start;
        }
        .ms-divider {
          width: 1px;
          align-self: stretch;
          transform-origin: top center;
        }
        .ms-right { display: flex; flex-direction: column; gap: 12px; }
        .ms-heading {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(1.6rem, 2.5vw, 2.4rem);
          font-weight: 400;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: #111;
          margin: 0;
        }
        .ms-body {
          font-size: clamp(0.85rem, 1.1vw, 0.95rem);
          color: #666662;
          line-height: 1.78;
          max-width: 52ch;
          margin: 0;
        }
        .ms-stat {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(1.2rem, 2vw, 1.7rem);
          letter-spacing: -0.02em;
          padding-bottom: 6px;
          border-bottom: 2px solid;
          display: inline-block;
          margin-top: 8px;
        }
        .ms-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 2.5rem;
        }
        .ms-nav {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ms-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.15);
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
          color: #111;
        }
        .ms-btn:hover:not(:disabled) {
          background: #0A7C3F;
          color: #fff;
          border-color: #0A7C3F;
        }
        .ms-btn:disabled { opacity: 0.25; cursor: default; }
        .ms-counter {
          font-size: 11px;
          letter-spacing: 0.15em;
          color: rgba(0,0,0,0.25);
        }
        .ms-progress-track {
          width: 120px;
          height: 2px;
          background: rgba(0,0,0,0.08);
          border-radius: 99px;
          overflow: hidden;
        }
        .ms-progress-fill {
          height: 100%;
          border-radius: 99px;
        }
        @media (max-width: 640px) {
          .ms-card { grid-template-columns: 1fr; gap: 1.5rem 0; }
          .ms-divider { display: none; }
          .ms-big-year { font-size: clamp(4rem, 18vw, 6rem); }
          .ms-progress-track { width: 80px; }
        }
      `}</style>

      <div
        className="ms-section"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="ms-inner">

          <div className="ms-header">
            <p className="ms-eyebrow">Our History</p>
            <h2 className="ms-title">Two Decades of Glass</h2>
          </div>

          <div className="ms-track">
            {MILESTONES.map((stop, i) => (
              <div
                key={i}
                className={`ms-stop${i === active ? " active" : ""}`}
                onClick={() => goTo(i)}
                role="button"
                aria-label={`Go to ${stop.year}`}
              >
                <div
                  className={`ms-stop-dot${i === active ? " active" : ""}`}
                  style={i === active ? { background: stop.accent, borderColor: stop.accent } : {}}
                >
                  {i !== active && <span>{stop.year.slice(2)}</span>}
                </div>
                <span className="ms-stop-year">{stop.year}</span>
              </div>
            ))}
          </div>

          <div className="ms-card-wrap">
            <div className="ms-card ms-card-enter" key={animKey}>
              <div className="ms-left">
                <div className="ms-big-year">{m.year}</div>
                <span className="ms-tag" style={{ background: m.tagBg, color: m.accent }}>
                  {m.tag}
                </span>
              </div>
              <div className="ms-divider" style={{ background: `${m.accent}22` }} />
              <div className="ms-right">
                <h3 className="ms-heading">{m.heading}</h3>
                <p className="ms-body">{m.body}</p>
                {m.stat && (
                  <span className="ms-stat" style={{ color: m.accent, borderColor: m.accent }}>
                    {m.stat}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="ms-footer">
            <div className="ms-nav">
              <button
                className="ms-btn"
                onClick={() => goTo(Math.max(0, active - 1))}
                disabled={active === 0}
                aria-label="Previous"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                className="ms-btn"
                onClick={() => goTo(Math.min(MILESTONES.length - 1, active + 1))}
                disabled={active === MILESTONES.length - 1}
                aria-label="Next"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span className="ms-counter">
                {String(active + 1).padStart(2, "0")} / {String(MILESTONES.length).padStart(2, "0")}
              </span>
            </div>

            <div className="ms-progress-track">
              <div
                className="ms-progress-fill"
                style={{ width: `${progress * 100}%`, background: m.accent }}
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}