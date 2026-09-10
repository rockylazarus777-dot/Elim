"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { interpolate, Easing } from "remotion";
import ServiceScene from "@/components/home/ecosystem/ServiceScenes";
import Reveal from "@/components/shared/Reveal";
import { serviceFamilies } from "@/content/service-families";
import { serviceNavigation } from "@/content/service-navigation";
import type { IconKey, ServiceFamily } from "@/types/content";

/**
 * "What we do" — a once-only cinematic assembly (EMC hub -> connecting
 * lines -> three sectors -> their services, each sector's services fanning
 * outward from that sector) that then becomes a fully interactive radial
 * map. Left side copy/wording/CTA/positioning is locked — only its
 * typographic scale, contrast and surrounding whitespace may be adjusted.
 *
 * Motion timing uses Remotion's pure `interpolate`/`Easing` helpers (already
 * a project dependency, see remotion/src/HeroIntro.tsx) purely as animation
 * math — nothing here renders through Remotion's Player/Composition, so the
 * whole thing stays a normal interactive DOM tree driven by React state.
 *
 * Hrefs/labels come from service-families.ts + service-navigation.ts (the
 * same source the header mega-menu uses), so a link here can never dangle.
 */

const ACCENT = "#20E0D0";
const EMC_POS = { x: 50, y: 50 };
/** Fixed angles (degrees) for the hub's settled orbital particles — placed
 * once during assembly, never animated afterward. */
const PARTICLE_ANGLES = [15, 95, 165, 235, 305] as const;

interface ServiceNode {
  familyId: ServiceFamily;
  x: number;
  y: number;
  linePath: string;
}

interface Sector {
  id: string;
  number: string;
  title: string;
  x: number;
  y: number;
  linePath: string;
  services: ServiceNode[];
}

/** Gently bowed quadratic bezier between two points, in 0-100 viewBox space. */
function curve(x1: number, y1: number, x2: number, y2: number, bend: number): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / len) * len * bend;
  const cy = my + (dx / len) * len * bend;
  return `M${x1},${y1} Q${cx.toFixed(2)},${cy.toFixed(2)} ${x2},${y2}`;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

interface SectorDef {
  id: string;
  number: string;
  title: string;
  familyIds: ServiceFamily[];
  x: number;
  y: number;
  servicePositions: { x: number; y: number }[];
}

/**
 * Hand-placed layout (not pure trig) so every node clears the canvas edges
 * and its neighbours — see the brief's own "flowing fan, not a stacked
 * card" ASCII diagrams. Adjusted empirically against real renders.
 */
/**
 * Spacing is more generous than a plain icon+label pill needs, because each
 * service node is now a small 3D scene + glass platform + label stacked
 * vertically (see ServiceScenes.tsx) — noticeably taller than the old
 * compact pill, so neighbouring nodes and canvas edges need more clearance.
 */
const SECTOR_DEFS: SectorDef[] = [
  {
    id: "compliance-quality",
    number: "01",
    title: "Compliance & Quality",
    familyIds: ["compliance-licensing", "quality-accreditation", "records-management"],
    x: 50,
    y: 27,
    servicePositions: [
      { x: 24, y: 11 },
      { x: 50, y: 6 },
      { x: 76, y: 11 },
    ],
  },
  {
    id: "establishment-support",
    number: "02",
    title: "Establishment & Business Support",
    familyIds: ["facility-setup", "equipment-infrastructure", "manpower", "insurance-tpa"],
    x: 24,
    y: 70,
    servicePositions: [
      { x: 10, y: 55 },
      { x: 7, y: 79 },
      { x: 25, y: 92 },
      { x: 46, y: 84 },
    ],
  },
  {
    id: "outreach-growth",
    number: "03",
    title: "Outreach & Growth",
    familyIds: ["marketing", "medical-camps"],
    x: 76,
    y: 70,
    servicePositions: [
      { x: 90, y: 53 },
      { x: 90, y: 87 },
    ],
  },
];

const sectors: Sector[] = SECTOR_DEFS.map((def) => ({
  id: def.id,
  number: def.number,
  title: def.title,
  x: def.x,
  y: def.y,
  linePath: curve(EMC_POS.x, EMC_POS.y, def.x, def.y, 0.05),
  services: def.familyIds.map((familyId, i) => {
    const pos = def.servicePositions[i] ?? { x: def.x, y: def.y };
    return {
      familyId,
      x: pos.x,
      y: pos.y,
      linePath: curve(def.x, def.y, pos.x, pos.y, 0.1),
    };
  }),
}));

interface FamilyNavInfo {
  label: string;
  href: string;
  icon: IconKey;
}

const familyNavById: Partial<Record<ServiceFamily, FamilyNavInfo>> = {};
serviceFamilies.forEach((family, index) => {
  const nav = serviceNavigation[index];
  familyNavById[family.id] = {
    label: family.name,
    href: nav ? nav.href : `/services#${family.id}`,
    icon: family.icon,
  };
});

const ARROW_ICON = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="arrow-move">
    <path d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Fixed-length lookup that's always in range here (3 sectors) — avoids
 * `noUncheckedIndexedAccess` friction from plain array indexing. */
function at3(arr: readonly [number, number, number], i: number): number {
  return arr[i] ?? arr[0];
}

// ---- Cinematic assembly timeline (ms), runs once then stops ----
const HUB_START = 0;
const HUB_DUR = 550;
const LINE_STARTS: readonly [number, number, number] = [280, 400, 520];
const LINE_DUR = 550;
const SECTOR_STARTS: readonly [number, number, number] = [620, 820, 1020];
const SECTOR_DUR = 480;
const SERVICE_SECTOR_STARTS: readonly [number, number, number] = [1300, 1560, 1820];
const SERVICE_STAGGER = 90;
const SERVICE_DUR = 460;
const RETRACT_AT = 2500;
const CTA_START = 2550;
const CTA_DUR = 420;
const DEMO_SECTOR_ID = "compliance-quality";
const DEMO_START = 2950;
const DEMO_END = 4000;
const TOTAL_DURATION = 4150;

const easeOutCubic = Easing.out(Easing.cubic);
const easeOutBack = Easing.out(Easing.back(1.25));

function progress(elapsed: number, start: number, duration: number): number {
  return interpolate(elapsed, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export default function ServicesEcosystem() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const [elapsed, setElapsed] = useState(0);
  const [isAnimatingIntro, setIsAnimatingIntro] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const [openMobileId, setOpenMobileId] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [tilt, setTilt] = useState<{ id: string; rx: number; ry: number } | null>(null);
  const [pulseKey, setPulseKey] = useState(0);

  const userInteractedRef = useRef(false);
  const prevExpandedRef = useRef<string | null>(null);
  const expandedId = pinnedId ?? hoverId ?? null;

  useEffect(() => {
    if (expandedId && expandedId !== prevExpandedRef.current) {
      setPulseKey((k) => k + 1);
    }
    prevExpandedRef.current = expandedId;
  }, [expandedId]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();

          const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          setReducedMotion(reduced);
          if (reduced) {
            setElapsed(TOTAL_DURATION);
            return;
          }

          setIsAnimatingIntro(true);
          const start = performance.now();
          const tick = (now: number) => {
            const t = now - start;
            setElapsed(t);
            if (t >= TOTAL_DURATION || userInteractedRef.current) {
              rafRef.current = null;
              setIsAnimatingIntro(false);
              return;
            }
            rafRef.current = requestAnimationFrame(tick);
          };
          rafRef.current = requestAnimationFrame(tick);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const markInteracted = () => {
    if (!userInteractedRef.current) {
      userInteractedRef.current = true;
      setUserInteracted(true);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setIsAnimatingIntro(false);
    }
  };

  const isSectorExpanded = (sector: Sector, index: number): boolean => {
    if (expandedId) return expandedId === sector.id;
    if (isAnimatingIntro) {
      const introWindow = elapsed >= at3(SERVICE_SECTOR_STARTS, index) && elapsed < RETRACT_AT;
      const demoWindow =
        !userInteracted && sector.id === DEMO_SECTOR_ID && elapsed >= DEMO_START && elapsed < DEMO_END;
      return introWindow || demoWindow;
    }
    return false;
  };

  const anySectorHinted = expandedId !== null;

  const toggleSector = (id: string) => {
    markInteracted();
    setPinnedId((current) => (current === id ? null : id));
    setHoverId(null);
  };

  const hoverSector = (id: string) => {
    markInteracted();
    if (!pinnedId) setHoverId(id);
  };

  const leaveSector = () => {
    if (!pinnedId) setHoverId(null);
  };

  // ---- Style helpers (closures over elapsed/isAnimatingIntro/state) ----

  const getHubStyle = (): CSSProperties => {
    const p = easeOutCubic(progress(elapsed, HUB_START, HUB_DUR));
    return {
      opacity: p,
      filter: `blur(${interpolate(p, [0, 1], [6, 0])}px)`,
      transform: `translate(-50%, -50%) translateY(${interpolate(p, [0, 1], [14, 0])}px) scale(${interpolate(p, [0, 1], [0.86, 1])})`,
    };
  };

  const getRingStyle = (delayMs: number, fromScale: number): CSSProperties => {
    const p = easeOutCubic(progress(elapsed, HUB_START + delayMs, 650));
    return {
      opacity: interpolate(p, [0, 1], [0, 1]),
      transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [fromScale, 1])})`,
    };
  };

  const getParticleStyle = (angle: number, index: number): CSSProperties => {
    const start = HUB_START + HUB_DUR * 0.35 + index * 70;
    const p = easeOutCubic(progress(elapsed, start, 420));
    const rad = (angle * Math.PI) / 180;
    const radius = 18;
    const x = 50 + radius * Math.cos(rad);
    const y = 50 + radius * Math.sin(rad);
    return {
      left: `${x}%`,
      top: `${y}%`,
      opacity: interpolate(p, [0, 1], [0, 0.8]),
      transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.2, 1])})`,
    };
  };

  /** Subtle pointer-driven tilt for the "3D object" feel on hover — skipped
   * entirely under reduced motion. */
  const handleSceneTilt = (event: ReactMouseEvent<HTMLElement>, familyId: string) => {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ id: familyId, rx: py * -14, ry: px * 14 });
  };

  const clearSceneTilt = (familyId: string) => {
    setTilt((current) => (current?.id === familyId ? null : current));
  };

  const getSceneTiltStyle = (familyId: string): CSSProperties => {
    if (reducedMotion) return {};
    const active = tilt?.id === familyId ? tilt : null;
    return {
      transform: `perspective(600px) rotateX(${active ? active.rx : 0}deg) rotateY(${active ? active.ry : 0}deg) translateZ(${active ? 14 : 0}px)`,
      transition: active ? "transform 120ms ease-out" : "transform 400ms cubic-bezier(0.16,1,0.3,1)",
    };
  };

  const getLineStyle = (index: number, isExpanded: boolean): CSSProperties => {
    if (isAnimatingIntro) {
      const p = easeOutCubic(progress(elapsed, at3(LINE_STARTS, index), LINE_DUR));
      return {
        strokeDasharray: 1,
        strokeDashoffset: 1 - p,
        opacity: p,
        strokeWidth: 0.6,
        transition: "none",
      };
    }
    return {
      strokeDasharray: 1,
      strokeDashoffset: 0,
      opacity: anySectorHinted && !isExpanded ? 0.32 : 1,
      strokeWidth: isExpanded ? 1.5 : 0.6,
      transition: "opacity 400ms ease-out, stroke-width 400ms ease-out, stroke 400ms ease-out",
    };
  };

  const getSectorStyle = (sector: Sector, index: number, isExpanded: boolean): CSSProperties => {
    if (isAnimatingIntro && progress(elapsed, at3(SECTOR_STARTS, index), SECTOR_DUR) < 1) {
      const linP = progress(elapsed, at3(SECTOR_STARTS, index), SECTOR_DUR);
      const eased = easeOutCubic(linP);
      const scaleP = easeOutBack(linP);
      return {
        left: `${sector.x}%`,
        top: `${sector.y}%`,
        opacity: eased,
        transform: `translate(-50%, -50%) translateY(${interpolate(eased, [0, 1], [10, 0])}px) scale(${interpolate(scaleP, [0, 1], [0.92, 1])})`,
        transition: "none",
        borderColor: "rgb(228 233 236)",
      };
    }
    return {
      left: `${sector.x}%`,
      top: `${sector.y}%`,
      opacity: anySectorHinted && !isExpanded ? 0.55 : 1,
      transform: `translate(-50%, -50%) translateY(${isExpanded ? -2 : 0}px) scale(${isExpanded ? 1.05 : 1})`,
      transition: "opacity 400ms ease-out, transform 400ms ease-out, border-color 300ms ease-out",
      borderColor: isExpanded ? ACCENT : "rgb(228 233 236)",
    };
  };

  const getServiceStyle = (
    sector: Sector,
    service: ServiceNode,
    sectorIndex: number,
    serviceIndex: number,
    isExpanded: boolean,
  ): CSSProperties => {
    const jsMode = isAnimatingIntro && elapsed >= at3(SERVICE_SECTOR_STARTS, sectorIndex) && elapsed < RETRACT_AT;
    const isHovered = hoveredServiceId === service.familyId;

    if (jsMode) {
      const start = at3(SERVICE_SECTOR_STARTS, sectorIndex) + serviceIndex * SERVICE_STAGGER;
      const amount = easeOutCubic(progress(elapsed, start, SERVICE_DUR));
      return {
        left: `${lerp(sector.x, service.x, amount)}%`,
        top: `${lerp(sector.y, service.y, amount)}%`,
        opacity: amount,
        transform: `translate(-50%, -50%) scale(${interpolate(amount, [0, 1], [0.5, 1])})`,
        transition: "none",
        pointerEvents: amount > 0.6 ? "auto" : "none",
      };
    }

    const x = isExpanded ? service.x : sector.x;
    const y = isExpanded ? service.y : sector.y;
    const dimmedSibling = isExpanded && hoveredServiceId !== null && !isHovered;
    const scale = isExpanded ? (isHovered ? 1.08 : 1) : 0.5;
    return {
      left: `${x}%`,
      top: `${y}%`,
      opacity: isExpanded ? (dimmedSibling ? 0.62 : 1) : 0,
      transform: `translate(-50%, -50%) translateY(${isHovered ? -3 : 0}px) scale(${scale})`,
      transition: isExpanded
        ? "left 460ms cubic-bezier(0.16,1,0.3,1) 90ms, top 460ms cubic-bezier(0.16,1,0.3,1) 90ms, opacity 400ms ease-out, transform 450ms cubic-bezier(0.16,1,0.3,1)"
        : "left 240ms ease-out, top 240ms ease-out, opacity 200ms ease-out, transform 220ms ease-out",
      pointerEvents: isExpanded ? "auto" : "none",
    };
  };

  const getServiceLineStyle = (
    sectorIndex: number,
    serviceIndex: number,
    isExpanded: boolean,
    isHovered: boolean,
  ): CSSProperties => {
    const jsMode = isAnimatingIntro && elapsed >= at3(SERVICE_SECTOR_STARTS, sectorIndex) && elapsed < RETRACT_AT;
    if (jsMode) {
      const start = at3(SERVICE_SECTOR_STARTS, sectorIndex) + serviceIndex * SERVICE_STAGGER;
      const p = easeOutCubic(progress(elapsed, start, SERVICE_DUR));
      return { strokeDasharray: 1, strokeDashoffset: 1 - p, opacity: p * 0.85, strokeWidth: 0.5, transition: "none" };
    }
    return {
      strokeDasharray: 1,
      strokeDashoffset: isExpanded ? 0 : 1,
      opacity: isExpanded ? (isHovered ? 1 : 0.55) : 0,
      strokeWidth: isHovered ? 1.1 : 0.5,
      transition: "opacity 400ms ease-out, stroke-dashoffset 400ms ease-out, stroke-width 300ms ease-out",
    };
  };

  const getCtaStyle = (): CSSProperties => {
    if (isAnimatingIntro) {
      const p = easeOutCubic(progress(elapsed, CTA_START, CTA_DUR));
      return {
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [10, 0])}px)`,
        transition: "none",
        pointerEvents: p > 0.5 ? "auto" : "none",
      };
    }
    return { opacity: 1, transform: "translateY(0)", pointerEvents: "auto" };
  };

  const activeSectorForPulse = sectors.find((s) => s.id === expandedId) ?? null;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="services-ecosystem-heading"
      className="relative overflow-hidden border-t border-ink-100 bg-gradient-to-b from-white via-brand-50/20 to-white"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-brand-100/25 blur-3xl" />
        <div className="absolute -bottom-32 left-[-10%] h-80 w-80 rounded-full bg-[#20E0D0]/[0.06] blur-3xl" />
      </div>

      <div className="container-page relative py-14 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-14">
          {/* LEFT — editorial content (wording/CTA locked; scale/contrast tuned) */}
          <Reveal as="div">
            <p className="eyebrow text-sm">What we do</p>
            <h1
              id="services-ecosystem-heading"
              className="mt-4 text-[clamp(2.4rem,4.6vw,4.1rem)] font-display leading-[1.08] tracking-[-0.03em] text-ink-900"
            >
              One Integrated
              <br />
              Healthcare Ecosystem.
            </h1>
            <p className="mt-5 max-w-md text-[1.2rem] leading-relaxed text-ink-800">
              Comprehensive expertise supporting healthcare organisations from establishment and compliance to
              operations and growth.
            </p>
            <Link href="/services" className="btn-primary group mt-8">
              Explore Our Services
              {ARROW_ICON}
            </Link>
          </Reveal>

          {/* RIGHT — interactive ecosystem (desktop/tablet) */}
          <div
            className="hidden lg:block"
            onMouseLeave={leaveSector}
            onBlur={(event) => {
              if (!pinnedId && !event.currentTarget.contains(event.relatedTarget as Node)) {
                setHoverId(null);
              }
            }}
          >
            <div className="relative mx-auto aspect-square w-full max-w-[560px]">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
                {sectors.map((sector, index) => {
                  const isExpanded = isSectorExpanded(sector, index);
                  return (
                    <path
                      key={`line-${sector.id}`}
                      d={sector.linePath}
                      pathLength={1}
                      fill="none"
                      strokeLinecap="round"
                      className="eco-line text-ink-200"
                      stroke={isExpanded ? ACCENT : "currentColor"}
                      style={getLineStyle(index, isExpanded)}
                    />
                  );
                })}
                {sectors.flatMap((sector, sIndex) => {
                  const isExpanded = isSectorExpanded(sector, sIndex);
                  return sector.services.map((service, vIndex) => {
                    const isHoveredLine = hoveredServiceId === service.familyId;
                    return (
                      <path
                        key={`sline-${service.familyId}`}
                        d={service.linePath}
                        pathLength={1}
                        fill="none"
                        strokeLinecap="round"
                        className="text-ink-200"
                        stroke={isHoveredLine ? ACCENT : isExpanded ? "#8fd8d0" : "currentColor"}
                        style={getServiceLineStyle(sIndex, vIndex, isExpanded, isHoveredLine)}
                      />
                    );
                  });
                })}
                {/* One-shot light pulse: EMC -> active sector, replays whenever
                    the active sector changes (hover/click), never loops. */}
                {!reducedMotion && activeSectorForPulse ? (
                  <circle key={`pulse-${activeSectorForPulse.id}-${pulseKey}`} r="1.1" fill={ACCENT}>
                    <animateMotion dur="0.7s" fill="freeze" path={activeSectorForPulse.linePath} />
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.75;1" dur="0.7s" fill="freeze" />
                  </circle>
                ) : null}
              </svg>

              {/* Hub — EMC, permanently centred. Concentric glass rings +
                  settled particles assemble once with the core, then hold
                  still — no continuous orbit/spin. */}
              <div
                className="eco-ring pointer-events-none absolute left-1/2 top-1/2 z-[6] aspect-square w-[40%] rounded-full border border-[#20E0D0]/15"
                style={getRingStyle(80, 0.7)}
                aria-hidden="true"
              />
              <div
                className="eco-ring pointer-events-none absolute left-1/2 top-1/2 z-[7] aspect-square w-[33%] rounded-full border border-[#20E0D0]/25"
                style={getRingStyle(160, 0.8)}
                aria-hidden="true"
              />
              {PARTICLE_ANGLES.map((angle, index) => (
                <span
                  key={angle}
                  className="eco-particle pointer-events-none absolute z-[8] h-1.5 w-1.5 rounded-full bg-[#20E0D0]"
                  style={{ ...getParticleStyle(angle, index), boxShadow: "0 0 6px 1px rgba(32,224,208,0.55)" }}
                  aria-hidden="true"
                />
              ))}

              <div
                className="eco-hub absolute left-1/2 top-1/2 z-10 flex aspect-square w-[26%] flex-col items-center justify-center overflow-hidden rounded-full border border-white bg-white/85 shadow-[0_20px_45px_-18px_rgba(15,24,25,0.35)] backdrop-blur-md"
                style={getHubStyle()}
              >
                {/* Soft white/cyan radial glow behind the logo */}
                <span
                  className="pointer-events-none absolute inset-[6%] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.95), rgba(214,244,241,0.55) 45%, rgba(32,224,208,0.12) 75%, transparent 85%)",
                  }}
                  aria-hidden="true"
                />
                {/* Thin cyan luminous ring, glass depth via inset shadow */}
                <span
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    boxShadow:
                      "inset 0 0 0 1px rgba(32,224,208,0.55), inset 0 1px 6px rgba(255,255,255,0.6), 0 0 16px 2px rgba(32,224,208,0.28)",
                  }}
                  aria-hidden="true"
                />
                {/* Subtle glass highlight / reflection, upper-left */}
                <span
                  className="pointer-events-none absolute -left-[10%] -top-[18%] h-[70%] w-[70%] rounded-full opacity-60"
                  style={{ background: "radial-gradient(circle, rgba(255,255,255,0.65), transparent 70%)" }}
                  aria-hidden="true"
                />

                <Image
                  src="/images/Emc Pvt ltd logo/logo.png"
                  alt="EMC Healthcare Services"
                  width={140}
                  height={140}
                  className="relative h-[70%] w-[70%] object-contain drop-shadow-[0_4px_10px_rgba(15,64,58,0.25)]"
                />
              </div>

              {/* Sectors + their service nodes — each service is a DOM
                  sibling right after its own sector button (not a shared
                  panel elsewhere), so Tab walks button -> that button's own
                  services -> next sector button, never sideways. */}
              {sectors.map((sector, sIndex) => {
                const isExpanded = isSectorExpanded(sector, sIndex);
                return (
                  <Fragment key={sector.id}>
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      onMouseEnter={() => hoverSector(sector.id)}
                      onFocus={() => hoverSector(sector.id)}
                      onClick={() => toggleSector(sector.id)}
                      className="eco-sector absolute z-20 flex w-[27%] max-w-[190px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-2xl border bg-white/90 px-3 py-2.5 text-center shadow-card backdrop-blur-sm"
                      style={getSectorStyle(sector, sIndex, isExpanded)}
                    >
                      <span className="text-[0.78rem] font-bold uppercase leading-tight tracking-[0.03em] text-ink-900">
                        {sector.title}
                      </span>
                    </button>

                    {sector.services.map((service, vIndex) => {
                      const info = familyNavById[service.familyId];
                      if (!info) return null;
                      const isHovered = hoveredServiceId === service.familyId;
                      return (
                        <Link
                          key={service.familyId}
                          href={info.href}
                          tabIndex={isExpanded ? 0 : -1}
                          aria-hidden={!isExpanded}
                          onMouseEnter={() => setHoveredServiceId(service.familyId)}
                          onMouseMove={(event) => handleSceneTilt(event, service.familyId)}
                          onMouseLeave={() => {
                            setHoveredServiceId((current) => (current === service.familyId ? null : current));
                            clearSceneTilt(service.familyId);
                          }}
                          onFocus={() => {
                            markInteracted();
                            setHoveredServiceId(service.familyId);
                          }}
                          onBlur={() => setHoveredServiceId((current) => (current === service.familyId ? null : current))}
                          className="group absolute z-[15] flex w-[20%] max-w-[112px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-center"
                          style={getServiceStyle(sector, service, sIndex, vIndex, isExpanded)}
                        >
                          {/* Soft cyan under-glow, brighter on hover */}
                          <span
                            className="pointer-events-none absolute bottom-2 left-1/2 h-4 w-[68%] -translate-x-1/2 rounded-full blur-md transition-opacity duration-500"
                            style={{
                              background: "radial-gradient(ellipse, rgba(32,224,208,0.55), transparent 72%)",
                              opacity: isHovered ? 1 : 0.35,
                            }}
                            aria-hidden="true"
                          />

                          {/* The 3D scene — tilts toward the pointer on hover */}
                          <div style={getSceneTiltStyle(service.familyId)}>
                            <ServiceScene
                              familyId={service.familyId}
                              uid={`d-${service.familyId}`}
                              className={`h-11 w-11 sm:h-12 sm:w-12 transition-[filter] duration-400 ${
                                isHovered ? "drop-shadow-[0_10px_18px_rgba(15,24,25,0.4)] brightness-[1.08] saturate-[1.15]" : "drop-shadow-[0_6px_12px_rgba(15,24,25,0.3)]"
                              }`}
                            />
                          </div>

                          {/* Glass platform the scene "rests" on */}
                          <span
                            className="h-[3px] w-[58%] rounded-full transition-all duration-500"
                            style={{
                              background: "linear-gradient(to bottom, rgba(255,255,255,0.75), rgba(32,224,208,0.2))",
                              boxShadow: isHovered ? "0 2px 8px rgba(32,224,208,0.55)" : "0 1px 4px rgba(32,224,208,0.25)",
                            }}
                            aria-hidden="true"
                          />

                          <span
                            className={`text-[0.62rem] font-medium leading-tight transition-colors duration-300 ${
                              isHovered ? "text-ink-900" : "text-ink-700"
                            }`}
                          >
                            {info.label}
                          </span>
                        </Link>
                      );
                    })}
                  </Fragment>
                );
              })}
            </div>

            {/* Ecosystem CTA — appears once assembly settles */}
            <div className="eco-cta mt-8 flex justify-end" style={getCtaStyle()}>
              <Link
                href="/services"
                className="group inline-flex items-center gap-2 rounded-full border border-[#20E0D0]/40 bg-white px-5 py-2.5 text-sm font-semibold text-ink-900 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-[#20E0D0] hover:shadow-[0_14px_32px_-12px_rgba(32,224,208,0.45)]"
              >
                Explore Our Services
                {ARROW_ICON}
              </Link>
            </div>
          </div>

          {/* RIGHT — mobile/tablet accordion */}
          <div className="lg:hidden">
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-ink-100 bg-white/80 p-5 text-center shadow-card">
              <Image
                src="/images/Emc Pvt ltd logo/logo.png"
                alt="EMC Healthcare Services"
                width={56}
                height={56}
                className="h-12 w-12 object-contain"
              />
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-700">
                A–to–Z Healthcare Expertise
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {sectors.map((sector) => {
                const isOpen = openMobileId === sector.id;
                return (
                  <div key={sector.id} className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`mobile-ecosystem-panel-${sector.id}`}
                      onClick={() => setOpenMobileId(isOpen ? null : sector.id)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                    >
                      <span className="text-sm font-semibold text-ink-900">{sector.title}</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                        className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      >
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <div
                      id={`mobile-ecosystem-panel-${sector.id}`}
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <ul className="space-y-2 px-4 pb-4">
                          {sector.services.map((service) => {
                            const info = familyNavById[service.familyId];
                            if (!info) return null;
                            return (
                              <li key={service.familyId}>
                                <Link
                                  href={info.href}
                                  className="flex items-center gap-3 rounded-xl bg-ink-50 px-3 py-2.5 text-sm font-medium text-ink-800 transition-colors active:bg-[#20E0D0]/10"
                                >
                                  <ServiceScene familyId={service.familyId} uid={`m-${service.familyId}`} className="h-11 w-11 shrink-0" />
                                  <span>{info.label}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Reveal className="mt-5 flex justify-center">
              <Link
                href="/services"
                className="group inline-flex items-center gap-2 rounded-full border border-[#20E0D0]/40 bg-white px-5 py-2.5 text-sm font-semibold text-ink-900 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-[#20E0D0]"
              >
                Explore Our Services
                {ARROW_ICON}
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
