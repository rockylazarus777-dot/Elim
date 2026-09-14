"use client";

import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/shared/Reveal";
import { ServiceContent } from "@/types/content";
import { FamilyTheme } from "@/lib/theme";
import { buildServiceWhatsAppHref } from "@/lib/service-whatsapp";
import { trackCtaClick, trackWhatsAppClick } from "@/lib/tracking";

const WHATSAPP_ICON = (
  <svg viewBox="0 0 32 32" fill="currentColor" className="h-5 w-5" aria-hidden="true">
    <path d="M16.004 3C9.107 3 3.5 8.605 3.5 15.5c0 2.43.688 4.7 1.882 6.63L3 29l7.05-2.334A12.42 12.42 0 0 0 16.004 28C22.9 28 28.507 22.395 28.507 15.5S22.9 3 16.004 3Zm0 22.64a10.1 10.1 0 0 1-5.15-1.41l-.37-.22-3.79 1.256 1.27-3.694-.24-.38A10.1 10.1 0 0 1 5.86 15.5c0-5.6 4.556-10.14 10.144-10.14 5.588 0 10.144 4.54 10.144 10.14 0 5.6-4.556 10.14-10.144 10.14Zm5.57-7.59c-.305-.152-1.804-.89-2.084-.992-.28-.102-.484-.152-.688.152-.203.305-.79.992-.968 1.196-.178.203-.356.229-.66.076-.305-.152-1.288-.475-2.454-1.516-.907-.81-1.52-1.81-1.698-2.115-.178-.305-.019-.47.133-.622.137-.136.305-.356.457-.534.152-.178.203-.305.305-.508.102-.203.05-.381-.025-.534-.076-.152-.688-1.658-.943-2.27-.248-.596-.5-.516-.688-.526l-.586-.01c-.203 0-.534.076-.813.381-.28.305-1.068 1.043-1.068 2.544 0 1.5 1.093 2.951 1.245 3.155.152.203 2.15 3.283 5.208 4.603.728.314 1.296.502 1.739.643.73.232 1.394.199 1.92.121.586-.088 1.804-.738 2.058-1.45.254-.712.254-1.322.178-1.45-.076-.127-.28-.203-.585-.355Z" />
  </svg>
);

export default function ServiceFinalCTA({ service, theme }: { service: ServiceContent; theme: FamilyTheme }) {
  const whatsappHref = buildServiceWhatsAppHref(service.name);

  return (
    <section className={`relative isolate overflow-hidden bg-gradient-to-br ${theme.gradient}`}>
      {service.photoSrc ? (
        <>
          <Image src={service.photoSrc} alt="" fill sizes="100vw" className="object-cover opacity-[0.08] blur-[2px]" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/75 to-ink-950/85" />
        </>
      ) : null}

      <div className="container-page relative py-16 sm:py-20 lg:py-24">
        <Reveal className="max-w-xl">
          <h2 className="text-display-lg font-display text-white">Have a {service.name.toLowerCase()} requirement?</h2>
          <p className="mt-4 text-white/85">Tell us about your facility and current status — we&apos;ll help you identify the right next step.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("service_final_cta")}
              className="btn bg-[#25D366] text-white hover:bg-[#20BD5A]"
            >
              {WHATSAPP_ICON}
              Connect on WhatsApp
            </a>
            <Link
              href="/services"
              onClick={() => trackCtaClick("Explore All Services", "service_final_cta")}
              className="btn bg-white/10 text-white ring-1 ring-inset ring-white/30 hover:bg-white/20"
            >
              Explore All Services
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
