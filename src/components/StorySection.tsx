const PARAGRAPHS = [
  "With a rich history spanning over 25 years, Sorana builds on a long operational history that began under a sister company focused on auto glass services.",
  "That automotive heritage shaped a culture of precision. Building on decades of tempering expertise, we expanded into full-scale architectural processing — continually upgrading our 4 advanced tempering furnaces to meet growing national demand.",
  "Today the factory produces up to 2,000 m² per day and supplies contractors, real estate developers, car assembly companies, hotels, hospitals, museums and industrial facilities across the country.",
];

const IMAGE = "https://images.pexels.com/photos/13203179/pexels-photo-13203179.jpeg";

export function StorySection() {
  return (
    <section className="bg-white text-black">
      <div className="flex flex-col md:flex-row min-h-[80vh]">

        {/* Left: Text */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-10 md:px-16 lg:px-24 py-20 md:pr-12">
          <p className="text-[10px] uppercase tracking-[0.25em] text-black/40 font-medium mb-10">
            Our Story
          </p>
          <div className="flex flex-col gap-7">
            {PARAGRAPHS.map((text, i) => (
              <p key={i} className="text-base md:text-lg leading-relaxed text-black/75 font-light">
                {text}
              </p>
            ))}
          </div>
        </div>

        {/* Center divider */}
        <div className="hidden md:block w-px bg-black/10 self-stretch my-16" />

        {/* Right: Image */}
        <div className="w-full md:w-1/2 overflow-hidden min-h-[400px]">
          <img
            src={IMAGE}
            alt="Sorana factory"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </section>
  );
}