'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toaster';

export const enquirySchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  hospitalName: z.string().min(2, 'Please enter your hospital name'),
  phone: z
    .string()
    .min(7, 'Please enter a valid phone number')
    .max(20)
    .regex(/^[+\d\s()-]+$/, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Please share a bit more detail (10+ chars)'),
  // honeypot
  website: z.string().max(0).optional().or(z.literal('')),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

export default function EnquiryForm() {
  const { toast } = useToast();
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { website: '' },
  });

  // Inject reCAPTCHA v3 script when key is configured
  React.useEffect(() => {
    if (!recaptchaSiteKey) return;
    if (document.getElementById('recaptcha-v3')) return;
    const script = document.createElement('script');
    script.id = 'recaptcha-v3';
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, [recaptchaSiteKey]);

  async function getRecaptchaToken(): Promise<string | undefined> {
    if (!recaptchaSiteKey || typeof window === 'undefined' || !window.grecaptcha) {
      return undefined;
    }
    return new Promise((resolve) => {
      window.grecaptcha!.ready(async () => {
        const token = await window.grecaptcha!.execute(recaptchaSiteKey, {
          action: 'enquiry',
        });
        resolve(token);
      });
    });
  }

  async function onSubmit(values: EnquiryInput) {
    try {
      const recaptchaToken = await getRecaptchaToken();
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, recaptchaToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Something went wrong. Please try again.');
      }
      toast({
        type: 'success',
        title: 'Enquiry received',
        description:
          'Our team will reach out within one business day. A confirmation email is on its way.',
      });
      reset();
    } catch (err) {
      toast({
        type: 'error',
        title: 'Could not send enquiry',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4 rounded-3xl border border-brand-100 bg-white p-6 shadow-card sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Full name"
          error={errors.name?.message}
          input={
            <Input
              placeholder="Dr. Anita Sharma"
              autoComplete="name"
              {...register('name')}
            />
          }
        />
        <Field
          label="Hospital name"
          error={errors.hospitalName?.message}
          input={
            <Input
              placeholder="City Care Hospital"
              autoComplete="organization"
              {...register('hospitalName')}
            />
          }
        />
        <Field
          label="Phone"
          error={errors.phone?.message}
          input={
            <Input
              placeholder="+91 98xxxxxxxx"
              type="tel"
              autoComplete="tel"
              {...register('phone')}
            />
          }
        />
        <Field
          label="Email"
          error={errors.email?.message}
          input={
            <Input
              placeholder="you@hospital.com"
              type="email"
              autoComplete="email"
              {...register('email')}
            />
          }
        />
      </div>

      <Field
        label="How can we help?"
        error={errors.message?.message}
        input={
          <Textarea
            rows={5}
            placeholder="Tell us about your hospital, current challenges, and goals."
            {...register('message')}
          />
        }
      />

      {/* honeypot */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" {...register('website')} />
        </label>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full sm:w-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Enquiry
          </>
        )}
      </Button>

      <p className="text-xs text-muted">
        By submitting, you agree to our privacy practices. We respond within
        one business day.
        {recaptchaSiteKey
          ? ' This site is protected by reCAPTCHA.'
          : ''}
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  input,
}: {
  label: string;
  error?: string;
  input: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {input}
      {error ? (
        <p className="text-xs font-medium text-rose-600">{error}</p>
      ) : null}
    </div>
  );
}
