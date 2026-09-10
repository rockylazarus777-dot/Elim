import { IconKey, ServiceFamily } from "@/types/content";

export interface GalleryCategory {
  id: string;
  label: string;
}

export interface GalleryItem {
  id: string;
  categoryId: string;
  caption: string;
  alt: string;
  family: ServiceFamily;
  icon: IconKey;
  aspect: "portrait" | "landscape" | "square" | "wide";
  photoSrc?: string;
  photoAlt?: string;
}

export const galleryCategories: GalleryCategory[] = [
  { id: "all", label: "All" },
  { id: "community", label: "Community & Camps" },
  { id: "compliance", label: "Compliance & Documentation" },
  { id: "facilities", label: "Facilities & Setup" },
  { id: "team", label: "Team & Field" },
  { id: "technical", label: "Technical & Equipment" },
  { id: "training", label: "Training & Development" },
];

/**
 * PLACEHOLDER GALLERY DATA. Every item below renders through ThemedVisual as
 * a generated placeholder because no real photography has been supplied yet.
 * To add a real photo: drop the file in /public/images/gallery/ and set
 * `photoSrc` (+ `photoAlt`) on the matching item — everything else (masonry
 * layout, lightbox, filtering, captions) keeps working unchanged.
 */
export const galleryItems: GalleryItem[] = [
  {
    id: "camp-1",
    categoryId: "community",
    caption: "Community health camp — screening in progress",
    alt: "Placeholder — EMC-organised community health camp screening station",
    family: "medical-camps",
    icon: "tent",
    aspect: "portrait",
  },
  {
    id: "camp-2",
    categoryId: "community",
    caption: "Corporate health camp — employee screening",
    alt: "Placeholder — corporate health camp employee screening",
    family: "medical-camps",
    icon: "tent",
    aspect: "landscape",
  },
  {
    id: "home-1",
    categoryId: "community",
    caption: "Health at Home — nursing visit",
    alt: "Placeholder — Health at Home nursing visit",
    family: "medical-camps",
    icon: "home-heart",
    aspect: "square",
  },
  {
    id: "compliance-1",
    categoryId: "compliance",
    caption: "CEA documentation review",
    alt: "Placeholder — CEA registration documentation review",
    family: "compliance-licensing",
    icon: "document",
    aspect: "landscape",
  },
  {
    id: "compliance-2",
    categoryId: "compliance",
    caption: "NABH gap assessment walkthrough",
    alt: "Placeholder — NABH gap assessment walkthrough at a hospital",
    family: "compliance-licensing",
    icon: "shield-check",
    aspect: "portrait",
  },
  {
    id: "compliance-3",
    categoryId: "compliance",
    caption: "MRD deficiency audit",
    alt: "Placeholder — medical records department deficiency audit",
    family: "records-management",
    icon: "folder",
    aspect: "wide",
  },
  {
    id: "facilities-1",
    categoryId: "facilities",
    caption: "Hospital setup project — infrastructure coordination",
    alt: "Placeholder — hospital setup project infrastructure coordination",
    family: "equipment-infrastructure",
    icon: "building",
    aspect: "landscape",
  },
  {
    id: "facilities-2",
    categoryId: "facilities",
    caption: "Fire & safety arrangement review",
    alt: "Placeholder — hospital fire safety arrangement review",
    family: "records-management",
    icon: "flame",
    aspect: "square",
  },
  {
    id: "team-1",
    categoryId: "team",
    caption: "EMC PRO field visit",
    alt: "Placeholder — EMC public relations officer on a field visit",
    family: "marketing",
    icon: "handshake",
    aspect: "portrait",
  },
  {
    id: "team-2",
    categoryId: "team",
    caption: "Client discussion — requirement briefing",
    alt: "Placeholder — EMC team discussing a client requirement",
    family: "marketing",
    icon: "users",
    aspect: "landscape",
  },
  {
    id: "technical-1",
    categoryId: "technical",
    caption: "Medical equipment calibration in progress",
    alt: "Placeholder — medical equipment calibration in progress",
    family: "equipment-infrastructure",
    icon: "gauge",
    aspect: "square",
  },
  {
    id: "training-1",
    categoryId: "training",
    caption: "Staff training session",
    alt: "Placeholder — EMC staff training session",
    family: "records-management",
    icon: "book-open",
    aspect: "wide",
  },
];

export function getGalleryItemsByCategory(categoryId: string) {
  if (categoryId === "all") return galleryItems;
  return galleryItems.filter((item) => item.categoryId === categoryId);
}
