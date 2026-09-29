import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/shared/Reveal";
import { getTrustedClientLogos } from "@/content/clients";

/** Homepage shows a compact 14-client "featured" selection (7×2 on desktop)
 * so the section stays dense and scannable; the full roster (currently 21
 * logos) still renders in full on /clients, which calls
 * `getTrustedClientLogos()` independently — slicing here never touches the
 * underlying data. No explicit featured-order flag exists on the data yet,
 * so this takes the first 14 in their existing authored order. */
const FEATURED_COUNT = 14;

export default function ClientsShowcase() {
  const featuredClients = getTrustedClientLogos().slice(0, FEATURED_COUNT);

  return (
    <div className="space-y-7">
      <div className="max-w-2xl">
        <p className="eyebrow text-sm">Trusted by</p>
        <h2 className="mt-3 text-[clamp(1.9rem,2.6vw,2.6rem)] font-display leading-[1.15] tracking-[-0.01em] text-ink-900">
          Trusted Across Healthcare
        </h2>
        <p className="mt-4 max-w-xl text-[1.08rem] leading-relaxed text-ink-800">
          Healthcare organisations that have partnered with EMC across our areas of expertise.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-7">
        {featuredClients.map((client, index) => (
          <Reveal key={client.name} delay={index * 40} className="h-full">
            <article className="group flex h-full flex-col items-center gap-3 rounded-xl border border-ink-100 bg-white p-3 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover sm:p-4">
              <div className="flex h-16 w-full items-center justify-center sm:h-[4.5rem]">
                <Image
                  src={client.logoSrc}
                  alt={client.alt}
                  width={160}
                  height={80}
                  className="h-auto max-h-16 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.05] sm:max-h-[4.5rem]"
                  priority={index < 7}
                />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold leading-snug text-ink-800">{client.name}</p>
                <p className="mt-0.5 text-[0.7rem] leading-snug text-ink-500">{client.location}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Link href="/clients" className="link-underline inline-block text-sm font-semibold text-brand-700">
        View all clients →
      </Link>
    </div>
  );
}
