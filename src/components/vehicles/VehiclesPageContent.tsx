"use client";

import { useMemo, useState } from "react";
import Container from "@/components/layout/Container";
import VehicleFilter from "./VehicleFilter";
import VehicleCard from "./VehicleCard";
import { CATEGORY_LABEL, VEHICLES, type Category } from "./vehicles-data";

export default function VehiclesPageContent() {
  const [active, setActive] = useState<Category>("ALL");

  const filtered = useMemo(
    () => (active === "ALL" ? VEHICLES : VEHICLES.filter((v) => v.category === active)),
    [active]
  );

  return (
    <section className=" w-full py-10 lg:py-16 mt-10">
      <Container>
        {/* Mobile page title — mirrors the Figma mobile mockup, which shows
            the active category as a heading (e.g. "SUVs"). Exact mobile
            font size wasn't available (Figma API rate limit), so this uses
            the 24px/bold/uppercase pattern established for headings
            elsewhere on mobile in this file. */}
        <h1 className="mb-6 text-[24px] font-black uppercase leading-[normal] text-[#1e1e1e] lg:hidden">
          {CATEGORY_LABEL[active]}
        </h1>

        <div className="flex flex-col lg:flex-row lg:gap-[45px]">
          <VehicleFilter active={active} onChange={setActive} />

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
