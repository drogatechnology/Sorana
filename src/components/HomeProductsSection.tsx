import { Link } from "@tanstack/react-router";

const HOME_PRODUCTS = [
  { name: "Tempered Glass", img: "https://images.pexels.com/photos/20677918/pexels-photo-20677918.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { name: "Laminated Glass", img: "https://images.unsplash.com/photo-1616385968568-7e9400871a40?q=80&w=735&auto=format&fit=crop" },
  { name: "Insulating Glass (IGU)", img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80" },
  { name: "Bullet-Resistant Glass", img: "https://images.pexels.com/photos/33530412/pexels-photo-33530412.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { name: "Printed Glass", img: "https://images.unsplash.com/photo-1614959541579-c01f9b605f79?w=900&q=75&auto=format&fit=crop" },
  { name: "Sandblasted Glass", img: "https://images.unsplash.com/photo-1570347809976-0a4abd0aa811?w=900&q=75&auto=format&fit=crop" },
  { name: "Installations", img: "https://images.pexels.com/photos/1407487/pexels-photo-1407487.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { name: "Glass hardware", img: "https://images.pexels.com/photos/905956/pexels-photo-905956.jpeg?auto=compress&cs=tinysrgb&w=900" }
];

export function HomeProductsSection() {
  return (
    <section className="bg-[#f7f7f5] py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <p className="text-[#0A7C3F] text-xs tracking-[0.3em] uppercase font-sans mb-4 font-bold">Products</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-[#111] tracking-tight mb-4">Our Glass Solutions</h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {HOME_PRODUCTS.map((prod, i) => (
          <div key={i} className="flex flex-col bg-white group cursor-pointer border border-[#111]/5 transition-all duration-500 hover:shadow-xl hover:border-[#111]/20">
             <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100">
               <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
             </div>
             <div className="py-6 px-6 flex justify-between items-center">
               <h3 className="font-sans font-bold text-[#111] tracking-wide text-lg">{prod.name}</h3>
               <div className="w-8 h-8 rounded-full bg-[#111]/5 flex items-center justify-center group-hover:bg-[#0A7C3F] group-hover:text-white transition-colors">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                 </svg>
               </div>
             </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 text-center">
         <Link to="/products" className="inline-block bg-[#111] text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-[#0A7C3F] transition-colors">
           View All Products
         </Link>
      </div>
    </section>
  );
}
