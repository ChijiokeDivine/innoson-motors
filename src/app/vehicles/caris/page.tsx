"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";

const SPECS = [
  { value: "321mi", label: "Range (EPA est.)" },
  { value: "125mph", label: "Top Speed" },
  { value: "5.8sec", label: "0-60mph" },
];

const DESIGN_BODY = `Improved Exhaust Tech – IVM improved exhaust helps to create that energetic performance needed to drive through long distance while maintaining optimal stability. It also helps to conserve your fuel efficiently, cools the temperature of the engine and allows the engine to breathe better. Adjustable passenger seats – IVM Caris gives you the finesse and peace you need while driving. There is a great need for your muscles to be well relaxed while driving; there is no room for discomfort while cruising with IVM Caris. Air Conditioned leather seats – each drive with IVM Caris is a memorable experience. The air conditioned leather seats create a lush feel and extreme relaxation while driving. Standard LED front lights – we used the latest technology in automotive lighting technology. No need to be frustrated with dull lights while driving. Power through the dark, your vision and balance are secured. Enhanced multimedia experience – play your favorite sounds with the inbuilt modern multimedia system in IVM Caris. You can connect your multimedia devices while driving. Automatic folding side mirrors – you can park comfortably without bothering about accidental smashing of your side mirrors. Front and rear airbags – the front and rear airbags are there to prevent fatal injuries if there is an unexpected crash.`;

const ACCORDION = [
  { id: "design", title: "Design", body: DESIGN_BODY },
  { id: "specs", title: "Specifications", body: DESIGN_BODY },
  { id: "tech", title: "Technology", body: DESIGN_BODY },
];

const TESTIMONIALS = [
  {
    img: "/images/testimonial-1.png",
    progress: "w-[25%]",
    name: "Nneka Okoli",
    location: "Anambra State",
  },
  {
    img: "/images/testimonial-2.png",
    progress: "w-[84%]",
    name: "Nneka Okoli",
    location: "Anambra State",
  },
];

export default function CarisDetailPage() {
  const [open, setOpen] = useState<string | null>("design");
  const [heroSlide, setHeroSlide] = useState(0);

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-google-sans)] text-[#1e1e1e]">
      <Header active="vehicles" />

      {/* Offset for fixed header */}
      <main className="pt-[72px] lg:pt-[80px]">
        {/* ========== HERO ========== */}
        <section className="relative">
          <div className="relative h-[383px] w-full overflow-hidden lg:h-[822px]">
            {/* Desktop hero */}
            <Image
              src="/images/hero-caris.png"
              alt="Innoson Caris"
              fill
              priority
              className="hidden object-cover lg:block"
            />
            {/* Mobile hero */}
            <Image
              src="/images/hero-caris-mobile.png"
              alt="Innoson Caris"
              fill
              priority
              className="object-cover lg:hidden"
            />
            <div className="absolute inset-0 bg-black/40" />

            {/* Copy + CTA */}
            <div className="absolute inset-0 flex flex-col items-center px-5 pt-8 text-center text-white lg:pt-10">
              <p className="text-[14px] font-bold tracking-wide lg:text-[17px]">
                BOLD AND ELEGANT
              </p>
              <h1 className="mt-1 text-[32px] font-black leading-none lg:mt-1 lg:text-[70px] lg:leading-[110px]">
                INNOSON CARIS
              </h1>
              <p className="mt-2 max-w-[523px] text-[14px] leading-5 lg:text-[17px]">
                IVM Caris embodies the beauty you want to explore in a car and the
                strength you need to sustain the experience.
              </p>
              <Link
                href="#quote"
                className="mt-4 flex h-10 w-[138px] items-center justify-center rounded-[4px] bg-[#005eb8] text-[14px] font-bold text-white"
              >
                Get Quote
              </Link>
            </div>

            {/* Nav arrows */}
            <button
              type="button"
              aria-label="Previous slide"
              className="absolute left-5 top-1/2 size-6 -translate-y-1/2 lg:left-[50px] lg:size-10"
              onClick={() => setHeroSlide((s) => Math.max(0, s - 1))}
            >
              <Image
                src="/icons/icon-nav-arrow.svg"
                alt=""
                width={40}
                height={40}
                className="size-full rounded-full"
              />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              className="absolute right-5 top-1/2 size-6 -translate-y-1/2 lg:right-[50px] lg:size-10"
              onClick={() => setHeroSlide((s) => s + 1)}
            >
              <Image
                src="/icons/icon-nav-arrow-alt.svg"
                alt=""
                width={40}
                height={40}
                className="size-full rotate-180"
              />
            </button>

            {/* Dots */}
            <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-4 lg:bottom-14">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setHeroSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                  className="relative size-4 border border-[#b1cbe8]"
                >
                  {heroSlide === i && (
                    <span className="absolute left-0.5 top-0.5 size-3 bg-white" />
                  )}
                </button>
              ))}
            </div>

            {/* SUV badge */}
            <div className="absolute bottom-3 right-5 flex h-[26px] w-[58px] items-center justify-center bg-[#005eb8] text-[12px] font-bold text-white lg:bottom-12 lg:right-[50px] lg:h-11 lg:w-[105px] lg:text-[20px]">
              SUV
            </div>
          </div>
        </section>

        {/* ========== INTRO ========== */}
        <Container className="py-10 lg:py-14">
          <h2 className="text-[24px] font-bold uppercase leading-normal lg:text-[40px]">
            Sleek, Sporty, Modern Sedan.
          </h2>
          <p className="mt-3 text-[14px] leading-normal text-[#1e1e1e] lg:mt-6 lg:text-[24px]">
            IVM Caris is one of our forays into future car designs. With a
            captivating sleeker design, it was produced to give you the
            all-encompassing comfort, sophistication, and experience you crave
            in a modern car. Imbibing our concept of regionalization in car
            manufacturing, IVM Caris embodies the beauty you want to explore in
            a car and the strength you need to sustain the experience.
          </p>
        </Container>

        {/* ========== ACCORDION ========== */}
        <Container className="pb-10">
          <div className="flex flex-col gap-6">
            {ACCORDION.map((item) => {
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
                      src={
                        isOpen
                          ? "/icons/icon-minus.svg"
                          : "/icons/icon-plus.svg"
                      }
                      alt=""
                      width={40}
                      height={40}
                      className="size-10 shrink-0"
                    />
                  </button>
                  {isOpen && item.body && (
                    <p className="pb-6 text-[14px] leading-relaxed lg:text-[18px]">
                      {item.body}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Container>

        {/* ========== SPECS BAR ========== */}
        <section className="bg-[#fafafa]">
          <Container className="flex flex-col gap-8 py-6 lg:flex-row lg:items-center lg:justify-between lg:py-8">
            <div className="flex justify-between gap-2 lg:gap-[140px]">
              {SPECS.map((s) => (
                <div key={s.label} className="min-w-0 text-center lg:text-left">
                  <p className="text-[16px] font-bold lg:text-[22px]">
                    {s.value}
                  </p>
                  <p className="text-[12px] lg:text-[14px]">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/icons/icon-pdf.svg"
                  alt=""
                  width={23}
                  height={27}
                  className="h-[27px] w-[23px]"
                />
                <button
                  type="button"
                  className="flex h-10 items-center justify-center rounded-[4px] border border-[#deeeff] bg-white px-5 text-[14px] font-bold"
                >
                  Download Pdf
                </button>
              </div>
              <Link
                href="#quote"
                className="flex h-10 items-center justify-center rounded-[4px] bg-[#005eb8] px-6 text-[14px] font-bold text-white"
              >
                Get Quote
              </Link>
            </div>
          </Container>
        </section>

        {/* ========== INTERIOR ========== */}
        <section className="relative h-[312px] w-full overflow-hidden lg:h-[800px]">
          <Image
            src="/images/interior-hero.png"
            alt="Interior design"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-5 text-white lg:px-[109px]">
            <p className="text-[14px] font-medium lg:text-[17px]">
              INTERIOR DESIGN
            </p>
            <h3 className="mt-2 max-w-[589px] text-[24px] font-bold leading-tight lg:text-[47px] lg:leading-[64px]">
              THOUGHTFUL DETAILS DECORATING THE SPACE
            </h3>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative h-[275px] lg:h-[383px]">
            <Image
              src="/images/interior-detail-1.png"
              alt="Interior detail"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-[259px] lg:h-[383px]">
            <Image
              src="/images/interior-detail-2.png"
              alt="Interior detail"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* ========== EXTERIOR ========== */}
        <section className="relative h-[276px] w-full overflow-hidden lg:h-[800px]">
          <Image
            src="/images/exterior-hero.png"
            alt="Exterior design"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/27" />
          <div className="absolute inset-0 flex flex-col justify-center px-5 text-white lg:px-[109px]">
            <p className="text-[14px] font-medium lg:text-[17px]">
              EXTERIOR DESIGN
            </p>
            <h3 className="mt-2 max-w-[432px] text-[24px] font-bold lg:text-[48px]">
              THE BOLD EXPERIENCE
            </h3>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative h-[344px] lg:h-[477px]">
            <Image
              src="/images/exterior-detail-1.png"
              alt="Exterior detail"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-[363px] lg:h-[478px]">
            <Image
              src="/images/exterior-detail-2.png"
              alt="Exterior detail"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* ========== CUSTOMER REPORT ========== */}
        <Container className="py-12 lg:py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-[14px] lg:text-[24px]">Customer Report</p>
              <h2 className="mt-2 max-w-[589px] text-[24px] font-bold uppercase leading-tight lg:text-[40px] lg:leading-[58px]">
                What Our customers say about innoson caris
              </h2>
            </div>
            <div className="hidden shrink-0 gap-4 lg:flex">
              <button type="button" className="size-10" aria-label="Previous">
                <Image
                  src="/icons/icon-nav-left.svg"
                  alt=""
                  width={40}
                  height={40}
                />
              </button>
              <button type="button" className="size-10" aria-label="Next">
                <Image
                  src="/icons/icon-nav-right.svg"
                  alt=""
                  width={40}
                  height={40}
                  className="rotate-180"
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="relative aspect-[660/532] overflow-hidden"
              >
                <Image
                  src={t.img}
                  alt={`${t.name} testimonial`}
                  fill
                  className="object-cover"
                />
                {/* Progress bar */}
                <div className="absolute left-4 right-4 top-6 h-3.5 rounded-full bg-white/25">
                  <div
                    className={`h-full rounded-full bg-white ${t.progress}`}
                  />
                </div>
                {/* Name + pause */}
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                  <div>
                    <p className="text-[20px] font-bold capitalize lg:text-[32px]">
                      {t.name}
                    </p>
                    <p className="text-[14px] capitalize lg:text-[24px]">
                      {t.location}
                    </p>
                  </div>
                  <Image
                    src="/icons/icon-pause.svg"
                    alt="Pause"
                    width={40}
                    height={40}
                    className="size-10 shrink-0"
                  />
                </div>
              </div>
            ))}
          </div>
        </Container>

        {/* ========== TECHNOLOGY CTA ========== */}
        <Container className="flex flex-col gap-8 pb-16 lg:flex-row lg:items-center lg:gap-10">
          <div className="relative aspect-[723/482] w-full overflow-hidden lg:w-[54%]">
            <Image
              src="/images/tech-reverse-camera.png"
              alt="Reverse camera"
              fill
              className="object-cover"
            />
          </div>
          <div className="lg:w-[46%]">
            <p className="text-[14px] lg:text-[24px]">Technology</p>
            <h3 className="mt-2 text-[24px] font-bold uppercase lg:text-[40px]">
              reverse camera
            </h3>
            <p className="mt-4 text-[14px] leading-relaxed lg:text-[18px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              consectetur massa in turpis commodo, id ultrices nisi tincidunt.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <Link
              id="quote"
              href="/book-a-test-drive"
              className="mt-6 inline-flex items-center gap-2 text-[20px] font-bold text-[#005eb8] lg:text-[32px]"
            >
              Get Quote Now
              <Image
                src="/icons/icon-arrow-up-right.svg"
                alt=""
                width={24}
                height={24}
                className="size-6 lg:size-8"
              />
            </Link>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}