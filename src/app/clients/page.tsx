import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import CTASection from "@/components/shared/CTASection";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import { getTrustedClientLogos } from "@/content/clients";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Trusted by Healthcare Leaders",
  description:
    "Hospitals and clinics that trust EMC Healthcare Services for compliance, accreditation, digital growth and operational support.",
  path: "/clients",
});

export default function ClientsPage() {
  const clients = getTrustedClientLogos();

  return (
    <>
      <Breadcrumbs items={[{ name: "Clients", path: "/clients" }]} />

      <section className="border-t border-ink-100 bg-white">
        <div className="container-page py-10 sm:py-14">
          <SectionHeading
            as="h1"
            eyebrow="Client network"
            title="Organisations that value practical, results-driven healthcare support"
            description="From specialist clinics to multi-speciality hospitals, EMC works alongside healthcare teams that need responsive expertise and a clear path to sustainable operational improvement."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {clients.map((client, index) => {
              const isFocusLogo = client.focus;

              return (
                <Reveal key={client.name} delay={(index % 4) * 70} className="h-full">
                  <article className="group h-full rounded-[1.5rem] border border-ink-100 bg-white/90 p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                    <div
                      className={`flex ${isFocusLogo ? "min-h-[210px]" : "min-h-[180px]"} items-center justify-center rounded-[1.1rem] border border-ink-100 bg-[radial-gradient(circle_at_top,_rgba(224,236,233,0.75),_rgba(255,255,255,0.9)_50%,_rgba(244,246,247,0.9))] p-6`}
                    >
                      <Image
                        src={client.logoSrc}
                        alt={client.alt}
                        width={480}
                        height={220}
                        unoptimized
                        className={`mx-auto h-auto w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.04] ${
                          isFocusLogo ? "max-h-[150px] sm:max-h-[180px]" : "max-h-[120px] sm:max-h-[150px]"
                        }`}
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <h2 className="text-sm font-semibold leading-relaxed text-ink-800">{client.name}</h2>
                      <p className="mt-1 text-xs leading-relaxed text-ink-500">{client.location}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection
        title="Want to be EMC's next success story?"
        description="Whether it's a single compliance requirement or a full growth strategy, tell us where your hospital or clinic needs support."
      />
    </>
  );
}
