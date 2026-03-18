import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MovieVerse",
    short_name: "MovieVerse",
    description:
      "Browse trending movies and shows, explore cast details, and manage your watchlist.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#101010",
    theme_color: "#101010",
    categories: ["entertainment", "lifestyle"],
    icons: [
      {
        src: "/icons/pwa-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/pwa-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
