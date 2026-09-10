"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { interpolate, Easing } from "remotion";
import SectionHeading from "@/components/shared/SectionHeading";
import Reveal from "@/components/shared/Reveal";

/**
 * "Who we serve" — a premium isometric healthcare landscape: four bespoke
 * architectural scenes (hospital / clinic / healthcare centre / other
 * organisations) of intentionally different scale, connected by one
 * flowing, glowing pathway, using the same content the original grid used
 * (see `CATEGORIES` — names/detail copy unchanged).
 *
 * Pure SVG + CSS, following the same animation architecture as
 * ServicesEcosystem: Remotion's `interpolate`/`Easing` used only as
 * animation-curve math inside a one-shot requestAnimationFrame loop, never
 * through Remotion's Player/Composition — everything stays a normal
 * interactive DOM/SVG tree.
 */

const ACCENT = "#20E0D0";
const NAVY = "#173049";
const NAVY_DEEP = "#0f2434";
const NAVY_SOFT = "#2c4a5f";
const GLASS_LIGHT = "#eef6f8";
const GLASS_MID = "#cfe3ea";
const GLASS_PALE = "#dcedf0";

const CATEGORIES = [
  { id: "hospitals", number: "01", label: "Hospitals", detail: "Multi-speciality and single-speciality" },
  { id: "clinics", number: "02", label: "Clinics", detail: "Small and mid-size practices" },
  { id: "healthcare-centres", number: "03", label: "Healthcare Centres", detail: "Diagnostic and wellness centres" },
  { id: "other-organisations", number: "04", label: "Other organisations", detail: "NGOs, corporates, community groups" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

/** Each building's main-mass footprint (w × d × h, local iso units) —
 * deliberately different sizes so the scale progression reads as
 * intentional: hospitals largest, healthcare centres medium/large, other
 * organisations medium, clinics smallest. */
const FOOTPRINT: Record<CategoryId, { w: number; d: number; h: number }> = {
  hospitals: { w: 36, d: 22, h: 40 },
  clinics: { w: 20, d: 14, h: 20 },
  "healthcare-centres": { w: 28, d: 19, h: 30 },
  "other-organisations": { w: 27, d: 19, h: 22 },
};

/** Ground placement (viewBox units) for each building's *back* corner (see
 * the projection note below) — a gentle descending line left-to-right so
 * the pathway reads as one continuous journey. Sized and spaced to fill
 * the scene rather than float in a large empty canvas. */
const LAYOUT: Record<CategoryId, { x: number; y: number; scale: number }> = {
  hospitals: { x: 66, y: 76, scale: 1.22 },
  clinics: { x: 195, y: 110, scale: 0.84 },
  "healthcare-centres": { x: 300, y: 98, scale: 1.08 },
  "other-organisations": { x: 405, y: 107, scale: 0.98 },
};

// ---------------------------------------------------------------------
// Isometric projection helpers (30° dimetric) — a point (X,Y,Z) in local
// "3D" space projects to a flat (x,y). Y is height (up), X is width
// (right), Z is depth (into the scene). Local (0,0,0) — where each
// building's `<g transform="translate(...)">` is anchored — projects to
// the BACK-top-adjacent corner of its main mass, not the front-ground
// corner nearest the viewer (that's `(w,0,d)` for a box of width w, depth
// d). `FRONT_OFFSET` below is that corner's projected position for each
// building's own main-box dimensions, so shadows/labels/pathway can anchor
// to where the building actually visually touches the ground.
// ---------------------------------------------------------------------
function project(X: number, Y: number, Z: number): [number, number] {
  return [(X - Z) * 0.866, (X + Z) * 0.5 - Y];
}

const FRONT_OFFSET: Record<CategoryId, { x: number; y: number }> = Object.fromEntries(
  (Object.keys(FOOTPRINT) as CategoryId[]).map((id) => {
    const { w, d } = FOOTPRINT[id];
    const [x, y] = project(w, 0, d);
    return [id, { x, y }];
  }),
) as Record<CategoryId, { x: number; y: number }>;

function groundPoint(id: CategoryId): { x: number; y: number } {
  const layout = LAYOUT[id];
  const offset = FRONT_OFFSET[id];
  return { x: layout.x + offset.x * layout.scale, y: layout.y + offset.y * layout.scale };
}
function pt(X: number, Y: number, Z: number): string {
  const [x, y] = project(X, Y, Z);
  return `${x.toFixed(2)},${y.toFixed(2)}`;
}
function quad(a: [number, number, number], b: [number, number, number], c: [number, number, number], d: [number, number, number]): string {
  return `M${pt(...a)} L${pt(...b)} L${pt(...c)} L${pt(...d)} Z`;
}
/** The three visible faces of an axis-aligned box at local origin, offset by (x0,y0,z0). */
function isoBox(x0: number, y0: number, z0: number, w: number, d: number, h: number) {
  const o = (X: number, Y: number, Z: number): [number, number, number] => [X + x0, Y + y0, Z + z0];
  return {
    top: quad(o(0, h, 0), o(w, h, 0), o(w, h, d), o(0, h, d)),
    right: quad(o(w, 0, 0), o(w, 0, d), o(w, h, d), o(w, h, 0)),
    left: quad(o(0, 0, d), o(w, 0, d), o(w, h, d), o(0, h, d)),
  };
}
/** A small glass-panel rect inset into the right (X = x0+w) face. */
function rightPanel(x0: number, y0: number, z0: number, w: number, y1: number, y2: number, z1: number, z2: number) {
  return quad([x0 + w, y0 + y1, z0 + z1], [x0 + w, y0 + y1, z0 + z2], [x0 + w, y0 + y2, z0 + z2], [x0 + w, y0 + y2, z0 + z1]);
}
/** A small glass-panel rect inset into the left (Z = z0+d) face. */
function leftPanel(x0: number, y0: number, z0: number, d: number, x1: number, x2: number, y1: number, y2: number) {
  return quad([x0 + x1, y0 + y1, z0 + d], [x0 + x2, y0 + y1, z0 + d], [x0 + x2, y0 + y2, z0 + d], [x0 + x1, y0 + y2, z0 + d]);
}

interface Shape {
  d: string;
  fill: string;
  opacity?: number;
}

function windowsOnFace(
  face: "right" | "left",
  x0: number,
  y0: number,
  z0: number,
  w: number,
  d: number,
  rows: number[],
  cols: number[],
  size: number,
  fill: string,
): Shape[] {
  const shapes: Shape[] = [];
  for (const r of rows) {
    for (const c of cols) {
      const dPath =
        face === "right"
          ? rightPanel(x0, y0, z0, w, r, r + size, c, c + size)
          : leftPanel(x0, y0, z0, d, c, c + size, r, r + size);
      shapes.push({ d: dPath, fill });
    }
  }
  return shapes;
}

/** A thin, low-opacity band hugging the base of a face — cheap "ambient
 * occlusion" where the building meets the ground. */
function groundAo(x0: number, y0: number, z0: number, w: number, d: number): Shape[] {
  return [
    { d: rightPanel(x0, y0, z0, w, 0, 2.4, 0, d), fill: NAVY_DEEP, opacity: 0.16 },
    { d: leftPanel(x0, y0, z0, d, 0, w, 0, 2.4), fill: NAVY_DEEP, opacity: 0.14 },
  ];
}

/** Hospitals — largest mass, a tall multi-floor facade, a colonnaded
 * entrance and restrained landscaping either side of the entry path. */
function hospitalShapes(uid: string): Shape[] {
  const { w, d, h } = FOOTPRINT.hospitals;
  const box = isoBox(0, 0, 0, w, d, h);
  const canopy = isoBox(10, 0, d, 16, 8, 5);
  const shapes: Shape[] = [
    { d: box.left, fill: NAVY },
    { d: box.right, fill: GLASS_MID },
    { d: box.top, fill: GLASS_LIGHT },
    ...groundAo(0, 0, 0, w, d),
    ...windowsOnFace("right", 0, 0, 0, w, d, [6, 14, 22, 30], [4, 12, 20, 28], 5, `url(#${uid}-glass)`),
    ...windowsOnFace("left", 0, 0, 0, w, d, [6, 14, 22, 30], [3, 12], 5, "rgba(255,255,255,0.16)"),
    { d: canopy.left, fill: NAVY_DEEP },
    { d: canopy.right, fill: "#a9c9d3" },
    { d: canopy.top, fill: GLASS_PALE },
  ];
  // Two slim entrance pillars beneath the canopy.
  const pillar = (px: number, pz: number) => isoBox(px, 0, pz, 1.4, 1.4, 5);
  for (const [px, pz] of [
    [11, d + 1],
    [22.5, d + 1],
  ] as const) {
    const p = pillar(px, pz);
    shapes.push({ d: p.left, fill: "#c7d8dd" }, { d: p.right, fill: "#e7f1f3" });
  }
  // Restrained shrubs flanking the entrance path.
  for (const [sx, sz] of [
    [4, d + 4],
    [w - 4, d + 4],
  ] as const) {
    const [cx, cy] = project(sx, 2.6, sz);
    shapes.push({ d: `M${cx - 2.6},${cy} a2.6,2.2 0 1,0 5.2,0 a2.6,2.2 0 1,0 -5.2,0`, fill: "#7fb8af", opacity: 0.85 });
  }
  // Red cross emblem, set into the tower roof near-front.
  const cx = 18;
  const cz = 9;
  const armW = 5.5;
  const armL = 1.7;
  shapes.push(
    { d: quad([cx - armL, h, cz - armW / 2], [cx + armL, h, cz - armW / 2], [cx + armL, h, cz + armW / 2], [cx - armL, h, cz + armW / 2]), fill: "#e14b43" },
    { d: quad([cx - armW / 2, h, cz - armL], [cx + armW / 2, h, cz - armL], [cx + armW / 2, h, cz + armL], [cx - armW / 2, h, cz + armL]), fill: "#e14b43" },
  );
  return shapes;
}

/** Clinics — smallest, contemporary two-storey box with a full-height glass
 * entrance bay and a single shrub. */
function clinicShapes(uid: string): Shape[] {
  const { w, d, h } = FOOTPRINT.clinics;
  const box = isoBox(0, 0, 0, w, d, h);
  const canopy = isoBox(4, 0, d, 12, 5.5, 3.5);
  const shapes: Shape[] = [
    { d: box.left, fill: NAVY_SOFT },
    { d: box.right, fill: GLASS_MID },
    { d: box.top, fill: GLASS_LIGHT },
    ...groundAo(0, 0, 0, w, d),
    // Full-height glass entrance bay, ground floor.
    { d: rightPanel(0, 0, 0, w, 0, h * 0.42, 5.5, 12.5), fill: `url(#${uid}-glass)` },
    ...windowsOnFace("right", 0, 0, 0, w, d, [h * 0.55, h * 0.8], [4, 12], 4.4, `url(#${uid}-glass)`),
    ...windowsOnFace("left", 0, 0, 0, w, d, [5, 12.5], [3], 4.4, "rgba(255,255,255,0.16)"),
    { d: canopy.left, fill: NAVY_DEEP },
    { d: canopy.right, fill: "#a9c9d3" },
    { d: canopy.top, fill: GLASS_PALE },
  ];
  const [cx, cy] = project(w - 3, 2.2, d + 3.5);
  shapes.push({ d: `M${cx - 2.2},${cy} a2.2,1.9 0 1,0 4.4,0 a2.2,1.9 0 1,0 -4.4,0`, fill: "#7fb8af", opacity: 0.85 });
  return shapes;
}

/** Healthcare Centres — medium/large glass-forward facade with a
 * prominent circular atrium. */
function healthcareCentreShapes(uid: string): Shape[] {
  const { w, d, h } = FOOTPRINT["healthcare-centres"];
  const box = isoBox(0, 0, 0, w, d, h);
  return [
    { d: box.left, fill: NAVY },
    { d: box.right, fill: GLASS_MID },
    { d: box.top, fill: GLASS_LIGHT },
    ...groundAo(0, 0, 0, w, d),
    ...windowsOnFace("right", 0, 0, 0, w, d, [6, 15, 24], [3, 12, 21], 6, `url(#${uid}-glass)`),
    ...windowsOnFace("left", 0, 0, 0, w, d, [6, 15, 24], [3, 11], 6, "rgba(255,255,255,0.16)"),
  ];
}
/** Atrium rendered separately (as a real ellipse, not iso faces) so callers
 * can layer it visually in front of the main mass. */
function healthcareCentreAtrium(): { cx: number; cy: number; rx: number; ry: number } {
  const [cx, cy] = project(FOOTPRINT["healthcare-centres"].w, 13, 5);
  return { cx, cy, rx: 7.5, ry: 9.8 };
}

/** Other organisations — medium, civic/corporate block with a glass entry
 * pavilion (distinct from the other three's canopies) and a tree. */
function otherOrgShapes(uid: string): Shape[] {
  const { w, d, h } = FOOTPRINT["other-organisations"];
  const box = isoBox(0, 0, 0, w, d, h);
  const pavilion = isoBox(8, 0, d, 11, 6, 7);
  return [
    { d: box.left, fill: NAVY_SOFT },
    { d: box.right, fill: GLASS_MID },
    { d: box.top, fill: GLASS_LIGHT },
    ...groundAo(0, 0, 0, w, d),
    ...windowsOnFace("right", 0, 0, 0, w, d, [4.5, 11, 17.5], [4, 12, 20], 4.6, `url(#${uid}-glass)`),
    ...windowsOnFace("left", 0, 0, 0, w, d, [4.5, 11, 17.5], [4, 12], 4.6, "rgba(255,255,255,0.16)"),
    { d: pavilion.left, fill: `url(#${uid}-glass)` },
    { d: pavilion.right, fill: GLASS_LIGHT },
    { d: pavilion.top, fill: "#ffffff" },
  ];
}
function otherOrgTree(): { trunk: [[number, number], [number, number]]; canopy: { cx: number; cy: number; r: number } } {
  const { d } = FOOTPRINT["other-organisations"];
  // z0 = d+4 (in front of the facade, by the entrance plaza) — matches how
  // the hospital/clinic shrubs are placed, so the tree reads as ground-level
  // landscaping beside the entrance rather than floating near the roofline.
  const base = project(-5, 0, d + 4);
  const top = project(-5, 7, d + 4);
  const canopyCenter = project(-5, 11, d + 4);
  return {
    trunk: [base, top],
    canopy: { cx: canopyCenter[0], cy: canopyCenter[1], r: 4.4 },
  };
}

const SHAPES_BY_ID: Record<CategoryId, (uid: string) => Shape[]> = {
  hospitals: hospitalShapes,
  clinics: clinicShapes,
  "healthcare-centres": healthcareCentreShapes,
  "other-organisations": otherOrgShapes,
};

/** Ground-shadow ellipse radius per building (roughly matches its footprint). */
const SHADOW_RX: Record<CategoryId, number> = {
  hospitals: 30,
  clinics: 17,
  "healthcare-centres": 24,
  "other-organisations": 24,
};

/** Smooth Catmull-Rom-through-points spline, returned as 3 separate cubic
 * segments (one per gap between the 4 buildings) so each can be styled
 * independently on hover. */
function smoothSegments(points: { x: number; y: number }[]): string[] {
  const segments: string[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    // i ranges 0..length-2, so points[i] and points[i+1] are always in bounds;
    // only the Catmull-Rom "neighbour" lookups need the tangent-clamped fallback.
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p0 = points[i - 1] ?? p1;
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    segments.push(`M${p1.x},${p1.y} C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`);
  }
  return segments;
}

// ---- Cinematic one-shot entrance timeline (ms) ----
const BG_DUR = 500;
const BUILDING_STARTS: readonly [number, number, number, number] = [280, 520, 760, 1000];
const BUILDING_DUR = 560;
const PATHWAY_START = 1450;
const PATHWAY_DUR = 700;
const LABEL_STARTS: readonly [number, number, number, number] = [1780, 1930, 2080, 2230];
const LABEL_DUR = 380;
const TOTAL_DURATION = 2750;

const easeOutCubic = Easing.out(Easing.cubic);
const easeOutBack = Easing.out(Easing.back(1.2));

function progress(elapsed: number, start: number, duration: number): number {
  return interpolate(elapsed, [start, start + duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}
function at4(arr: readonly [number, number, number, number], i: number): number {
  return arr[i] ?? arr[0];
}

function BuildingGraphic({ id, uid }: { id: CategoryId; uid: string }) {
  const shapes = SHAPES_BY_ID[id](uid);
  return (
    <>
      {shapes.map((s, i) => (
        <path key={`${uid}-${i}`} d={s.d} fill={s.fill} opacity={s.opacity} />
      ))}
      {id === "healthcare-centres"
        ? (() => {
            const atrium = healthcareCentreAtrium();
            return (
              <>
                <ellipse cx={atrium.cx} cy={atrium.cy} rx={atrium.rx} ry={atrium.ry} fill={`url(#${uid}-atrium)`} stroke="rgba(255,255,255,0.55)" strokeWidth="0.45" />
                <line x1={atrium.cx} y1={atrium.cy - atrium.ry} x2={atrium.cx} y2={atrium.cy + atrium.ry} stroke="rgba(23,48,73,0.22)" strokeWidth="0.4" />
                <line x1={atrium.cx - atrium.rx * 0.55} y1={atrium.cy - atrium.ry * 0.55} x2={atrium.cx + atrium.rx * 0.55} y2={atrium.cy + atrium.ry * 0.55} stroke="rgba(23,48,73,0.14)" strokeWidth="0.35" />
              </>
            );
          })()
        : null}
      {id === "other-organisations"
        ? (() => {
            const tree = otherOrgTree();
            return (
              <>
                <line x1={tree.trunk[0][0]} y1={tree.trunk[0][1]} x2={tree.trunk[1][0]} y2={tree.trunk[1][1]} stroke="#8a7256" strokeWidth="1" />
                <circle cx={tree.canopy.cx} cy={tree.canopy.cy} r={tree.canopy.r} fill="#7fb8af" opacity="0.85" />
              </>
            );
          })()
        : null}
    </>
  );
}

export default function WhoWeServeEcosystem() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredId, setHoveredId] = useState<CategoryId | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          if (reduced) {
            setElapsed(TOTAL_DURATION);
            return;
          }
          setIsAnimating(true);
          const start = performance.now();
          const tick = (now: number) => {
            const t = now - start;
            setElapsed(t);
            if (t >= TOTAL_DURATION) {
              rafRef.current = null;
              setIsAnimating(false);
              return;
            }
            rafRef.current = requestAnimationFrame(tick);
          };
          rafRef.current = requestAnimationFrame(tick);
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const groundPoints = CATEGORIES.map((c) => groundPoint(c.id));
  const pathSegments = smoothSegments(groundPoints);
  const segmentAdjacency: Record<CategoryId, number[]> = {
    hospitals: [0],
    clinics: [0, 1],
    "healthcare-centres": [1, 2],
    "other-organisations": [2],
  };

  const getBgStyle = (): CSSProperties => {
    const p = easeOutCubic(progress(elapsed, 0, BG_DUR));
    return { opacity: p };
  };

  /**
   * Applied to an INNER `<g>` nested inside an outer `<g transform="translate(...) scale(...)">`
   * that does pure placement. SVG elements can carry either an XML `transform`
   * attribute or a CSS `transform` (via style) — when both are present the
   * CSS one wins outright rather than composing, so animation and placement
   * must live on separate nested groups. The local origin (0,0) already is
   * each building's own ground-contact point (see the projection helpers
   * above), so `transformOrigin: "0 0"` scales/lifts from the ground up.
   */
  const getBuildingStyle = (index: number, id: CategoryId): CSSProperties => {
    const isHovered = hoveredId === id;
    const dimmed = hoveredId !== null && !isHovered;
    if (isAnimating) {
      const linP = progress(elapsed, at4(BUILDING_STARTS, index), BUILDING_DUR);
      const eased = easeOutCubic(linP);
      const scaleP = easeOutBack(linP);
      return {
        opacity: eased,
        transform: `translateY(${interpolate(eased, [0, 1], [16, 0])}px) scale(${interpolate(scaleP, [0, 1], [0.85, 1])})`,
        transformOrigin: "0px 0px",
        transition: "none",
      };
    }
    return {
      opacity: dimmed ? 0.72 : 1,
      transform: `translateY(${isHovered ? -4 : 0}px) scale(${isHovered ? 1.045 : 1})`,
      transformOrigin: "0px 0px",
      transition: "transform 450ms cubic-bezier(0.16,1,0.3,1), opacity 400ms ease-out, filter 400ms ease-out",
      filter: isHovered
        ? "brightness(1.05) drop-shadow(0 18px 22px rgba(15,40,60,0.38))"
        : "brightness(1) drop-shadow(0 8px 12px rgba(15,40,60,0.18))",
    };
  };

  const getShadowStyle = (index: number, id: CategoryId): CSSProperties => {
    const isHovered = hoveredId === id;
    if (isAnimating) {
      const p = easeOutCubic(progress(elapsed, at4(BUILDING_STARTS, index), BUILDING_DUR));
      return { opacity: p * 0.24, transition: "none" };
    }
    return { opacity: isHovered ? 0.36 : 0.22, transition: "opacity 400ms ease-out" };
  };

  const getSegmentStyle = (segIndex: number): CSSProperties => {
    const isActive = hoveredId !== null && segmentAdjacency[hoveredId].includes(segIndex);
    if (isAnimating) {
      const p = easeOutCubic(progress(elapsed, PATHWAY_START, PATHWAY_DUR));
      return { strokeDasharray: 1, strokeDashoffset: 1 - p, opacity: p, transition: "none" };
    }
    return {
      strokeDasharray: 1,
      strokeDashoffset: 0,
      opacity: hoveredId === null ? 0.9 : isActive ? 1 : 0.38,
      strokeWidth: isActive ? 2 : 1.1,
      transition: "opacity 350ms ease-out, stroke-width 350ms ease-out",
    };
  };
  const getGlowSegmentStyle = (segIndex: number): CSSProperties => {
    const isActive = hoveredId !== null && segmentAdjacency[hoveredId].includes(segIndex);
    if (isAnimating) {
      const p = easeOutCubic(progress(elapsed, PATHWAY_START, PATHWAY_DUR));
      return { strokeDasharray: 1, strokeDashoffset: 1 - p, opacity: p * 0.5, transition: "none" };
    }
    return {
      strokeDasharray: 1,
      strokeDashoffset: 0,
      opacity: isActive ? 0.65 : 0.28,
      strokeWidth: isActive ? 5 : 3.2,
      transition: "opacity 350ms ease-out, stroke-width 350ms ease-out",
    };
  };

  const getNodeStyle = (id: CategoryId): CSSProperties => {
    const isHovered = hoveredId === id;
    return {
      opacity: isHovered ? 1 : 0.85,
      transform: `scale(${isHovered ? 1.35 : 1})`,
      transformOrigin: "center",
      transition: "opacity 300ms ease-out, transform 300ms ease-out",
    };
  };

  const getLabelStyle = (index: number): CSSProperties => {
    if (isAnimating) {
      const p = easeOutCubic(progress(elapsed, at4(LABEL_STARTS, index), LABEL_DUR));
      return { opacity: p, transform: `translateY(${interpolate(p, [0, 1], [8, 0])}px)`, transition: "none" };
    }
    return { opacity: 1, transform: "translateY(0)" };
  };

  return (
    <section ref={sectionRef} className="border-t border-ink-100 bg-gradient-to-b from-white to-[#eef6fb]">
      <div className="container-page py-12 sm:py-16">
        <SectionHeading eyebrow="Who we serve" title="Across Healthcare. At Every Scale" align="left" size="lg" />

        {/* Desktop/tablet — the connected isometric landscape */}
        <div className="mt-6 hidden md:block">
          <div className="relative mx-auto w-full max-w-[1080px]">
            <svg viewBox="0 0 480 178" className="w-full" role="img" aria-label="EMC supports hospitals, clinics, healthcare centres and other healthcare organisations">
              <defs>
                <linearGradient id="wws-d-glass" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                  <stop offset="100%" stopColor={ACCENT} stopOpacity="0.35" />
                </linearGradient>
                <radialGradient id="wws-d-atrium" cx="35%" cy="30%" r="75%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="100%" stopColor={ACCENT} stopOpacity="0.4" />
                </radialGradient>
                <linearGradient id="wws-path" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={NAVY} />
                  <stop offset="100%" stopColor={ACCENT} />
                </linearGradient>
                <radialGradient id="wws-shadow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={NAVY} stopOpacity="0.55" />
                  <stop offset="100%" stopColor={NAVY} stopOpacity="0" />
                </radialGradient>
                <radialGradient id="wws-ambient" cx="42%" cy="30%" r="70%">
                  <stop offset="0%" stopColor={ACCENT} stopOpacity="0.1" />
                  <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
                </radialGradient>
                <radialGradient id="wws-node-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={ACCENT} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
                </radialGradient>
                <filter id="wws-blur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.6" />
                </filter>
              </defs>

              {/* Background — clean gradient wash, faint silhouettes, extremely subtle contour lines */}
              <g style={getBgStyle()} aria-hidden="true">
                <rect x="0" y="0" width="480" height="178" fill="url(#wws-ambient)" />
                <g opacity="0.06" stroke={NAVY} strokeWidth="0.4">
                  <line x1="0" y1="60" x2="480" y2="55" />
                  <line x1="0" y1="90" x2="480" y2="86" />
                  <line x1="0" y1="120" x2="480" y2="117" />
                </g>
                <g opacity="0.07" fill={NAVY}>
                  <rect x="14" y="52" width="9" height="42" />
                  <rect x="26" y="66" width="7" height="28" />
                  <rect x="446" y="58" width="8" height="36" />
                  <rect x="458" y="70" width="6" height="24" />
                </g>
              </g>

              {/* Pathway — soft glow layer, then the crisp gradient line, then luminous connection nodes */}
              {pathSegments.map((d, i) => (
                <path key={`glow-${i}`} d={d} fill="none" stroke={ACCENT} strokeLinecap="round" style={getGlowSegmentStyle(i)} filter="url(#wws-blur)" />
              ))}
              {pathSegments.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="url(#wws-path)" strokeLinecap="round" style={getSegmentStyle(i)} />
              ))}
              {groundPoints.map((p, i) => (
                <g key={`node-${i}`} transform={`translate(${p.x}, ${p.y})`}>
                  <circle r="4.5" fill="url(#wws-node-glow)" />
                  <circle r="1.3" fill={ACCENT} style={getNodeStyle(CATEGORIES[i]!.id)} />
                </g>
              ))}

              {/* Buildings */}
              {CATEGORIES.map((cat, index) => {
                const layout = LAYOUT[cat.id];
                const ground = groundPoint(cat.id);
                return (
                  <g key={cat.id}>
                    <ellipse
                      cx={ground.x}
                      cy={ground.y + 2}
                      rx={SHADOW_RX[cat.id] * layout.scale}
                      ry={7.5 * layout.scale}
                      fill="url(#wws-shadow)"
                      style={getShadowStyle(index, cat.id)}
                    />
                    {/* Outer group: pure placement (XML transform attribute).
                        Inner group: pure animation (CSS transform via style) —
                        SVG lets a CSS transform replace an XML transform
                        attribute outright rather than compose with it, so
                        placement and animation must live on separate nodes. */}
                    <g transform={`translate(${layout.x}, ${layout.y}) scale(${layout.scale})`}>
                      <g
                        role="button"
                        tabIndex={0}
                        aria-label={`${cat.label} — ${cat.detail}`}
                        style={getBuildingStyle(index, cat.id)}
                        onMouseEnter={() => setHoveredId(cat.id)}
                        onMouseLeave={() => setHoveredId((c) => (c === cat.id ? null : c))}
                        onFocus={() => setHoveredId(cat.id)}
                        onBlur={() => setHoveredId((c) => (c === cat.id ? null : c))}
                        className="cursor-default outline-none focus-visible:opacity-100"
                      >
                        <BuildingGraphic id={cat.id} uid="wws-d" />
                      </g>
                    </g>
                  </g>
                );
              })}

              {/* Labels — same outer-placement / inner-animation split as buildings. */}
              {CATEGORIES.map((cat, index) => {
                const ground = groundPoint(cat.id);
                const isHovered = hoveredId === cat.id;
                return (
                  <g key={`label-${cat.id}`} transform={`translate(${ground.x}, ${ground.y + 9})`}>
                    <g style={getLabelStyle(index)}>
                      <text
                        textAnchor="middle"
                        x="0"
                        y="0"
                        className="font-display"
                        style={{ fontSize: "5.6px", fill: isHovered ? "#178f86" : "#8a9aa8", transition: "fill 300ms ease-out" }}
                      >
                        {cat.number}
                      </text>
                      <text
                        textAnchor="middle"
                        x="0"
                        y="7.6"
                        style={{
                          fontSize: "5.6px",
                          fontWeight: 700,
                          letterSpacing: "0.035em",
                          textTransform: "uppercase",
                          fill: isHovered ? "#0f2b28" : NAVY,
                          transition: "fill 300ms ease-out",
                        }}
                      >
                        {cat.label}
                      </text>
                      <text textAnchor="middle" x="0" y="13.6" style={{ fontSize: "4.1px", fill: "#748796" }}>
                        {cat.detail}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Mobile — vertical healthcare journey */}
        <div className="mt-6 md:hidden">
          <div className="relative space-y-2">
            {CATEGORIES.map((cat, index) => (
              <div key={cat.id}>
                <Reveal delay={index * 90} className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-white/80 p-4">
                  <svg viewBox="-30 -55 90 90" className="h-16 w-16 shrink-0">
                    <defs>
                      <linearGradient id={`m-${cat.id}-glass`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                        <stop offset="100%" stopColor={ACCENT} stopOpacity="0.35" />
                      </linearGradient>
                      <radialGradient id={`m-${cat.id}-atrium`}>
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                        <stop offset="100%" stopColor={ACCENT} stopOpacity="0.4" />
                      </radialGradient>
                    </defs>
                    <ellipse cx="10" cy="2" rx="24" ry="6" fill={NAVY} opacity="0.12" />
                    <g transform="scale(1)">
                      <BuildingGraphic id={cat.id} uid={`m-${cat.id}`} />
                    </g>
                  </svg>
                  <div className="min-w-0">
                    <p className="font-display text-sm text-ink-400">{cat.number}</p>
                    <p className="text-sm font-bold uppercase tracking-[0.035em] text-ink-900">{cat.label}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-600">{cat.detail}</p>
                  </div>
                </Reveal>
                {index < CATEGORIES.length - 1 ? (
                  <div className="ml-8 h-4 w-px" style={{ background: `linear-gradient(to bottom, ${NAVY}55, ${ACCENT}55)` }} aria-hidden="true" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
