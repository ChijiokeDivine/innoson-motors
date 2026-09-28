"use client";

import { useState, type FormEvent } from "react";
import { VEHICLE_BRANDS } from "./contact-data";
import { HONEYPOT_FIELD } from "@/lib/honeypot";

type SubState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fields?: Record<string, string> };

export default function ContactForm({ className = "" }: { className?: string }) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sub, setSub] = useState<SubState>({ status: "idle" });

  function toggleBrand(brand: string) {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSub({ status: "loading" });
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      [HONEYPOT_FIELD]: (fd.get(HONEYPOT_FIELD) as string | null) ?? "",
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      subject: String(fd.get("subject") ?? ""),
      message: String(fd.get("message") ?? ""),
      interestedBrands: selectedBrands,
    };
    try {
      const res = await fetch("/api/contact", {
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
              "Too many messages from this connection. Please try again in an hour.",
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
              "We couldn't send your message right now. Please try again later.",
          });
        }
        return;
      }
      setSub({
        status: "success",
        message:
          "Thanks — we've received your message and will get back to you soon.",
      });
      setSelectedBrands([]);
      form.reset();
    } catch {
      setSub({
        status: "error",
        message:
          "We couldn't reach our server right now. Please check your connection and try again.",
      });
    }
  }

  const inputClasses =
    "h-[48px] w-full rounded-[4px] border-[0.5px] border-[#cfcfcf] px-3 text-[16px] text-black outline-none placeholder:text-[#888888]";

  return (
    <div
      className={`font-[family-name:var(--font-google-sans)] w-full rounded-[9px] border-[0.5px] border-[#e6e6e6] bg-white p-3 lg:w-[684px] lg:p-[30px] ${className}`}
    >
      <h2 className="text-[20px] font-extrabold text-[#333333] lg:text-[40px] lg:leading-[62px]">
        Send a Message
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4 lg:mt-10 lg:gap-6" noValidate>
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
            <Field error={sub.status === "error" ? sub.fields?.name : undefined}>
              <input type="text" name="name" placeholder="Name" required className={inputClasses} />
            </Field>
            <Field error={sub.status === "error" ? sub.fields?.phone : undefined}>
              <input type="tel" name="phone" placeholder="Phone Number" required className={inputClasses} />
            </Field>

            <div className="flex flex-col gap-4">
              <p className="text-[14px] font-extrabold uppercase text-[#1e1e1e] lg:text-[16px]">
                Choose your interested vehicle brand
              </p>
              <div className="flex flex-col gap-3">
                {VEHICLE_BRANDS.map((brand: string) => (
                  <label key={brand} className="flex items-center gap-2 text-[14px] uppercase text-black">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="size-6 shrink-0 rounded-[6px] border-[1.15px] border-[#d5d7da] accent-[#005eb8]"
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>

            <Field error={sub.status === "error" ? sub.fields?.email : undefined}>
              <input type="email" name="email" placeholder="Email Address" required className={inputClasses} />
            </Field>
            <Field error={sub.status === "error" ? sub.fields?.subject : undefined}>
              <input type="text" name="subject" placeholder="Subject" required className={inputClasses} />
            </Field>
            <Field error={sub.status === "error" ? sub.fields?.message : undefined}>
              <textarea
                name="message"
                placeholder="Write a message"
                required
                rows={4}
                className="w-full resize-none rounded-[4px] border-[0.5px] border-[#cfcfcf] px-3 py-3 text-[16px] text-black outline-none placeholder:text-[#888888]"
              />
            </Field>

            <button
              type="submit"
              disabled={sub.status === "loading"}
              className="flex h-[48px] w-full items-center justify-center rounded-[4px] bg-[#005eb8] text-[14px] font-extrabold text-white disabled:opacity-60"
            >
              {sub.status === "loading" ? "Sending…" : "Submit"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}

function Field({
  error,
  children,
}: {
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      {children}
      {error ? (
        <p role="alert" className="text-[12px] font-semibold text-[#9a2a2a]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
