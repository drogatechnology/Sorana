import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { services } from "@/lib/site-data";
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

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 flex flex-col items-center justify-center text-center">
        {/* Glassy background blobs */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#E87732]/50 rounded-full blur-[80px] -translate-y-1/3 -translate-x-2/3" />
          <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#0A7C3F]/40 rounded-full blur-[80px] translate-y-1/3 translate-x-2/3" />
          <div className="absolute inset-0 bg-background/30 backdrop-blur-[30px]" />
        </div>

        <div className="relative z-10 h-full w-full max-w-6xl px-6 flex flex-col items-center">
          <h1 className="mb-8 mt-10 max-w-3xl capitalize font-display text-3xl font-semibold leading-tight">
            End-to-end glass solutions, under one roof.
          </h1>

          <div className="relative p-2 md:p-3 bg-[#E87732]/30 backdrop-blur-md border border-white/20 shadow-2xl mb-10 w-64 max-w-3xl mx-auto">
            <div className="p-1 rounded-sm">
              <img
                src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                alt="Glass Services"
                className="w-full aspect-[1/1] object-cover opacity-95"
              />
            </div>
          </div>

          <p className="mt-3 max-w-5xl capitalize font-display text-lg font-light text-balance">
            Sorana provides turnkey service — we import, process, deliver and install. One supplier,
            one accountable team, one quality standard.
          </p>
        </div>
      </section>

      {/* ── Scroll-driven capabilities: Processing · Installation · Custom Fabrication · Supply ── */}
      <ServiceCapabilitiesSection />

      {/* ── Service catalogue ───────────────────────────────────────── */}
      <ServiceCatalogueSection />

    </div>
  );
}
