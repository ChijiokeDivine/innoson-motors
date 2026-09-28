"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "./Container";
import type { ContactInfoDTO } from "@/types/dto";
import { HONEYPOT_FIELD } from "@/lib/honeypot";

const NAV_COLUMNS = [
  {
    heading: "Vehicles",
    links: [
      { label: "SUV", href: "/vehicles?category=suvs" },
      { label: "Pickup", href: "/vehicles?category=pickup" },
      { label: "MPV", href: "/vehicles?category=mpv" },
      { label: "Cars", href: "/vehicles?category=cars" },
      { label: "Bus", href: "/vehicles?category=buses" },
      { label: "EV", href: "/vehicles?category=electric" },
    ],
  },
  {
    heading: "IVM",
    links: [
      { label: "News", href: "/news" },
      { label: "Find Showroom", href: "/contact#showrooms" },
      { label: "Book a Test Drive", href: "/book-a-test-drive" },
    ],
  },
];

type NLState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success" }
  | { status: "exists" }
  | { status: "error"; message: string };

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Footer({
  contactInfo,
  className = "",
}: {
  contactInfo?: ContactInfoDTO;
  className?: string;
}) {
  const supportEmail = contactInfo?.emails.find((e) => /support/i.test(e)) ??
    contactInfo?.emails[0] ??
    "Support@innosonmotors.com";
  const supportPhone = contactInfo?.phones[0]?.number ?? "+234 (0) 700-0000";
  const address = contactInfo?.address ?? NAV_ADDRESS_FALLBACK;

  const [nl, setNl] = useState<NLState>({ status: "idle" });
  const [email, setEmail] = useState("");

  async function handleNewsletterSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setNl({ status: "loading" });
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, [HONEYPOT_FIELD]: "" }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 409) {
        setNl({ status: "exists" });
      } else if (res.status === 429) {
        setNl({ status: "error", message: "Too many recent requests. Please try again later." });
      } else if (!res.ok) {
        setNl({
          status: "error",
          message:
            (json?.message as string | undefined) ??
            "We couldn't sign you up right now. Please try again later.",
        });
      } else {
        setNl({ status: "success" });
        setEmail("");
      }
    } catch {
      setNl({
        status: "error",
        message: "We couldn't reach our server. Please check your connection and try again.",
      });
    }
  }

  return (
    <footer className={`font-[family-name:var(--font-google-sans)] w-full bg-[#002a52] pt-6 text-white lg:rounded-[6px] ${className}`}>
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className="mx-auto flex flex-col items-center gap-[7px] text-[13px] text-[#d9d9d9]"
      >
        <Image
          src="/icons/icon-back-to-top.svg"
          alt=""
          width={14}
          height={7}
          className="rotate-90"
        />
        Up
      </button>

      <Container className="mt-6 flex flex-col gap-10 lg:mt-[100px] lg:gap-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-0">
          <div className="flex max-w-[499px] flex-col gap-4">
            <Image
              src="/images/logo-footer.png"
              alt="Innoson Vehicle Manufacturing"
              width={111}
              height={66}
              className="h-[66px] w-[111px] object-contain"
            />
            <div className="flex flex-col gap-3">
              <h2 className="text-[24px] font-bold capitalize leading-[normal] lg:text-[33px] lg:leading-[42px]">
                The Future of Mobility.
              </h2>
              <p className="max-w-[472px] text-[14px] font-light leading-[normal] lg:text-[17px] lg:leading-[27px]">
                Innoson Vehicle Manufacturing — the first privately owned
                indigenous automobile manufacturer in Nigeria and the largest
                in West Africa.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-[91px] gap-y-10">
            {NAV_COLUMNS.map((column) => (
              <div key={column.heading} className="flex flex-col gap-5">
                <h3 className="text-[22px] font-black leading-[20px]">{column.heading}</h3>
                <ul className="flex flex-col gap-4 text-[14px] leading-[20px]">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="flex flex-col gap-4 lg:w-[300px]">
              <h3 className="text-[22px] font-black leading-[20px]">Help &amp; Support</h3>
              <div className="flex flex-col gap-4 text-[14px] leading-normal">
                <a href={`mailto:${supportEmail}`} className="flex items-center gap-2">
                  <Image src="/icons/icon-email.svg" alt="" width={24} height={24} />
                  {supportEmail}
                </a>
                <a href={`tel:${supportPhone.replace(/\s/g, "")}`} className="flex items-center gap-2">
                  <Image src="/icons/icon-phone.svg" alt="" width={24} height={24} />
                  {supportPhone}
                </a>
                <div className="flex items-start gap-2 capitalize tracking-[0.07px]">
                  <Image
                    src="/icons/icon-location.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="shrink-0"
                  />
                  <div className="flex flex-col gap-2">
                    <p>{address}</p>
                  </div>
                </div>
                {contactInfo && contactInfo.socialLinks.length > 0 ? (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {contactInfo.socialLinks.map((s) => (
                      <a
                        key={s.platform}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.platform}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[11px] uppercase tracking-wide"
                      >
                        {s.platform.slice(0, 2)}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <form className="flex flex-col gap-4 lg:gap-6" onSubmit={handleNewsletterSubmit} noValidate>
          <div className="flex flex-col gap-2">
            <h3 className="text-[24px] font-bold tracking-[0.5px] leading-[normal]">
              Join our newsletter
            </h3>
            <p className="text-[16px] tracking-[0.5px] leading-[normal] text-[#e1e1e1]">
              Sign up to receive our weekly newsletter about new launches and exclusive financing offers
            </p>
          </div>
          <div className="flex flex-col gap-2 lg:flex-row lg:items-start">
            <div className="flex flex-1 flex-col gap-1">
              <input
                type="text"
                name={HONEYPOT_FIELD}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="h-[48px] flex-1 rounded-[5px] border-[0.5px] border-white bg-transparent px-[10px] py-[12px] text-[16px] tracking-[0.5px] text-white placeholder:text-[#b0b0b0]"
              />
              {nl.status === "error" ? (
                <p role="alert" className="text-[12px] font-semibold text-[#ffd3d3]">
                  {nl.message}
                </p>
              ) : null}
              {nl.status === "success" ? (
                <p role="status" className="text-[12px] font-semibold text-[#d7f5de]">
                  You are subscribed. Thank you!
                </p>
              ) : null}
              {nl.status === "exists" ? (
                <p role="status" className="text-[12px] font-semibold text-[#e2eaff]">
                  You&rsquo;re already subscribed — no worries.
                </p>
              ) : null}
            </div>
            <button
              type="submit"
              disabled={nl.status === "loading"}
              className="flex h-[48px] w-full items-center justify-center rounded-[6px] bg-white px-[14px] text-[16px] font-bold tracking-[0.192px] text-[#00a0ff] lg:w-[158px] disabled:opacity-70"
            >
              {nl.status === "loading" ? "Sending…" : "Submit"}
            </button>
          </div>
        </form>
      </Container>

      <Container className="mt-10 flex flex-col items-center gap-[30px] pb-10 lg:mt-16">
        <div className="h-px w-full bg-white/30" />
        <p className="text-center text-[13px] leading-[20px]">
          ©Copyright 2025. All rights reserved (Innoson Manufacturing Vehicles, LTD)
        </p>
      </Container>
    </footer>
  );
}

const NAV_ADDRESS_FALLBACK =
  "No 2 Innoson Industrial Estate, Akwa-Uru, Uru Umudim, Nnewi, Anambra State";
