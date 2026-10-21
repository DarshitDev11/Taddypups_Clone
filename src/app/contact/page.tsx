// PLACEHOLDER contact page. Replace with the real design (see research/DESIGN-SPEC.md).

import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("contact");

export default function ContactPage() {
  return (
    <Container className="min-h-[70vh] pt-10 pb-24 md:pt-16">
      <PageHeader
        title="Get in touch with us"
        lede="Have questions about our puppies or adoption process? Fill out the form, and our team will get back to you promptly."
      />
    </Container>
  );
}
