import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VehicleDetailPage from "@/components/vehicles/VehicleDetailPage";
import Header from "@/components/layout/Header";
import FooterServer from "@/components/layout/FooterServer";
import { getModelBySlugOrNotFound, getPublishedModels } from "@/server/models";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const res = await getPublishedModels({ limit: 200 });
    return res.docs.map((m) => ({ slug: m.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const doc = await getModelBySlugOrNotFound(slug);
    return {
      title: `${doc.name} | Innoson Vehicle Manufacturing`,
      description: doc.summary ?? doc.name + " — " + (doc.category?.name ?? "Nigeria-made vehicle"),
      openGraph: {
        title: doc.name,
        description: doc.summary ?? doc.name,
        images: doc.heroImage ? [doc.heroImage] : [],
      },
    };
  } catch {
    notFound();
  }
}

export default async function ModelDetailRoute({ params }: PageProps) {
  const { slug } = await params;
  const model = await getModelBySlugOrNotFound(slug);
  return (
    <>
      <Header active="vehicles" />
      <VehicleDetailPage model={model} />
      <FooterServer />
    </>
  );
}
