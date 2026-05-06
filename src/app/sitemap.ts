import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://air.antigravity.kr",
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
  ];
}
