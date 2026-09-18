"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "./Container";

const NAV_LINKS = [
  { label: "Vehicles", href: "/vehicles", id: "vehicles" },
  { label: "About Us", href: "/about", id: "about" },
  { label: "News", href: "/news", id: "news" },
  { label: "Contact Us", href: "/contact", id: "contact" },
];

const PHONE_LABEL = "Call : 081xxxxxxxxx";

// 1. Define the TypeScript interface for the component props
interface HeaderProps {
  active?: "vehicles" | "about" | "news" | "contact" | string;
}

// 2. Destructure the active prop into the component
export default function Header({ active }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="font-[family-name:var(--font-google-sans)] fixed top-0 left-0 right-0 z-50 w-full border-b border-[#e4e4e4] bg-white">
      <Container className="flex h-[72px] items-center justify-between lg:h-[80px]">
        {/* Mobile: hamburger */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex size-6 items-center justify-center lg:hidden"
        >
          <Image src="/icons/icon-hamburger.svg" alt="" width={24} height={24} />
        </button>

        {/* Mobile: logo */}
        <Link href="/" className="lg:hidden">
          <Image
            src="/images/logo-header-mobile.png"
            alt="Innoson Vehicle Manufacturing"
            width={60}
            height={45}
            className="h-[45px] w-[60px] object-contain"
          />
        </Link>

        {/* Desktop: logo + primary nav */}
        <div className="hidden items-center gap-[60px] lg:flex">
          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo-header.png"
              alt="Innoson Vehicle Manufacturing"
              width={149}
              height={31}
              className="h-[31px] w-[149px] object-contain"
            />
          </Link>
          <nav className="flex items-center gap-[66px] text-[14px] text-black">
            {NAV_LINKS.map((link) => {
              // Check if this link matches the active prop
              const isActive = active === link.id;
              
              return (
                <Link 
                  key={link.label} 
                  href={link.href} 
                  className={`whitespace-nowrap leading-[20px] transition-colors ${
                    isActive ? "font-bold text-[#005eb8] border-b-2 border-[#005eb8]" : "hover:text-[#005eb8]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop: phone + CTA */}
        <div className="hidden items-center gap-6 lg:flex">
          <a
            href="tel:081xxxxxxxxx"
            className="whitespace-nowrap text-[16px] font-bold leading-[20px] text-[#005eb8]"
          >
            {PHONE_LABEL}
          </a>
          <Link
            href="/book-a-test-drive"
            className="flex h-[38px] w-[143px] items-center justify-center rounded-[4px] bg-[#005eb8] px-1.5 py-1 text-center text-[14px] font-bold text-white"
          >
            Book a Test Drive
          </Link>
        </div>
      </Container>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="border-t border-[#e4e4e4] bg-white px-5 py-6 lg:hidden">
          <nav className="flex flex-col gap-4 text-[14px] text-black">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.id;

              return (
                <Link 
                  key={link.label} 
                  href={link.href} 
                  onClick={() => setMenuOpen(false)}
                  className={isActive ? "font-bold text-[#005eb8]" : ""}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <a href="tel:081xxxxxxxxx" className="mt-6 block text-[14px] font-bold text-[#005eb8]">
            {PHONE_LABEL}
          </a>
          <Link
            href="/book-a-test-drive"
            className="mt-4 flex h-[38px] w-full items-center justify-center rounded-[4px] bg-[#005eb8] text-[14px] font-bold text-white"
            onClick={() => setMenuOpen(false)}
          >
            Book a Test Drive
          </Link>
        </div>
      )}
    </header>
  );
}