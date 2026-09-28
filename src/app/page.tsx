import Header from "@/components/layout/Header";
import FooterServer from "@/components/layout/FooterServer";
import Hero from "@/components/home/Hero";
import BoldExperience from "@/components/home/BoldExperience";
import EvCollectionBanner from "@/components/home/EvCollectionBanner";
import CarModelShowcase from "@/components/home/CarModelShowcase";
import PaymentBanner from "@/components/home/PaymentBanner";
import { getFeaturedModels } from "@/server/models";
import { modelsAsVehicleCards } from "@/lib/adapters";

export const revalidate = 60;

export default async function HomePage() {
  let featured;
  try {
    const models = await getFeaturedModels(6);
    featured = modelsAsVehicleCards(models);
  } catch {
    featured = undefined;
  }
  return (
    <>
      <Header />
      <main className="pt-[70px] lg:pt-[80px]">
        <Hero />
        <BoldExperience />
        <EvCollectionBanner />
        <CarModelShowcase initialVehicles={featured} />
        <PaymentBanner />
      </main>
      <FooterServer />
    </>
  );
}
