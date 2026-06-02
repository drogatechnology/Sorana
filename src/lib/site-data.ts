import tempered from "@/assets/tempered.jpg";
import laminated from "@/assets/laminated.jpg";
import shower from "@/assets/shower.jpg";
import partition from "@/assets/partition.jpg";
import auto from "@/assets/auto.jpg";
import skylight from "@/assets/skylight.jpg";

export const products = [
  { name: "Tempered Glass", image: tempered, desc: "Heat-treated safety glass, up to 5× stronger than annealed glass, fragments safely on impact." },
  { name: "Laminated Glass", image: laminated, desc: "Multi-layered glass bonded with PVB interlayers for security, sound and UV control." },
  { name: "Frameless Partitions", image: partition, desc: "Frosted and sandblasted partitions for offices, retail and residential spaces." },
  { name: "Shower Enclosures", image: shower, desc: "Custom frameless shower boxes designed and installed for luxury bathrooms." },
  { name: "Skylight & Double Glazing", image: skylight, desc: "Insulated and skylight glass solutions for energy-efficient architecture." },
  { name: "Auto Glass", image: auto, desc: "Windshield supply, replacement and processing for cars, buses and assembly lines." },
] as const;

export const services = [
  "Glass Cutting",
  "Glass Drilling",
  "Tempering",
  "Lamination",
  "Sandblasting & Frosting",
  "Digital Printing on Glass",
  "Bullet-Resistant Processing",
  "Glass Installation",
  "Hardware & Accessories Supply",
  "Custom Glass Fabrication",
] as const;

export const industries = [
  { name: "Real-Estate & Construction", desc: "High-rises, villas, hotels, hospitals and commercial buildings across Ethiopia." },
  { name: "Automotive Industry", desc: "OEM supply and replacement glass for car assembly lines and dealerships." },
  { name: "Government Infrastructure", desc: "Large-scale public projects, museums and institutional facilities." },
  { name: "Hospitality", desc: "Hotels, resorts and restaurants requiring premium custom glasswork." },
  { name: "Furniture Manufacturing", desc: "Made-to-spec glass tops, panels and decorative components." },
  { name: "Interior Designers", desc: "Frameless partitions, showers, mirrors and decorative glass." },
] as const;

export const stats = [
  { label: "Years of experience", value: "20+" },
  { label: "Tempering furnaces", value: "4" },
  { label: "Daily capacity", value: "2,000 m²" },
  { label: "Established", value: "2017" },
] as const;
