import type { MetadataRoute } from "next";
import { pageMeta } from "@/data/pageMeta";
import { siteConfig } from "@/data/siteConfig";
import { getPuppySlugs } from "@/lib/puppies";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = Object.values(pageMeta).map(({ path }) => path);
  const puppyPages = getPuppySlugs().map((slug) => `/puppies/${slug}`);

  return [...staticPages, ...puppyPages].map((path) => ({
    url: `${siteConfig.url}${path === "/" ? "" : path}`,
  }));
}
