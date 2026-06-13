import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { stats } from "@/lib/site-data";
import { HeroSection } from "@/components/HeroSection";
import { HomeAboutSection } from "@/components/HomeAboutSection";
import { HomeProductsSection } from "@/components/HomeProductsSection";
import { ServicesSection } from "@/components/ServicesSection";
import { IndustriesSection } from "@/components/Industriessection";
import { WhyChooseUsSection } from "@/components/WhyChooseUsSection";
import { HomeSuggestionSection } from "@/components/HomeSuggestionSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sorana Glass — Advanced Glass Processing in Ethiopia" },
      { name: "description", content: "Tempered, laminated, architectural and automotive glass from Addis Ababa. 20+ years of expertise, 2,000 m²/day capacity." },
      { property: "og:title", content: "Sorana Glass — Advanced Glass Processing in Ethiopia" },
      { property: "og:description", content: "Tempered, laminated, architectural and automotive glass from Addis Ababa." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* ── Full-screen hero with diagonal image strips ─────────────────────── */}
      <HeroSection />

      {/* ── About Us ────────────────────────────────────────────────────── */}
      <HomeAboutSection />

      {/* ── Products ────────────────────────────────────────────────────── */}
      <HomeProductsSection />

      {/* ── Why Choose Us ────────────────────────────────────────────────────── */}
      <WhyChooseUsSection />

      {/* ── Services catalogue ───────────────────────────────────────────────── */}
      <ServicesSection />

      {/* ── Industries we serve (DuChateau-style scroll) ─────────────────────── */}
      <IndustriesSection />

      {/* ── Suggestion Box ─────────────────────────────────────────────────── */}
      <HomeSuggestionSection />
    </>
  );
}
