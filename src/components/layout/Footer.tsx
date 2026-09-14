import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { serviceFamilies } from "@/content/service-families";
import { getServicesByFamily, getServiceHref } from "@/content/services";
import PlaceholderNote from "@/components/shared/PlaceholderNote";
import TrackedContactLink from "@/components/shared/TrackedContactLink";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";

/** Footer-only curation — the Services page itself still lists all nine
 * families untouched. Picked by id (not a slice) so this stays correct even
 * if `serviceFamilies`'s order ever changes. */
const FOOTER_SERVICE_FAMILY_IDS = ["compliance-licensing", "quality-accreditation", "marketing", "medical-camps"];

export default function Footer() {
  const year = new Date().getFullYear();
  const footerServiceFamilies = serviceFamilies.filter((family) => FOOTER_SERVICE_FAMILY_IDS.includes(family.id));

  return (
    <footer className="border-t border-ink-100 bg-ink-950 text-ink-200">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo variant="dark" companyName="EMC Healthcare Services Pvt. Ltd." />
          <p className="mt-4 font-display text-lg font-medium tracking-tight text-[#20E0D0]">Bridging Care. Building Trust.</p>
          <SocialLinks />
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white">Services</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {footerServiceFamilies.map((family) => {
              const familyServices = getServicesByFamily(family.id).filter((s) => s.isCore);
              const single = familyServices.length === 1 ? familyServices[0] : null;
              const href = single ? getServiceHref(single) : `/services#${family.id}`;
              return (
                <li key={family.id}>
                  <Link href={href} className="text-ink-100 transition-colors hover:text-[#20E0D0]">
                    {family.name}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link href="/services" className="text-ink-100 transition-colors hover:text-[#20E0D0]">
                View All Services →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white">Company</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              { label: "About Us", href: "/about" },
              { label: "All Services", href: "/services" },
              { label: "Health at Home", href: "/services/health-at-home" },
              { label: "Clients", href: "/clients" },
              { label: "Blog", href: "/blog" },
              { label: "Contact", href: "/contact" },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-100 transition-colors hover:text-[#20E0D0]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-ink-100">
            <li>
              {siteConfig.phone.isPlaceholder ? (
                <PlaceholderNote>Phone number needed</PlaceholderNote>
              ) : (
                <TrackedContactLink
                  kind="phone"
                  href={siteConfig.phone.href}
                  location="footer"
                  className="transition-colors hover:text-[#20E0D0]"
                >
                  {siteConfig.phone.display}
                </TrackedContactLink>
              )}
            </li>
            {!siteConfig.phoneSecondary.isPlaceholder ? (
              <li>
                <TrackedContactLink
                  kind="phone"
                  href={siteConfig.phoneSecondary.href}
                  location="footer"
                  className="transition-colors hover:text-[#20E0D0]"
                >
                  {siteConfig.phoneSecondary.display}
                </TrackedContactLink>
              </li>
            ) : null}
            <li>
              {siteConfig.email.isPlaceholder ? (
                <PlaceholderNote>Contact email needed</PlaceholderNote>
              ) : (
                <TrackedContactLink
                  kind="email"
                  href={siteConfig.email.href}
                  location="footer"
                  className="transition-colors hover:text-[#20E0D0]"
                >
                  {siteConfig.email.display}
                </TrackedContactLink>
              )}
            </li>
            <li>
              {siteConfig.address.isPlaceholder ? (
                <PlaceholderNote>Address needed</PlaceholderNote>
              ) : (
                <address className="not-italic">
                  {siteConfig.address.streetAddress}, {siteConfig.address.addressLocality}
                </address>
              )}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-ink-300 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} EMC Healthcare Services Pvt Ltd. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {siteConfig.footerLegal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-[#20E0D0]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
