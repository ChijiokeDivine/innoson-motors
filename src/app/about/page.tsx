import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import FooterServer from "@/components/layout/FooterServer";
import AboutHero from "@/components/about/AboutHero";
import StatsRow from "@/components/about/StatsRow";
import ImageBand from "@/components/about/ImageBand";
import StoryTwoColumn from "@/components/about/StoryTwoColumn";
import StoryWithImage from "@/components/about/StoryWithImage";
import { getAboutPage } from "@/server/globals";

export const metadata: Metadata = {
  title: "About Us | Innoson Vehicle Manufacturing",
  description:
    "Innoson Vehicle Manufacturing — Nigeria's first privately owned indigenous automobile manufacturer.",
};

export const revalidate = 60;

export default async function AboutPage() {
  let about;
  try {
    about = await getAboutPage();
  } catch {
    about = undefined;
  }
  return (
    <>
      <Header active="about" />
      <main>
        <AboutHero />
        <StatsRow stats={about?.stats} />

        <ImageBand
          src="/images/about-car-rear.png"
          alt="IVM Caris rear view"
          heightClassName="h-[254px] lg:h-[519px]"
          containerClassName="px-0 py-8 lg:px-[50px] lg:py-10"
        />

        <StoryTwoColumn />

        <ImageBand
          src="/images/image.webp"
          alt="IVM Caris driving through a forest road"
          heightClassName="h-[407px] lg:h-[800px]"
          heading="Why do we exist?"
          body={'To eradicate "tokunbo" (foreign used) automobiles from Africa by promoting MADE IS NIGERIA'}
        />

        <ImageBand
          src="/images/image1.webp"
          alt="IVM pickup truck on a scenic road"
          heightClassName="h-[326px] lg:h-[642px]"
          containerClassName="px-5 py-8 lg:px-5 lg:py-10"
          rounded
        />

        <StoryWithImage />

        <ImageBand
          src="/images/b1e142294a01d68abac29ed61f48321618579322.jpg"
          alt="Red IVM hatchback in a showroom"
          heightClassName="h-[335px] lg:h-[800px]"
          containerClassName="px-5 py-8 lg:px-0 lg:py-0"
          eyebrow="DRIVING VIDEO"
          heading="Thoughtful details decorating the space"
        />
      </main>
      <FooterServer />
    </>
  );
}
