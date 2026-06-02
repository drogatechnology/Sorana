import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@tanstack/react-router";
import { services } from "@/lib/site-data";
import { romanize } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
// ── Unsplash images per service (3 each) ───────────────────────────────────
const SERVICE_IMAGES: Record<string, string[]> = {
  "Glass Cutting": [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80&fit=crop",
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=700&q=80&fit=crop",
    "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=700&q=80&fit=crop",
  ],
  "Glass Drilling": [
    "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=700&q=80&fit=crop",
    "https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=700&q=80&fit=crop",
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=700&q=80&fit=crop",
  ],
  "Tempering": [
    "https://images.unsplash.com/photo-1626284255451-c5ff1d74e5d4?w=700&q=80&fit=crop",
    "https://images.unsplash.com/photo-1598514982205-f36b96d1e8dd?w=700&q=80&fit=crop",
    "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=700&q=80&fit=crop",
  ],
  "Lamination": [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80&fit=crop",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=700&q=80&fit=crop",
    "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=700&q=80&fit=crop",
  ],
  "Sandblasting & Frosting": [
    "https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=700&q=80&fit=crop",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=700&q=80&fit=crop",
    "https://images.unsplash.com/photo-1513147122760-ad1d5bf68cdb?w=700&q=80&fit=crop",
  ],
  "Digital Printing on Glass": [
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=700&q=80&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80&fit=crop",
    "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=700&q=80&fit=crop",
  ],
  "Bullet-Resistant Processing": [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=80&fit=crop",
    "https://images.unsplash.com/photo-1626284255451-c5ff1d74e5d4?w=700&q=80&fit=crop",
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=700&q=80&fit=crop",
  ],
  "Glass Installation": [
    "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=700&q=80&fit=crop",
    "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=700&q=80&fit=crop",
    "https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=700&q=80&fit=crop",
  ],
  "Hardware & Accessories Supply": [
    "https://images.unsplash.com/photo-1583248369069-9d91f1640fe6?w=700&q=80&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80&fit=crop",
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=700&q=80&fit=crop",
  ],
  "Custom Glass Fabrication": [
    "https://images.unsplash.com/photo-1558002038-1ad5c2eeef4e?w=700&q=80&fit=crop",
    "https://images.unsplash.com/photo-1626284255451-c5ff1d74e5d4?w=700&q=80&fit=crop",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=80&fit=crop",
  ],
};

export function ServicesSection() {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const boxRef        = useRef<HTMLDivElement>(null);
  const listRef       = useRef<HTMLUListElement>(null);

  const [activeService, setActiveService] = useState<string | null>(null);

  // ── Scroll-expand entry animation ─────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Box rises up from below as a smaller rectangle, then expands to full width
      // Removed opacity fading as requested
      gsap.fromTo(
        boxRef.current,
        {
          y: 200,
          width: "60%",
        },
        {
          y: 0,
          width: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            end: "top 20%",
            scrub: 1.2,
          },
        }
      );

      // Pin ServicesSection so IndustriesSection can overlay it
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "bottom bottom",
        end: () => `+=${window.innerHeight}`,
        pin: true,
        pinSpacing: false,
      });

      // Stagger list items fade-in
      gsap.fromTo(
        listRef.current ? Array.from(listRef.current.children) : [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleItemEnter = useCallback((service: string, el: HTMLLIElement) => {
    setActiveService(service);
    
    // Animate the inline images for this specific item
    const images = el.querySelectorAll('.svc-item-img');
    gsap.fromTo(images, 
      { x: -15, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: "power2.out", overwrite: true }
    );
  }, []);

  const handleItemLeave = useCallback((el: HTMLLIElement) => {
    setActiveService(null);
    
    // Animate out the inline images
    const images = el.querySelectorAll('.svc-item-img');
    gsap.to(images, {
      opacity: 0,
      x: -10,
      duration: 0.2,
      ease: "power2.in",
      overwrite: true
    });
  }, []);

  return (
    <div className="svc-pin-wrapper">
      <section
        ref={sectionRef}
        className="svc-section"
        aria-labelledby="svc-heading"
      >
      {/* ── Expanding box ──────────────────────────────────────────────────── */}
      <div ref={boxRef} className="svc-box">

        {/* ── Split Section Header ────────────────────────────────────────── */}
        <div className="svc-header-mcalpine">
          <h2 className="svc-title-left text-white">Services</h2>
          <div className="svc-header-img-wrapper">
             <img src="https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg" alt="Factory" className="svc-header-img" />
          </div>
          <h2 className="svc-title-right text-white">Catalogue</h2>
        </div>

        {/* ── Vertical centered service list ───────────────────────────────── */}
        <ul ref={listRef} className="svc-list">
          {(services as readonly string[]).map((service, i) => {
            const isActive = activeService === service;
            const isDimmed = activeService && activeService !== service;
            const itemImages = SERVICE_IMAGES[service] || ["", "", ""];

            return (
              <li
                key={service}
                className={`svc-item${isActive ? " is-active" : ""}${isDimmed ? " is-dimmed" : ""}`}
                onMouseEnter={(e) => handleItemEnter(service, e.currentTarget)}
                onMouseLeave={(e) => handleItemLeave(e.currentTarget)}
              >
                <Link to="/services" className="svc-item-link">
                  {/* Inline hover images (left side) */}
                  <div className="svc-item-images" aria-hidden="true">
                    {itemImages.map((src, idx) => (
                      <img
                        key={`${service}-img-${idx}`}
                        src={src}
                        alt=""
                        className="svc-item-img"
                      />
                    ))}
                  </div>

                  {/* Text and Numeral tightly coupled */}
                  <div className="svc-item-text-wrapper">
                    <span className="svc-item-name">{service}</span>
                    <sup className="svc-item-index">{romanize(i + 1)}</sup>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
    </div>
  );
}
