"use client";

import { useState } from "react";
import ThemedVisual from "@/components/shared/ThemedVisual";
import Lightbox from "./Lightbox";
import { galleryCategories, galleryItems, getGalleryItemsByCategory } from "@/content/gallery-items";

const aspectClass: Record<string, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
  wide: "aspect-[16/9]",
};

export default function GalleryMasonry() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const items = getGalleryItemsByCategory(activeCategory);
  // Lightbox navigates within the full set so Next/Prev never feels like it "runs out" mid-filter.
  const globalIndex = (id: string) => galleryItems.findIndex((item) => item.id === id);

  return (
    <div>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {galleryCategories.map((category) => {
          const isActive = category.id === activeCategory;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              aria-pressed={isActive}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive ? "bg-ink-900 text-white" : "bg-ink-50 text-ink-600 hover:bg-ink-100"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLightboxIndex(globalIndex(item.id))}
            className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl text-left"
            aria-label={`Open image: ${item.caption}`}
          >
            <ThemedVisual
              family={item.family}
              icon={item.icon}
              label={item.alt}
              photoSrc={item.photoSrc}
              photoAlt={item.photoAlt}
              className={`w-full ${aspectClass[item.aspect]}`}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
            <span className="mt-2 block text-sm text-ink-600 group-hover:text-ink-900">{item.caption}</span>
          </button>
        ))}
      </div>

      {lightboxIndex !== null ? (
        <Lightbox
          items={galleryItems}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      ) : null}
    </div>
  );
}
