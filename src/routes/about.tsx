import { useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Target, Eye, Sparkles } from "lucide-react";
import factoryImg from "@/assets/factory.jpg";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { StorySection } from "@/components/StorySection";
import { CoreValuesSection, LeafyBranchSVG } from "@/components/CoreValuesSection";
import { LeadershipSection } from "@/components/LeadershipSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Sorana Glass — 20+ Years of Glass Craftsmanship" },
      { name: "description", content: "Founded on automotive glass expertise and grown into one of Ethiopia's most advanced glass processors. Meet Sorana Glass." },
      { property: "og:title", content: "About Sorana Glass" },
      { property: "og:description", content: "20+ years of glass craftsmanship — from auto glass roots to a fully integrated processor in Addis Ababa." },
    ],
  }),
  component: About,
});

function About() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;
    
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "bottom bottom", // When the bottom of the wrapper hits the bottom of the viewport
        end: () => "+=" + window.innerHeight, // Pin it for the duration of 1 viewport height (for the footer reveal)
        pin: contentRef.current,
        pinSpacing: true, // Automatically adds the exact padding needed
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section className="relative overflow-hidden py-16 flex flex-col items-center justify-center text-center">
        {/* Greenish/orangeish glassy background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#0A7C3F]/50 rounded-full blur-[80px] -translate-y-1/3 -translate-x-2/3" />
          <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#E87732]/40 rounded-full blur-[80px] translate-y-1/3 translate-x-2/3" />
          <div className="absolute inset-0 bg-background/30 backdrop-blur-[30px]" />
        </div>

        <div className="relative z-10 h-full w-full max-w-6xl px-6 flex flex-col items-center">
          <p className="mt-10 mb-8 max-w-3xl capitalize font-display text-3xl font-semibold leading-tight">
            From auto glass roots to Ethiopia's most advanced processor.
          </p>

          <div className="relative p-2 md:p-3 bg-[#0A7C3F]/30 backdrop-blur-md border border-white/20 shadow-2xl mb-10 w-full max-w-3xl mx-auto">
            <div className="p-1 rounded-sm">
              <img 
                src="https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                alt="Sorana Glass Interior" 
                className="w-full h-[180px] sm:h-[220px] md:h-[200px] object-cover opacity-95" 
              />
            </div>
          </div>

          <p className="mt-3 max-w-5xl capitalize font-display text-lg font-light text-balance">
            Sorana Glass began with deep technical expertise in automotive glass and has grown into a fully integrated glass solutions provider — combining over 20 years of industry experience with modern production technology.
          </p>
        </div>
      </section>

      <StorySection />

      <div ref={wrapperRef} className="relative">
        <div ref={contentRef} className="relative overflow-hidden bg-surface min-h-screen">
          {/* Background Layer: Frosted Glass + Leafy SVGs */}
          <div className="absolute inset-0 z-0 bg-[#EFEFEA]">
            {/* Colorful gradient blobs */}
            <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#0A7C3F]/30 rounded-full blur-[100px] -translate-y-1/3 -translate-x-1/2" />
            <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#E87732]/20 rounded-full blur-[100px] translate-y-1/3 translate-x-1/2" />
            {/* Leafy SVGs */}
            <LeafyBranchSVG />
            {/* Heavy Frosted Glass Overlay */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[60px]" />
          </div>

          <CoreValuesSection />
          <LeadershipSection />
        </div>
      </div>
    </>
  );
}
