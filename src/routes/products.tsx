import { createFileRoute } from "@tanstack/react-router";
import { WebGLGallery } from "../components/WebGLGallery";
import { ErrorBoundary } from "../components/ErrorBoundary";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Sorana Glass" },
      {
        name: "description",
        content:
          "Tempered, laminated, printed, frosted, sandblasted, bullet-resistant, skylight, double glazing and auto glass.",
      },
      { property: "og:title", content: "Glass Products — Sorana Glass" },
      {
        property: "og:description",
        content: "Explore Sorana Glass's full product range.",
      },
    ],
  }),
  component: Products,
});

/* ─── Product data ──────────────────────────────────────────────────────── */
interface Card {
  name: string;
  img: string;
  desc: string;
}

const CARDS: Card[] = [
  // 1. Tempered Glass ×3
  { name: "Tempered Glass", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&h=820&q=80", desc: "Heat-treated safety glass, up to 5× stronger than annealed glass — fragments safely on impact." },
  { name: "Tempered Glass", img: "https://images.pexels.com/photos/11618522/pexels-photo-11618522.jpeg", desc: "Heat-treated safety glass, up to 5× stronger than annealed glass — fragments safely on impact." },
  { name: "Tempered Glass", img: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=600&h=820&q=80", desc: "Heat-treated safety glass, up to 5× stronger than annealed glass — fragments safely on impact." },
  // 2. Laminated Glass ×3
  { name: "Laminated Glass", img: "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=600&h=820&q=80", desc: "Multi-layered glass bonded with PVB interlayers for security, sound and UV control." },
  { name: "Laminated Glass", img: "https://images.pexels.com/photos/1190902/pexels-photo-1190902.jpeg", desc: "Multi-layered glass bonded with PVB interlayers for security, sound and UV control." },
  { name: "Laminated Glass", img: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=600&h=820&q=80", desc: "Multi-layered glass bonded with PVB interlayers for security, sound and UV control." },
  // 3. Frameless Partitions ×3
  { name: "Frameless Partitions", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&h=820&q=80", desc: "Frosted and sandblasted partitions for offices, retail and residential spaces." },
  { name: "Frameless Partitions", img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&h=820&q=80", desc: "Frosted and sandblasted partitions for offices, retail and residential spaces." },
  { name: "Frameless Partitions", img: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=600&h=820&q=80", desc: "Frosted and sandblasted partitions for offices, retail and residential spaces." },
  // 4. Shower Enclosures ×3
  { name: "Shower Enclosures", img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&h=820&q=80", desc: "Custom frameless shower boxes designed and installed for luxury bathrooms." },
  { name: "Shower Enclosures", img: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&h=820&q=80", desc: "Custom frameless shower boxes designed and installed for luxury bathrooms." },
  { name: "Shower Enclosures", img: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=600&h=820&q=80", desc: "Custom frameless shower boxes designed and installed for luxury bathrooms." },
  // 5. Skylight & Double Glazing ×3
  { name: "Skylight & Double Glazing", img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&h=820&q=80", desc: "Insulated and skylight glass solutions for energy-efficient architecture." },
  { name: "Skylight & Double Glazing", img: "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=600&h=820&q=80", desc: "Insulated and skylight glass solutions for energy-efficient architecture." },
  { name: "Skylight & Double Glazing", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=600&h=820&q=80", desc: "Insulated and skylight glass solutions for energy-efficient architecture." },
  // 6. Auto Glass ×3
  { name: "Auto Glass", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&h=820&q=80", desc: "Windshield supply, replacement and processing for cars, buses and assembly lines." },
  { name: "Auto Glass", img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&h=820&q=80", desc: "Windshield supply, replacement and processing for cars, buses and assembly lines." },
  { name: "Auto Glass", img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=600&h=820&q=80", desc: "Windshield supply, replacement and processing for cars, buses and assembly lines." },
  // 7. Printed Glass ×3
  { name: "Printed Glass", img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&h=820&q=80", desc: "Digitally printed glass for branded and decorative interior applications." },
  { name: "Printed Glass", img: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=600&h=820&q=80", desc: "Digitally printed glass for branded and decorative interior applications." },
  { name: "Printed Glass", img: "https://images.pexels.com/photos/12472486/pexels-photo-12472486.jpeg", desc: "Digitally printed glass for branded and decorative interior applications." },
  // 8. Sandblasted Glass ×3
  { name: "Sandblasted Glass", img: "https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?auto=format&fit=crop&w=600&h=820&q=80", desc: "Custom etched and sandblasted patterns for privacy and decoration." },
  { name: "Sandblasted Glass", img: "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=600&h=820&q=80", desc: "Custom etched and sandblasted patterns for privacy and decoration." },
  { name: "Sandblasted Glass", img: "https://images.pexels.com/photos/16775661/pexels-photo-16775661.jpeg", desc: "Custom etched and sandblasted patterns for privacy and decoration." },
  // 9. Bullet-Resistant Glass ×3
  { name: "Bullet-Resistant Glass", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&h=820&q=80", desc: "Multi-layered laminated glass engineered for security applications." },
  { name: "Bullet-Resistant Glass", img: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&h=820&q=80", desc: "Multi-layered laminated glass engineered for security applications." },
  { name: "Bullet-Resistant Glass", img: "https://images.pexels.com/photos/33530414/pexels-photo-33530414.jpeg", desc: "Multi-layered laminated glass engineered for security applications." },
];

/* ─── Grid layout ───────────────────────────────────────────────────────── */
/**
 * ROW-BASED layout — like tarasyareha.com screenshot:
 *
 *  • Images in the SAME row share the same vertical baseline (no staggering).
 *  • Rows vary: some have 1 empty slot, some 2, some 3 — never all 5 filled.
 *  • 8 rows, 27 images total: 4+3+4+2+4+3+4+3 = 27.
 */
interface GridItem {
  cardIdx: number;
  col: number; // 1-5
  row: number; // 1-8
  colMobile?: number; // 1-3
  rowMobile?: number; // 1-12
}

const BASE_GRID: GridItem[] = [
  // Row 1 — col 4 empty (4 imgs)
  { cardIdx: 0, col: 1, row: 1 }, // Tempered
  { cardIdx: 9, col: 2, row: 1 }, // Shower
  { cardIdx: 18, col: 3, row: 1 }, // Printed
  { cardIdx: 3, col: 5, row: 1 }, // Laminated

  // Row 2 — cols 1,3 empty (3 imgs)
  { cardIdx: 12, col: 2, row: 2 }, // Skylight
  { cardIdx: 21, col: 4, row: 2 }, // Sandblasted
  { cardIdx: 6, col: 5, row: 2 }, // Frameless

  // Row 3 — col 5 empty (4 imgs)
  { cardIdx: 24, col: 1, row: 3 }, // Bullet-Resistant
  { cardIdx: 15, col: 2, row: 3 }, // Auto Glass
  { cardIdx: 1, col: 3, row: 3 }, // Tempered
  { cardIdx: 10, col: 4, row: 3 }, // Shower

  // Row 4 — cols 1,3,4 empty — only 2 imgs (most sparse)
  { cardIdx: 19, col: 2, row: 4 }, // Printed
  { cardIdx: 4, col: 5, row: 4 }, // Laminated

  // Row 5 — col 3 empty (4 imgs)
  { cardIdx: 13, col: 1, row: 5 }, // Skylight
  { cardIdx: 22, col: 2, row: 5 }, // Sandblasted
  { cardIdx: 7, col: 4, row: 5 }, // Frameless
  { cardIdx: 25, col: 5, row: 5 }, // Bullet-Resistant

  // Row 6 — cols 2,3 empty (3 imgs)
  { cardIdx: 16, col: 1, row: 6 }, // Auto Glass
  { cardIdx: 2, col: 4, row: 6 }, // Tempered
  { cardIdx: 11, col: 5, row: 6 }, // Shower

  // Row 7 — col 4 empty (4 imgs)
  { cardIdx: 20, col: 1, row: 7 }, // Printed
  { cardIdx: 5, col: 2, row: 7 }, // Laminated
  { cardIdx: 14, col: 3, row: 7 }, // Skylight
  { cardIdx: 23, col: 5, row: 7 }, // Sandblasted

  // Row 8 — cols 1,4 empty (3 imgs)
  { cardIdx: 8, col: 2, row: 8 }, // Frameless
  { cardIdx: 26, col: 3, row: 8 }, // Bullet-Resistant
  { cardIdx: 17, col: 5, row: 8 }, // Auto Glass
];

const MOBILE_PATTERN = [
  [1, 2], // Row 1 (2 imgs)
  [2, 3], // Row 2 (2 imgs)
  [1, 2, 3], // Row 3 (3 imgs)
  [1, 3], // Row 4 (2 imgs)
  [1, 2], // Row 5 (2 imgs)
  [2, 3], // Row 6 (2 imgs)
  [1, 2, 3], // Row 7 (3 imgs)
  [1, 3], // Row 8 (2 imgs)
  [1, 2], // Row 9 (2 imgs)
  [2, 3], // Row 10 (2 imgs)
  [1, 2, 3], // Row 11 (3 imgs)
  [1, 3], // Row 12 (2 imgs)
];

const GRID: GridItem[] = [];
let mobilePatternIndex = 0;
let itemsInCurrentMobileRow = 0;

BASE_GRID.forEach((item) => {
  const currentRowPattern = MOBILE_PATTERN[mobilePatternIndex];
  GRID.push({
    ...item,
    colMobile: currentRowPattern[itemsInCurrentMobileRow],
    rowMobile: mobilePatternIndex + 1,
  });
  
  itemsInCurrentMobileRow++;
  if (itemsInCurrentMobileRow >= currentRowPattern.length) {
    itemsInCurrentMobileRow = 0;
    mobilePatternIndex++;
  }
});

function Products() {
  // The WebGLGallery component handles all scroll distortion automatically


  return (
    <div className="relative bg-background">
      <ErrorBoundary>
        <WebGLGallery selector=".gallery-img" textWrapperSelector=".gallery-text-wrapper" />
      </ErrorBoundary>
      {/* ── Hero Section — sits above WebGL canvas (z:5) via z-index:10 */}
      <section
        className="relative overflow-hidden py-16 flex flex-col items-center justify-center text-center"
        style={{ position: "relative", zIndex: 10 }}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#E87732]/50 rounded-full blur-[80px] -translate-y-1/3 -translate-x-2/3" />
          <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#0A7C3F]/40 rounded-full blur-[80px] translate-y-1/3 translate-x-2/3" />
          <div className="absolute inset-0 bg-background/30 backdrop-blur-[30px]" />
        </div>

        <div className="relative z-10 h-full w-full max-w-6xl px-6 flex flex-col items-center">
          <h1 className="mb-8 mt-10 max-w-3xl capitalize font-display text-3xl font-semibold leading-tight">
            A complete range of processed glass.
          </h1>
          <div className="relative p-2 md:p-3 bg-[#E87732]/30 backdrop-blur-md border border-white/20 shadow-2xl mb-10 w-64 max-w-4xl mx-auto">
            <div className="p-1 rounded-sm">
              <img
                src="https://images.pexels.com/photos/30196145/pexels-photo-30196145.jpeg"
                alt="Glass Products"
                className="w-full h-[180px] sm:h-[220px] md:h-[300px] object-cover opacity-95"
              />
            </div>
          </div>
          <p className="mt-3 max-w-5xl capitalize font-display text-lg font-light text-balance">
            From structural facades to delicate decorative panels — all
            manufactured in Addis Ababa from Grade One float glass.
          </p>
        </div>
      </section>

      {/* ── Gallery Section ────────────────────────────────────────── */}
      <section className="bg-background pb-[600px] md:pb-[800px]">
        {/* Section header */}
        <div className="text-center pt-24 pb-16 px-6">
          <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-[#0A7C3F] mb-4">
            Our Products
          </span>
          <h2
            className="font-display font-light text-foreground leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            Crafted for every application
          </h2>
          <p className="mt-4 text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Nine product lines. Twenty-seven perspectives. Each piece engineered
            to specification.
          </p>
        </div>

        {/*
         * ── Gallery grid ─────────────────────────────────────────────
         */}
        <style>{`
          .product-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(12, auto);
            column-gap: 12px;
            row-gap: 60px;
            padding: 0 16px;
            align-items: start;
            overflow: visible;
          }
          .product-grid-item {
            grid-column: var(--col-mobile);
            grid-row: var(--row-mobile);
          }
          @media (min-width: 768px) {
            .product-grid {
              grid-template-columns: repeat(5, 1fr);
              grid-template-rows: repeat(8, auto);
              column-gap: 20px;
              row-gap: 130px;
              padding: 0 28px;
            }
            .product-grid-item {
              grid-column: var(--col-desktop);
              grid-row: var(--row-desktop);
            }
          }
        `}</style>
        <div className="product-grid">
          {GRID.map(({ cardIdx, col, row, colMobile, rowMobile }) => {
            const c = CARDS[cardIdx];
            return (
              <article
                key={cardIdx}
                className="product-grid-item"
                style={{
                  '--col-desktop': col,
                  '--row-desktop': row,
                  '--col-mobile': colMobile,
                  '--row-mobile': rowMobile,
                } as React.CSSProperties}
              >
                {/* Title above image */}
                <div className="gallery-text-wrapper" style={{ marginBottom: "9px" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "9px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color: "#208349",
                      lineHeight: 1,
                      willChange: "transform",
                    }}
                  >
                    {c.name}
                  </p>
                </div>

                {/* Image — portrait 3:4 */}
                <div style={{ overflow: "hidden", width: "100%" }}>
                  <img
                    crossOrigin="anonymous"
                    src={c.img}
                    alt={c.name}
                    loading="lazy"
                    className="gallery-img"
                    style={{
                      width: "100%",
                      aspectRatio: "3 / 4",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
                    }}
                  />
                </div>

                {/* Description below image */}
                <div className="gallery-text-wrapper" style={{ marginTop: "10px" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "11px",
                      color: "var(--color-muted-foreground)",
                      lineHeight: 1.75,
                      willChange: "transform",
                    }}
                  >
                    {c.desc}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
