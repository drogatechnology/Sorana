interface PageHeroSectionProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  titleAs?: "h1" | "p";
  imageClassName?: string;
  imageWrapperClassName?: string;
  className?: string;
}

export function PageHeroSection({
  imageSrc,
  imageAlt,
  title,
  description,
  titleAs = "h1",
  imageClassName = "w-full h-[180px] sm:h-[220px] md:h-[200px] object-cover",
  imageWrapperClassName = "w-full max-w-3xl mx-auto",
  className = "",
}: PageHeroSectionProps) {
  const TitleTag = titleAs;

  return (
    <section
      className={`relative overflow-hidden py-16 flex flex-col items-center justify-center text-center text-white ${className}`}
    >
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <img
          src={imageSrc}
          alt=""
          className="absolute inset-0 h-full w-full scale-[1.02] object-cover blur-[12px] brightness-[0.65]"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 h-full w-full max-w-6xl px-6 flex flex-col items-center">
        <TitleTag className="mt-10 mb-8 max-w-3xl capitalize font-display text-3xl font-semibold leading-tight text-white">
          {title}
        </TitleTag>

        <div
          className={`relative p-2 md:p-3 bg-white/10 backdrop-blur-md border border-white/25 shadow-2xl mb-10 ${imageWrapperClassName}`}
        >
          <div className="p-1 rounded-sm">
            <img src={imageSrc} alt={imageAlt} className={imageClassName} />
          </div>
        </div>

        <p className="mt-3 max-w-5xl capitalize font-display text-lg font-light text-balance text-white/90">
          {description}
        </p>
      </div>
    </section>
  );
}
