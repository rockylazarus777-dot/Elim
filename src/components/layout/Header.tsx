"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import ServicesMenu from "./ServicesMenu";
import { siteConfig } from "@/lib/site-config";
import { trackCtaClick } from "@/lib/tracking";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const publishHeight = () => {
      document.documentElement.style.setProperty("--navbar-h", `${header.offsetHeight}px`);
    };
    publishHeight();
    const observer = new ResizeObserver(publishHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-b border-ink-100 bg-white/95 shadow-[0_1px_0_rgba(10,13,16,0.04)] backdrop-blur-md"
          : "border-b border-transparent bg-white/70 backdrop-blur-sm"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-0.5">
            {siteConfig.nav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              if (item.label === "Services") {
                return (
                  <li key={item.href}>
                    <ServicesMenu />
                  </li>
                );
              }
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative rounded-md px-3.5 py-2 text-[0.925rem] font-medium tracking-[-0.01em] transition-colors ${
                      isActive ? "text-ink-900" : "text-ink-600 hover:text-ink-900"
                    }`}
                  >
                    {item.label}
                    <span
                      className={`absolute inset-x-3.5 -bottom-[1px] h-px rounded-full bg-brand-600 transition-transform duration-300 ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center md:flex">
          <Link
            href="/contact"
            onClick={() => trackCtaClick("Connect with Our Team", "header")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-4 py-2 text-[0.875rem] font-semibold text-white shadow-[0_1px_2px_rgba(10,13,16,0.06),0_4px_10px_-4px_rgba(28,81,74,0.45)] transition-all duration-200 hover:-translate-y-px hover:bg-brand-800 hover:shadow-[0_2px_4px_rgba(10,13,16,0.08),0_8px_16px_-6px_rgba(28,81,74,0.5)] active:translate-y-0"
          >
            Connect with Our Team
          </Link>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
