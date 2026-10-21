// PLACEHOLDER home page. The real storybook scenes (research/DESIGN-SPEC.md section 4.1) go in components/home/.

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { siteConfig } from "@/data/siteConfig";
import { pageMetadata } from "@/lib/metadata";
import { generalWhatsAppLink } from "@/lib/whatsapp";

export const metadata = pageMetadata("home");

export default function HomePage() {
  return (
    <Container className="min-h-[70vh] pt-10 pb-24 md:pt-16">
      <PageHeader
        kicker={siteConfig.tagline}
        title="Premium teacup puppies in Dubai"
        lede="Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders worldwide."
        actions={
          <>
            <Button href="/puppies">View available puppies</Button>
            <Button variant="ghost" href={generalWhatsAppLink}>
              Enquire on WhatsApp
            </Button>
          </>
        }
      />
    </Container>
  );
}
