export function WhyChooseUsSection() {
  const stats = [
    { label: "Projects Completed", value: "200+" },
    { label: "Years Experience", value: "20+" },
    { label: "Daily Capacity", value: "2,000 m²" },
    { label: "Tempering Furnaces", value: "4" },
    { label: "Employees", value: "150+" },
    { label: "Installation", value: "Nationwide" },
  ];

  return (
    <section className="bg-surface py-24 px-6 md:px-16 border-y border-black/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-start">
        <div className="w-full md:w-1/3">
          <p className="text-accent text-[10px] tracking-[0.32em] uppercase font-sans mb-4 font-semibold">Our Impact</p>
          <h2 className="text-4xl md:text-5xl font-display text-primary leading-tight mb-6">Why Contractors Choose Sorana</h2>
          <p className="text-primary/70 font-sans leading-relaxed text-sm md:text-base">
            With decades of hands-on expertise and a state-of-the-art facility, we deliver unmatched scale, precision, and reliability for architectural glass projects across Ethiopia.
          </p>
        </div>
        
        <div className="w-full md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col border-t border-black/10 pt-6">
              <span className="text-4xl md:text-5xl font-display text-accent mb-2">{stat.value}</span>
              <span className="text-sm font-sans text-primary font-medium tracking-wide uppercase">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
