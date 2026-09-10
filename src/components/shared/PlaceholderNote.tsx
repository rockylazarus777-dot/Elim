/**
 * Visually flags placeholder content directly on the page (not just in code
 * comments), so nothing fabricated or unfinished can be mistaken for a real
 * company fact if the site is previewed before assets are supplied.
 */
export default function PlaceholderNote({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-signal-amber/60 bg-signal-amber/10 px-2 py-0.5 text-[13px] font-medium text-signal-amber">
      {children}
    </span>
  );
}
