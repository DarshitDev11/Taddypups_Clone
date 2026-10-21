// PLACEHOLDER happy families page. Replace with the real design (see research/DESIGN-SPEC.md).

import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("happyFamilies");

export default function HappyFamiliesPage() {
  return (
    <Container className="min-h-[70vh] pt-10 pb-24 md:pt-16">
      <PageHeader
        title="Happy families"
        lede="Nothing makes us happier than seeing our puppies in loving homes! Here are some beautiful moments shared by our amazing clients after welcoming their furry friends."
      />
    </Container>
  );
}
