// /puppies/[slug]: one puppy's "storybook" page, built at deploy time for every slug (42 pages).
//  - generateStaticParams builds one static HTML page per puppy
//  - generateMetadata sets the title/description from the puppy's data

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdjacentPuppies } from "@/components/puppies/AdjacentPuppies";
import { BookmarkRibbon } from "@/components/puppies/BookmarkRibbon";
import { ChapterLabel } from "@/components/puppies/ChapterLabel";
import { EnquiryLetter } from "@/components/puppies/EnquiryLetter";
import { PuppyGallery } from "@/components/puppies/PuppyGallery";
import { PuppyTagCard } from "@/components/puppies/PuppyTagCard";
import { WayHome } from "@/components/puppies/WayHome";
import { WhatComesWith } from "@/components/puppies/WhatComesWith";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/siteConfig";
import { getCoverImage, getPuppyBySlug, getPuppyMetadata, getPuppySlugs } from "@/lib/puppies";

// Only the slugs returned below exist; any other URL is a 404 instead of being rendered on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPuppySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/puppies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const puppy = getPuppyBySlug(slug);
  if (!puppy) return {};

  const { title, description } = getPuppyMetadata(puppy);
  const cover = getCoverImage(puppy);
  return {
    title,
    description,
    alternates: { canonical: `/puppies/${slug}` },
    // The social-share picture is the puppy's cover photo.
    openGraph: { title, description, url: `/puppies/${slug}`, images: [{ url: cover.src, alt: cover.alt }] },
  };
}

export default async function PuppyPage({ params }: PageProps<"/puppies/[slug]">) {
  const { slug } = await params;
  const puppy = getPuppyBySlug(slug);
  if (!puppy) notFound();

  const isGone = puppy.status === "gone";
  const cover = getCoverImage(puppy);

  // Gone-home puppies have no "way home" chapter (nobody can order them), so the numbering shifts up.
  const chapters = isGone
    ? { comesWith: 2, wayHome: 0, enquiry: 3 }
    : { comesWith: 2, wayHome: 3, enquiry: 4 };

  const breadcrumb = isGone
    ? { label: "Gone home", href: "/gone-home" }
    : { label: "Available puppies", href: "/puppies" };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isGone ? "Gone home" : "Puppies",
        item: `${siteConfig.url}${breadcrumb.href}`,
      },
      { "@type": "ListItem", position: 2, name: puppy.name, item: `${siteConfig.url}/puppies/${puppy.slug}` },
    ],
  };

  return (
    // A faint wash of the puppy's own photo colour fades into the page colour, so each page feels a little different.
    <article
      className="storybook"
      style={{
        background: `linear-gradient(180deg, color-mix(in oklab, ${cover.color} 24%, var(--color-milk)) 0, var(--color-milk) 85%)`,
      }}
    >
      <BookmarkRibbon />
      {/* Escaping "<" stops a stray "</script>" in the data from ending the tag early. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />

      <Container className="pt-8 pb-20 md:pt-12">
        <nav aria-label="Breadcrumb" className="text-[0.95rem] font-semibold text-cocoa-soft">
          <Link href={breadcrumb.href} className="link-ink">
            {breadcrumb.label}
          </Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">{puppy.name}</span>
        </nav>

        <ChapterLabel number={1}>{isGone ? "the day they went home" : "hello, it's me"}</ChapterLabel>

        <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <PuppyGallery name={puppy.name} media={puppy.media} />
          </div>
          <div className="min-w-0 lg:col-span-5">
            {/* Sticky on desktop, so the tag and details stay beside the photos while you look through them. */}
            <div className="lg:sticky lg:top-[calc(var(--header-h)+5.5rem)]">
              <PuppyTagCard puppy={puppy} />
              <WhatComesWith chapter={chapters.comesWith} puppyName={puppy.name} />
            </div>
          </div>
        </div>

        {!isGone && <WayHome chapter={chapters.wayHome} origin={puppy.origin} slug={puppy.slug} />}

        <EnquiryLetter puppy={puppy} chapter={chapters.enquiry} />

        <AdjacentPuppies puppy={puppy} />
      </Container>
    </article>
  );
}
