import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import FooterServer from "@/components/layout/FooterServer";
import VehiclesPageContent from "@/components/vehicles/VehiclesPageContent";
import { getCategories, getPublishedModels } from "@/server/models";
import { categoriesAsList, modelsAsVehicleCards } from "@/lib/adapters";

export const metadata: Metadata = {
  title: "Vehicles | Innoson Vehicle Manufacturing",
  description:
    "Browse all Innoson vehicles: SUVs, sedans, pickups, MPVs, buses and EVs — made in Nigeria.",
};

export const revalidate = 60;

export default async function VehiclesPage() {
  const [modelsRes, cats] = await Promise.all([
    getPublishedModels({ limit: 100 }),
    getCategories(),
  ]);
  const vehicles = modelsAsVehicleCards(modelsRes.docs);
  const categories = categoriesAsList(cats);
  return (
    <>
      <Header />
      <main>
        <VehiclesPageContent initialVehicles={vehicles} initialCategories={categories} />
      </main>
      <FooterServer />
    </>
  );
}
