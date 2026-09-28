"use client";

import { useMemo, useState } from "react";
import Container from "@/components/layout/Container";
import VehicleFilter from "./VehicleFilter";
import VehicleCard from "./VehicleCard";
import {
  CATEGORY_LABEL,
  VEHICLES,
  CATEGORIES,
  type Category,
  type Vehicle,
} from "./vehicles-data";

type Props = {
  initialVehicles?: Vehicle[];
  initialCategories?: { slug: string; name: string; order: number }[];
};

export default function VehiclesPageContent({ initialVehicles, initialCategories }: Props) {
  const [active, setActive] = useState<Category>("ALL");

  const vehicles = initialVehicles?.length ? initialVehicles : VEHICLES;
  const categoriesFromServer: Category[] = initialCategories?.length
    ? (["ALL", ...initialCategories
        .sort((a, b) => a.order - b.order)
        .map((c) => c.slug.toUpperCase())
        .filter((s): s is Exclude<Category, "ALL"> => true)] as Category[])
    : CATEGORIES;

  const filtered = useMemo(
    () => (active === "ALL" ? vehicles : vehicles.filter((v) => v.category === active)),
    [active, vehicles],
  );

  const label =
    active === "ALL"
      ? CATEGORY_LABEL.ALL
      : initialCategories?.find((c) => c.slug.toUpperCase() === active)?.name ??
        CATEGORY_LABEL[active] ??
        "Models";

  return (
    <section className="w-full py-10 lg:py-16 mt-10">
      <Container>
        <h1 className="mb-6 text-[24px] font-black uppercase leading-[normal] text-[#1e1e1e] lg:hidden">
          {label}
        </h1>

        <div className="flex flex-col lg:flex-row lg:gap-[45px]">
          <VehicleFilter active={active} onChange={setActive} extraCategories={categoriesFromServer.filter((c) => c !== "ALL" && !CATEGORIES.includes(c)) as Exclude<Category, "ALL">[]} />

          <div className="hidden w-px self-stretch bg-[#e4e4e4] lg:block" />

          <div className="flex-1">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <p className="py-16 text-center text-[16px] text-[#878383]">
                No vehicles found in this category yet.
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
