import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/**
 * Powers the "Add to Home Screen" icon/name on Android and other platforms
 * that read the web app manifest. Uses the official EMC favicon asset at
 * both sizes it was supplied in — see public/images/fav icon/ for the source
 * files (icon.png is the same 192×192 asset, served from src/app per
 * Next.js's file-convention favicon).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.brandName,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1c514a",
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png" },
      { src: "/images/branding/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
