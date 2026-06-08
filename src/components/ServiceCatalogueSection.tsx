import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CATALOGUE_SERVICES = [
  {
    title: 'Glass Cutting',
    image: 'https://images.pexels.com/photos/7219180/pexels-photo-7219180.jpeg',
  },
  {
    title: 'Glass Drilling',
    image: 'https://images.pexels.com/photos/5691515/pexels-photo-5691515.jpeg',
  },
  {
    title: 'Tempering',
    image: 'https://images.pexels.com/photos/7191404/pexels-photo-7191404.jpeg',
  },
  {
    title: 'Lamination',
    image: 'https://images.pexels.com/photos/5797/kitchen-boards-laminated-wenge.jpg',
  },
  {
    title: 'Sandblasting & Frosting',
    image: 'https://images.pexels.com/photos/28628031/pexels-photo-28628031.jpeg',
  },
  {
    title: 'Digital Printing on Glass',
    image: 'https://images.pexels.com/photos/18549730/pexels-photo-18549730.jpeg',
  },
];

const N = CATALOGUE_SERVICES.length;

export function ServiceCatalogueSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rightContainersRef = useRef<(HTMLDivElement | null)[]>([]);
  const centerImagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const bgImagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const activeIndexRef = useRef(0);
  const lastProgressRef = useRef(-1);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ease = gsap.parseEase('power2.inOut');

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          // Pause the animation slightly before the section ends
          // so the user has time to read the last item before the footer arrives.
          const effectiveProgress = Math.min(1, self.progress / 0.85);
          
          if (effectiveProgress === 1 && lastProgressRef.current === 1) {
            return;
          }
          lastProgressRef.current = effectiveProgress;

          const sp = effectiveProgress;
          const totalSteps = N - 1;
          const step = sp * totalSteps;

          CATALOGUE_SERVICES.forEach((_, i) => {
            const container = rightContainersRef.current[i];
            const centerImg = centerImagesRef.current[i];
            
            if (!container || !centerImg) return;

            const distance = step - i;

            const isMobile = window.innerWidth < 768;
            const startClip = isMobile 
              ? { t: 25, r: 50, b: 75, l: 50 } 
              : { t: 50, r: 25, b: 50, l: 75 };

            // Container clip-path reveal
            if (distance <= -1) {
              container.style.clipPath = `inset(${startClip.t}% ${startClip.r}% ${startClip.b}% ${startClip.l}%)`;
            } else if (distance >= 0) {
              container.style.clipPath = 'inset(0% 0% 0% 0%)';
            } else {
              const p = distance + 1; 
              const eased = ease(p);
              const v = 1 - eased;
              container.style.clipPath = `inset(${v * startClip.t}% ${v * startClip.r}% ${v * startClip.b}% ${v * startClip.l}%)`;
            }

            // Image scaling effect
            if (distance < 0) {
              const p = Math.max(0, distance + 1);
              const eased = ease(p);
              centerImg.style.transform = `scale(${1.4 - 0.4 * eased}) translateZ(0)`;
            } else {
              const p = Math.min(1, distance);
              const eased = ease(p);
              centerImg.style.transform = `scale(${1 - 0.15 * eased}) translateZ(0)`;
            }
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display&display=swap');
        .caps-section {
          font-family: 'Inter', sans-serif;
        }
        .caps-headline {
          font-family: 'Inter', serif;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative w-full"
        style={{ height: `${(N + 0.5) * 100}vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col md:flex-row bg-black">
          
          {/* BACKGROUND & RIGHT IMAGES */}
          <div className="absolute inset-0 w-full h-full z-0">
            {CATALOGUE_SERVICES.map((cap, i) => (
              <div
                key={`img-container-${i}`}
                ref={el => { rightContainersRef.current[i] = el; }}
                className="absolute inset-0 w-full h-full will-change-[clip-path]"
                style={{
                  zIndex: i,
                  clipPath: i === 0 
                    ? 'inset(0% 0% 0% 0%)' 
                    : (typeof window !== 'undefined' && window.innerWidth < 768)
                      ? 'inset(25% 50% 75% 50%)'
                      : 'inset(50% 25% 50% 75%)',
                  transform: 'translateZ(0)' // Force GPU layer for clip-path animation
                }}
              >
                {/* Blurred Background spanning full width */}
                <div 
                  className="absolute inset-0 bg-cover bg-center pointer-events-none"
                  style={{ 
                    backgroundImage: `url(${cap.image})`, 
                    filter: 'blur(15px) brightness(0.6)', 
                    transform: 'scale(1.15) translateZ(0)' // Static scale to hide blurred edges
                  }}
                />
                
                {/* Foreground Image constrained to top half on mobile, right half on desktop */}
                <div className="absolute top-0 w-full h-[55%] md:top-auto md:right-0 md:w-1/2 md:h-full flex items-center justify-center">
                  <div className="w-[65%] md:w-[55%] aspect-[4/5] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative rounded-sm transform-gpu">
                    <img
                      ref={el => { centerImagesRef.current[i] = el; }}
                      src={cap.image}
                      alt={cap.title}
                      className="w-full h-full object-cover will-change-transform"
                      style={{ transform: i === 0 ? 'scale(1) translateZ(0)' : 'scale(1.4) translateZ(0)' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* LEFT/BOTTOM: Glassy Texts Panel */}
          <div className="mt-auto md:mt-0 w-full h-[45%] md:w-1/2 md:h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 z-10 caps-section relative bg-[#083D1F]/70 backdrop-blur-xl border-t md:border-t-0 md:border-r border-white/5 shadow-[0_-20px_40px_rgba(0,0,0,0.2)] md:shadow-[20px_0_40px_rgba(0,0,0,0.2)]">
            
            {/* Header Block */}
            <div className="mb-8 md:mb-12 lg:mb-16 text-center md:text-left">
              <h2 className="caps-headline text-3xl md:text-4xl lg:text-5xl text-white md:mb-4">Service Catalogue</h2>
            </div>

            {/* List Block for Desktop */}
            <div className="hidden md:flex w-full flex-col">
              {CATALOGUE_SERVICES.map((cap, i) => (
                <div 
                  key={`text-${i}`} 
                  className={`flex gap-6 mb-5 lg:mb-8 transition-all duration-700 ease-out items-center ${
                    activeIndex === i ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-4'
                  }`}
                >
                  <span className="text-sm font-medium text-white/40 w-6">
                    0{i + 1}
                  </span>
                  <h3 className="text-2xl lg:text-3xl caps-headline text-white">{cap.title}</h3>
                </div>
              ))}
            </div>

            {/* Replacing Text Block for Mobile */}
            <div className="md:hidden relative w-full h-[80px] overflow-hidden">
              {CATALOGUE_SERVICES.map((cap, i) => (
                <div
                  key={`mob-text-${i}`}
                  className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out"
                  style={{
                    transform: activeIndex === i ? 'translateY(0%)' : activeIndex > i ? 'translateY(-100%)' : 'translateY(100%)',
                  }}
                >
                  <span className="text-sm font-medium text-white/40 mr-4">
                    0{i + 1}
                  </span>
                  <h3 className="text-2xl caps-headline text-white text-center leading-tight">{cap.title}</h3>
                </div>
              ))}
            </div>

          </div>
          
        </div>
      </section>
    </>
  );
}
