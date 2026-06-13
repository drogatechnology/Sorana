import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="relative bg-[#111] overflow-hidden pt-24 pb-8">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-70"
        >
          <source src="https://www.pexels.com/download/video/5091106/" type="video/mp4" />
        </video>

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center">
        {/* SORANA Title */}
        <div className="flex justify-center mb-16 w-full cursor-default select-none">
          {["S", "O", "R", "A", "N", "A"].map((letter, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(4rem, 15vw, 15rem)",
                lineHeight: 0.8,
                background:
                  "linear-gradient(130deg, rgba(10,124,63,0.85) 0%, rgba(232,119,50,0.85) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center text-sm font-sans text-white/60 pt-8 border-t border-white/10 gap-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <span>© {new Date().getFullYear()} Sorana Glass</span>

            <div className="flex items-center gap-4">
              {["Instagram", "LinkedIn", "YouTube"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="hover:text-white transition-colors duration-300"
            >
              Privacy Policy
            </Link>

            <Link
              to="/"
              className="hover:text-white transition-colors duration-300"
            >
              Terms & Conditions
            </Link>

            <span className="hidden lg:inline text-white/40">
              Crafted with precision
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}