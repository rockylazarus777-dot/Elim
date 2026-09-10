"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import { serviceNavigation } from "@/content/service-navigation";
import { trackCtaClick } from "@/lib/tracking";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [openGroupNumber, setOpenGroupNumber] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // The overlay is portaled to document.body (see below) rather than left as
  // a normal descendant of <header>: the header's backdrop-blur establishes
  // a new CSS containing block for position:fixed descendants, which would
  // otherwise size and clip this fixed, full-screen overlay to the header's
  // own ~64px box instead of the viewport.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(pathname === "/services" || pathname.startsWith("/services/"));
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const overlay = (
    <div
      id="mobile-menu"
      aria-hidden={!open}
      className={`fixed inset-0 z-[60] flex flex-col bg-ink-950 transition-opacity duration-400 ease-out ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="pointer-events-none h-16 shrink-0" aria-hidden="true" />
      <nav aria-label="Mobile" className="container-page flex flex-1 flex-col gap-1 overflow-y-auto pb-20 pt-4">
        {siteConfig.nav.map((item, index) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          if (item.label === "Services") {
            const servicesActive = pathname === "/services" || pathname.startsWith("/services/");
            return (
              <div key={item.href} className="border-b border-white/10">
                <div className="flex items-center">
                  <button
                    type="button"
                    aria-expanded={servicesOpen}
                    aria-controls="mobile-services-panel"
                    onClick={() => setServicesOpen((value) => !value)}
                    style={{ transitionDelay: open ? `${index * 45 + 80}ms` : "0ms" }}
                    className={`flex flex-1 items-center justify-between py-4 font-display text-3xl transition-all duration-500 ease-out ${
                      servicesActive ? "text-white" : "text-white/70 hover:text-white"
                    } ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
                  >
                    Services
                    <span aria-hidden="true" className="ml-3 text-2xl font-normal text-brand-300">
                      {servicesOpen ? "−" : "+"}
                    </span>
                  </button>
                </div>
                <div
                  id="mobile-services-panel"
                  className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
                    servicesOpen ? "max-h-[1200px] pb-3 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {serviceNavigation.map((group) => {
                    const isGroupOpen = openGroupNumber === group.number;
                    return (
                      <div key={group.number} className="ml-3 border-l border-white/15 pl-4">
                        <div className="flex items-center">
                          <Link href={group.href} onClick={() => setOpen(false)} className="flex-1 py-2.5 text-sm font-medium leading-snug text-white/75 hover:text-white">
                            <span className="mr-2 font-display text-brand-300">{group.number}</span>{group.label}
                          </Link>
                          {group.hasSubmenu ? (
                            <button
                              type="button"
                              aria-label={`Toggle ${group.label} sub-services`}
                              aria-expanded={isGroupOpen}
                              aria-controls={`mobile-group-${group.number}`}
                              onClick={() => setOpenGroupNumber((value) => (value === group.number ? null : group.number))}
                              className="flex h-10 w-10 shrink-0 items-center justify-center text-lg text-white/60 hover:text-white"
                            >
                              <span aria-hidden="true">{isGroupOpen ? "−" : "+"}</span>
                            </button>
                          ) : null}
                        </div>
                        {group.hasSubmenu ? (
                          <div
                            id={`mobile-group-${group.number}`}
                            className={`overflow-hidden border-t border-white/10 pl-3 transition-[max-height,opacity] duration-300 ${
                              isGroupOpen ? "max-h-[480px] py-1 opacity-100" : "max-h-0 opacity-0"
                            }`}
                          >
                            {group.subItems.map((item) => (
                              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block py-2 text-sm leading-snug text-white/55 hover:text-white">
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                  <Link
                    href="/services"
                    onClick={() => setOpen(false)}
                    className="ml-3 mt-2 inline-flex items-center gap-1.5 pl-4 text-sm font-semibold text-brand-300 hover:text-white"
                  >
                    View all services <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ transitionDelay: open ? `${index * 45 + 80}ms` : "0ms" }}
              className={`border-b border-white/10 py-4 font-display text-3xl transition-all duration-500 ease-out ${
                isActive ? "text-white" : "text-white/70 hover:text-white"
              } ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
            >
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/contact"
          onClick={() => trackCtaClick("Connect with Our Team", "mobile_nav")}
          style={{ transitionDelay: open ? `${siteConfig.nav.length * 45 + 120}ms` : "0ms" }}
          className={`btn-primary mt-8 w-full justify-center transition-all duration-500 ease-out ${
            open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          Connect with Our Team
        </Link>
      </nav>
    </div>
  );

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className={`relative z-[70] flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-inset transition-colors ${
          open ? "text-white ring-white/30 hover:bg-white/10" : "text-ink-900 ring-ink-200 hover:bg-ink-50"
        }`}
      >
        <span className="relative block h-4 w-5">
          <span
            className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition-transform duration-300 ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-[7px] h-0.5 w-5 bg-current transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 top-[14px] h-0.5 w-5 bg-current transition-transform duration-300 ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      {mounted ? createPortal(overlay, document.body) : null}
    </div>
  );
}
