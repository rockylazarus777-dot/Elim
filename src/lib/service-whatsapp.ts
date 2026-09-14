import { siteConfig } from "@/lib/site-config";

/**
 * WhatsApp deep link for a specific service's detail-page CTAs — always the
 * same EMC Admin WhatsApp Business number used site-wide (WhatsAppButton,
 * chatbot handoff), just with a service-specific prefilled message instead
 * of the generic one. Never a contact-form URL.
 */
export function buildServiceWhatsAppHref(serviceName: string): string {
  const message = `Hello EMC Healthcare Services, I'd like to know more about ${serviceName}.`;
  return `${siteConfig.whatsapp.href}?text=${encodeURIComponent(message)}`;
}
