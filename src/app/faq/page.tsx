// PLACEHOLDER FAQ page. Replace with the real design (see research/DESIGN-SPEC.md).

import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("faq");

export default function FaqPage() {
  return (
    <Container className="min-h-[70vh] pt-10 pb-24 md:pt-16">
      <PageHeader
        title="Questions & answers"
        lede="Can't find what you're looking for? Message us on WhatsApp — our team is available 24/7."
      />
    </Container>
  );
}
