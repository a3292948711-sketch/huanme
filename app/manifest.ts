import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "换么｜智能换物",
    short_name: "换么",
    description: "面向年轻人的AI智能换物与闲置交易平台。",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F7F2",
    theme_color: "#FFD600",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
