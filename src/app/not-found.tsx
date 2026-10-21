// PLACEHOLDER 404 page. Replace with the "LOST" poster design (research/DESIGN-SPEC.md section 4.9).

import { Teddy } from "@/components/decor/Teddy";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export default function NotFound() {
  return (
    <Container className="min-h-[70vh] pt-10 pb-24 md:pt-16">
      <PageHeader
        kicker="have you seen this page?"
        title="Lost"
        lede="One page, last seen wandering off. It answers to the address you typed, but it isn't here any more. Teddy is on the case."
        actions={<Button href="/">Back to the home page</Button>}
      />
      <Teddy
        pose="sniff"
        facing="right"
        label="Teddy, sniffing out the missing page"
        className="mt-10 w-52"
      />
    </Container>
  );
}
