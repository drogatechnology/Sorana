import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "@tanstack/react-router";
import { services } from "@/lib/site-data";

const SERVICE_IMAGES: Record<string, string> = {
  "Glass Cutting":
    "https://images.pexels.com/photos/7219180/pexels-photo-7219180.jpeg?w=800&auto=compress",
  "Glass Drilling":
    "https://images.pexels.com/photos/5691515/pexels-photo-5691515.jpeg?w=800&auto=compress",
  Tempering:
    "https://images.pexels.com/photos/11499130/pexels-photo-11499130.jpeg?w=800&auto=compress",
  Lamination:
    "https://images.pexels.com/photos/34048368/pexels-photo-34048368.jpeg?w=800&auto=compress",
  "Sandblasting & Frosting":
    "https://images.pexels.com/photos/28628031/pexels-photo-28628031.jpeg?w=800&auto=compress",
  "Digital Printing on Glass":
    "https://images.pexels.com/photos/18549730/pexels-photo-18549730.jpeg?w=800&auto=compress",
  "Bullet-Resistant Processing":
    "https://images.pexels.com/photos/21263452/pexels-photo-21263452.jpeg?w=800&auto=compress",
  "Glass Installation":
    "https://images.pexels.com/photos/5691544/pexels-photo-5691544.jpeg?w=800&auto=compress",
  "Hardware & Accessories Supply":
    "https://images.pexels.com/photos/3926794/pexels-photo-3926794.jpeg?w=800&auto=compress",
  "Custom Glass Fabrication":
    "https://images.pexels.com/photos/7519284/pexels-photo-7519284.jpeg?w=800&auto=compress",
};

const SERVICE_DESCRIPTIONS: Record<string, string> = {
  "Glass Cutting":
    "Precision cutting to any shape or dimension — straight lines, curves, and complex profiles — using state-of-the-art CNC and waterjet technology.",
  "Glass Drilling":
    "Clean, chip-free holes of any diameter drilled with diamond-tipped tooling for hardware, fixtures, and custom installations.",
  Tempering:
    "Heat-treated for up to 5× the strength of standard glass, producing a safety product that crumbles safely on impact — ideal for doors, facades, and furniture.",
  Lamination:
    "Two or more glass layers bonded with a resilient interlayer that holds fragments in place on breakage, delivering superior safety and acoustic performance.",
  "Sandblasting & Frosting":
    "Controlled abrasive or chemical etching that transforms clear glass into translucent, privacy-enhancing surfaces with elegant matte finishes.",
  "Digital Printing on Glass":
    "High-resolution ceramic or UV-cured inks fused directly onto glass, enabling vivid graphics, patterns, and branding on architectural panels.",
  "Bullet-Resistant Processing":
    "Multi-layer laminated systems engineered to meet UL 752 ballistic standards, protecting people and assets without sacrificing transparency.",
  "Glass Installation":
    "End-to-end fitting of structural glazing, frameless systems, partitions, and façades — handled by certified technicians with precision and care.",
  "Hardware & Accessories Supply":
    "A comprehensive range of clamps, hinges, channels, and fittings sourced from leading manufacturers to complement every glass application.",
  "Custom Glass Fabrication":
    "Bespoke solutions combining any combination of processing techniques to realise unique architectural, interior, and industrial glass projects.",
};

const FALLBACK =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fit=crop";

export function ServicesSection() {
  const cursorRef = useRef<HTMLDivElement>(null);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  const total = (services as readonly string[]).length;

  /* ── Embla setup ──────────────────────────────────────────────────── */
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: false,
    containScroll: "trimSnaps",
    slidesToScroll: 1,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  /* ── Inject/remove a global style that nukes the cursor everywhere ── */
  useEffect(() => {
    const styleId = "svc-cursor-none";
    if (cursorVisible) {
      if (!document.getElementById(styleId)) {
        const s = document.createElement("style");
        s.id = styleId;
        s.textContent = "*, *::before, *::after { cursor: none !important; }";
        document.head.appendChild(s);
      }
    } else {
      document.getElementById(styleId)?.remove();
    }
    return () => {
      document.getElementById(styleId)?.remove();
    };
  }, [cursorVisible]);

  /* ── Move cursor via ref (no re-render on every mousemove) ───────── */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (cursorRef.current) {
      cursorRef.current.style.left = `${e.clientX}px`;
      cursorRef.current.style.top = `${e.clientY}px`;
    }
  }, []);

  /* ── Arrow button shared style ────────────────────────────────────── */
  const btnStyle = (disabled: boolean): React.CSSProperties => ({
    all: "unset" as const,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "48px",
    height: "48px",
    background: disabled ? "rgba(10,124,63,0.3)" : "#0A7C3F",
    borderRadius: "50%",
    color: "#ffffff",
    transition: "background 0.2s ease",
    flexShrink: 0,
  });

  /* ── Custom cursor rendered into document.body via portal ─────────── */
  const dragCursor =
    typeof document !== "undefined"
      ? createPortal(
          <div
            ref={cursorRef}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              pointerEvents: "none",
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transform: "translate(-50%, -50%)",
              opacity: cursorVisible ? 1 : 0,
              transition: "opacity 0.15s ease",
              color: isDragging ? "#fb923c" : "#f97316",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="12 3 5 9 12 15" />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "15px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                lineHeight: 1,
                color: "currentColor",
              }}
            >
              DRAG
            </span>
            <svg
              width="32"
              height="32"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 3 13 9 6 15" />
            </svg>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      {/* ── Hover overlay keyframes ───────────────────────────────────── */}
      <style>{`
        .svc-card-img {
          transition: transform 0.55s cubic-bezier(0.4,0,0.2,1),
                      filter 0.45s cubic-bezier(0.4,0,0.2,1) !important;
        }
        .svc-card:hover .svc-card-img {
          transform: scale(1.07) !important;
          filter: blur(3px) brightness(0.45) !important;
        }

        /* Persistent bottom gradient — always visible */
        .svc-card-gradient-base {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.78) 0%,
            rgba(0,0,0,0.12) 50%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 1;
        }

        /* Hover dark scrim — fades in on hover */
        .svc-card-scrim {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.55);
          pointer-events: none;
          z-index: 2;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .svc-card:hover .svc-card-scrim {
          opacity: 1;
        }

        /* Bottom text — always visible (title only) */
        .svc-card-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 24px 20px 20px;
          pointer-events: none;
          z-index: 3;
        }

        /* Centre description overlay — slides up on hover */
        .svc-card:hover .svc-card-footer {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .svc-card-footer {
          transition: opacity 0.3s ease;
        }

        .svc-card-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 28px 24px;
          text-align: center;
          pointer-events: none;
          z-index: 4;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.4s ease 0.05s, transform 0.4s ease 0.05s;
        }
        .svc-card:hover .svc-card-overlay {
          opacity: 1;
          transform: translateY(0);
        }

        /* Thin accent line that grows on hover */
        .svc-card-overlay-line {
          width: 0;
          height: 1.5px;
          background: #0A7C3F;
          margin: 12px auto 14px;
          transition: width 0.45s cubic-bezier(0.4,0,0.2,1) 0.1s;
        }
        .svc-card:hover .svc-card-overlay-line {
          width: 40px;
        }
      `}</style>

      {dragCursor}

      <section className="svc-section" aria-labelledby="svc-heading">
        <div className="svc-box">
          {/* ── Split header ──────────────────────────────────────── */}
          <div className="svc-header-mcalpine">
            <h2 className="svc-title-left text-black" id="svc-heading">
              Services
            </h2>
            <div className="svc-header-img-wrapper">
              <img
                src="https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg"
                alt="Factory"
                className="svc-header-img"
              />
            </div>
            <h2 className="svc-title-right text-black">Catalogue</h2>
          </div>

          <div className="svc-carousel-block">
            {/* ── Controls row ─────────────────────────────────────── */}
            <div className="svc-controls">
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "11px",
                  letterSpacing: "0.14em",
                  color: "rgba(0, 0, 0, 1)",
                }}
              >
                {String(selectedIndex + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </span>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  aria-label="Previous service"
                  onClick={scrollPrev}
                  disabled={!canScrollPrev}
                  style={btnStyle(!canScrollPrev)}
                  onMouseEnter={(e) => {
                    if (canScrollPrev)
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.background = "#0d9e51";
                  }}
                  onMouseLeave={(e) => {
                    if (canScrollPrev)
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.background = "#0A7C3F";
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="11 4 6 9 11 14" />
                  </svg>
                </button>

                <button
                  aria-label="Next service"
                  onClick={scrollNext}
                  disabled={!canScrollNext}
                  style={btnStyle(!canScrollNext)}
                  onMouseEnter={(e) => {
                    if (canScrollNext)
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.background = "#0d9e51";
                  }}
                  onMouseLeave={(e) => {
                    if (canScrollNext)
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.background = "#0A7C3F";
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="7 4 12 9 7 14" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ── Embla viewport ───────────────────────────────────── */}
            <div
              ref={emblaRef}
              className="svc-embla"
              style={{ overflow: "hidden" }}
              onMouseMove={handleMouseMove}
              onMouseEnter={(e) => {
                if (cursorRef.current) {
                  cursorRef.current.style.left = `${e.clientX}px`;
                  cursorRef.current.style.top = `${e.clientY}px`;
                }
                setCursorVisible(true);
              }}
              onMouseLeave={() => {
                setCursorVisible(false);
                setIsDragging(false);
              }}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
            >
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  touchAction: "pan-y pinch-zoom",
                }}
              >
                {(services as readonly string[]).map((service) => {
                  const img = SERVICE_IMAGES[service] ?? FALLBACK;
                  const desc =
                    SERVICE_DESCRIPTIONS[service] ??
                    "Expert glass processing tailored to your exact specifications, delivered with precision and care.";

                  return (
                    <Link
                      key={service}
                      to="/services"
                      draggable={false}
                      className="svc-card"
                      style={{
                        flexShrink: 0,
                        flexBasis: "380px",
                        height: "490px",
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: "2px",
                        display: "block",
                        textDecoration: "none",
                      }}
                    >
                      {/* Image */}
                      <img
                        src={img}
                        alt={service}
                        draggable={false}
                        className="svc-card-img"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          pointerEvents: "none",
                        }}
                      />

                      {/* Always-visible bottom gradient */}
                      <div className="svc-card-gradient-base" />

                      {/* Hover dark scrim */}
                      <div className="svc-card-scrim" />

                      {/* Centre overlay: title + line + description */}
                      <div className="svc-card-overlay">
                        <p
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "9px",
                            fontWeight: 500,
                            textTransform: "uppercase",
                            letterSpacing: "0.22em",
                            color: "rgba(255,255,255,0.5)",
                            marginBottom: "8px",
                          }}
                        >
                          Sorana Glass
                        </p>
                        <h3
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(1.15rem, 1.8vw, 1.5rem)",
                            fontWeight: 600,
                            color: "#ffffff",
                            lineHeight: 1.1,
                            margin: 0,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {service}
                        </h3>
                        <div className="svc-card-overlay-line" />
                        <p
                          style={{
                            fontFamily: "var(--font-body, sans-serif)",
                            fontSize: "0.8rem",
                            fontWeight: 400,
                            color: "rgba(255,255,255,0.75)",
                            lineHeight: 1.6,
                            margin: 0,
                            maxWidth: "300px",
                          }}
                        >
                          {desc}
                        </p>
                      </div>

                      {/* Always-visible bottom footer (service name at rest) */}
                      <div className="svc-card-footer">
                        <p
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "9px",
                            fontWeight: 500,
                            textTransform: "uppercase",
                            letterSpacing: "0.22em",
                            color: "rgba(255,255,255,0.5)",
                            marginBottom: "6px",
                          }}
                        >
                          Sorana Glass
                        </p>
                        <h3
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(1.15rem, 1.8vw, 1.5rem)",
                            fontWeight: 600,
                            color: "#ffffff",
                            lineHeight: 1.1,
                            margin: 0,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {service}
                        </h3>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* ── Progress bar ─────────────────────────────────────── */}
            <div className="svc-progress">
              <div
                style={{
                  height: "1px",
                  background: "rgba(255,255,255,0.1)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: "#0A7C3F",
                    width: `${((selectedIndex + 1) / total) * 100}%`,
                    transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}