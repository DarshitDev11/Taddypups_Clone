// PLACEHOLDER /puppies page: shows the data layer works by listing available puppies.
// Replace with the sketchbook design and filters (research/DESIGN-SPEC.md section 4.2).

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { genderLabels, getAvailablePuppies } from "@/lib/puppies";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("puppies");

export default function PuppiesPage() {
  const puppies = getAvailablePuppies();

  return (
    <Container className="min-h-[70vh] pt-10 pb-24 md:pt-16">
      <PageHeader
        kicker="from Teddy's sketchbook"
        title="Available puppies"
        lede="Every listing shows real photos of the actual puppy. Open a profile to see them all, then ask us about them on WhatsApp."
      />
      <ul className="mt-12 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
        {puppies.map((puppy) => (
          <li key={puppy.slug}>
            <Link href={`/puppies/${puppy.slug}`} className="link-ink font-semibold">
              {puppy.name}
            </Link>
            <span className="text-cocoa-soft">
              {" "}
              · {genderLabels[puppy.gender].toLowerCase()} · {puppy.age}
            </span>
          </li>
        ))}
      </ul>
    </Container>
  );
}
