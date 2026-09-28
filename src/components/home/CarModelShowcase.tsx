"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "../layout/Container";
import type { Vehicle } from "@/components/vehicles/vehicles-data";

interface CarModel {
  id: string;
  name: string;
  watermark: string;
  image: string;
  slug?: string;
}

const FALLBACK: CarModel[] = [
  { id: "fb-1", name: "INNOSON CARIS", watermark: "IVM", image: "/images/car-model-side.png", slug: "caris" },
  { id: "fb-2", name: "INNOSON CAPA", watermark: "IVM", image: "/images/car-model-side.png" },
  { id: "fb-3", name: "INNOSON G80", watermark: "IVM", image: "/images/car-model-side.png" },
];

function watermarkFromName(name: string): string {
  const t = name.trim().toUpperCase();
  const tokens = t.split(/\s+/).filter(Boolean);
  if (tokens[0] === "INNOSON") tokens.shift();
  if (tokens.length === 0) return "IVM";
  if (tokens.length === 1) {
    const w = tokens[0];
    return w.length > 3 ? w.slice(0, 3) : w;
  }
  return (tokens[0]?.[0] ?? "") + (tokens[1]?.[0] ?? "") + (tokens[2]?.[0] ?? "M");
}

export default function CarModelShowcase({
  initialVehicles,
}: {
  initialVehicles?: Vehicle[];
}) {
  const models: CarModel[] =
    initialVehicles && initialVehicles.length > 0
      ? initialVehicles.slice(0, 12).map((v) => ({
          id: v.id,
          name: v.name,
          watermark: watermarkFromName(v.name) || "IVM",
          image: v.image,
          slug: "slug" in v ? String((v as { slug?: string }).slug) : undefined,
        }))
      : FALLBACK;

  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const count = models.length;
  const goPrev = () => setActiveIndex((i) => (i - 1 + count) % count);
  const goNext = () => setActiveIndex((i) => (i + 1) % count);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) (diff > 0 ? goNext : goPrev)();
    touchStartX.current = null;
  };

  const active = models[activeIndex];
  const detailHref =
    active?.slug ? `/vehicles/${active.slug}` : `/vehicles?ref=home-showcase`;

  return (
    <section className="font-[family-name:var(--font-google-sans)] w-full py-16 lg:py-[100px]">
      <Container className="flex flex-col gap-10 lg:gap-10">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-0">
          <div className="flex flex-col gap-3 lg:gap-3">
            <h2 className="text-[24px] font-bold uppercase leading-[normal] text-[#1e1e1e] lg:text-[40px] lg:leading-[58px]">
              Explore our Car Model
            </h2>
            <p className="max-w-[781px] text-[14px] leading-[normal] text-black lg:text-[19px]">
              Find the perfect electric vehicle designed for performance, efficiency, and
              sustainability
            </p>
          </div>

          <Link
            href="/vehicles"
            className="flex w-fit shrink-0 items-center gap-2 rounded-full bg-[#1e1e1e] px-4 py-3 text-white lg:gap-4 transition-transform hover:scale-105"
          >
            <span className="text-[14px] font-semibold leading-normal lg:text-[19px]">
              See All Models
            </span>
            <span className="flex size-[18px] items-center justify-center rounded-full bg-white lg:size-8">
              <Image
                src="/icons/icon-arrow-up-right.svg"
                alt=""
                width={16}
                height={16}
                className="size-[9px] lg:size-4"
              />
            </span>
          </Link>
        </div>

        <div
          className="relative h-[360px] w-full overflow-hidden rounded-[4px] bg-[#e4e4e4] md:h-[520px] lg:h-[752px]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {models.map((model, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={model.id}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <span className="absolute left-1/2 top-[36%] -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[110px] font-bold leading-none text-white opacity-40 md:text-[220px] lg:text-[375px]">
                  {model.watermark}
                </span>
                <div className="absolute left-1/2 top-[36%] w-[85%] max-w-[961px] -translate-x-1/2 -translate-y-1/2">
                  <Image
                    src={model.image}
                    alt={model.name}
                    width={961}
                    height={483}
                    priority={index === 0}
                    className="h-auto w-full rounded-[10px] object-contain"
                  />
                </div>
                <p className="absolute bottom-[15%] left-1/2 -translate-x-1/2 whitespace-nowrap text-[22px] font-bold leading-none text-black md:text-[36px] lg:text-[48px]">
                  {model.name}
                </p>
              </div>
            );
          })}

          <button
            type="button"
            aria-label="Previous model"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center transition-transform hover:scale-110 lg:left-10 lg:size-16"
          >
            <Image src="/icons/icon-chevron.svg" alt="" width={24} height={24} className="size-full" />
          </button>
          <Link
            href={detailHref}
            aria-label="View model details"
            className="absolute bottom-[6%] left-1/2 z-20 -translate-x-1/2 rounded-[4px] bg-[#005eb8] px-4 py-2 text-[12px] font-bold text-white lg:text-[14px]"
          >
            Discover More
          </Link>
          <button
            type="button"
            aria-label="Next model"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-20 flex size-10 -translate-y-1/2 rotate-180 items-center justify-center transition-transform hover:scale-110 lg:right-10 lg:size-16"
          >
            <Image src="/icons/icon-chevron.svg" alt="" width={24} height={24} className="size-full" />
          </button>
        </div>
      </Container>
    </section>
  );
}
