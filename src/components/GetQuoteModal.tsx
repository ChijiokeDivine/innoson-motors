"use client";

import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { HONEYPOT_FIELD } from "@/lib/honeypot";

type GetQuoteModalProps = {
  open: boolean;
  onClose: () => void;
  vehicleType?: string;
  vehicleSlug?: string | null;
};

type SubState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fields?: Record<string, string> };

export default function GetQuoteModal({
  open,
  onClose,
  vehicleType = "Innoson Caris",
  vehicleSlug = null,
}: GetQuoteModalProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [sub, setSub] = useState<SubState>({ status: "idle" });

  const handleClose = useCallback(() => {
    setSub({ status: "idle" });
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSub({ status: "loading" });
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      [HONEYPOT_FIELD]: (fd.get(HONEYPOT_FIELD) as string | null) ?? "",
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      address: String(fd.get("address") ?? ""),
      vehicleModel: String(fd.get("vehicleType") ?? vehicleType),
      vehicleModelSlug: vehicleSlug,
      message: String(fd.get("message") ?? ""),
    };
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 429) {
          setSub({
            status: "error",
            message:
              (json?.message as string | undefined) ??
              "Too many recent requests. Please try again later.",
          });
        } else if (res.status === 422) {
          const fields: Record<string, string> = {};
          const err = json?.errors;
          if (err && typeof err === "object") {
            for (const [k, v] of Object.entries(err as Record<string, unknown>)) {
              if (typeof v === "string") fields[k] = v;
            }
          }
          setSub({
            status: "error",
            message:
              (json?.message as string | undefined) ??
              "Please check the highlighted fields and try again.",
            fields,
          });
        } else {
          setSub({
            status: "error",
            message:
              (json?.message as string | undefined) ??
              "We couldn't process your request right now. Please try again later.",
          });
        }
        return;
      }
      setSub({
        status: "success",
        message:
          "Thanks — your quote request has been received. Our sales team will reach out within one business day.",
      });
      setTimeout(() => {
        handleClose();
      }, 2500);
    } catch {
      setSub({
        status: "error",
        message:
          "We couldn't reach our server right now. Please check your connection and try again.",
      });
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-[5px] lg:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <ModalShell
        titleId={titleId}
        closeRef={closeRef}
        onClose={handleClose}
        vehicleType={vehicleType}
        sub={sub}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

function ModalShell({
  titleId,
  closeRef,
  onClose,
  vehicleType,
  sub,
  onSubmit,
}: {
  titleId: string;
  closeRef: React.MutableRefObject<HTMLButtonElement | null>;
  onClose: () => void;
  vehicleType: string;
  sub: SubState;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <>
      <div className="relative hidden h-[680px] w-[895px] overflow-hidden bg-white lg:flex">
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
        <div className="relative flex flex-1 flex-col px-10 pb-8 pt-12">
          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-6 top-6 size-6"
          >
            <Image src="/icons/icon-cancel.svg" alt="" width={24} height={24} className="size-6" />
          </button>
          <h2 id={titleId} className="text-center text-[36px] font-bold capitalize leading-none text-black">
            Get Quote
          </h2>
          <p className="mt-4 text-[16px] leading-normal text-[#1e1e1e]">
            Kindly provide the information below and our sales personnel will
            reach out to you shortly
          </p>
          <QuoteForm onSubmit={onSubmit} vehicleType={vehicleType} sub={sub} variant="desktop" />
        </div>
      </div>

      <div className="relative flex max-h-[100dvh] w-full max-w-[393px] flex-col overflow-y-auto bg-white lg:hidden">
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
            <Image src="/icons/icon-cancel.svg" alt="" width={24} height={24} className="size-6" />
          </button>
        </div>
        <div className="flex flex-1 flex-col px-5 pb-6 pt-5">
          <h2 id={titleId} className="text-[24px] font-bold capitalize leading-none text-black">
            Get Quote
          </h2>
          <p className="mt-3 text-[14px] leading-normal text-[#1e1e1e]">
            Kindly provide the information below and our sales personnel will
            reach out to you shortly
          </p>
          <QuoteForm onSubmit={onSubmit} vehicleType={vehicleType} sub={sub} variant="mobile" />
        </div>
      </div>
    </>
  );
}

function QuoteForm({
  onSubmit,
  vehicleType,
  sub,
  variant,
}: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  vehicleType: string;
  sub: SubState;
  variant: "desktop" | "mobile";
}) {
  const input =
    "h-10 w-full rounded-[4px] border-[0.5px] border-[#cfcfcf] px-3 text-[14px] text-black outline-none placeholder:text-[#888]";

  return (
    <form
      onSubmit={onSubmit}
      className={`flex flex-1 flex-col gap-4 ${variant === "desktop" ? "mt-6" : "mt-5"}`}
      noValidate
    >
      <input
        type="text"
        name={HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {sub.status === "error" && sub.message ? (
        <div role="alert" className="rounded-[4px] border border-[#f3b6b6] bg-[#fdecec] p-3 text-[14px] font-semibold text-[#9a2a2a]">
          {sub.message}
        </div>
      ) : null}

      {sub.status === "success" ? (
        <div role="status" className="rounded-[4px] border border-[#7ec18e] bg-[#e9f8ee] p-3 text-[14px] font-semibold text-[#225b3a]">
          {sub.message}
        </div>
      ) : (
        <>
          <Field label="Full Name" error={sub.status === "error" ? sub.fields?.name : undefined}>
            <input name="name" type="text" required placeholder="E.g Chike Okafor" className={input} />
          </Field>
          <Field label="Vehicle Type">
            <input
              name="vehicleType"
              defaultValue={vehicleType}
              readOnly
              className="h-10 w-full rounded-[4px] border-[0.5px] border-[#cfcfcf] px-3 text-[14px] font-bold text-black outline-none"
            />
          </Field>
          <Field label="Phone number" error={sub.status === "error" ? sub.fields?.phone : undefined}>
            <input name="phone" type="tel" required placeholder="E.g 08106367382" className={input} />
          </Field>
          <Field label="Email" error={sub.status === "error" ? sub.fields?.email : undefined}>
            <input name="email" type="email" required placeholder="E.g Chike@gmail.com" className={input} />
          </Field>
          <Field label="Residential Address" error={sub.status === "error" ? sub.fields?.address : undefined}>
            <input name="address" type="text" required placeholder="E.g 12 Allen Avenue, Ikeja, Lagos" className={input} />
          </Field>
          <Field label="Message" error={sub.status === "error" ? sub.fields?.message : undefined}>
            <textarea
              name="message"
              rows={3}
              placeholder="Write a message"
              className="min-h-[94px] w-full resize-none rounded-[4px] border-[0.5px] border-[#cfcfcf] px-3 py-3 text-[14px] text-black outline-none placeholder:text-[#888]"
            />
          </Field>
          <button
            type="submit"
            disabled={sub.status === "loading"}
            className={`flex h-12 w-full items-center justify-center rounded-[4px] bg-[#005eb8] text-[14px] font-bold text-white disabled:opacity-60 ${
              variant === "desktop" ? "mt-auto" : "mt-4"
            }`}
          >
            {sub.status === "loading" ? "Submitting…" : "Submit"}
          </button>
        </>
      )}
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex w-full flex-col gap-2">
      <span className="text-[12px] font-bold uppercase leading-none text-[#888]">
        {label}
      </span>
      {children}
      {error ? (
        <p role="alert" className="text-[12px] font-semibold text-[#9a2a2a]">
          {error}
        </p>
      ) : null}
    </label>
  );
}
