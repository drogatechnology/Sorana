import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import processingVideo from '@/assets/video-service/processing.mp4';
import installationVideo from '@/assets/video-service/installation.mp4';
import fabricationVideo from '@/assets/video-service/custom-fabrication.mp4';
import supplyVideo from '@/assets/video-service/supply-distribution.mp4';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CAPABILITIES = [
  {
    title: 'Processing',
    desc: '4 tempering furnaces, lamination lines, CNC cutting and drilling, sandblasting and digital printing.',
    image: 'https://images.unsplash.com/photo-1506902039157-1a7e7374b077?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    video: "https://www.pexels.com/download/video/7519297/",
  },
  {
    title: 'Custom Fabrication',
    desc: 'From a single bespoke piece to large project runs — we engineer to spec with structured QC at each step.',
    image: 'https://images.pexels.com/photos/7220832/pexels-photo-7220832.jpeg',
    video: "https://www.pexels.com/download/video/7219277/",
  },
  {
    title: 'Installation',
    desc: 'Skilled installation teams trained on safe handling, packaging and site logistics for fragile glass.',
    image: 'https://images.pexels.com/photos/5768188/pexels-photo-5768188.jpeg',
    video: "https://www.pexels.com/download/video/34918466/",
  },
  {
    title: 'Supply & Distribution',
    desc: 'Direct imports of Grade One float glass and full hardware accessories supply for trade clients.',
    image: 'https://images.pexels.com/photos/36122954/pexels-photo-36122954.jpeg',
    video: "https://www.pexels.com/download/video/6169107/",
  },
];

const N = CAPABILITIES.length;

export function ServiceCapabilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftImagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const bgImagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const videoCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ease = gsap.parseEase('power2.inOut');

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (self) => {
          const sp = self.progress;
          const totalSteps = N - 1;
          const step = sp * totalSteps;

          // LEFT image & BACKGROUND clip-path reveal
          CAPABILITIES.forEach((_, i) => {
            let topClip = 100, bottomClip = 0;
            const revealStart = (i - 1) / totalSteps;
            const revealEnd = i / totalSteps;
            const hideStart = i / totalSteps;
            const hideEnd = (i + 1) / totalSteps;

            if (i === 0) {
              topClip = 0;
              if (sp >= hideEnd) {
                bottomClip = 100;
              } else if (sp > hideStart) {
                const p = (sp - hideStart) / (hideEnd - hideStart);
                bottomClip = gsap.utils.clamp(0, 1, ease(p)) * 100;
              }
            } else {
              if (sp <= revealStart) {
                topClip = 100; bottomClip = 0;
              } else if (sp >= hideEnd) {
                topClip = 0; bottomClip = 100;
              } else if (sp > revealStart && sp <= revealEnd) {
                const p = (sp - revealStart) / (revealEnd - revealStart);
                topClip = (1 - gsap.utils.clamp(0, 1, ease(p))) * 100;
                bottomClip = 0;
              } else if (sp > hideStart && sp < hideEnd) {
                const p = (sp - hideStart) / (hideEnd - hideStart);
                topClip = 0;
                bottomClip = gsap.utils.clamp(0, 1, ease(p)) * 100;
              }
            }
            const el = leftImagesRef.current[i];
            if (el) el.style.clipPath = `inset(${topClip}% 0 ${bottomClip}% 0)`;

            const bgEl = bgImagesRef.current[i];
            if (bgEl) bgEl.style.clipPath = `inset(${topClip}% 0 ${bottomClip}% 0)`;
          });

          // VIDEO cards — each card slides DOWN to exit, revealing the one behind it
          CAPABILITIES.forEach((_, i) => {
            const card = videoCardsRef.current[i];
            if (!card) return;

            // Card exits during the scroll segment between step i and step i+1
            const exitStart = i / totalSteps;
            const exitEnd = (i + 1) / totalSteps;

            let ty = 0;

            if (i < N - 1) {
              if (sp >= exitEnd) {
                ty = 100; // fully slid out below
              } else if (sp > exitStart) {
                const p = (sp - exitStart) / (exitEnd - exitStart);
                ty = gsap.utils.clamp(0, 1, ease(p)) * 100;
              }
              // else ty = 0 — sitting in place, waiting its turn
            }
            // last card: ty stays 0 forever

            card.style.transform = `translateY(${ty}%)`;
            card.style.zIndex = String(N - i); // card 0 = top of stack
            card.style.opacity = '1';
          });

          const newIdx = Math.min(Math.round(step), N - 1);
          if (newIdx !== activeIndexRef.current) {
            activeIndexRef.current = newIdx;
            setActiveIndex(newIdx);
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        .caps * { box-sizing: border-box; }
        .caps-label {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          white-space: nowrap;
          margin: 0;
        }
        .caps-headline {
          font-family: 'Inter', sans-serif;
          font-size: clamp(1.5rem, 2.4vw, 2.5rem);
          font-weight: 500;
          line-height: 1.08;
          color: rgba(255,255,255,0.92);
          margin: 0;
        }
        .caps-desc {
          font-family: 'Inter', sans-serif;
          font-size: clamp(0.75rem, 0.9vw, 0.875rem);
          font-weight: 300;
          line-height: 1.65;
          color: rgba(255,255,255,0.45);
          margin: 0;
        }
        .caps-slot {
          position: relative;
          overflow: hidden;
        }
        .caps-item {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          will-change: transform;
          transition: transform 0.6s cubic-bezier(0.76, 0, 0.24, 1);
        }
      `}</style>

      <section
        ref={sectionRef}
        className="caps relative w-full"
        style={{ height: `${N * 100}vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col md:flex-row">

          {/* BACKGROUND BLURRED IMAGES */}
          <div className="absolute inset-0 w-full h-full z-0 bg-[#133720]">
          </div>

          {/* RIGHT: content & glassy panel (Top on Mobile, Right on Desktop) */}
          <div 
            className="relative w-full h-[60%] md:h-full md:flex-1 overflow-hidden bg-[#083D1F]/70 backdrop-blur-[30px] border-b md:border-b-0 md:border-l border-white/5 z-10 shadow-[0_20px_40px_rgba(0,0,0,0.2)] md:shadow-[-20px_0_40px_rgba(0,0,0,0.2)] order-1 md:order-2"
          >
            {/* TITLE block */}
            <div className="absolute top-[55%] md:top-[10%] left-0 md:left-[6%] w-full md:w-[48%] z-20 pointer-events-none px-4 md:px-0 text-center md:text-left">
              <div className="caps-slot md:mt-10" style={{ height: 'clamp(90px, 11vw, 130px)' }}>
                {CAPABILITIES.map((cap, i) => (
                  <h2
                    key={`hl-${i}`}
                    className="caps-headline caps-item w-full flex justify-center md:justify-start"
                    style={{
                      transitionDelay: '0.04s',
                      transform: activeIndex === i
                        ? 'translateY(0%)'
                        : activeIndex > i ? 'translateY(-110%)' : 'translateY(110%)',
                    }}
                  >
                    {cap.title}
                  </h2>
                ))}
              </div>
            </div>

            {/* DESCRIPTION block */}
            <div className="absolute top-[65%] md:top-auto md:bottom-[10%] left-0 md:left-[6%] w-full md:w-[44%] z-20 pointer-events-none px-6 md:px-0 text-center md:text-left">
              <div className="caps-slot" style={{ height: 'clamp(72px, 9vw, 100px)' }}>
                {CAPABILITIES.map((cap, i) => (
                  <p
                    key={`desc-${i}`}
                    className="text-base text-white w-full"
                    style={{
                      position: 'absolute', inset: 0,
                      transitionDelay: '0.06s',
                      transition: 'transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)',
                      transform: activeIndex === i
                        ? 'translateY(0%)'
                        : activeIndex > i ? 'translateY(-110%)' : 'translateY(110%)',
                    }}
                  >
                    {cap.desc}
                  </p>
                ))}
              </div>
            </div>

            {/* VIDEOS — stacked, each one slides down on exit */}
            <div
              className="absolute top-24 left-4 w-[35%] h-[25%] md:top-[8%] md:left-auto md:right-[6%] md:w-[30%] md:h-[25%] overflow-hidden z-10 rounded-sm shadow-xl"
            >
              {CAPABILITIES.map((cap, i) => (
                <div
                  key={`card-${i}`}
                  ref={el => { videoCardsRef.current[i] = el; }}
                  className="will-change-transform"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'hidden',
                    zIndex: N - i,
                    transform: 'translateY(0%)', // all start stacked at 0; z-index decides who's on top
                  }}
                >
                  <video
                    src={cap.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) scale(1)',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* LEFT: image (Bottom on Mobile, Left on Desktop) */}
          <div className="relative w-full h-[40%] md:h-full md:w-[38%] shrink-0 p-0 md:py-[10px] md:pl-[10px] z-10 order-2 md:order-1">
            <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
              {CAPABILITIES.map((cap, i) => (
                <div
                  key={`img-${i}`}
                  ref={el => { leftImagesRef.current[i] = el; }}
                  className="will-change-[clip-path]"
                  style={{
                    position: 'absolute', inset: 0, zIndex: i,
                    clipPath: i === 0 ? 'inset(0% 0 0% 0)' : 'inset(100% 0 0% 0)',
                  }}
                >
                  <img
                    src={cap.image}
                    alt={cap.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}