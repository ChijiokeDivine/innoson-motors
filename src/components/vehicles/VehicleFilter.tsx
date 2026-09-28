"use client";

import { CATEGORIES, CATEGORY_LABEL, type Category } from "./vehicles-data";

interface VehicleFilterProps {
  active: Category;
  onChange: (category: Category) => void;
  extraCategories?: Exclude<Category, "ALL">[];
}

export default function VehicleFilter({ active, onChange, extraCategories = [] }: VehicleFilterProps) {
  const mergedCategories = Array.from(new Set([...CATEGORIES, ...extraCategories])) as Category[];

  return (
    <>
      {/* Desktop: vertical sidebar list — matches Figma "Frame 58" exactly */}
      <aside className="hidden w-[182px] shrink-0 lg:block">
        <h2 className="text-[30px] font-bold leading-[20px] text-[#002a52]">MODELS</h2>
        <ul className="mt-10 flex flex-col">
          {mergedCategories.map((category) => (
            <li key={category}>
              <button
                type="button"
                onClick={() => onChange(category)}
                aria-current={active === category}
                className={`h-[59px] w-full text-left text-[22px] leading-[20px] ${
                  active === category ? "font-bold text-[#005eb8]" : "font-normal text-[#878383]"
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/*
        Mobile: no expanded filter frame exists in the Figma file for this
        breakpoint (only the closed result — a page title reading the active
        category, e.g. "SUVs" — is shown), so this chip bar is a reasonable,
        flagged addition using the sidebar's exact colors/weights rather than
        an untouched design spec.
      */}
      <div className="-mx-5 mb-8 flex gap-3 overflow-x-auto px-5 pb-1 lg:hidden">
        {mergedCategories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            aria-current={active === category}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[13px] font-bold uppercase leading-[normal] ${
              active === category
                ? "border-[#005eb8] bg-[#005eb8] text-white"
                : "border-[#e4e4e4] text-[#878383]"
            }`}
          >
            {CATEGORY_LABEL[category] ?? category}
          </button>
        ))}
      </div>
    </>
  );
}
