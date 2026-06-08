import { useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { PageHeroSection } from "@/components/PageHeroSection";
import { StorySection } from "@/components/StorySection";
import { CoreValuesSection, LeafyBranchSVG } from "@/components/CoreValuesSection";
import { LeadershipSection } from "@/components/LeadershipSection";
import { MilestonesSection } from "@/components/Milestonessection";

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
        id: "about-pin",
        trigger: wrapperRef.current,
        start: "bottom bottom",
        end: () => "+=" + window.innerHeight,
        pin: contentRef.current,
        pinSpacing: true,
        onUpdate: (self) => {
          window.dispatchEvent(
            new CustomEvent("pinned-footer-progress", { detail: { progress: self.progress } }),
          );
        },
        onEnter: () => {
          window.dispatchEvent(
            new CustomEvent("pinned-footer-progress", { detail: { progress: 0, visible: true } }),
          );
        },
        onEnterBack: () => {
          window.dispatchEvent(
            new CustomEvent("pinned-footer-progress", { detail: { progress: 0, visible: true, enterBack: true } }),
          );
        },
        onLeaveBack: () => {
          window.dispatchEvent(
            new CustomEvent("pinned-footer-progress", { detail: { progress: 0, visible: false } }),
          );
        },
        onLeave: () => {
          window.dispatchEvent(
            new CustomEvent("pinned-footer-progress", { detail: { progress: 1, visible: true, leave: true } }),
          );
        },
      });
      ScrollTrigger.refresh();
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <PageHeroSection
        imageSrc="https://images.pexels.com/photos/13946142/pexels-photo-13946142.jpeg"
        imageAlt="Sorana Glass Interior"
        title="From auto glass roots to Ethiopia's most advanced processor."
        description="Sorana Glass began with deep technical expertise in automotive glass and has grown into a fully integrated glass solutions provider — combining over 20 years of industry experience with modern production technology."
        titleAs="p"
      />

      {/* ─── Milestones ─── */}
      <MilestonesSection />

      <StorySection />

      <div ref={wrapperRef} id="about-footer-trigger" className="relative">
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