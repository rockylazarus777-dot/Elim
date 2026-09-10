interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  /** "lg" bumps eyebrow/title/description ~8-12% and darkens the
   * description for stronger contrast — opt-in per call site, so every
   * existing `size="md"` (default) usage elsewhere is pixel-identical to
   * before. */
  size?: "md" | "lg";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as = "h2",
  size = "md",
}: SectionHeadingProps) {
  const Heading = as;
  const isLg = size === "lg";
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""} animate-fade-in`}>
      {eyebrow ? <p className={`eyebrow mb-3 ${isLg ? "text-sm" : ""}`}>{eyebrow}</p> : null}
      <Heading
        className={
          isLg
            ? "text-[clamp(1.9rem,2.6vw,2.6rem)] font-display leading-[1.15] tracking-[-0.01em] text-ink-900"
            : "text-display-md font-display text-ink-900"
        }
      >
        {title}
      </Heading>
      {description ? (
        <p className={isLg ? "mt-4 max-w-prose text-[1.14rem] leading-relaxed text-ink-800" : "prose-content mt-4"}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
