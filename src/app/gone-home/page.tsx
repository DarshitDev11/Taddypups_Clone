// PLACEHOLDER /gone-home page: lists puppies that found a family.
// Replace with the "admit one" ticket design (research/DESIGN-SPEC.md section 4.4).

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/metadata";
import { getGoneHomePuppies } from "@/lib/puppies";

export const metadata = pageMetadata("goneHome");

export default function GoneHomePage() {
  const puppies = getGoneHomePuppies();

  return (
    <Container className="min-h-[70vh] pt-10 pb-24 md:pt-16">
      <PageHeader
        title="Gone home"
        lede="Every puppy here has already joined a loving family. Looking for one just like them? Tell us — we'll help you find your match."
        actions={<Button href="/puppies">See available puppies</Button>}
      />
      <ul className="mt-12 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
        {puppies.map((puppy) => (
          <li key={puppy.slug}>
            <Link href={`/puppies/${puppy.slug}`} className="link-ink font-semibold">
              {puppy.name}
            </Link>
            <span className="text-cocoa-soft"> · {puppy.breed}</span>
          </li>
        ))}
      </ul>
    </Container>
  );
}
