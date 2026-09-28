import type { Metadata } from "next";
import FooterServer from "@/components/layout/FooterServer";
import BookTestDriveClient from "@/components/test-drive/BookTestDriveClient";
import { getPublishedModels } from "@/server/models";
import { modelsAsVehicleCards } from "@/lib/adapters";

export const metadata: Metadata = {
  title: "Book a Test Drive | Innoson Vehicle Manufacturing",
  description:
    "Book a test drive at your nearest IVM showroom — choose any Innoson model.",
};

export const revalidate = 60;

export default async function BookTestDrivePage() {
  let vehicles;
  try {
    const res = await getPublishedModels({ limit: 50 });
    vehicles = modelsAsVehicleCards(res.docs);
  } catch {
    vehicles = undefined;
  }
  return (
    <>
      <BookTestDriveClient initialVehicles={vehicles} />
      <FooterServer />
    </>
  );
}
