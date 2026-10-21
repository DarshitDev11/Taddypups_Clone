// PLACEHOLDER how it works page. Replace with the real design (see research/DESIGN-SPEC.md).

import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("howItWorks");

export default function HowItWorksPage() {
  return (
    <Container className="min-h-[70vh] pt-10 pb-24 md:pt-16">
      <PageHeader
        title="How it works"
        lede="Whether you choose to visit us locally or order a premium breed from overseas, TeddyPups is here to make the experience unforgettable."
      />
    </Container>
  );
}
