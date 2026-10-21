// Builds the Next.js <head> metadata for a static page from data/pageMeta.ts.

import type { Metadata } from "next";
import { pageMeta } from "@/data/pageMeta";

export function pageMetadata(key: keyof typeof pageMeta): Metadata {
  const { path, title, description } = pageMeta[key];
  return {
    // The root layout adds " | TeddyPups U.A.E." to titles; the home title already says it all.
    title: key === "home" ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
  };
}
