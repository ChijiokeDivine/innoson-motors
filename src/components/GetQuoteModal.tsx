"use client";

import { useEffect, useId, useRef } from "react";
import Image from "next/image";

type GetQuoteModalProps = {
  open: boolean;
  onClose: () => void;
  /** Pre-filled vehicle name (default: Innoson Caris) */
  vehicleType?: string;
};

export default function GetQuoteModal({
  open,
  onClose,
  vehicleType = "Innoson Caris",
}: GetQuoteModalProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll + focus close button when opened
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-[5px] lg:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* ========== DESKTOP MODAL (895 × 640) ========== */}
      <div className="relative hidden h-[640px] w-[895px] overflow-hidden bg-white lg:flex">
        {/* Left image panel */}
        <div className="relative h-full w-[456px] shrink-0 bg-[#ebebeb]">
          <Image
            src="/images/quote-car.png"
            alt=""
            fill
            className="object-cover object-left"
            sizes="456px"
            priority
          />
        </div>

        {/* Right form panel */}
        <div className="relative flex flex-1 flex-col px-10 pb-8 pt-12">
          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-6 top-6 size-6"
          >
            <Image
              src="/icons/icon-cancel.svg"
              alt=""
              width={24}
              height={24}
              className="size-6"
            />
          </button>

          <h2
            id={titleId}
            className="text-center text-[36px] font-bold capitalize leading-none text-black"
          >
            Get Quote
          </h2>
          <p className="mt-4 text-[16px] leading-normal text-[#1e1e1e]">
            Kindly provide the information below and our sales personnel will
            reach out to you shortly
          </p>

          <form
            className="mt-6 flex flex-1 flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              // wire to your API
              onClose();
            }}
          >
            <Field label="Vehicle Type">
              <input
                name="vehicleType"
                defaultValue={vehicleType}
                readOnly
                className="h-10 w-full rounded-[4px] border-[0.5px] border-[#cfcfcf] px-3 text-[14px] font-bold text-black outline-none"
              />
            </Field>

            <Field label="Phone number">
              <input
                name="phone"
                type="tel"
                required
                placeholder="E.g 081063673829"
                className="h-10 w-full rounded-[4px] border-[0.5px] border-[#cfcfcf] px-3 text-[14px] text-black outline-none placeholder:text-[#888]"
              />
            </Field>

            {/* Figma labels this "Phone number" but placeholder is email */}
            <Field label="Email">
              <input
                name="email"
                type="email"
                required
                placeholder="E.g Chike.........@gmail.com"
                className="h-10 w-full rounded-[4px] border-[0.5px] border-[#cfcfcf] px-3 text-[14px] text-black outline-none placeholder:text-[#888]"
              />
            </Field>

            <Field label="Message">
              <textarea
                name="message"
                rows={3}
                placeholder="Write a message"
                className="min-h-[94px] w-full resize-none rounded-[4px] border-[0.5px] border-[#cfcfcf] px-3 py-3 text-[14px] text-black outline-none placeholder:text-[#888]"
              />
            </Field>

            <button
              type="submit"
              className="mt-auto flex h-12 w-full items-center justify-center rounded-[4px] bg-[#005eb8] text-[14px] font-bold text-white"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* ========== MOBILE MODAL (full-width sheet) ========== */}
      <div className="relative flex max-h-[100dvh] w-full max-w-[393px] flex-col overflow-y-auto bg-white lg:hidden">
        {/* Image + close */}
        <div className="relative h-[316px] w-full shrink-0">
          <Image
            src="/images/quote-car.png"
            alt=""
            fill
            className="object-cover"
            sizes="393px"
            priority
          />
          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-5 top-5 size-6"
          >
            <Image
              src="/icons/icon-cancel.svg"
              alt=""
              width={24}
              height={24}
              className="size-6"
            />
          </button>
        </div>

        <div className="flex flex-1 flex-col px-5 pb-6 pt-5">
          <h2
            id={titleId}
            className="text-[24px] font-bold capitalize leading-none text-black"
          >
            Get Quote
          </h2>
          <p className="mt-3 text-[14px] leading-normal text-[#1e1e1e]">
            Kindly provide the information below and our sales personnel will
            reach out to you shortly
          </p>

          <form
            className="mt-5 flex flex-1 flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            <Field label="Vehicle Type">
              <input
                name="vehicleType"
                defaultValue={vehicleType}
                readOnly
                className="h-10 w-full rounded-[4px] border-[0.5px] border-[#cfcfcf] px-3 text-[14px] font-bold text-black outline-none"
              />
            </Field>

            <Field label="Phone number">
              <input
                name="phone"
                type="tel"
                required
                placeholder="E.g 081063673829"
                className="h-10 w-full rounded-[4px] border-[0.5px] border-[#cfcfcf] px-3 text-[14px] text-black outline-none placeholder:text-[#888]"
              />
            </Field>

            <Field label="Email">
              <input
                name="email"
                type="email"
                required
                placeholder="E.g Chike.........@gmail.com"
                className="h-10 w-full rounded-[4px] border-[0.5px] border-[#cfcfcf] px-3 text-[14px] text-black outline-none placeholder:text-[#888]"
              />
            </Field>

            <Field label="Message">
              <textarea
                name="message"
                rows={3}
                placeholder="Write a message"
                className="min-h-[94px] w-full resize-none rounded-[4px] border-[0.5px] border-[#cfcfcf] px-3 py-3 text-[14px] text-black outline-none placeholder:text-[#888]"
              />
            </Field>

            <button
              type="submit"
              className="mt-4 flex h-12 w-full items-center justify-center rounded-[4px] bg-[#005eb8] text-[14px] font-bold text-white"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex w-full flex-col gap-2">
      <span className="text-[12px] font-bold uppercase leading-none text-[#888]">
        {label}
      </span>
      {children}
    </label>
  );
}