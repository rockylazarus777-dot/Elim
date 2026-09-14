"use client";

import Link from "next/link";
import ThemedVisual from "@/components/shared/ThemedVisual";
import { ServiceContent, ServiceFamilyInfo } from "@/types/content";
import { FamilyTheme } from "@/lib/theme";
import { buildServiceWhatsAppHref } from "@/lib/service-whatsapp";
import { trackCtaClick, trackWhatsAppClick } from "@/lib/tracking";

const WHATSAPP_ICON = (
  <svg viewBox="0 0 32 32" fill="currentColor" className="h-5 w-5" aria-hidden="true">
    <path d="M16.004 3C9.107 3 3.5 8.605 3.5 15.5c0 2.43.688 4.7 1.882 6.63L3 29l7.05-2.334A12.42 12.42 0 0 0 16.004 28C22.9 28 28.507 22.395 28.507 15.5S22.9 3 16.004 3Zm0 22.64a10.1 10.1 0 0 1-5.15-1.41l-.37-.22-3.79 1.256 1.27-3.694-.24-.38A10.1 10.1 0 0 1 5.86 15.5c0-5.6 4.556-10.14 10.144-10.14 5.588 0 10.144 4.54 10.144 10.14 0 5.6-4.556 10.14-10.144 10.14Zm5.57-7.59c-.305-.152-1.804-.89-2.084-.992-.28-.102-.484-.152-.688.152-.203.305-.79.992-.968 1.196-.178.203-.356.229-.66.076-.305-.152-1.288-.475-2.454-1.516-.907-.81-1.52-1.81-1.698-2.115-.178-.305-.019-.47.133-.622.137-.136.305-.356.457-.534.152-.178.203-.305.305-.508.102-.203.05-.381-.025-.534-.076-.152-.688-1.658-.943-2.27-.248-.596-.5-.516-.688-.526l-.586-.01c-.203 0-.534.076-.813.381-.28.305-1.068 1.043-1.068 2.544 0 1.5 1.093 2.951 1.245 3.155.152.203 2.15 3.283 5.208 4.603.728.314 1.296.502 1.739.643.73.232 1.394.199 1.92.121.586-.088 1.804-.738 2.058-1.45.254-.712.254-1.322.178-1.45-.076-.127-.28-.203-.585-.355Z" />
  </svg>
);

export default function ServiceHero({
  service,
  family,
  theme,
}: {
  service: ServiceContent;
  family: ServiceFamilyInfo | undefined;
  theme: FamilyTheme;
}) {
  const whatsappHref = buildServiceWhatsAppHref(service.name);

  return (
    <section className={`overflow-hidden bg-gradient-to-br ${theme.gradient} text-white`}>
      <div className="container-page grid min-h-[640px] items-center gap-12 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.85fr)_minmax(420px,0.85fr)] lg:gap-16 lg:py-28">
        <div>
          {family ? <p className="eyebrow text-white/70">{family.name}</p> : null}
          <h1 className="mt-6 max-w-2xl text-display-xl font-display leading-[0.96] text-white">{service.name}</h1>
          {service.positioning ? (
            <p className="mt-6 max-w-xl font-display text-2xl leading-tight text-white/90 sm:text-3xl">{service.positioning}</p>
          ) : null}
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{service.whatIsIt}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("service_hero")}
              className="btn bg-[#25D366] text-white shadow-card hover:bg-[#20BD5A]"
            >
              {WHATSAPP_ICON}
              Connect on WhatsApp
            </a>
            <Link
              href="/services"
              onClick={() => trackCtaClick("Explore All Services", "service_hero")}
              className="btn-secondary bg-white/10 text-white ring-white/30 hover:bg-white hover:text-ink-900"
            >
              Explore All Services
            </Link>
          </div>
        </div>

        <div className="relative lg:justify-self-end">
          <div className="relative w-full overflow-hidden rounded-2xl border border-white/15 bg-ink-900 shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
            <ThemedVisual
              family={service.family}
              icon={service.icon}
              label={service.name}
              photoSrc={service.photoSrc}
              photoAlt={service.photoAlt}
              className="aspect-[4/3] w-full"
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
