import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/shared/Reveal";
import Counter from "@/components/shared/Counter";
import { siteConfig } from "@/lib/site-config";
import { services } from "@/content/services";
import { serviceFamilies } from "@/content/service-families";
import { getAllClients } from "@/content/clients";

/**
 * Premium editorial "About" section for the homepage. Features the uploaded
 * healthcare team image as the main visual anchor with integrated focus areas,
 * statistics, and a strong narrative hook.
 */
export default function AboutEditorial() {
  const clientCount = getAllClients().length;
  const serviceCount = services.length;
  const familyCount = serviceFamilies.length;

  const focusAreas = [
    {
      name: "Compliance Excellence",
      icon: "✓",
      color: "bg-brand-700 text-white",
      position: "top-6 left-6 sm:top-8 sm:left-8 lg:top-12 lg:left-12",
    },
    {
      name: "Patient Care",
      icon: "♡",
      color: "bg-red-500 text-white",
      position: "top-6 right-6 sm:top-8 sm:right-8 lg:top-12 lg:right-12",
    },
    {
      name: "Operational Efficiency",
      icon: "⚙",
      color: "bg-blue-600 text-white",
      position: "bottom-6 left-6 sm:bottom-8 sm:left-8 lg:bottom-12 lg:left-12",
    },
    {
      name: "Growth Management",
      icon: "↗",
      color: "bg-amber-500 text-white",
      position: "bottom-6 right-6 sm:bottom-8 sm:right-8 lg:bottom-12 lg:right-12",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-brand-50/30 to-white">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-100/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-brand-50/30 blur-3xl" />
      </div>

      <div className="container-page relative py-16 sm:py-24 lg:py-32">
        {/* Hook Section */}
        <Reveal as="div" className="mb-12 sm:mb-16 lg:mb-20">
          <p className="eyebrow mb-3 text-brand-700">PARTNERING FOR HEALTHCARE EXCELLENCE</p>
          <div className="max-w-4xl">
            <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-display leading-[1.1] tracking-[-0.06em] text-ink-900 mb-3">
              Bridging Care.{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Building Trust.</span>
                <span className="absolute -inset-1 bg-brand-200/40 -skew-y-1 -z-10 rounded-sm" />
              </span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-700 max-w-2xl">
              From navigating regulatory requirements and establishing strong foundations to strengthening operations, empowering teams and accelerating growth, EMC stands alongside healthcare organisations at every stage — helping them move forward with clarity, confidence and purpose.
            </p>
          </div>
        </Reveal>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* Left: Premium Image with Layered Focus Areas */}
          <Reveal as="div" delay={80} className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(15,24,25,0.3)]">
              {/* Image Container */}
              <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[9/11] overflow-hidden bg-white">
                <Image
                  src="/images/about/about-emc-healthcare-team.png"
                  alt="EMC Healthcare Services team — compliance excellence, patient care, operational efficiency and growth management"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 45vw, (min-width: 640px) 90vw, 100vw"
                  priority
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* Floating Focus Area Badges */}
              {focusAreas.map((area) => (
                <div
                  key={area.name}
                  className={`absolute ${area.position} z-20 transform transition-all duration-500 hover:scale-110 hover:-translate-y-1`}
                >
                  <div className={`${area.color} rounded-full h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center shadow-lg border-4 border-white group cursor-pointer`}>
                    <span className="text-lg sm:text-xl font-bold group-hover:scale-125 transition-transform">
                      {area.icon}
                    </span>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm font-semibold text-ink-900 whitespace-nowrap hidden sm:block">
                    {area.name}
                  </p>
                </div>
              ))}
            </div>

            {/* Statistics Card - Floating below image */}
            <Reveal delay={160} className="mt-6 sm:mt-8">
              <div className="relative rounded-2xl border border-white bg-white/80 backdrop-blur-sm shadow-[0_12px_30px_-8px_rgba(15,24,25,0.2)] p-5 sm:p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-50/40 via-transparent to-transparent rounded-2xl" />
                <div className="relative grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-700 mb-1">Services</p>
                    <p className="text-2xl sm:text-3xl font-display font-bold text-ink-900">
                      <Counter value={serviceCount} />
                    </p>
                  </div>
                  <div className="text-center border-l border-r border-ink-100">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-700 mb-1">Families</p>
                    <p className="text-2xl sm:text-3xl font-display font-bold text-ink-900">
                      <Counter value={familyCount} />
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-700 mb-1">Clients</p>
                    <p className="text-2xl sm:text-3xl font-display font-bold text-ink-900">
                      <Counter value={clientCount} />
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </Reveal>

          {/* Right: Premium Text & CTA Section */}
          <div className="flex flex-col justify-center">
            {/* The Promise */}
            <Reveal delay={100}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-ink-900 mb-3">
                    The healthcare journey, simplified.
                  </h3>
                  <p className="text-base sm:text-lg leading-7 text-ink-700">
                    {siteConfig.description}
                  </p>
                </div>

                <div className="pt-4 space-y-4">
                  <p className="text-sm leading-6 text-ink-600">
                    Formerly known as {siteConfig.formerlyKnownAs}, EMC is positioned as one <strong>coordinated healthcare partner</strong> — not a one-off vendor for a single task.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Focus Areas - Text Version */}
            <Reveal delay={130} className="mt-8 sm:mt-10">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-700 mb-4">HOW EMC CREATES VALUE</p>
              <div className="space-y-3">
                {[
                  "COMPLIANCE & QUALITY",
                  "ESTABLISHMENT & OPERATIONS",
                  "PEOPLE & BUSINESS SUPPORT",
                  "VISIBILITY & GROWTH",
                ].map((pillar, idx) => (
                  <div
                    key={pillar}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700 font-bold text-sm group-hover:bg-brand-100 transition-colors">
                      {idx + 1}
                    </div>
                    <span className="text-sm sm:text-base font-medium text-ink-800 group-hover:text-brand-700 transition-colors">
                      {pillar}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* CTA Section */}
            <Reveal delay={160} className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-3">
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-6 sm:px-7 py-3 sm:py-3.5 rounded-lg bg-brand-700 text-white font-semibold shadow-lg hover:shadow-xl hover:bg-brand-800 transition-all duration-300 hover:-translate-y-0.5 text-sm sm:text-base group"
              >
                Learn more about EMC
                <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-6 sm:px-7 py-3 sm:py-3.5 rounded-lg border-2 border-brand-200 text-brand-700 font-semibold hover:bg-brand-50 transition-all duration-300 text-sm sm:text-base"
              >
                Explore services
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
