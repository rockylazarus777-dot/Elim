"use client";

import { FormEvent, useRef, useState } from "react";
import { trackFormStart, trackFormSubmit, trackLead } from "@/lib/tracking";
import { getStoredUtmParams } from "@/lib/utm";
import { enquiryServiceOptions } from "@/content/enquiry-services";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const hasStartedRef = useRef(false);

  function handleFormStart() {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    trackFormStart("contact_form");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    trackFormSubmit("contact_form");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const service = String(formData.get("service") ?? "");
    const payload = { ...Object.fromEntries(formData.entries()), ...getStoredUtmParams() };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
      // Fires only here — a genuine, confirmed lead submission — never on page open.
      trackLead("contact_form", { service, ...getStoredUtmParams() });
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="card p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-ink-900">Thank you — your enquiry has been received</h3>
        <p className="prose-content mx-auto mt-2">
          A member of the EMC team will get back to you shortly. If your requirement is urgent, please use the phone
          number above.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onFocus={handleFormStart} noValidate className="card space-y-5 p-6 sm:p-8">
      {/* Honeypot field — hidden from real users, catches basic bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company_website">Company Website</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-ink-800">
            Full name<span aria-hidden="true"> *</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="mt-1.5 w-full rounded-lg border border-ink-200 px-4 py-2.5 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500"
          />
        </div>
        <div>
          <label htmlFor="organisation" className="text-sm font-medium text-ink-800">
            Hospital / Clinic name<span aria-hidden="true"> *</span>
          </label>
          <input
            id="organisation"
            name="organisation"
            type="text"
            required
            className="mt-1.5 w-full rounded-lg border border-ink-200 px-4 py-2.5 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="text-sm font-medium text-ink-800">
            Phone number<span aria-hidden="true"> *</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className="mt-1.5 w-full rounded-lg border border-ink-200 px-4 py-2.5 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-ink-800">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="mt-1.5 w-full rounded-lg border border-ink-200 px-4 py-2.5 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="service" className="text-sm font-medium text-ink-800">
          Which service are you enquiring about?
        </label>
        <select
          id="service"
          name="service"
          defaultValue=""
          className="mt-1.5 w-full rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500"
        >
          <option value="" disabled>
            Select a service
          </option>
          {enquiryServiceOptions.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-ink-800">
          Tell us about your requirement<span aria-hidden="true"> *</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-1.5 w-full rounded-lg border border-ink-200 px-4 py-2.5 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500"
        />
      </div>

      {status === "error" ? (
        <p role="alert" className="text-sm font-medium text-red-600">
          {errorMessage}
        </p>
      ) : null}

      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full sm:w-auto">
        {status === "submitting" ? "Sending…" : "Send Enquiry"}
      </button>
      <p className="text-xs text-ink-500">
        By submitting this form you agree to be contacted by EMC Healthcare Services about your enquiry.
      </p>
    </form>
  );
}
