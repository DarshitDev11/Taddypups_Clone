"use client";

// Enquiry form on a puppy's page: validates in the browser first, then hands over to a Server Action.

import { useActionState, useId, useState, type FormEvent } from "react";
import { useFormStatus } from "react-dom";
import { submitEnquiry, type EnquiryState } from "@/app/puppies/[slug]/actions";
import { Button } from "@/components/ui/Button";
import { validateEnquiry, type EnquiryFieldErrors } from "@/lib/enquirySchema";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink, whatsappMessages } from "@/lib/whatsapp";

type EnquiryFormProps = {
  puppy: { slug: string; name: string; breed: string };
};

const INITIAL_STATE: EnquiryState = { status: "idle" };

const inputClass =
  "mt-1.5 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 text-base outline-none transition-[border-color,box-shadow] focus:border-cocoa focus:shadow-[0_0_0_4px_rgb(242_190_107/0.6)] aria-[invalid=true]:border-error";

type FieldProps = {
  name: keyof EnquiryFieldErrors;
  label: string;
  /** Shown after the label: "required" adds a toffee star, "optional" a grey note. */
  mark: "required" | "optional";
  error?: string;
  hint?: string;
  type?: string;
  inputMode?: "tel" | "email";
  autoComplete?: string;
  maxLength?: number;
};

function Field({ name, label, mark, error, hint, type = "text", ...inputProps }: FieldProps) {
  const id = useId();
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={id} className="block text-[0.95rem] font-semibold">
        {label}
        {mark === "required" ? (
          <span className="text-toffee-ink"> *</span>
        ) : (
          <span className="font-normal text-cocoa-soft"> (optional)</span>
        )}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        className={cn(inputClass, "h-12")}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        required={mark === "required"}
        {...inputProps}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm font-semibold text-error">
          {error}
        </p>
      )}
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-cocoa-soft">
          {hint}
        </p>
      )}
    </div>
  );
}

/** Its own component because useFormStatus only works inside the <form> it reports on. */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full disabled:opacity-70 sm:w-auto">
      {pending ? "Sending…" : "Send enquiry"}
    </Button>
  );
}

export function EnquiryForm({ puppy }: EnquiryFormProps) {
  const [state, formAction] = useActionState(submitEnquiry, INITIAL_STATE);
  // Errors found by the browser check. Cleared on the next submit; server errors come back through `state`.
  const [clientErrors, setClientErrors] = useState<EnquiryFieldErrors | null>(null);
  const messageId = useId();

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-2xl bg-honey-soft p-6">
        <p className="font-plush-text text-2xl font-bold">Thank you, {state.name}!</p>
        <p className="mt-2 text-cocoa-soft">
          We&apos;ve got your enquiry about {puppy.name} and our team will get back to you promptly. For the
          quickest reply you can also message us on WhatsApp.
        </p>
        <Button variant="whatsapp" href={buildWhatsAppLink(whatsappMessages.puppy(puppy))} className="mt-5">
          Ask about {puppy.name} on WhatsApp
        </Button>
      </div>
    );
  }

  const errors = clientErrors ?? (state.status === "error" ? state.fieldErrors : {});

  // Check in the browser before the Server Action runs; instant feedback, no round trip.
  function checkBeforeSending(event: FormEvent<HTMLFormElement>) {
    const result = validateEnquiry(new FormData(event.currentTarget));
    if (result.ok) {
      setClientErrors(null);
      return;
    }
    event.preventDefault();
    setClientErrors(result.errors);
  }

  return (
    // noValidate: we show our own messages instead of the browser's pop-up bubbles.
    <form action={formAction} onSubmit={checkBeforeSending} noValidate className="relative space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          name="name"
          label="Your name"
          mark="required"
          autoComplete="name"
          maxLength={80}
          error={errors.name}
        />
        <Field
          name="phone"
          label="Phone or WhatsApp"
          mark="required"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          hint="With country code, e.g. +971 50 123 4567"
          error={errors.phone}
        />
        <Field
          name="email"
          label="Email"
          mark="optional"
          type="email"
          autoComplete="email"
          error={errors.email}
        />
        <Field
          name="area"
          label="Your area"
          mark="optional"
          autoComplete="address-level2"
          maxLength={80}
          hint="e.g. Dubai Marina"
          error={errors.area}
        />
      </div>

      <input type="hidden" name="puppyId" value={puppy.slug} />

      <div>
        <label htmlFor={messageId} className="block text-[0.95rem] font-semibold">
          Message <span className="font-normal text-cocoa-soft">(optional)</span>
        </label>
        <textarea
          id={messageId}
          name="message"
          rows={4}
          maxLength={2000}
          defaultValue={`Hi! I'd love to know more about ${puppy.name} (${puppy.breed}).`}
          aria-invalid={Boolean(errors.message)}
          className={cn(inputClass, "py-3")}
        />
        {errors.message && (
          <p role="alert" className="mt-1 text-sm font-semibold text-error">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot: off-screen and skipped by keyboard users, so only a bot fills it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" name="website" defaultValue="" />
        </label>
      </div>

      {state.status === "error" && !clientErrors && (
        <p role="alert" className="text-sm font-semibold text-error">
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
