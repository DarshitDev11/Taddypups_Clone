// PLACEHOLDER puppy detail page. It already does the real routing work:
//  - generateStaticParams builds one static HTML page per puppy at build time
//  - generateMetadata sets the title/description from the puppy's data
// Replace the body with the storybook design (research/DESIGN-SPEC.md section 4.3).

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusTag } from "@/components/ui/StatusTag";
import { genderLabels, getPuppyBySlug, getPuppyMetadata, getPuppySlugs, originLabels } from "@/lib/puppies";
import { buildWhatsAppLink, whatsappMessages } from "@/lib/whatsapp";

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
  return { title, description, alternates: { canonical: `/puppies/${slug}` } };
}

export default async function PuppyPage({ params }: PageProps<"/puppies/[slug]">) {
  const { slug } = await params;
  const puppy = getPuppyBySlug(slug);
  if (!puppy) notFound();

  return (
    <Container className="min-h-[70vh] pt-10 pb-24 md:pt-16">
      <StatusTag status={puppy.status} variant="chip" />
      <PageHeader
        className="mt-4"
        title={puppy.name}
        lede={`${puppy.breed} · ${genderLabels[puppy.gender].toLowerCase()} · ${puppy.age} · ${originLabels[puppy.origin]}`}
        actions={
          <Button variant="whatsapp" href={buildWhatsAppLink(whatsappMessages.puppy(puppy))}>
            Ask about {puppy.name} on WhatsApp
          </Button>
        }
      />
    </Container>
  );
}
