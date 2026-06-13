import React, { useState } from "react";
import { Award, ShieldCheck, HeartHandshake, Zap, Users } from "lucide-react";

const VALUES = [
  {
    id: "01",
    title: "Quality",
    icon: Award,
    image: "https://images.pexels.com/photos/9729590/pexels-photo-9729590.jpeg",
    layout: "text-img", // Icon -> Text -> Image -> Num
    colorA: "text-[#E87732]", // Orangeish
    colorN: "text-[#0A7C3F]",
  },
  {
    id: "02",
    title: "Reliability",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    layout: "img-text", // Icon -> Image -> Text -> Num
    colorA: "text-[#0A7C3F]", // Greenish
    colorN: "text-[#E87732]",
  },
  {
    id: "03",
    title: "Responsibility",
    icon: HeartHandshake,
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80",
    layout: "text-num-img", // Icon -> Text -> Num -> Image
    colorA: "text-[#E87732]", // Orangeish
    colorN: "text-[#0A7C3F]",
  },
  {
    id: "04",
    title: "Efficiency",
    icon: Zap,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    layout: "img-icon-text", // Image -> Icon -> Text -> Num
    colorA: "text-[#0A7C3F]", // Greenish
    colorN: "text-[#E87732]",
  },
  {
    id: "05",
    title: "Customer Focus",
    icon: Users,
    image: "https://images.pexels.com/photos/7689767/pexels-photo-7689767.jpeg",
    layout: "text-img", // Icon -> Text -> Image -> Num
    colorA: "text-[#0A7C3F]", // Greenish
    colorN: "text-[#E87732]",
  },
];

function CoreValueCard({ val }: { val: typeof VALUES[0] }) {
  const Icon = val.icon;
  const [isActive, setIsActive] = useState(false);

  return (
    <div 
      className="group flex flex-nowrap items-center justify-center gap-2 sm:gap-4 md:gap-6 cursor-pointer w-full max-w-full overflow-hidden"
      onClick={() => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
          setIsActive(!isActive);
        }
      }}
    >
      {/* LAYOUT 1: Icon -> Text -> Image -> Num */}
      {val.layout === "text-img" && (
        <>
          <Icon className={`w-6 h-6 sm:w-8 sm:h-8 md:w-8 md:h-8 shrink-0 ${val.colorA} transition-transform md:group-hover:scale-110 ${isActive ? 'scale-110' : ''}`} strokeWidth={2} />
          <h3 className="font-display text-3xl sm:text-4xl md:text-6xl font-medium tracking-tight text-foreground whitespace-nowrap">
            {val.title}
          </h3>
          <div className={`shrink-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-xl h-14 sm:h-20 md:h-24 ${isActive ? 'w-24 sm:w-32' : 'w-12 sm:w-16 md:w-20'} md:group-hover:w-40`}>
            <img src={val.image} alt={val.title} className={`w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-100 ${isActive ? 'scale-100' : 'scale-110'}`} />
          </div>
          <span className={`font-display text-2xl sm:text-3xl md:text-5xl font-light ${val.colorN} opacity-80 whitespace-nowrap`}>
            ({val.id})
          </span>
        </>
      )}

      {/* LAYOUT 2: Icon -> Image -> Text -> Num */}
      {val.layout === "img-text" && (
        <>
          <Icon className={`w-6 h-6 sm:w-8 sm:h-8 md:w-8 md:h-8 shrink-0 ${val.colorA} transition-transform md:group-hover:scale-110 ${isActive ? 'scale-110' : ''}`} strokeWidth={2} />
          <div className={`shrink-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-xl h-14 sm:h-20 md:h-24 ${isActive ? 'w-24 sm:w-32' : 'w-12 sm:w-16 md:w-20'} md:group-hover:w-40`}>
            <img src={val.image} alt={val.title} className={`w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-100 ${isActive ? 'scale-100' : 'scale-110'}`} />
          </div>
          <h3 className="font-display text-3xl sm:text-4xl md:text-6xl font-medium tracking-tight text-foreground whitespace-nowrap">
            {val.title}
          </h3>
          <span className={`font-display text-2xl sm:text-3xl md:text-5xl font-light ${val.colorN} opacity-80 whitespace-nowrap`}>
            ({val.id})
          </span>
        </>
      )}

      {/* LAYOUT 3: Icon -> Text -> Num -> Image */}
      {val.layout === "text-num-img" && (
        <>
          <Icon className={`w-6 h-6 sm:w-8 sm:h-8 md:w-8 md:h-8 shrink-0 ${val.colorA} transition-transform md:group-hover:scale-110 ${isActive ? 'scale-110' : ''}`} strokeWidth={2} />
          <h3 className="font-display text-3xl sm:text-4xl md:text-6xl font-medium tracking-tight text-foreground whitespace-nowrap">
            {val.title}
          </h3>
          <span className={`font-display text-2xl sm:text-3xl md:text-5xl font-light ${val.colorN} opacity-80 whitespace-nowrap`}>
            ({val.id})
          </span>
          <div className={`shrink-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-xl h-14 sm:h-20 md:h-24 ${isActive ? 'w-24 sm:w-32' : 'w-12 sm:w-16 md:w-20'} md:group-hover:w-40`}>
            <img src={val.image} alt={val.title} className={`w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-100 ${isActive ? 'scale-100' : 'scale-110'}`} />
          </div>
        </>
      )}

      {/* LAYOUT 4: Image -> Icon -> Text -> Num */}
      {val.layout === "img-icon-text" && (
        <>
          <div className={`shrink-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-xl h-14 sm:h-20 md:h-24 ${isActive ? 'w-24 sm:w-32' : 'w-12 sm:w-16 md:w-20'} md:group-hover:w-40`}>
            <img src={val.image} alt={val.title} className={`w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-100 ${isActive ? 'scale-100' : 'scale-110'}`} />
          </div>
          <Icon className={`w-6 h-6 sm:w-8 sm:h-8 md:w-8 md:h-8 shrink-0 ${val.colorA} transition-transform md:group-hover:scale-110 ${isActive ? 'scale-110' : ''}`} strokeWidth={2} />
          <h3 className="font-display text-3xl sm:text-4xl md:text-6xl font-medium tracking-tight text-foreground whitespace-nowrap">
            {val.title}
          </h3>
          <span className={`font-display text-2xl sm:text-3xl md:text-5xl font-light ${val.colorN} opacity-80 whitespace-nowrap`}>
            ({val.id})
          </span>
        </>
      )}

    </div>
  );
}

export function CoreValuesSection() {
  return (
    <section
      className="relative flex flex-col items-center justify-center pt-32 pb-16 bg-white"
      style={{ background: "#ffffff" }}
    >
      <div className="relative z-10 w-full max-w-4xl px-6">
        <h2 className="text-center font-display text-lg tracking-[0.2em] uppercase font-semibold text-black mb-24">
          Our Core Values
        </h2>

        <div className="flex flex-col items-center justify-center gap-12 md:gap-16">
          {VALUES.map((val) => (
            <CoreValueCard key={val.id} val={val} />
          ))}
        </div>
      </div>
    </section>
  );
}
