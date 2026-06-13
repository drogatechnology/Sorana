import { useRef, useEffect, useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Sorana Glass" },
      { name: "description", content: "Get in touch with Sorana Glass. Nifas Silk Lafto, Addis Ababa. +251 960 323 232." },
      { property: "og:title", content: "Contact Sorana Glass" },
      { property: "og:description", content: "Talk to our team about your glass project." },
    ],
  }),
  component: Contact,
});

const PANELS = [
  {
    id: "visit",
    label: "Visit Us",
    Icon: MapPin,
    body: ["Nifas Silk Lafto Sub-City", "Wereda 12, Addis Ababa"],
    image: "",
    isMap: true,
  },
  {
    id: "call",
    label: "Call Us",
    Icon: Phone,
    body: ["+251 960 323 232", "+251 955 323 232"],
    image: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=1400&q=85&fit=crop",
    isMap: false,
  },
  {
    id: "email",
    label: "Email",
    Icon: Mail,
    body: ["info@soranaglass.com", "sales@soranaglass.com"],
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1400&q=85&fit=crop",
    isMap: false,
  },
  {
    id: "hours",
    label: "Hours",
    Icon: Clock,
    body: ["Mon – Sat: 8:30 – 18:00", "Sunday: Closed"],
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=85&fit=crop",
    isMap: false,
  },
];

const N = PANELS.length;
const INTERVAL_MS = 3500;
const INTRO_SPEED_MS = 400;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function ExpandPanel({
  panelIndex,
  prevIndex,
  animating,
  isInteractingMap,
}: {
  panelIndex: number;
  prevIndex: number;
  animating: boolean;
  isInteractingMap?: boolean;
}) {
  const [progress, setProgress] = useState(animating ? 0 : 1);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!animating) {
      setProgress(1);
      return;
    }
    setProgress(0);
    startRef.current = performance.now();
    const duration = INTRO_SPEED_MS;

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const raw = Math.min(1, elapsed / duration);
      setProgress(easeInOut(raw));
      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animating, panelIndex]);

  const v = 1 - progress;
  const newClip = `inset(${v * 50}% ${v * 25}% ${v * 50}% ${v * 75}%)`;
  const oldVisible = prevIndex !== panelIndex;

  return (
    <div className="absolute inset-0">
      {/* Previous panel stays fully visible underneath */}
      {oldVisible && (
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <PanelContent panel={PANELS[prevIndex]} isInteractingMap={false} />
        </div>
      )}
      {/* New panel expands from center of right side */}
      <div
        className="absolute inset-0 will-change-[clip-path]"
        style={{
          zIndex: 2,
          clipPath: newClip,
          transform: "translateZ(0)",
        }}
      >
        <PanelContent panel={PANELS[panelIndex]} isInteractingMap={isInteractingMap} />
      </div>
    </div>
  );
}

function PanelContent({ panel, isInteractingMap = false }: { panel: (typeof PANELS)[number], isInteractingMap?: boolean }) {
  if (panel.isMap) {
    return (
      <div className="absolute inset-0">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941.0!2d38.7578!3d8.9806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85e9a37e08b5%3A0x4f5f0c5d42f55e70!2sNifas%20Silk%20Lafto%2C%20Addis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2set!4v1700000000000!5m2!1sen!2set"
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Sorana Glass Location"
        />
        {/* Dark overlay so the text is readable */}
        <div className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${isInteractingMap ? 'bg-black/0' : 'bg-black/50'}`} />
      </div>
    );
  }
  return (
    <div className="absolute inset-0">
      <img
        src={panel.image}
        alt={panel.label}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />
    </div>
  );
}

function Contact() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [sent, setSent] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const [isInteractingMap, setIsInteractingMap] = useState(false);
  const introRef = useRef(false);

  useEffect(() => {
    const handleBlur = () => {
      setTimeout(() => {
        if (document.activeElement?.tagName === "IFRAME") {
          setIsInteractingMap(true);
        }
      }, 0);
    };
    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, []);

  // When we exit map mode, remove focus from the iframe so the next click registers as a new blur event
  useEffect(() => {
    if (!isInteractingMap) {
      if (document.activeElement?.tagName === "IFRAME") {
        (document.activeElement as HTMLElement).blur();
      }
      window.focus();
    }
  }, [isInteractingMap]);

  const goTo = useCallback((next: number, instant = false) => {
    setIsInteractingMap(false);
    setAnimating(false);
    requestAnimationFrame(() => {
      setPrevIndex((cur) => cur);
      setActiveIndex((cur) => {
        setPrevIndex(cur);
        return next;
      });
      setAnimating(!instant);
    });
  }, []);

  // Intro flash: quickly cycle through all panels, then start normal rotation
  useEffect(() => {
    if (introRef.current) return;
    introRef.current = true;

    let step = 0;
    const flashSpeed = 300;

    const flashNext = () => {
      step++;
      if (step < N) {
        goTo(step, false);
        setTimeout(flashNext, flashSpeed);
      } else {
        // Wrap back and signal intro is finished
        goTo(0, true);
        setTimeout(() => setIntroFinished(true), 600);
      }
    };

    setTimeout(flashNext, flashSpeed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!introFinished || isHovered || isInteractingMap) return;
    
    const t = setInterval(() => {
      if (window.innerWidth < 768) return; // Disable auto-rotation on mobile

      setActiveIndex((cur) => {
        const next = (cur + 1) % N;
        setPrevIndex(cur);
        setAnimating(true);
        return next;
      });
    }, INTERVAL_MS);
    
    return () => clearInterval(t);
  }, [introFinished, isHovered]);

  const handleTabClick = (i: number) => {
    if (i === activeIndex) return;
    setIsInteractingMap(false);
    setPrevIndex(activeIndex);
    setActiveIndex(i);
    setAnimating(true);
  };

  const active = PANELS[activeIndex];

  return (
    <div 
      className="min-h-screen md:h-screen w-full flex flex-col md:flex-row overflow-visible md:overflow-hidden bg-[#071a0e]"
      onMouseLeave={() => setIsHovered(false)}
    >

      {/* ── LEFT: Animated image panels (Bottom on mobile) ───────────────────────── */}
      <div
        className="relative w-full h-[60vh] md:h-full md:w-1/2 flex-shrink-0 overflow-hidden order-2 md:order-1"
        onMouseEnter={() => setIsHovered(true)}
      >
        <ExpandPanel
          panelIndex={activeIndex}
          prevIndex={prevIndex}
          animating={animating}
          isInteractingMap={isInteractingMap}
        />

        {/* Exit map mode button */}
        <div className={`absolute top-6 right-6 z-20 transition-opacity duration-500 ${active.isMap && isInteractingMap ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <button
            onClick={() => setIsInteractingMap(false)}
            className="bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md hover:bg-black/70 transition-colors shadow-lg"
          >
            Exit Map
          </button>
        </div>

        {/* Center info overlay */}
        <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center p-8 pointer-events-none text-center transition-all duration-500 ${active.isMap && isInteractingMap ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          
          {/* Active panel info */}
          <div className="transition-all duration-500 mb-8">
            <p className="text-white/70 text-sm uppercase tracking-widest mb-3 font-semibold">
              {active.label}
            </p>
            {active.body.map((line, i) => (
              <p key={i} className="text-white text-2xl md:text-3xl font-display font-light leading-snug drop-shadow-lg">
                {line}
              </p>
            ))}
          </div>
          
          {/* Tab buttons */}
          <div className={`flex gap-4 ${active.isMap && isInteractingMap ? 'pointer-events-none' : 'pointer-events-auto'}`}>
            {PANELS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => handleTabClick(i)}
                className={`flex items-center justify-center w-12 h-12 transition-all duration-300 ${
                  i === activeIndex
                    ? "bg-[#E87732] text-white shadow-[0_0_20px_rgba(232,119,50,0.5)] scale-110"
                    : "bg-black/40 text-[#E87732] border border-[#E87732]/30 hover:bg-[#E87732]/20 backdrop-blur-sm"
                }`}
                title={p.label}
              >
                <p.Icon className="w-5 h-5" />
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* ── RIGHT: Contact form (Top on mobile) ────────────────────────────────── */}
      <div
        className="relative w-full min-h-[60vh] md:h-full md:w-1/2 flex-shrink-0 flex flex-col justify-center order-1 md:order-2 pt-28 pb-12 md:py-0"
        style={{ background: "linear-gradient(160deg, #0A7C3F 0%, #064E26 100%)" }}
        onMouseEnter={() => {
          setIsHovered(false);
          setIsInteractingMap(false);
        }}
        onPointerDown={() => setIsInteractingMap(false)}
      >
        {/* Subtle grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "160px",
          }}
        />

        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#E87732]/20 blur-[80px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/10 blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 px-8 lg:px-12 xl:px-20">
          {/* Header */}
          <h1 className="font-display text-3xl xl:text-4xl font-semibold text-white leading-tight mb-5 xl:mb-6">
            Let's Talk About <br />Your Project.
          </h1>

          {/* Form */}
          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3 xl:gap-4">
              <ContactField label="Full name" name="name" required />
              <ContactField label="Company" name="company" />
              <ContactField label="Email" name="email" type="email" required />
              <ContactField label="Phone" name="phone" type="tel" />
            </div>
            <ContactField
              label="Project type"
              name="project"
              placeholder="Facade, partition, shower, auto glass…"
            />
            <div>
              <label className="block text-[10px] xl:text-xs font-semibold text-white/60 uppercase tracking-widest mb-1.5">
                Message
              </label>
              <textarea
                name="message"
                rows={4}
                required
                className="w-full border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white focus:bg-white/15 transition-colors resize-none shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 text-sm font-semibold transition-all duration-300 mt-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              style={{
                background: sent
                  ? "rgba(255,255,255,0.2)"
                  : "#E87732",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {sent ? "✓ Thanks — we'll be in touch soon" : "Send enquiry"}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}

function ContactField({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] xl:text-xs font-semibold text-white/60 uppercase tracking-widest mb-1.5">
        {label}{required && <span className="text-[#E87732] ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white focus:bg-white/15 transition-colors shadow-sm"
      />
    </div>
  );
}
