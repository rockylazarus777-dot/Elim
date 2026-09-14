"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { serviceNavigation } from "@/content/service-navigation";

const CLOSE_DELAY_MS = 160;

/**
 * Compact premium mega-menu for the primary nav's "Services" item. Supports
 * hover AND click. Hover opens instantly and closes on a short delay after
 * the cursor leaves both the trigger and the panel — never flickers shut
 * while moving between them. Click is intentionally NOT a naive toggle: a
 * mouse click always hovers first, so a plain toggle would flash the menu
 * open (via hover) then immediately shut (via the click that follows) —
 * click instead "pins" the menu open, and a second click (or Escape /
 * click-outside) closes it. This also makes the trigger fully usable via
 * keyboard/touch, which never fires hover at all. Only Healthcare Compliance
 * & Licensing (group 01) has a nested flyout of its 6 sub-services — every
 * other group is a single tile linking straight to its service or its
 * /services section.
 */
export default function ServicesMenu() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const complianceCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pinnedRef = useRef(false);

  const [open, setOpen] = useState(false);
  const [complianceOpen, setComplianceOpen] = useState(false);
  const servicesActive = pathname === "/services" || pathname.startsWith("/services/");

  function closeAll() {
    pinnedRef.current = false;
    setOpen(false);
    setComplianceOpen(false);
  }

  function openMenuNow() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  }

  function scheduleMenuClose() {
    if (pinnedRef.current) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(closeAll, CLOSE_DELAY_MS);
  }

  function handleTriggerClick() {
    if (open && pinnedRef.current) {
      // Genuine second click while pinned open — close it.
      closeAll();
      return;
    }
    // First click: either opens it (keyboard/touch, no prior hover) or
    // "pins" it open if hover already opened it — never closes on this click.
    pinnedRef.current = true;
    openMenuNow();
  }

  function openComplianceNow() {
    if (complianceCloseTimer.current) {
      clearTimeout(complianceCloseTimer.current);
      complianceCloseTimer.current = null;
    }
    setComplianceOpen(true);
  }

  function scheduleComplianceClose() {
    if (complianceCloseTimer.current) clearTimeout(complianceCloseTimer.current);
    complianceCloseTimer.current = setTimeout(() => setComplianceOpen(false), CLOSE_DELAY_MS);
  }

  // Click outside closes the whole menu.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) closeAll();
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  // Escape closes the whole menu and returns focus to the trigger.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeAll();
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      if (complianceCloseTimer.current) clearTimeout(complianceCloseTimer.current);
    },
    [],
  );

  return (
    <div ref={containerRef} className="relative" onMouseEnter={openMenuNow} onMouseLeave={scheduleMenuClose}>
      <button
        ref={triggerRef}
        type="button"
        aria-current={servicesActive ? "page" : undefined}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={handleTriggerClick}
        onFocus={openMenuNow}
        className={`relative flex items-center gap-1.5 rounded-md px-3.5 py-2 text-[0.925rem] font-medium tracking-[-0.01em] transition-colors ${
          servicesActive || open ? "text-ink-900" : "text-ink-600 hover:text-ink-900"
        }`}
      >
        Services
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" className={`transition-transform duration-200 ${open ? "-rotate-180" : ""}`}>
          <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span
          className={`absolute inset-x-3.5 -bottom-[1px] h-px rounded-full bg-brand-600 transition-transform duration-300 ${
            servicesActive ? "scale-x-100" : "scale-x-0"
          }`}
        />
      </button>

      <div
        role="menu"
        aria-label="Services menu"
        className={`absolute right-0 top-full z-30 w-[min(480px,calc(100vw-2rem))] origin-top-right pt-3 transition-[opacity,transform,visibility] duration-200 xl:w-[min(640px,calc(100vw-2rem))] ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1.5 opacity-0"
        }`}
      >
        <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-[0_20px_48px_-12px_rgba(10,13,16,0.18)]">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-400">Services</p>

          <div className="grid grid-cols-2 gap-1 xl:grid-cols-3">
            {serviceNavigation.map((group) => (
              <div
                key={group.number}
                className="relative"
                onMouseEnter={group.hasSubmenu ? openComplianceNow : undefined}
                onMouseLeave={group.hasSubmenu ? scheduleComplianceClose : undefined}
              >
                <Link
                  role="menuitem"
                  href={group.href}
                  onClick={closeAll}
                  className={`group flex h-full flex-col gap-0.5 rounded-xl px-3 py-2.5 transition-colors hover:bg-ink-50 ${
                    group.hasSubmenu ? "pr-8" : ""
                  }`}
                >
                  <span className="text-[0.94rem] font-bold leading-normal text-brand-700 transition-colors group-hover:text-brand-800">{group.label}</span>
                  <span className="text-[0.75rem] leading-snug text-brand-600/70">{group.summary}</span>
                </Link>

                {group.hasSubmenu ? (
                  <>
                    <button
                      type="button"
                      aria-label={`Show ${group.label} sub-services`}
                      aria-expanded={complianceOpen}
                      onClick={(event) => {
                        event.stopPropagation();
                        setComplianceOpen((value) => !value);
                      }}
                      className="absolute right-1.5 top-2 flex h-7 w-7 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-900"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M4 2.5 7.5 6 4 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    <div
                      role="menu"
                      aria-label={`${group.label} sub-services`}
                      onMouseEnter={openComplianceNow}
                      onMouseLeave={scheduleComplianceClose}
                      className={`absolute left-0 top-[calc(100%+0.25rem)] z-40 w-[19rem] origin-top-left rounded-xl border border-ink-100 bg-white p-2 shadow-[0_20px_48px_-12px_rgba(10,13,16,0.2)] transition-[opacity,transform,visibility] duration-150 ${
                        complianceOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
                      }`}
                    >
                      <p className="px-2.5 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-400">{group.label}</p>
                      <div className="flex flex-col">
                        {group.subItems.map((item) => (
                          <Link
                            key={item.href}
                            role="menuitem"
                            href={item.href}
                            onClick={closeAll}
                            className="rounded-lg px-2.5 py-2 text-[0.8rem] leading-snug text-ink-700 transition-colors hover:bg-ink-50 hover:text-brand-700"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-ink-100 px-2 pt-3">
            <p className="text-[0.75rem] text-ink-500">Integrated expertise, one coordinated partner.</p>
            <Link href="/services" onClick={closeAll} className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-brand-700 hover:text-brand-800">
              View all services <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
