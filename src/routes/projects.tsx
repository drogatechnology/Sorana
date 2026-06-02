import { useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ProjectsIndustriesSection } from "@/components/ProjectsIndustriesSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden w-full aspect-[3/2]">
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-[124%] object-cover will-change-transform"
        style={{ marginTop: "-12%" }}
      />
    </div>
  );
}

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects & Industries — Sorana Glass" },
      { name: "description", content: "Sorana Glass serves contractors, developers, hotels, hospitals, museums, car assembly companies and more across Ethiopia." },
      { property: "og:title", content: "Projects & Industries — Sorana Glass" },
      { property: "og:description", content: "Industries and project types served by Sorana Glass." },
    ],
  }),
  component: Projects,
});

const projectTypes = [
  {
    label: "High-rise Buildings",
    subtitle: "Curtain walls, structural glazing, facades",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Villas & Residential",
    subtitle: "Frameless showers, balustrades, skylights",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Hotels & Resorts",
    subtitle: "Lobby glazing, pool enclosures, partitions",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Hospitals",
    subtitle: "Safety glass, sterile partitions, windows",
    image: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Commercial Buildings",
    subtitle: "Storefronts, office glazing, entrances",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Museums",
    subtitle: "Display cases, UV protection, skylights",
    image: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Industrial Facilities",
    subtitle: "Bulletproof, safety & tempered glass",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Government Infrastructure",
    subtitle: "Security glazing, blast-resistant systems",
    image: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=800&q=80",
  },
];

function Projects() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "bottom bottom",
        end: () => "+=" + window.innerHeight,
        pin: contentRef.current,
        pinSpacing: true,
      });
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div ref={contentRef} className="relative bg-background">
        <section className="relative overflow-hidden py-16 flex flex-col items-center justify-center text-center">
          {/* Greenish/orangeish glassy background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#0A7C3F]/50 rounded-full blur-[80px] -translate-y-1/3 -translate-x-2/3" />
            <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#E87732]/40 rounded-full blur-[80px] translate-y-1/3 translate-x-2/3" />
            <div className="absolute inset-0 bg-background/30 backdrop-blur-[30px]" />
          </div>

          <div className="relative z-10 h-full w-full max-w-6xl px-6 flex flex-col items-center">
            <h1 className="mt-10 mb-8 max-w-3xl capitalize font-display text-3xl font-semibold leading-tight">
              Trusted across Ethiopia's most demanding sectors.
            </h1>

            <div className="relative p-2 md:p-3 bg-[#0A7C3F]/30 backdrop-blur-md border border-white/20 shadow-2xl mb-10 w-full max-w-5xl mx-auto">
              <div className="p-1 rounded-sm">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                  alt="Glass Projects" 
                  className="w-full aspect-[16/9] md:aspect-[42/9] object-cover opacity-95" 
                />
              </div>
            </div>

            <p className="mt-3 max-w-5xl capitalize font-display text-lg font-light text-balance">
              Sorana works alongside contractors, developers and manufacturers — delivering consistent quality on both large-scale and urgent projects.
            </p>
          </div>
        </section>

        <ProjectsIndustriesSection />

        <section className="relative overflow-hidden py-24">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A7C3F]/20 via-white to-[#E87732]/20" />
          
          {/* Green blur */}
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#0A7C3F]/25 blur-3xl" />

          {/* Orange blur */}
          <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#E87732]/25 blur-3xl" />

          {/* Soft glass haze */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />

          <div className="relative mx-auto max-w-[1400px] px-6">
            <h2 className="font-display text-3xl font-semibold text-[#10351f]">
              Project Types Delivered
            </h2>

            <div className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {projectTypes.map((p) => (
                <div
                  key={p.label}
                  className="group cursor-pointer"
                >
                  {/* Glass image container */}
                  <div className="overflow-hidden border border-white/20 bg-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-500 hover:bg-white/25 hover:shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                    <ParallaxImage src={p.image} alt={p.label} />
                  </div>

                  <div className="mt-4">
                    <p className="font-display text-base font-semibold leading-snug text-[#10351f]">
                      <span className="font-bold">{p.label}</span>

                      {p.subtitle && (
                        <span className="font-normal text-[#10351f]/70">
                          {" "}
                          — {p.subtitle}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}