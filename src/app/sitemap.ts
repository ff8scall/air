import { MetadataRoute } from "next";
import { ALL_REGIONS } from "@/lib/regions";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://air.lego-sia.com";
  
  const regions = ALL_REGIONS.map((r) => ({
    url: `${baseUrl}/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    ...regions,
  ];
}
