"use client";

import { useEffect, useRef } from "react";
import ThemedVisual from "@/components/shared/ThemedVisual";
import ServiceIcon from "@/components/shared/ServiceIcon";
import { GalleryItem } from "@/content/gallery-items";

interface LightboxProps {
  items: GalleryItem[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ items, activeIndex, onClose, onNavigate }: LightboxProps) {
  const touchStartX = useRef<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const item = items[activeIndex];

  useEffect(() => {
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") onNavigate((activeIndex + 1) % items.length);
      else if (event.key === "ArrowLeft") onNavigate((activeIndex - 1 + items.length) % items.length);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, items.length, onClose, onNavigate]);

  if (!item) return null;

  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    if (delta > 40) onNavigate((activeIndex - 1 + items.length) % items.length);
    else if (delta < -40) onNavigate((activeIndex + 1) % items.length);
    touchStartX.current = null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${item.caption} — image ${activeIndex + 1} of ${items.length}`}
      className="fixed inset-0 z-[80] flex flex-col bg-ink-950/97 backdrop-blur-sm"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <p className="text-sm font-medium text-white/70">
          {activeIndex + 1} / {items.length}
        </p>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/10"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 pb-6 sm:px-16">
        <button
          type="button"
          onClick={() => onNavigate((activeIndex - 1 + items.length) % items.length)}
          aria-label="Previous image"
          className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/10 sm:left-6"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M9.5 3.5 5 8l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div key={item.id} className="animate-fade-in w-full max-w-3xl">
          <ThemedVisual
            family={item.family}
            icon={item.icon}
            label={item.alt}
            photoSrc={item.photoSrc}
            photoAlt={item.photoAlt}
            className="aspect-[4/3] w-full rounded-xl"
            sizes="(min-width: 640px) 768px, 100vw"
          />
          <div className="mt-4 flex items-center gap-2 text-white/85">
            <ServiceIcon name={item.icon} className="h-4 w-4 shrink-0" />
            <p className="text-sm">{item.caption}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate((activeIndex + 1) % items.length)}
          aria-label="Next image"
          className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/10 sm:right-6"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6.5 3.5 11 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
