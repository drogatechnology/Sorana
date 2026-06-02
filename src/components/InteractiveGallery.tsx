import { useEffect, useRef } from "react";
import { ArrowUpLeft, ArrowUpRight, ArrowDownLeft, ArrowDownRight } from "lucide-react";

const baseImages = [
  "https://images.pexels.com/photos/33410957/pexels-photo-33410957.jpeg",
  "https://images.pexels.com/photos/11876277/pexels-photo-11876277.jpeg",
  "https://images.pexels.com/photos/1407487/pexels-photo-1407487.jpeg",
  "https://images.pexels.com/photos/13025284/pexels-photo-13025284.jpeg",
  "https://images.pexels.com/photos/11299583/pexels-photo-11299583.jpeg",
  "https://images.pexels.com/photos/905956/pexels-photo-905956.jpeg",
  "https://images.pexels.com/photos/14479234/pexels-photo-14479234.jpeg",
  "https://images.pexels.com/photos/31291737/pexels-photo-31291737.jpeg",
  "https://images.pexels.com/photos/37722714/pexels-photo-37722714.jpeg",
  "https://images.pexels.com/photos/30395628/pexels-photo-30395628.jpeg",
  "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
  "https://images.pexels.com/photos/4476718/pexels-photo-4476718.jpeg",
  "https://images.pexels.com/photos/18506932/pexels-photo-18506932.jpeg",
  "https://images.pexels.com/photos/20346013/pexels-photo-20346013.jpeg",
  "https://images.pexels.com/photos/28984522/pexels-photo-28984522.jpeg",
  "https://images.pexels.com/photos/15005692/pexels-photo-15005692.jpeg",
  "https://images.pexels.com/photos/4916183/pexels-photo-4916183.jpeg",
  "https://images.pexels.com/photos/13970256/pexels-photo-13970256.jpeg",
  "https://images.pexels.com/photos/17706641/pexels-photo-17706641.jpeg",
  "https://images.pexels.com/photos/16790837/pexels-photo-16790837.jpeg",
  "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
  "https://images.pexels.com/photos/34993717/pexels-photo-34993717.jpeg",
  "https://images.pexels.com/photos/28649913/pexels-photo-28649913.jpeg",
  "https://images.pexels.com/photos/30824915/pexels-photo-30824915.jpeg",
  "https://images.pexels.com/photos/28145545/pexels-photo-28145545.jpeg",
];

const COLS = 20;
const ROWS = 20;
const TOTAL = COLS * ROWS;

// Checkerboard pattern guarantees immense spacing.
const items = Array.from({ length: TOTAL }).map((_, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  
  const isImageCell = (col + row) % 2 === 0;

  if (!isImageCell) return null;

  return {
    src: baseImages[i % baseImages.length],
  };
});

export function InteractiveGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const targetVelocity = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const isHoveredRef = useRef(false);
  const bounds = useRef({ minX: 0, maxX: 0, minY: 0, maxY: 0 });
  const activeDirectionRef = useRef<{x: number, y: number} | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !gridRef.current) return;
      const cw = containerRef.current.clientWidth;
      const ch = containerRef.current.clientHeight;
      const gw = gridRef.current.scrollWidth;
      const gh = gridRef.current.scrollHeight;

      bounds.current = {
        minX: Math.min(0, cw - gw),
        maxX: 0,
        minY: Math.min(0, ch - gh),
        maxY: 0,
      };

      // Center it initially if we haven't set a pos
      if (pos.current.x === 0 && pos.current.y === 0) {
        pos.current = {
          x: (cw - gw) / 2,
          y: (ch - gh) / 2,
        };
      }
    };

    setTimeout(handleResize, 100);
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const hw = window.innerWidth / 2;
      const hh = window.innerHeight / 2;

      let nx = (e.clientX - hw) / hw;
      let ny = (e.clientY - hh) / hh;

      const deadzone = 0.15;
      if (Math.abs(nx) < deadzone) nx = 0;
      else nx = nx > 0 ? nx - deadzone : nx + deadzone;

      if (Math.abs(ny) < deadzone) ny = 0;
      else ny = ny > 0 ? ny - deadzone : ny + deadzone;

      const maxSpeed = 16;
      targetVelocity.current = {
        x: -nx * maxSpeed,
        y: -ny * maxSpeed,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);

    let rafId: number;
    const loop = () => {
      const isMobile = window.innerWidth < 768;
      let targetVx = 0;
      let targetVy = 0;

      if (isMobile) {
        if (activeDirectionRef.current) {
          const maxSpeed = 16;
          targetVx = activeDirectionRef.current.x * maxSpeed;
          targetVy = activeDirectionRef.current.y * maxSpeed;
        }
      } else {
        targetVx = isHoveredRef.current ? 0 : targetVelocity.current.x;
        targetVy = isHoveredRef.current ? 0 : targetVelocity.current.y;
      }

      if (document.body.classList.contains("nav-open")) {
        targetVx = 0;
        targetVy = 0;
      }

      velocity.current.x += (targetVx - velocity.current.x) * 0.08;
      velocity.current.y += (targetVy - velocity.current.y) * 0.08;

      pos.current.x += velocity.current.x;
      pos.current.y += velocity.current.y;

      const { minX, maxX, minY, maxY } = bounds.current;

      if (pos.current.x < minX) {
        pos.current.x += (minX - pos.current.x) * 0.15;
      } else if (pos.current.x > maxX) {
        pos.current.x += (maxX - pos.current.x) * 0.15;
      }

      if (pos.current.y < minY) {
        pos.current.y += (minY - pos.current.y) * 0.15;
      } else if (pos.current.y > maxY) {
        pos.current.y += (maxY - pos.current.y) * 0.15;
      }

      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-[100dvh] overflow-hidden bg-background"
    >
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary/30 blur-[120px] dark:bg-primary/20" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[45vw] h-[45vw] rounded-full bg-accent/30 blur-[120px] dark:bg-accent/20" />
      </div>

      <div
        ref={gridRef}
        // Extremely massive grid to spread things out.
        // We use absolute, huge width/height, and large vw-based gaps.
        className="absolute w-[800vw] h-[800vh] lg:w-[600vw] lg:h-[600vh] p-24 grid grid-cols-20 grid-rows-20 gap-[10vw] md:gap-[12vw] lg:gap-[15vw] will-change-transform z-10 cursor-crosshair"
      >
        {items.map((item, i) => {
          if (!item) {
            return <div key={i} className="pointer-events-none" />;
          }
          
          return (
            <div
              key={i}
              // place-self-center ensures the image sits entirely centered within its grid cell
              // w-full with max-w ensures the image stops growing beyond a certain size, allowing for even MORE gap inside the cell
              className="group relative overflow-hidden bg-surface shadow-card transition-all duration-500 ease-out hover:scale-110 hover:z-50 hover:shadow-elegant rounded-none aspect-square col-span-1 row-span-1 place-self-center w-48 md:w-full max-w-[250px] sm:max-w-[250px] md:max-w-[280px]"
              onMouseEnter={() => {
                isHoveredRef.current = true;
              }}
              onMouseLeave={() => {
                isHoveredRef.current = false;
              }}
            >
              <img
                src={item.src}
                alt="Gallery"
                className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          );
        })}
      </div>

      {/* MOBILE CONTROLS (Diagonal Arrows) */}
      <div className="md:hidden absolute inset-0 pointer-events-none z-50">
        {/* Top Left (NW) */}
        <button
          className="pointer-events-auto absolute top-[12%] left-4 w-16 h-16 bg-[#0A7C3F]/70 backdrop-blur-md text-[#E87732]/80 rounded-full flex items-center justify-center active:scale-95 transition-transform shadow-lg"
          onPointerDown={() => { activeDirectionRef.current = { x: 1, y: 1 }; }}
          onPointerUp={() => { activeDirectionRef.current = null; }}
          onPointerLeave={() => { activeDirectionRef.current = null; }}
        >
          <ArrowUpLeft size={32} />
        </button>
        {/* Top Right (NE) */}
        <button
          className="pointer-events-auto absolute top-[12%] right-4 w-16 h-16 bg-[#0A7C3F]/70 backdrop-blur-md text-[#E87732]/80 rounded-full flex items-center justify-center active:scale-95 transition-transform shadow-lg"
          onPointerDown={() => { activeDirectionRef.current = { x: -1, y: 1 }; }}
          onPointerUp={() => { activeDirectionRef.current = null; }}
          onPointerLeave={() => { activeDirectionRef.current = null; }}
        >
          <ArrowUpRight size={32} />
        </button>
        {/* Bottom Left (SW) */}
        <button
          className="pointer-events-auto absolute bottom-[15%] left-4 w-16 h-16 bg-[#0A7C3F]/70 backdrop-blur-md text-[#E87732]/80 rounded-full flex items-center justify-center active:scale-95 transition-transform shadow-lg"
          onPointerDown={() => { activeDirectionRef.current = { x: 1, y: -1 }; }}
          onPointerUp={() => { activeDirectionRef.current = null; }}
          onPointerLeave={() => { activeDirectionRef.current = null; }}
        >
          <ArrowDownLeft size={32} />
        </button>
        {/* Bottom Right (SE) */}
        <button
          className="pointer-events-auto absolute bottom-[15%] right-4 w-16 h-16 bg-[#0A7C3F]/70 backdrop-blur-md text-[#E87732]/80 rounded-full flex items-center justify-center active:scale-95 transition-transform shadow-lg"
          onPointerDown={() => { activeDirectionRef.current = { x: -1, y: -1 }; }}
          onPointerUp={() => { activeDirectionRef.current = null; }}
          onPointerLeave={() => { activeDirectionRef.current = null; }}
        >
          <ArrowDownRight size={32} />
        </button>
      </div>

    </div>
  );
}
