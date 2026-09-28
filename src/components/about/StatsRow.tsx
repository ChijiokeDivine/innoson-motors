import Image from "next/image";
import Container from "../layout/Container";
import type { AboutPageDTO } from "@/types/dto";

const FALLBACK = [
  { value: "100K+", label: "Employees" },
  { value: "20+", label: "Years of Manufacturing" },
  { value: "0%", label: "Imported Parts" },
];

export default function StatsRow({ stats }: { stats?: AboutPageDTO["stats"] }) {
  const items = stats?.length
    ? stats
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .slice(0, 3)
        .map((s) => ({ value: s.value, label: s.label }))
    : FALLBACK;
  return (
    <section className="white py-8 lg:py-[45px]">
      <Container className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-[138px]">
        {items.slice(0, 2).map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-0 lg:items-start">
            <p className="text-[24px] leading-[normal] text-[#1e1e1e]">{s.value}</p>
            <p className="text-[14px] leading-[normal] text-[#1e1e1e]">{s.label}</p>
          </div>
        ))}

        <div className="flex flex-col items-center gap-4 text-center lg:flex-row lg:gap-[15px] lg:text-left">
          <Image src="/images/africa.png" alt="" width={42} height={42} />
          <p className="max-w-[262px] text-[20px] leading-[31px] text-[#1e1e1e]">
            1ST Africa&rsquo;s Automobile Brand
          </p>
        </div>

        {items[2] && (
          <div className="flex flex-col items-center gap-0 lg:items-start">
            <p className="text-[24px] leading-[normal] text-[#1e1e1e]">{items[2].value}</p>
            <p className="text-[14px] leading-[normal] text-[#1e1e1e]">{items[2].label}</p>
          </div>
        )}
      </Container>
    </section>
  );
}
