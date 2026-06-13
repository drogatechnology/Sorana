import { Link } from "@tanstack/react-router";
import aboutVideoSrc from "@/assets/video-about/220941_medium.mp4";

export function HomeAboutSection() {
  return (
    <section className="bg-white py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        <div className="w-full lg:w-1/2">
          <p className="text-[#0A7C3F] text-xs tracking-[0.3em] uppercase font-sans mb-4 font-bold">About Us</p>
          <h2 className="text-4xl md:text-6xl font-display text-[#111] leading-[1.1] tracking-tight mb-8">
            Leading the way in glass innovation.
          </h2>
          <p className="text-[#666662] font-sans leading-relaxed text-lg mb-8">
            Sorana Glass brings over 25 years of operational excellence to Ethiopia's architectural and automotive glass industry. Our commitment to precision, scale, and uncompromising quality sets the standard for modern construction.
          </p>
          <Link to="/about" className="inline-block border-b-2 border-[#111] text-[#111] font-sans font-bold text-sm uppercase tracking-widest pb-1 hover:text-[#0A7C3F] hover:border-[#0A7C3F] transition-colors">
            Our Story
          </Link>
        </div>
        <div className="w-full lg:w-1/2 overflow-hidden bg-gray-100">
           <video
              src={aboutVideoSrc}
              className="w-full h-auto aspect-[4/3] object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
        </div>
      </div>
    </section>
  );
}
