import { useEffect, useState } from "react";

/**
 * Drop this anywhere in your page (e.g. inside Home in index.tsx).
 * On mobile, tap anywhere — it will show you EVERY element stacked at
 * that point from top to bottom, with z-index and pointer-events.
 * Remove after debugging.
 *
 * Usage in index.tsx:
 *   import { DebugBlocker } from "@/components/DebugBlocker";
 *   // inside Home():
 *   <DebugBlocker />
 */

interface HitInfo {
  tag: string;
  id: string;
  className: string;
  zIndex: string;
  pointerEvents: string;
  position: string;
  visibility: string;
  opacity: string;
  rect: string;
}

function getStack(x: number, y: number): HitInfo[] {
  const results: HitInfo[] = [];
  const seen = new Set<Element>();

  // Temporarily hide the top element and re-probe to get the full stack
  let el = document.elementFromPoint(x, y);
  let limit = 20;

  while (el && limit-- > 0 && !seen.has(el)) {
    seen.add(el);
    const cs = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    results.push({
      tag: el.tagName.toLowerCase(),
      id: el.id ? `#${el.id}` : "",
      className: Array.from(el.classList).slice(0, 4).join(" "),
      zIndex: cs.zIndex,
      pointerEvents: cs.pointerEvents,
      position: cs.position,
      visibility: cs.visibility,
      opacity: cs.opacity,
      rect: `${Math.round(rect.left)},${Math.round(rect.top)} ${Math.round(rect.width)}×${Math.round(rect.height)}`,
    });

    // Hide this element temporarily to find what's behind it
    const prevPE = (el as HTMLElement).style.pointerEvents;
    (el as HTMLElement).style.pointerEvents = "none";
    const next = document.elementFromPoint(x, y);
    (el as HTMLElement).style.pointerEvents = prevPE;

    if (!next || next === el) break;
    el = next;
  }

  return results;
}

export function DebugBlocker() {
  const [hits, setHits] = useState<HitInfo[]>([]);
  const [tapPos, setTapPos] = useState<{ x: number; y: number } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: TouchEvent) => {
      const t = e.touches[0] || e.changedTouches[0];
      if (!t) return;
      const x = t.clientX;
      const y = t.clientY;
      setTapPos({ x, y });
      setHits(getStack(x, y));
      setVisible(true);
    };
    window.addEventListener("touchstart", handler, { passive: true, capture: true });
    return () => window.removeEventListener("touchstart", handler, { capture: true } as any);
  }, []);

  if (!visible) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: 16,
          left: 16,
          right: 16,
          zIndex: 999999,
          background: "rgba(0,0,0,0.85)",
          color: "#0f0",
          fontFamily: "monospace",
          fontSize: 11,
          padding: 8,
          borderRadius: 6,
          pointerEvents: "none",
        }}
      >
        🔍 TAP ANYWHERE to identify the blocking element
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999999,
        background: "rgba(0,0,0,0.95)",
        color: "#fff",
        fontFamily: "monospace",
        fontSize: 10,
        padding: 8,
        maxHeight: "60vh",
        overflowY: "auto",
        pointerEvents: "auto",
      }}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div style={{ color: "#0f0", marginBottom: 4 }}>
        TAP @ {tapPos?.x},{tapPos?.y} — element stack (top→bottom):
      </div>
      {hits.map((h, i) => (
        <div
          key={i}
          style={{
            marginBottom: 4,
            padding: "3px 4px",
            background: i === 0 ? "rgba(255,50,50,0.3)" : "rgba(255,255,255,0.05)",
            borderLeft: i === 0 ? "3px solid #f55" : "3px solid #555",
          }}
        >
          <span style={{ color: i === 0 ? "#f88" : "#aaa" }}>#{i} </span>
          <span style={{ color: "#7df" }}>{h.tag}</span>
          <span style={{ color: "#fd7" }}>{h.id}</span>{" "}
          <span style={{ color: "#aaa" }}>{h.className}</span>
          <br />
          <span style={{ color: "#0f0" }}>z:{h.zIndex}</span>{" "}
          <span style={{ color: h.pointerEvents === "none" ? "#f88" : "#0f0" }}>
            pe:{h.pointerEvents}
          </span>{" "}
          <span style={{ color: "#adf" }}>pos:{h.position}</span>{" "}
          <span style={{ color: "#fda" }}>op:{h.opacity}</span>{" "}
          <span style={{ color: "#ddd" }}>vis:{h.visibility}</span>
          <br />
          <span style={{ color: "#888" }}>rect:{h.rect}</span>
        </div>
      ))}
      <button
        style={{ marginTop: 8, background: "#333", color: "#fff", border: "none", padding: "4px 12px", borderRadius: 4 }}
        onTouchEnd={() => setVisible(false)}
      >
        close
      </button>
    </div>
  );
}