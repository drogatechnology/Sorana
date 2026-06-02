import { createFileRoute } from "@tanstack/react-router";
import { InteractiveGallery } from "@/components/InteractiveGallery";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Sorana Glass" },
      { name: "description", content: "A selection of Sorana glass projects." },
      { property: "og:title", content: "Sorana Glass — Project Gallery" },
      { property: "og:description", content: "Interactive visual gallery of our projects." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return <InteractiveGallery />;
}
