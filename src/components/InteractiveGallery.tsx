import { useEffect, useRef, useState, useCallback, useMemo } from "react";

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

function thumbUrl(src: string) {
  return `${src}?auto=compress&cs=tinysrgb&w=200`;
}
function fullUrl(src: string) {
  return `${src}?auto=compress&cs=tinysrgb&w=600`;
}

const COLS = 20;
const ROWS = 20;
const TOTAL = COLS * ROWS;

const PUSH_BY_RING: Record<number, { cardinal: number; diagonal: number }> = {
  1: { cardinal: 130, diagonal: 92 },
  2: { cardinal: 75,  diagonal: 53 },
  3: { cardinal: 35,  diagonal: 25 },
};

const items = Array.from({ length: TOTAL }).map((_, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const isImageCell = (col + row) % 2 === 0;
  if (!isImageCell) return null;
  return { src: baseImages[i % baseImages.length] };
});

function computePushMap(hoveredIdx: number): Map<number, { tx: number; ty: number }> {
  const map = new Map<number, { tx: number; ty: number }>();
  const hCol = hoveredIdx % COLS;
  const hRow = Math.floor(hoveredIdx / COLS);

  for (let i = 0; i < TOTAL; i++) {
    if (i === hoveredIdx || items[i] === null) continue;
    const tCol = i % COLS;
    const tRow = Math.floor(i / COLS);
    const dc = tCol - hCol;
    const dr = tRow - hRow;
    const dist = Math.max(Math.abs(dc), Math.abs(dr));
    if (dist === 0 || dist > 3) continue;
    const ring = PUSH_BY_RING[dist];
    const isDiagonal = dc !== 0 && dr !== 0;
    map.set(i, isDiagonal
      ? { tx: Math.sign(dc) * ring.diagonal, ty: Math.sign(dr) * ring.diagonal }
      : { tx: Math.sign(dc) * ring.cardinal, ty: Math.sign(dr) * ring.cardinal }
    );
  }
  return map;
}

const EASE = "0.5s cubic-bezier(0.34, 1.4, 0.64, 1)";

function GalleryCell({
  item,
  index,
  isHovered,
  neighborStyle,
  hiResRequested,
  hiResLoaded,
  onEnter,
  onLeave,
  onHiResLoaded,
}: {
  item: { src: string };
  index: number;
  isHovered: boolean;
  neighborStyle: React.CSSProperties;
  hiResRequested: boolean;
  hiResLoaded: boolean;
  onEnter: (i: number) => void;
  onLeave: () => void;
  onHiResLoaded: (i: number) => void;
}) {
  const thumb = thumbUrl(item.src);
  const full = fullUrl(item.src);

  return (
    <div
      style={
        isHovered
          ? { transform: "scale(2.8)", zIndex: 100, transition: `transform ${EASE}` }
          : { ...neighborStyle, zIndex: 1 }
      }
      className="group relative overflow-hidden bg-surface shadow-card rounded-none aspect-square col-span-1 row-span-1 place-self-center w-48 md:w-full max-w-[250px] sm:max-w-[250px] md:max-w-[280px]"
      onMouseEnter={() => onEnter(index)}
      onMouseLeave={onLeave}
    >
      <img
        src={thumb}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        style={{ opacity: hiResLoaded ? 0 : 1, transition: "opacity 0.4s ease" }}
        draggable={false}
      />
      {hiResRequested && (
        <img
          src={full}
          alt="Gallery"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          style={{ opacity: hiResLoaded ? 1 : 0, transition: "opacity 0.4s ease" }}
          onLoad={() => onHiResLoaded(index)}
          draggable={false}
        />
      )}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100"
        style={{ transition: "opacity 0.35s ease" }}
      />
      <div
        className="absolute inset-0 ring-2 ring-white/40 opacity-0 group-hover:opacity-100"
        style={{ transition: "opacity 0.35s ease" }}
      />
    </div>
  );
}

export function InteractiveGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const targetVelocity = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const isHoveredRef = useRef(false);
  const bounds = useRef({ minX: 0, maxX: 0, minY: 0, maxY: 0 });

  // Touch drag: track last touch point and rolling velocity for momentum
  const touchRef = useRef<{
    lastX: number;
    lastY: number;
    vx: number;
    vy: number;
    isDragging: boolean;
  } | null>(null);

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [hiResRequested, setHiResRequested] = useState<Set<number>>(new Set());
  const [hiResLoaded, setHiResLoaded] = useState<Set<number>>(new Set());

  const handleEnter = useCallback((i: number) => {
    isHoveredRef.current = true;
    setHoveredIdx(i);
    setHiResRequested(prev => {
      if (prev.has(i)) return prev;
      const next = new Set(prev);
      next.add(i);
      return next;
    });
  }, []);

  const handleLeave = useCallback(() => {
    isHoveredRef.current = false;
    setHoveredIdx(null);
  }, []);

  const handleHiResLoaded = useCallback((i: number) => {
    setHiResLoaded(prev => {
      if (prev.has(i)) return prev;
      const next = new Set(prev);
      next.add(i);
      return next;
    });
  }, []);

  const pushMap = useMemo(
    () => hoveredIdx !== null ? computePushMap(hoveredIdx) : null,
    [hoveredIdx]
  );

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

      if (pos.current.x === 0 && pos.current.y === 0) {
        pos.current = { x: (cw - gw) / 2, y: (ch - gh) / 2 };
      }
    };

    setTimeout(handleResize, 100);
    window.addEventListener("resize", handleResize);

    // ── Desktop: mouse-position-based pan ──────────────────────────────────
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
      targetVelocity.current = { x: -nx * 16, y: -ny * 16 };
    };

    window.addEventListener("mousemove", handleMouseMove);

    // ── Mobile: touch drag with momentum ──────────────────────────────────
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchRef.current = { lastX: t.clientX, lastY: t.clientY, vx: 0, vy: 0, isDragging: true };
      // Kill any existing momentum so drag feels instant
      velocity.current = { x: 0, y: 0 };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touchRef.current?.isDragging) return;
      e.preventDefault(); // stop page scroll while dragging the gallery
      const t = e.touches[0];
      const dx = t.clientX - touchRef.current.lastX;
      const dy = t.clientY - touchRef.current.lastY;

      // Apply delta directly to position for an immediate, 1:1 feel
      pos.current.x += dx;
      pos.current.y += dy;

      // Rolling average velocity (for momentum on release)
      touchRef.current.vx = touchRef.current.vx * 0.6 + dx * 0.4;
      touchRef.current.vy = touchRef.current.vy * 0.6 + dy * 0.4;

      touchRef.current.lastX = t.clientX;
      touchRef.current.lastY = t.clientY;
    };

    const onTouchEnd = () => {
      if (!touchRef.current) return;
      // Hand off the rolling velocity to the RAF loop for momentum coast
      velocity.current.x = touchRef.current.vx;
      velocity.current.y = touchRef.current.vy;
      touchRef.current.isDragging = false;
      touchRef.current = null;
    };

    // passive: false so we can call preventDefault inside onTouchMove
    const container = containerRef.current;
    container?.addEventListener("touchstart", onTouchStart, { passive: true });
    container?.addEventListener("touchmove", onTouchMove, { passive: false });
    container?.addEventListener("touchend", onTouchEnd);
    container?.addEventListener("touchcancel", onTouchEnd);

    // ── RAF loop ───────────────────────────────────────────────────────────
    let rafId: number;
    const loop = () => {
      const isMobile = window.innerWidth < 768;

      if (!touchRef.current?.isDragging) {
        // Not actively dragging — apply target velocity (desktop) or coast (mobile)
        const targetVx = isMobile ? 0 : (isHoveredRef.current ? 0 : targetVelocity.current.x);
        const targetVy = isMobile ? 0 : (isHoveredRef.current ? 0 : targetVelocity.current.y);

        if (document.body.classList.contains("nav-open")) {
          velocity.current.x *= 0.85;
          velocity.current.y *= 0.85;
        } else {
          // On mobile, decay velocity freely (momentum coast). On desktop, lerp to target.
          if (isMobile) {
            velocity.current.x *= 0.92; // friction / deceleration
            velocity.current.y *= 0.92;
          } else {
            velocity.current.x += (targetVx - velocity.current.x) * 0.08;
            velocity.current.y += (targetVy - velocity.current.y) * 0.08;
          }
        }

        pos.current.x += velocity.current.x;
        pos.current.y += velocity.current.y;
      }
      // While isDragging, pos is updated directly in onTouchMove — skip here

      // Soft-clamp to bounds
      const { minX, maxX, minY, maxY } = bounds.current;
      if (pos.current.x < minX) pos.current.x += (minX - pos.current.x) * 0.15;
      else if (pos.current.x > maxX) pos.current.x += (maxX - pos.current.x) * 0.15;
      if (pos.current.y < minY) pos.current.y += (minY - pos.current.y) * 0.15;
      else if (pos.current.y > maxY) pos.current.y += (maxY - pos.current.y) * 0.15;

      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      container?.removeEventListener("touchstart", onTouchStart);
      container?.removeEventListener("touchmove", onTouchMove);
      container?.removeEventListener("touchend", onTouchEnd);
      container?.removeEventListener("touchcancel", onTouchEnd);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-[100dvh] overflow-hidden bg-background touch-none"
    >
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary/30 blur-[120px] dark:bg-primary/20" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[45vw] h-[45vw] rounded-full bg-accent/30 blur-[120px] dark:bg-accent/20" />
      </div>

      <div
        ref={gridRef}
        className="absolute w-[800vw] h-[800vh] lg:w-[600vw] lg:h-[600vh] p-24 grid grid-cols-20 grid-rows-20 gap-[10vw] md:gap-[12vw] lg:gap-[15vw] will-change-transform z-10 cursor-crosshair"
      >
        {items.map((item, i) => {
          if (!item) return <div key={i} className="pointer-events-none" />;

          const isHovered = hoveredIdx === i;
          const push = pushMap?.get(i);

          const neighborStyle: React.CSSProperties = {
            transform: push ? `translate(${push.tx}px, ${push.ty}px)` : "translate(0px, 0px)",
            transition: `transform ${EASE}`,
          };

          return (
            <GalleryCell
              key={i}
              item={item}
              index={i}
              isHovered={isHovered}
              neighborStyle={neighborStyle}
              hiResRequested={hiResRequested.has(i)}
              hiResLoaded={hiResLoaded.has(i)}
              onEnter={handleEnter}
              onLeave={handleLeave}
              onHiResLoaded={handleHiResLoaded}
            />
          );
        })}
      </div>
    </div>
  );
}