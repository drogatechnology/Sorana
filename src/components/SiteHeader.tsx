import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logoImg from "@/assets/logo/Sorana-Logo.png";
import gsap from "gsap";

function AnimatedLink({
  to,
  onClick,
  children,
  className = "",
}: {
  to: any;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group relative overflow-hidden inline-flex items-center w-fit ${className}`}
    >
      <span className="transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-[110%]">
        {children}
      </span>
      <span className="absolute left-0 top-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] translate-y-[110%] group-hover:translate-y-0 text-white/70">
        {children}
      </span>
    </Link>
  );
}

// ─── Desktop Nav ─────────────────────────────────────────────────────────────

function DesktopNav({ pathname }: { pathname: string }) {
  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/products", label: "Products" },
    { to: "/projects", label: "Projects" },
    { to: "/services", label: "Services" },
    { to: "/gallery", label: "Gallery" },
  ];

  return (
    <header
      className="hidden md:flex fixed top-0 left-0 right-0 z-50 items-center justify-between px-8 h-16"
      style={{
        background:
          "linear-gradient(135deg, rgba(10, 124, 63, 0.50) 0%, rgba(10, 124, 63, 0.58) 25%, rgba(232, 119, 50, 0.58) 75%, rgba(232, 119, 50, 0.50) 100%)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        boxShadow: "0 4px 32px 0 rgba(0, 0, 0, 0.35)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.18)",
      }}
    >
      {/* Edge-softening glow */}
      <div
        className="absolute pointer-events-none inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 0% 50%, rgba(255,255,255,0.10) 0%, transparent 55%)",
          zIndex: 0,
        }}
      />

      {/* Logo — color, no invert */}
      <Link to="/" className="relative z-10 shrink-0">
        <img
          src={logoImg}
          alt="Sorana Glass Logo"
          className="h-7 w-auto object-contain"
        />
      </Link>

      {/* Links — absolutely centered */}
      <nav className="absolute left-1/2 -translate-x-1/2 z-10 flex items-center gap-8 text-white text-[11px] font-semibold tracking-[0.18em] uppercase">
        {links.map(({ to, label }) => {
          const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <AnimatedLink key={to} to={to} onClick={() => {}}>
              <span className={isActive ? "opacity-100" : "opacity-60 hover:opacity-100 transition-opacity"}>
                {label}
              </span>
            </AnimatedLink>
          );
        })}
      </nav>

      {/* CTA — orange on hover */}
      <Link
        to="/contact"
        className="relative z-10 shrink-0 px-5 py-2 text-white text-[10px] font-bold tracking-[0.18em] uppercase transition-all"
        style={{
          background: "rgba(10, 124, 63, 0.7)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(232, 119, 50, 0.9)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(10, 124, 63, 0.7)")}
      >
        Contact Us
      </Link>
    </header>
  );
}

// ─── Mobile Nav (capsule) ────────────────────────────────────────────────────

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<"top" | "bottom">("top");

  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;
  const isBottomRef = useRef(false);

  const capsuleRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const router = useRouterState();
  const pathname = router.location.pathname;

  let activeName = "HOME";
  if (pathname.includes("about")) activeName = "ABOUT";
  else if (pathname.includes("products")) activeName = "PRODUCTS";
  else if (pathname.includes("projects")) activeName = "PROJECTS";
  else if (pathname.includes("services")) activeName = "SERVICES";
  else if (pathname.includes("contact")) activeName = "CONTACT";
  else if (pathname.includes("gallery")) activeName = "GALLERY";

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("nav-open");
    } else {
      document.body.classList.remove("nav-open");
    }
    return () => document.body.classList.remove("nav-open");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || activeMode !== "top") return;
    const handleOutside = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleScroll = () => setIsOpen(false);
    document.addEventListener("pointerdown", handleOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, activeMode]);

  useEffect(() => {
    const handleBottomEnter = () => {
      isBottomRef.current = true;
      setActiveMode("bottom");
      setIsOpen(true);
    };
    const handleBottomLeave = () => {
      isBottomRef.current = false;
      setIsOpen(false);
      if (!isOpenRef.current) setActiveMode("top");
    };
    window.addEventListener("footer-bottom-enter", handleBottomEnter);
    window.addEventListener("footer-bottom-leave", handleBottomLeave);
    return () => {
      window.removeEventListener("footer-bottom-enter", handleBottomEnter);
      window.removeEventListener("footer-bottom-leave", handleBottomLeave);
    };
  }, []);

  useEffect(() => {
    if (!capsuleRef.current || !menuRef.current || !containerRef.current) return;

    gsap.set(menuRef.current, {
      height: 0,
      overflow: "hidden",
      y: -20,
      display: "none",
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.inOut", duration: 0.5 },
        onReverseComplete: () => {
          if (!isBottomRef.current) setActiveMode("top");
        },
      });

      tl.to(".closed-content", { opacity: 0, duration: 0.2 })
        .to(capsuleRef.current, { width: 48, duration: 0.4 }, "-=0.1")
        .to(".open-content", { opacity: 1, autoAlpha: 1, duration: 0.2 }, "-=0.2")
        .set(menuRef.current, { display: "block" }, "-=0.4")
        .to(menuRef.current, { height: "auto", y: 0, duration: 0.5 }, "-=0.3");

      tlRef.current = tl;
    }, containerRef);

    return () => ctx.revert();
  }, [activeMode]);

  useEffect(() => {
    if (tlRef.current) {
      if (isOpen) tlRef.current.play();
      else tlRef.current.reverse();
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
    setActiveMode("top");
    isBottomRef.current = false;
  }, [pathname]);

  const handleCapsuleClick = () => {
    if (activeMode === "bottom" && isOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsOpen(false);
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <>
      {/* Desktop nav */}
      <DesktopNav pathname={pathname} />

      {/* Mobile capsule nav */}
      <header
        id="site-header"
        ref={containerRef}
        className="md:hidden fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center w-[320px]"
        style={{ transition: "opacity 0.3s ease" }}
      >
        {/* DROPDOWN MENU */}
        <div
          ref={menuRef}
          className={`absolute left-0 w-full -z-10 ${
            activeMode === "bottom" ? "bottom-full mb-4" : "top-0 pt-[64px]"
          }`}
        >
          <div
            className="w-full rounded-none relative"
            style={{
              background:
                "linear-gradient(135deg, rgba(10, 124, 63, 0.45) 0%, rgba(232, 119, 50, 0.45) 100%)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
              borderTop: "1px solid rgba(255, 255, 255, 0.6)",
              borderLeft: "1px solid rgba(255, 255, 255, 0.4)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              borderRight: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Corner glows */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: 0, left: 0, width: "60%", height: "50%",
                background: "radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.22) 0%, transparent 70%)",
                zIndex: 1,
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                bottom: 0, right: 0, width: "50%", height: "40%",
                background: "radial-gradient(ellipse at 100% 100%, rgba(255,255,255,0.12) 0%, transparent 70%)",
                zIndex: 1,
              }}
            />

            <div className="p-8 flex flex-col gap-5 text-white justify-between relative z-10">
              {/* Nav links */}
              <div>
                <div className="text-[10px] font-bold tracking-[0.2em] mb-4 uppercase opacity-60">
                  Menu
                </div>
                <nav className="flex flex-col gap-3 text-[28px] leading-tight font-medium tracking-tight">
                  <AnimatedLink to="/" onClick={() => setIsOpen(false)}>
                    Home
                  </AnimatedLink>
                  <AnimatedLink to="/about" onClick={() => setIsOpen(false)}>
                    About
                  </AnimatedLink>
                  <AnimatedLink to="/products" onClick={() => setIsOpen(false)}>
                    Products
                  </AnimatedLink>
                  <AnimatedLink to="/projects" onClick={() => setIsOpen(false)}>
                    Projects
                  </AnimatedLink>
                  <AnimatedLink to="/services" onClick={() => setIsOpen(false)}>
                    Services
                  </AnimatedLink>
                  <AnimatedLink to="/gallery" onClick={() => setIsOpen(false)}>
                    Gallery
                  </AnimatedLink>
                </nav>
              </div>

              {/* Contact CTA */}
              <a
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="mt-4 w-full py-3 bg-[#0A7C3F]/80 text-white flex items-center justify-center gap-2 hover:bg-[#E87732] transition-colors rounded-none text-[10px] tracking-[0.2em] uppercase font-bold"
              >
                <span className="text-sm leading-none mb-[2px]">↳</span> CONTACT US
              </a>
            </div>
          </div>
        </div>

        {/* CAPSULE */}
        <div
          ref={capsuleRef}
          onClick={handleCapsuleClick}
          className="h-12 relative mx-auto cursor-pointer rounded-none z-20"
          style={{
            width: "100%",
            background:
              "linear-gradient(135deg, rgba(10, 124, 63, 0.45) 0%, rgba(232, 119, 50, 0.45) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
            borderTop: "1px solid rgba(255, 255, 255, 0.6)",
            borderLeft: "1px solid rgba(255, 255, 255, 0.4)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            className="absolute pointer-events-none"
            style={{
              top: 0, left: 0, width: "50%", height: "100%",
              background: "radial-gradient(ellipse at 0% 50%, rgba(255,255,255,0.28) 0%, transparent 65%)",
              zIndex: 1,
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: 0, right: 0, width: "40%", height: "100%",
              background: "radial-gradient(ellipse at 100% 50%, rgba(255,255,255,0.13) 0%, transparent 65%)",
              zIndex: 1,
            }}
          />

          {/* Closed State */}
          <div className="closed-content absolute inset-0 flex items-center justify-between px-4 w-full max-w-[320px]">
            <div className="flex items-center shrink-0">
              <img
                src={logoImg}
                alt="Sorana Glass Logo"
                className="h-6 w-auto object-contain brightness-0 invert"
              />
            </div>
            <div className="font-semibold tracking-[0.2em] text-[11px] text-white uppercase whitespace-nowrap overflow-hidden text-center mx-2">
              {activeName}
            </div>
            <div className="text-white hover:opacity-80 shrink-0 flex items-center">
              <Menu className="w-5 h-5" />
            </div>
          </div>

          {/* Open State */}
          <div className="open-content absolute inset-0 flex items-center justify-center opacity-0 invisible">
            <div className="text-white hover:opacity-80 flex items-center justify-center w-full h-full">
              {activeMode === "bottom" ? (
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20" className="w-5 h-5 text-white">
                  <path
                    d="M12 19V5M12 5L5 12M12 5L19 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <X className="w-5 h-5" />
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}