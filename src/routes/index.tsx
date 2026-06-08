import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { stats } from "@/lib/site-data";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { IndustriesSection } from "@/components/Industriessection";



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

      {/* ── Services catalogue ───────────────────────────────────────────────── */}
      <ServicesSection />

      {/* ── Industries we serve (DuChateau-style scroll) ─────────────────────── */}
      <IndustriesSection />

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      {/* <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="overflow-hidden rounded-3xl bg-gradient-hero p-10 text-primary-foreground shadow-elegant md:p-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-4xl font-bold leading-tight text-balance md:text-5xl">
                Have a project in mind?
              </h2>
              <p className="mt-4 max-w-md text-primary-foreground/80">
                Whether it's a single shower enclosure or a 10,000 m² facade, our team will quote,
                process and install — on time, to spec.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 md:justify-end">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:opacity-90"
              >
                Start a project <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:+251960323232"
                className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 px-6 py-3 text-sm font-semibold hover:bg-primary-foreground/10"
              >
                Call us
              </a>
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
}
