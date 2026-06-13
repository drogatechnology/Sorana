import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageHeroSection } from "@/components/PageHeroSection";

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
}

const CARDS: Card[] = [
  { name: "Tempered Glass", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80" },
  { name: "Tempered Glass", img: "https://images.pexels.com/photos/11618522/pexels-photo-11618522.jpeg?auto=compress&w=600" },
  { name: "Tempered Glass", img: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=600&q=80" },
  { name: "Laminated Glass", img: "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=600&q=80" },
  { name: "Laminated Glass", img: "https://images.pexels.com/photos/1190902/pexels-photo-1190902.jpeg?auto=compress&w=600" },
  { name: "Laminated Glass", img: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=600&q=80" },
  { name: "Frameless Partitions", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80" },
  { name: "Frameless Partitions", img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80" },
  { name: "Frameless Partitions", img: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=600&q=80" },
  { name: "Shower Enclosures", img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&q=80" },
  { name: "Shower Enclosures", img: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80" },
  { name: "Shower Enclosures", img: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=600&q=80" },
  { name: "Skylight & Double Glazing", img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80" },
  { name: "Skylight & Double Glazing", img: "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=600&q=80" },
  { name: "Skylight & Double Glazing", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=600&q=80" },
  { name: "Auto Glass", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80" },
  { name: "Auto Glass", img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80" },
  { name: "Auto Glass", img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=600&q=80" },
  { name: "Printed Glass", img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80" },
  { name: "Printed Glass", img: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=600&q=80" },
  { name: "Printed Glass", img: "https://images.pexels.com/photos/12472486/pexels-photo-12472486.jpeg?auto=compress&w=600" },
  { name: "Sandblasted Glass", img: "https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?auto=format&fit=crop&w=600&q=80" },
  { name: "Sandblasted Glass", img: "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=600&q=80" },
  { name: "Sandblasted Glass", img: "https://images.pexels.com/photos/16775661/pexels-photo-16775661.jpeg?auto=compress&w=600" },
  { name: "Bullet-Resistant Glass", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80" },
  { name: "Bullet-Resistant Glass", img: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80" },
  { name: "Bullet-Resistant Glass", img: "https://images.pexels.com/photos/33530414/pexels-photo-33530414.jpeg?auto=compress&w=600" },
];

const CATEGORIES = ["All", ...Array.from(new Set(CARDS.map((c) => c.name)))];

function Products() {
  const [filter, setFilter] = useState<string>("All");

  const filteredCards = useMemo(() => {
    const list = filter === "All" ? CARDS : CARDS.filter((c) => c.name === filter);
    return [...list].sort(() => Math.random() - 0.5);
  }, [filter]);

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      {/* ── Hero Section ── */}
      <PageHeroSection
        imageSrc="https://images.pexels.com/photos/17680665/pexels-photo-17680665.jpeg"
        imageAlt="Glass Products"
        title="A complete range of processed glass."
        description="From structural facades to delicate decorative panels — all manufactured in Addis Ababa from Grade One float glass."
        imageClassName="w-full h-[180px] sm:h-[220px] md:h-[300px] object-cover"
        imageWrapperClassName="w-64 max-w-4xl mx-auto"
        className="z-10 bg-[#032111]"
      />

      <div className="text-center pt-24 pb-6 px-6">
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

      {/* ── Breadcrumbs ── */}
      <div className="bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center text-xs font-sans text-gray-400 tracking-wide">
          <Link to="/" className="hover:text-gray-800 transition-colors">home</Link>
          <span className="mx-2">/</span>
          <span className="hover:text-gray-800 transition-colors cursor-pointer">Products&Solutions</span>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Products</span>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12 items-start">

        {/* ── Filter Sidebar ── */}
        <aside className="w-full lg:w-64 flex-shrink-0 bg-white border border-gray-200 lg:sticky lg:top-24">
          <div className="grid grid-cols-2 lg:grid-cols-1">
            {CATEGORIES.map((cat) => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`flex items-center justify-between px-4 py-3 lg:px-5 lg:py-4 text-sm font-sans text-left transition-all
                    border-b border-gray-100 last:border-b-0
                    ${active
                      ? "bg-[#0A7C3F]/10 text-[#0A7C3F] font-semibold border-t-2 border-t-[#0A7C3F] lg:border-t-0 lg:border-l-4 lg:border-l-[#0A7C3F]"
                      : "bg-white text-gray-600 hover:bg-gray-50 font-medium border-t-2 border-t-transparent lg:border-t-0 lg:border-l-4 lg:border-l-transparent"
                    }
                  `}
                >
                  <span className="truncate">{cat}</span>
                  {active ? (
                    <ArrowUpRight className="w-4 h-4 text-[#0A7C3F] opacity-70 flex-shrink-0 ml-1" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0 ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── Product Grid ── */}
        <div className="flex-1 flex flex-col w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full">
            {filteredCards.map((c, idx) => {
              const slug = c.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
              return (
                <Link
                  to="/products/$productId"
                  params={{ productId: slug }}
                  key={`${c.name}-${idx}`}
                  className="flex flex-col bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-full aspect-[4/3] overflow-hidden relative bg-[#f4f7f9] flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-[#e8f1f5] opacity-50"></div>
                    <img
                      src={c.img}
                      alt={c.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10"
                    />
                  </div>
                  <div className="py-4 px-3 md:py-6 md:px-4 text-center bg-white flex-1 flex items-center justify-center">
                    <h3 className="font-sans font-bold text-gray-900 tracking-wide text-[13px] md:text-[15px]">{c.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}