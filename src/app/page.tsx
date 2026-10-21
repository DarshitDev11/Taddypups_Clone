// Home page: one long "day" that runs from morning to night, one illustrated scene per section.

import { FinalCta } from "@/components/home/FinalCta";
import { HappyFamiliesTeaser } from "@/components/home/HappyFamiliesTeaser";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeHero } from "@/components/home/HomeHero";
import { MeetThePups } from "@/components/home/MeetThePups";
import { PuppyJourney } from "@/components/home/PuppyJourney";
import { TwoWaysHome } from "@/components/home/TwoWaysHome";
import { WhyFamiliesTrust } from "@/components/home/WhyFamiliesTrust";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("home");

export default function HomePage() {
  return (
    <div data-page="home">
      <HomeHero />
      <MeetThePups />
      <TwoWaysHome />
      <PuppyJourney />
      <WhyFamiliesTrust />
      <HappyFamiliesTeaser />
      <HomeFaq />
      <FinalCta />
    </div>
  );
}
