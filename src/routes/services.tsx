import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { services } from "@/lib/site-data";
import { PageHeroSection } from "@/components/PageHeroSection";
import { ServiceCapabilitiesSection } from "@/components/ServiceCapabilitiesSection";
import { ServiceCatalogueSection } from "@/components/ServiceCatalogueSection";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Sorana Glass" },
      { name: "description", content: "Cutting, drilling, tempering, lamination, sandblasting, printing, installation and full custom glass fabrication." },
      { property: "og:title", content: "Glass Services — Sorana Glass" },
      { property: "og:description", content: "End-to-end glass processing services in Addis Ababa." },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <div className="relative">

      <PageHeroSection
        imageSrc="https://images.pexels.com/photos/7519280/pexels-photo-7519280.jpeg"
        imageAlt="Glass Services"
        title="End-to-end glass solutions, under one roof."
        description="Sorana provides turnkey service — we import, process, deliver and install. One supplier, one accountable team, one quality standard."
        imageClassName="w-full aspect-[1/1] object-cover"
        imageWrapperClassName="w-64 max-w-3xl mx-auto"
      />

      {/* ── Scroll-driven capabilities: Processing · Installation · Custom Fabrication · Supply ── */}
      <ServiceCapabilitiesSection />

      {/* ── Service catalogue ───────────────────────────────────────── */}
      <ServiceCatalogueSection />

    </div>
  );
}
