"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import Container from "@/components/layout/Container";
import GetQuoteModal from "@/components/GetQuoteModal";
import type { ModelDetailDTO } from "@/types/dto";

const RichText = dynamic(
  () => import("@payloadcms/richtext-lexical/react").then((m) => m.RichText),
  { ssr: false, loading: () => null },
);

function paragraphsFromLexicalPlainfall(lexical: unknown | undefined | null): string {
  if (!lexical || typeof lexical !== "object") return "";
  try {
    const r = (lexical as { root?: { children?: Array<{ children?: Array<{ text?: string }> }> } }).root;
    if (!r?.children) return "";
    return r.children
      .flatMap((p) =>
        (p.children ?? [])
          .filter((n): n is { text: string } => typeof (n as { text?: unknown }).text === "string")
          .map((n) => n.text)
          .join(""),
      )
      .filter(Boolean)
      .join("\n\n");
  } catch {
    return "";
  }
}

export default function VehicleDetailPage({ model }: { model: ModelDetailDTO }) {
  const [open, setOpen] = useState<string | null>("design");
  const [quoteOpen, setQuoteOpen] = useState(false);

  const openQuote = () => setQuoteOpen(true);
  const closeQuote = () => setQuoteOpen(false);

  const descriptionPlain = paragraphsFromLexicalPlainfall(model.description);
  const designPlain = paragraphsFromLexicalPlainfall(model.design);
  const techPlain = paragraphsFromLexicalPlainfall(model.technology);
  const summary = model.summary ?? descriptionPlain.split("\n\n")[0] ?? "";

  const categoryName = model.category?.name?.toUpperCase() ?? "SUV";
  const heroDesktop =
    model.gallery?.[0]?.image?.url ??
    (model.slug === "caris" ? "/images/hero-caris.png" : "/images/vehicle-card-suv.png");
  const heroMobile =
    model.slug === "caris" ? "/images/hero-caris-mobile.png" : heroDesktop;

  const accordion = [
    { id: "design", title: "Design", body: designPlain || designBodyFallback, lexical: model.design },
    {
      id: "specs",
      title: "Specifications",
      body: specGroupBody(model),
      lexical: undefined,
    },
    { id: "tech", title: "Technology", body: techPlain || techBodyFallback, lexical: model.technology },
  ];

  const specBar = buildSpecBar(model);

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-google-sans)] text-[#1e1e1e]">
      <main className="pt-[72px] lg:pt-[80px]">
        <section className="relative">
          <div className="relative h-[383px] w-full overflow-hidden lg:h-[822px]">
            <Image
              src={heroDesktop}
              alt={model.name}
              fill
              priority
              className="hidden object-cover lg:block"
            />
            <Image
              src={heroMobile}
              alt={model.name}
              fill
              priority
              className="object-cover lg:hidden"
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute inset-0 flex flex-col items-center px-5 pt-8 text-center text-white lg:pt-10 mt-10">
              <p className="text-[14px] font-bold tracking-wide lg:text-[17px]">
                {(model.tagline ?? categoryName).toUpperCase()}
              </p>
              <h1 className="mt-1 text-[32px] font-black leading-none lg:mt-1 lg:text-[70px] lg:leading-[110px]">
                {model.name.toUpperCase()}
              </h1>
              <p className="mt-2 max-w-[523px] text-[14px] leading-5 lg:text-[17px]">
                {summary}
              </p>
              <button
                type="button"
                onClick={openQuote}
                className="mt-4 flex h-10 w-[138px] items-center justify-center rounded-[4px] bg-[#005eb8] text-[14px] font-bold text-white"
              >
                Get Quote
              </button>
            </div>

            <div className="absolute bottom-3 right-5 flex h-[26px] w-[58px] items-center justify-center bg-[#005eb8] text-[12px] font-bold text-white lg:bottom-12 lg:right-[50px] lg:h-11 lg:w-[105px] lg:text-[20px]">
              {categoryName.length > 4 ? categoryName.slice(0, 3) : categoryName}
            </div>
          </div>
        </section>

        <Container className="py-10 lg:py-14">
          <h2 className="text-[24px] font-bold uppercase leading-normal lg:text-[40px]">
            {(model.tagline ?? "Sleek, Sporty, Modern").trimEnd().replace(/\.$/, "") + "."}
          </h2>
          <div className="mt-3 text-[14px] leading-normal text-[#1e1e1e] lg:mt-6 lg:text-[24px]">
            {model.description != null && Object.keys(model.description as object).length > 0 ? (
              <RichText data={model.description as never} />
            ) : (
              <p>{descriptionPlain || introFallback}</p>
            )}
          </div>
        </Container>

        <Container className="pb-10">
          <div className="flex flex-col gap-6">
            {accordion.map((item) => {
              const isOpen = open === item.id;
              return (
                <div key={item.id} className="border-b border-[#888]">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between pb-3 text-left"
                    onClick={() => setOpen(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="text-[24px] font-bold lg:text-[40px]">
                      {item.title}
                    </span>
                    <Image
                      src={isOpen ? "/icons/icon-minus.svg" : "/icons/icon-plus.svg"}
                      alt=""
                      width={40}
                      height={40}
                      className="size-10 shrink-0"
                    />
                  </button>
                  {isOpen && (
                    <div className="pb-6 text-[14px] leading-relaxed lg:text-[18px]">
                      {item.lexical ? (
                        <RichText data={item.lexical as never} />
                      ) : (
                        item.body.split(/\n{2,}/).map((p, i) => (
                          <p key={i} className="mb-3 last:mb-0">
                            {p}
                          </p>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Container>

        {specBar.length > 0 && (
          <section className="bg-[#fafafa]">
            <Container className="flex flex-col gap-8 py-6 lg:flex-row lg:items-center lg:justify-between lg:py-8">
              <div className="flex justify-between gap-2 lg:gap-[140px]">
                {specBar.slice(0, 3).map((s) => (
                  <div key={s.label} className="min-w-0 text-center lg:text-left">
                    <p className="text-[16px] font-bold lg:text-[22px]">{s.value}</p>
                    <p className="text-[12px] lg:text-[14px]">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {model.brochure?.url ? (
                  <Link
                    href={model.brochure.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3"
                  >
                    <Image src="/icons/icon-pdf.svg" alt="" width={23} height={27} className="h-[27px] w-[23px]" />
                    <span className="flex h-10 items-center justify-center rounded-[4px] border border-[#deeeff] bg-white px-5 text-[14px] font-bold">
                      Download Pdf
                    </span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-3">
                    <Image src="/icons/icon-pdf.svg" alt="" width={23} height={27} className="h-[27px] w-[23px]" />
                    <button type="button" className="flex h-10 items-center justify-center rounded-[4px] border border-[#deeeff] bg-white px-5 text-[14px] font-bold">
                      Download Pdf
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={openQuote}
                  className="flex h-10 items-center justify-center rounded-[4px] bg-[#005eb8] px-6 text-[14px] font-bold text-white"
                >
                  Get Quote
                </button>
              </div>
            </Container>
          </section>
        )}

        {model.highlights && model.highlights.length > 0 && (
          <Container className="py-12 lg:py-16">
            <h2 className="mb-10 text-[24px] font-bold uppercase lg:text-[40px]">Highlights</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {model.highlights.map((h, i) => (
                <div key={`${h.title}-${i}`} className="rounded-[12px] border border-[#e6e6e6] p-5">
                  <h3 className="text-[18px] font-bold text-[#1e1e1e]">{h.title}</h3>
                  {h.description && (
                    <p className="mt-2 text-[14px] leading-relaxed text-[#333]">{h.description}</p>
                  )}
                </div>
              ))}
            </div>
          </Container>
        )}

        {model.colorOptions && model.colorOptions.length > 0 && (
          <section className="bg-[#fafafa]">
            <Container className="py-12 lg:py-16">
              <h2 className="mb-8 text-[24px] font-bold uppercase lg:text-[40px]">Available Colors</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {model.colorOptions.map((c, i) => (
                  <div key={`${c.name}-${i}`} className="flex flex-col items-center gap-2">
                    <div
                      className="h-16 w-16 rounded-full border border-[#cfcfcf] shadow-sm"
                      style={{ backgroundColor: c.hexCode || "#cccccc" }}
                      aria-label={c.name}
                    />
                    <p className="text-[14px] font-bold text-[#1e1e1e]">{c.name}</p>
                  </div>
                ))}
              </div>
            </Container>
          </section>
        )}

        {model.gallery && model.gallery.length > 1 && (
          <Container className="py-12">
            <h2 className="mb-8 text-[24px] font-bold uppercase lg:text-[40px]">Gallery</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {model.gallery.map((g, i) => (
                <div key={`${g.image.url}-${i}`} className="relative aspect-[4/3] overflow-hidden rounded-[12px]">
                  <Image src={g.image.url} alt={g.caption || `${model.name} ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </Container>
        )}
      </main>

      <GetQuoteModal open={quoteOpen} onClose={closeQuote} vehicleType={model.name} />
    </div>
  );
}

const designBodyFallback = `Improved Exhaust Tech – IVM improved exhaust helps to create that energetic performance needed to drive through long distance while maintaining optimal stability. It also helps to conserve your fuel efficiently, cools the temperature of the engine and allows the engine to breathe better.

Adjustable passenger seats – each drive gives you the finesse and peace you need while driving. There is a great need for your muscles to be well relaxed while driving.

Air Conditioned leather seats – each drive is a memorable experience. The air conditioned leather seats create a lush feel and extreme relaxation while driving.

Standard LED front lights – we used the latest technology in automotive lighting technology. Power through the dark, your vision and balance are secured.

Enhanced multimedia experience – play your favorite sounds with the inbuilt modern multimedia system. You can connect your multimedia devices while driving.

Automatic folding side mirrors – you can park comfortably without bothering about accidental smashing of your side mirrors.

Front and rear airbags – the front and rear airbags are there to prevent fatal injuries if there is an unexpected crash.`;

const techBodyFallback =
  "Reverse camera with dynamic parking lines, automatic folding mirrors, a large multimedia unit with phone integration, cruise control, hill-start assist, and tyre-pressure monitoring all come standard on this line.";

const introFallback =
  "This model embodies the beauty you want to explore in a car and the strength you need to sustain the experience. With a captivating design, it was produced to give you the all-encompassing comfort, sophistication, and experience you crave in a modern car.";

function specGroupBody(model: ModelDetailDTO): string {
  if (!model.specs || model.specs.length === 0) return designBodyFallback;
  const groups = new Map<string, string[]>();
  model.specs.forEach((s) => {
    const key = s.group ?? "General";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(`${s.label}:  ${s.value}`);
  });
  return Array.from(groups.entries())
    .map(([g, rows]) => `${g.toUpperCase()}\n${rows.join("\n")}`)
    .join("\n\n");
}

function buildSpecBar(model: ModelDetailDTO): Array<{ value: string; label: string }> {
  if (!model.specs || model.specs.length === 0) {
    return [
      { value: "321mi", label: "Range (EPA est.)" },
      { value: "125mph", label: "Top Speed" },
      { value: "5.8sec", label: "0-60mph" },
    ];
  }
  const preferred = ["engine capacity", "transmission", "drive type", "seating", "fuel tank", "power", "torque", "0-100"];
  const sorted = model.specs
    .slice()
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  const picks = preferred
    .map((p) => sorted.find((s) => s.label.toLowerCase().includes(p)))
    .filter(Boolean) as ModelDetailDTO["specs"];
  const fallback = sorted.slice(0, 3);
  const merged = (picks.length > 0 ? picks : fallback).slice(0, 3);
  return merged.map((s) => ({ value: s.value, label: s.label }));
}
