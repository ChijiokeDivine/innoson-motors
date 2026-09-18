"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";

const VEHICLES = Array.from({ length: 9 }, (_, i) => ({
  id: `caris-${i + 1}`,
  name: "INNOSON CARIS",
  image: "/images/vehicle-caris-side.png",
}));

export default function BookTestDrivePage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const goToPersonalInfo = () => {
    if (!selectedId) {
      setShowAlert(true);
      return;
    }
    setShowAlert(false);
    setStep(2);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // wire to your API — includes selected vehicle + form fields
    const data = new FormData(e.currentTarget);
    console.log({
      vehicleId: selectedId,
      vehicleName: VEHICLES.find((v) => v.id === selectedId)?.name,
      name: data.get("name"),
      phone: data.get("phone"),
      email: data.get("email"),
      message: data.get("message"),
      marketing,
    });
  };

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-google-sans)] text-black">
      <Header />

      <main className="pt-[72px] lg:pt-[80px]">
        <Container className="relative pb-16 pt-6 lg:pb-20 lg:pt-10">
          {/* Title */}
          <h1 className="mx-auto max-w-[1112px] text-center text-[24px] font-extrabold uppercase leading-[37px] tracking-[0.02em] text-black lg:text-[40px] lg:capitalize lg:leading-[62px]">
            Book an Innoson test drive for any car model
          </h1>
          <p className="mx-auto mt-3 max-w-[1035px] text-center text-[14px] leading-[22px] tracking-[0.02em] text-[#524E4E] lg:mt-4 lg:text-[24px] lg:leading-[37px]">
            Please complete the form below to request a driving experience. It
            only takes a few minutes
          </p>

          {/* Steps */}
          <div className="mt-8 flex items-center justify-center gap-6 lg:mt-10 lg:gap-16">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-2 lg:gap-4"
            >
              <span className="flex size-[23px] items-center justify-center rounded-full border border-[#D5D7DA] text-[11px] text-[#272727] lg:size-[50px] lg:text-[24px]">
                1
              </span>
              <span
                className={`text-[16px] leading-[25px] tracking-[0.02em] lg:text-[24px] lg:leading-[37px] ${
                  step === 1 ? "text-[#005EB8]" : "text-[#005EB8]"
                }`}
              >
                Select Vehicle
              </span>
            </button>

            <button
              type="button"
              onClick={goToPersonalInfo}
              className="flex items-center gap-2 lg:gap-4"
            >
              <span className="flex size-[23px] items-center justify-center rounded-full border border-[#D5D7DA] text-[11px] text-[#272727] lg:size-[50px] lg:text-[24px]">
                2
              </span>
              <span
                className={`text-[16px] leading-[25px] tracking-[0.02em] lg:text-[24px] lg:leading-[37px] ${
                  step === 2 ? "text-[#005EB8]" : "text-[#BDBDBD]"
                }`}
              >
                Personal Information
              </span>
            </button>
          </div>

          <div className="mt-5 border-t border-[#D9D9D9] lg:mt-6" />

          {/* Validation toast */}
          {showAlert && (
            <div
              role="alert"
              className="absolute right-4 z-20 w-[min(320px,calc(100%-2rem))] rounded border border-[#7EB6E8] bg-[#E8F4FC] px-4 py-3 shadow-sm lg:right-[50px]"
              style={{ top: "min(360px, 40vh)" }}
            >
              <div className="flex items-start gap-2">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-[#E85D5D] text-[12px] font-bold text-[#E85D5D]">
                  !
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-[#1e1e1e]">
                    Please select a vehicle
                  </p>
                  <p className="mt-0.5 text-[12px] leading-snug text-[#524E4E]">
                    Select at least 1 vehicle to be able to proceed to the next
                    section
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Dismiss"
                  onClick={() => setShowAlert(false)}
                  className="shrink-0 text-[#888] hover:text-black"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 4l8 8M12 4l-8 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* ========== STEP 1 ========== */}
          {step === 1 && (
            <div className="mt-6 lg:mt-8">
              <div className="flex flex-col gap-5 lg:hidden">
                {VEHICLES.map((v) => (
                  <VehicleCard
                    key={v.id}
                    name={v.name}
                    image={v.image}
                    selected={selectedId === v.id}
                    onSelect={() => {
                      setSelectedId(v.id);
                      setShowAlert(false);
                    }}
                  />
                ))}
              </div>
              <div className="hidden grid-cols-3 gap-5 lg:grid">
                {VEHICLES.map((v) => (
                  <VehicleCard
                    key={v.id}
                    name={v.name}
                    image={v.image}
                    selected={selectedId === v.id}
                    onSelect={() => {
                      setSelectedId(v.id);
                      setShowAlert(false);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ========== STEP 2: Personal Information ========== */}
          {step === 2 && (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex w-full max-w-[353px] flex-col gap-[31px] lg:mt-8 lg:max-w-[624px]"
            >
              <input
                name="name"
                type="text"
                required
                placeholder="Name"
                className="h-12 w-full rounded-[4px] border-[0.5px] border-[#CFCFCF] px-3 text-[16px] leading-[25px] text-black outline-none placeholder:text-[#888888]"
              />
              <input
                name="phone"
                type="tel"
                required
                placeholder="Phone Number"
                className="h-12 w-full rounded-[4px] border-[0.5px] border-[#CFCFCF] px-3 text-[16px] leading-[25px] text-black outline-none placeholder:text-[#888888]"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email Address"
                className="h-12 w-full rounded-[4px] border-[0.5px] border-[#CFCFCF] px-3 text-[16px] leading-[25px] text-black outline-none placeholder:text-[#888888]"
              />
              <textarea
                name="message"
                rows={4}
                placeholder="Write a message"
                className="min-h-[125px] w-full resize-none rounded-[4px] border-[0.5px] border-[#CFCFCF] px-3 py-3 text-[16px] leading-[25px] text-black outline-none placeholder:text-[#888888]"
              />

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="mt-0.5 size-6 shrink-0 appearance-none rounded-[6px] border-[1.15px] border-[#D5D7DA] checked:border-[#005EB8] checked:bg-[#005EB8]"
                />
                <span className="text-[14px] uppercase leading-[22px] text-black">
                  I agree to sharing my information for marketing and engagement
                  purposes
                </span>
              </label>

              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center rounded-[4px] bg-[#005EB8] text-[14px] font-extrabold leading-5 text-white"
              >
                Submit
              </button>
            </form>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}

function VehicleCard({
  name,
  image,
  selected,
  onSelect,
}: {
  name: string;
  image: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="relative flex w-full flex-col items-center rounded-[4px] bg-[#F1F1F1] px-4 pb-6 pt-5 lg:h-[313px] lg:px-0 lg:pb-0 lg:pt-0"
    >
      <span
        className={`absolute right-5 top-5 flex size-6 items-center justify-center rounded-full border-[1.2px] bg-white ${
          selected ? "border-[#005EB8]" : "border-[#D5D4D4]"
        }`}
        aria-hidden
      >
        {selected && (
          <span className="size-[14.4px] rounded-full bg-[#005EB8]" />
        )}
      </span>

      <div className="relative mt-4 h-[140px] w-[262px] lg:mt-[26px] lg:h-[190px] lg:w-[356px]">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 262px, 356px"
        />
      </div>

      <p className="mt-4 text-center text-[24px] font-normal uppercase leading-[37px] text-black lg:mt-6">
        {name}
      </p>
    </button>
  );
}