// Validation rules for the puppy enquiry form. The browser and the Server Action both use this one schema,
// so a message that passes in the browser can never be rejected by the server for a different reason.

import { z } from "zod";

export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name (at least 2 characters).")
    .max(80, "Please keep your name under 80 characters."),
  // Digits with an optional leading + and common separators; the hint asks for a country code.
  phone: z
    .string()
    .trim()
    .min(1, "Please enter a phone number or WhatsApp number.")
    .regex(/^\+?[\d\s().-]{7,20}$/, "Please enter a valid number, e.g. +971 50 123 4567."),
  // Optional: an empty string is fine, anything else must look like an email address.
  email: z.union([z.literal(""), z.email("Please enter a valid email address.")]),
  area: z.string().trim().max(80, "Please keep this under 80 characters."),
  message: z.string().trim().max(2000, "Please keep your message under 2000 characters."),
  /** Slug of the puppy the enquiry is about. Sent as a hidden field. */
  puppyId: z.string().trim().min(1),
  /** Honeypot: hidden from people, so only bots fill it in. Not validated here, checked in the action. */
  website: z.string().default(""),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

/** Field name to message, for showing errors under the right input. */
export type EnquiryFieldErrors = Partial<Record<keyof EnquiryInput, string>>;

const FIELD_NAMES = ["name", "phone", "email", "area", "message", "puppyId", "website"] as const;

/** Pulls the form fields out of FormData as plain strings (missing fields become ""). */
export function readEnquiryFormData(formData: FormData): Record<(typeof FIELD_NAMES)[number], string> {
  const read = (field: string) => {
    const value = formData.get(field);
    return typeof value === "string" ? value : "";
  };
  return Object.fromEntries(FIELD_NAMES.map((field) => [field, read(field)])) as Record<
    (typeof FIELD_NAMES)[number],
    string
  >;
}

/** Runs the schema and returns either the clean data or one message per failing field. */
export function validateEnquiry(
  formData: FormData,
): { ok: true; data: EnquiryInput } | { ok: false; errors: EnquiryFieldErrors } {
  const result = enquirySchema.safeParse(readEnquiryFormData(formData));
  if (result.success) return { ok: true, data: result.data };

  const errors: EnquiryFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof EnquiryInput;
    // Keep the first message per field.
    errors[field] ??= issue.message;
  }
  return { ok: false, errors };
}
