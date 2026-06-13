import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Store, Truck, Calendar, ShieldCheck, Check } from "lucide-react";

export const Route = createFileRoute("/products_/$productId")({
  component: ProductDetails,
});

function ProductDetails() {
  const { productId } = Route.useParams();

  // Re-create the product name from slug for display
  const title = productId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const [activeImage, setActiveImage] = useState(0);
  const images = [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    "https://images.pexels.com/photos/11618522/pexels-photo-11618522.jpeg?auto=compress&w=800",
    "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80",
  ];

  const [selectedThickness, setSelectedThickness] = useState("8mm");
  const [selectedTint, setSelectedTint] = useState("Clear");

  return (
    <div className="bg-[#f8fafc] min-h-screen py-8 px-4 sm:px-6">
      {/* Breadcrumbs */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center text-sm text-gray-500 font-sans">
        <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-gray-900 transition-colors">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{title}</span>
      </div>

      <div className="max-w-6xl mx-auto bg-white shadow-sm border border-gray-100 p-6 lg:p-10 flex flex-col lg:flex-row gap-12">
        
        {/* Left Column - Images & Store Info */}
        <div className="w-full lg:w-[45%] flex flex-col gap-6">
          {/* Main Image */}
          <div className="w-full aspect-[4/5] bg-gray-50 overflow-hidden relative">
            <img 
              src={images[activeImage]} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Thumbnails */}
          <div className="grid grid-cols-3 gap-4">
            {images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-full aspect-square overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-[#0A7C3F]' : 'border-transparent hover:border-gray-200'}`}
              >
                <img src={img} alt={`${title} ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="w-full lg:w-[55%] flex flex-col">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-[#EB7F39]/10 text-[#EB7F39] border border-[#EB7F39]/20 text-[11px] font-bold uppercase tracking-wider rounded-full">
              Premium Material
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-sans font-medium text-gray-900 mb-6 leading-tight tracking-tight">
            Custom {title}
          </h1>

          <div className="text-3xl text-[#0A7C3F] font-medium mb-8 font-sans">
            Custom Pricing
          </div>

          {/* Variants */}
          <div className="flex flex-col gap-6 mb-8">
            {/* Tints */}
            <div>
              <div className="text-sm font-bold text-gray-900 mb-3">Available Tints</div>
              <div className="flex flex-wrap gap-2">
                {["Clear", "Bronze", "Grey", "Green"].map((tint) => (
                  <button
                    key={tint}
                    onClick={() => setSelectedTint(tint)}
                    className={`px-5 py-2 border text-sm font-medium transition-colors ${
                      selectedTint === tint 
                        ? 'border-[#0A7C3F] bg-[#0A7C3F]/5 text-[#0A7C3F]' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {tint}
                  </button>
                ))}
              </div>
            </div>

            {/* Thickness */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-bold text-gray-900">Available Thickness</span>
                <span className="text-xs text-[#EB7F39] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EB7F39]"></span> High Demand
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["4mm", "6mm", "8mm", "10mm", "12mm"].map((thick) => (
                  <button
                    key={thick}
                    onClick={() => setSelectedThickness(thick)}
                    className={`min-w-[60px] py-2 border  text-sm font-medium transition-colors flex items-center justify-center ${
                      selectedThickness === thick 
                        ? 'border-[#0A7C3F] bg-[#0A7C3F]/5 text-[#0A7C3F]' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {thick}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Description:</h3>
            <ul className="space-y-2 text-sm text-gray-600 list-none pl-0">
              <li className="flex gap-2"><span className="text-gray-400">•</span> Engineered for maximum safety, durability, and aesthetic appeal.</li>
              <li className="flex gap-2"><span className="text-gray-400">•</span> Custom cut to exact dimensions for perfect fitment in any application.</li>
              <li className="flex gap-2"><span className="text-gray-400">•</span> Ideal for both residential renovations and large-scale commercial projects.</li>
            </ul>
          </div>

         {/* Store / Brand Card */}
          <div className="mt-4 border border-gray-100 p-5 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-gray-700" />
                <span className="font-semibold text-gray-900">Sorana Glass</span>
                <ShieldCheck className="w-4 h-4 text-[#0A7C3F]" />
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Addis Ababa, Ethiopia</span>
              </div>
              <Link to="/contact" className="text-sm text-[#0A7C3F] border border-[#0A7C3F] px-4 py-1.5  font-medium hover:bg-[#0A7C3F]/10 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
