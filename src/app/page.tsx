// Home page: one long "day" that runs from morning to night, one illustrated scene per section.

import { FinalCta } from "@/components/home/FinalCta";
import { HappyFamiliesTeaser } from "@/components/home/HappyFamiliesTeaser";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeHero } from "@/components/home/HomeHero";
import { MeetThePups } from "@/components/home/MeetThePups";
import { PupActor } from "@/components/home/PupActor";
import { PuppyJourney } from "@/components/home/PuppyJourney";
import { TwoWaysHome } from "@/components/home/TwoWaysHome";
import { WhyFamiliesTrust } from "@/components/home/WhyFamiliesTrust";
import { siteConfig } from "@/data/siteConfig";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("home");

// Structured data so search engines know this is a local pet business. Contact details are the demo placeholders.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "PetStore",
  name: siteConfig.name,
  url: siteConfig.url,
  image: `${siteConfig.url}/brand/logo.png`,
  email: siteConfig.contact.email,
  telephone: siteConfig.contact.phoneDisplay,
  address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
};

export default function HomePage() {
  return (
    <div data-page="home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <HomeHero />
      <MeetThePups />
      <TwoWaysHome />
      <PuppyJourney />
      <WhyFamiliesTrust />
      <HappyFamiliesTeaser />
      <HomeFaq />
      <FinalCta />
      <PupActor />
    </div>
  );
}
