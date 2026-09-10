"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { trackFormStart, trackFormSubmit, trackLead } from "@/lib/tracking";
import { getStoredUtmParams } from "@/lib/utm";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Inline lead-capture form rendered inside a chat bubble after a visitor
 * picks "Request a Call". Posts to the chatbot's own /api/chat-enquiry
 * endpoint rather than /api/contact — see that route for why it's a
 * sibling rather than a reuse (the field shape genuinely differs).
 */
export default function ChatEnquiryForm({
  defaultService,
  onSubmitted,
  onCancel,
}: {
  defaultService: string;
  onSubmitted: () => void;
  onCancel: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackFormStart("chatbot_enquiry");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    trackFormSubmit("chatbot_enquiry");

    const formData = new FormData(event.currentTarget);
    const service = String(formData.get("service") ?? "");
    const payload = { ...Object.fromEntries(formData.entries()), ...getStoredUtmParams() };

    try {
      const response = await fetch("/api/chat-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? "Something went wrong. Please try again.");
      }

      trackLead("chatbot_enquiry", { service });
      onSubmitted();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full space-y-2.5 rounded-xl border border-ink-100 bg-white p-3">
      <div>
        <label htmlFor="chat-name" className="text-xs font-medium text-ink-700">
          Full name<span aria-hidden="true"> *</span>
        </label>
        <input
          id="chat-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500"
        />
      </div>
      <div>
        <label htmlFor="chat-phone" className="text-xs font-medium text-ink-700">
          Phone number<span aria-hidden="true"> *</span>
        </label>
        <input
          id="chat-phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500"
        />
      </div>
      <div>
        <label htmlFor="chat-email" className="text-xs font-medium text-ink-700">
          Email
        </label>
        <input
          id="chat-email"
          name="email"
          type="email"
          autoComplete="email"
          className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500"
        />
      </div>
      <div>
        <label htmlFor="chat-organization" className="text-xs font-medium text-ink-700">
          Organization / Hospital name
        </label>
        <input
          id="chat-organization"
          name="organization"
          type="text"
          autoComplete="organization"
          className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500"
        />
      </div>
      <div>
        <label htmlFor="chat-city" className="text-xs font-medium text-ink-700">
          City / Location
        </label>
        <input
          id="chat-city"
          name="city"
          type="text"
          autoComplete="address-level2"
          className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500"
        />
      </div>
      <div>
        <label htmlFor="chat-service" className="text-xs font-medium text-ink-700">
          Service required
        </label>
        <input
          id="chat-service"
          name="service"
          type="text"
          defaultValue={defaultService}
          placeholder="e.g. NABH Accreditation"
          className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500"
        />
      </div>
      <div>
        <label htmlFor="chat-message" className="text-xs font-medium text-ink-700">
          Requirement<span aria-hidden="true"> *</span>
        </label>
        <textarea
          id="chat-message"
          name="message"
          required
          rows={3}
          className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500"
        />
      </div>

      {status === "error" ? (
        <p role="alert" className="text-xs font-medium text-red-600">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={status === "submitting"} className="flex-1 rounded-lg bg-brand-700 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-60">
          {status === "submitting" ? "Sending…" : "Send Enquiry"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={status === "submitting"}
          className="rounded-lg border border-ink-200 px-3 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50 disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
