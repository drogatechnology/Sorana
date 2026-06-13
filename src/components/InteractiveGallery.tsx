import { useState } from 'react';

const galleryItems = [
  { src: "https://images.pexels.com/photos/33410957/pexels-photo-33410957.jpeg", caption: "Commercial Bank of Ethiopia HQ" },
  { src: "https://images.pexels.com/photos/11876277/pexels-photo-11876277.jpeg", caption: "Awash Bank Tower" },
  { src: "https://images.pexels.com/photos/1407487/pexels-photo-1407487.jpeg", caption: "African Union Conference Center" },
  { src: "https://images.pexels.com/photos/13025284/pexels-photo-13025284.jpeg", caption: "Bole International Airport" },
  { src: "https://images.pexels.com/photos/11299583/pexels-photo-11299583.jpeg", caption: "Skylight Hotel Addis Ababa" },
  { src: "https://images.pexels.com/photos/905956/pexels-photo-905956.jpeg", caption: "United Bank Headquarters" },
  { src: "https://images.pexels.com/photos/14479234/pexels-photo-14479234.jpeg", caption: "NIB International Bank HQ" },
];

export function InteractiveGallery() {
  return (
    <div className="bg-[#f7f7f5] min-h-screen text-[#111] pt-32 pb-24 px-6 md:px-12 w-full">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <span className="inline-block bg-[#0A7C3F]/10 text-[#0A7C3F] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-6">Our Projects</span>
            <h1 className="text-5xl md:text-7xl font-display font-normal text-[#111] tracking-tight">Photo Gallery</h1>
          </div>
          <p className="text-[#666662] max-w-sm text-sm md:text-base font-sans leading-relaxed text-left md:text-right">
            Captured moments from our finest architectural and automotive glass installations.
          </p>
        </div>

        {/* Masonry Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-4 auto-rows-min">
          {/* Row 1 */}
          <div className="md:col-span-2 h-[300px] md:h-[500px] rounded-none overflow-hidden relative cursor-pointer group">
            <img src={galleryItems[0].src} alt={galleryItems[0].caption} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:blur-sm" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex flex-col justify-end p-6 md:p-10">
              <p className="text-white font-display text-2xl md:text-4xl font-light opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                {galleryItems[0].caption}
              </p>
              <p className="text-white/80 font-sans text-xs md:text-sm uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 translate-y-4 group-hover:translate-y-0 mt-2">
                Addis Ababa, Ethiopia
              </p>
            </div>
          </div>
          <div className="md:col-span-1 h-[300px] md:h-[500px] rounded-none overflow-hidden relative cursor-pointer group">
            <img src={galleryItems[1].src} alt={galleryItems[1].caption} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:blur-sm" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex flex-col justify-end p-6 md:p-8">
              <p className="text-white font-display text-2xl font-light opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                {galleryItems[1].caption}
              </p>
              <p className="text-white/80 font-sans text-xs uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 translate-y-4 group-hover:translate-y-0 mt-2">
                Addis Ababa, Ethiopia
              </p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="md:col-span-1 h-[300px] md:h-[350px] rounded-none overflow-hidden relative cursor-pointer group">
            <img src={galleryItems[2].src} alt={galleryItems[2].caption} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:blur-sm" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex flex-col justify-end p-6">
              <p className="text-white font-display text-xl font-light opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                {galleryItems[2].caption}
              </p>
            </div>
          </div>
          <div className="md:col-span-1 h-[300px] md:h-[350px] rounded-none overflow-hidden relative cursor-pointer group">
            <img src={galleryItems[3].src} alt={galleryItems[3].caption} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:blur-sm" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex flex-col justify-end p-6">
              <p className="text-white font-display text-xl font-light opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                {galleryItems[3].caption}
              </p>
            </div>
          </div>
          <div className="md:col-span-1 h-[300px] md:h-[350px] rounded-none overflow-hidden relative cursor-pointer group">
            <img src={galleryItems[4].src} alt={galleryItems[4].caption} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:blur-sm" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex flex-col justify-end p-6">
              <p className="text-white font-display text-xl font-light opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                {galleryItems[4].caption}
              </p>
            </div>
          </div>

          {/* Row 3 */}
          <div className="md:col-span-1 h-[200px] md:h-[250px] rounded-none overflow-hidden relative cursor-pointer group">
            <img src={galleryItems[5].src} alt={galleryItems[5].caption} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:blur-sm" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex flex-col justify-end p-6">
              <p className="text-white font-display text-xl font-light opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                {galleryItems[5].caption}
              </p>
            </div>
          </div>
          <div className="md:col-span-2 h-[200px] md:h-[250px] rounded-none overflow-hidden relative cursor-pointer group">
            <img src={galleryItems[6].src} alt={galleryItems[6].caption} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:blur-sm" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex flex-col justify-end p-6 md:p-8">
              <p className="text-white font-display text-2xl font-light opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                {galleryItems[6].caption}
              </p>
              <p className="text-white/80 font-sans text-xs md:text-sm uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 translate-y-4 group-hover:translate-y-0 mt-2">
                Addis Ababa, Ethiopia
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}