// Validation for the "letter" contact form. It is the puppy enquiry schema with one rule relaxed:
// a general letter does not have to be about a particular puppy, so `puppyId` may be empty.

import { z } from "zod";
import {
  enquirySchema,
  readEnquiryFormData,
  type EnquiryFieldErrors,
  type EnquiryInput,
} from "@/lib/enquirySchema";

export const contactSchema = enquirySchema.extend({
  /** Slug of the puppy the writer is curious about, or "" for "any puppy (not sure yet)". */
  puppyId: z.string().trim().max(80),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Runs the schema and returns either clean data or one message per failing field (same shape as validateEnquiry). */
export function validateContact(
  formData: FormData,
): { ok: true; data: ContactInput } | { ok: false; errors: EnquiryFieldErrors } {
  const result = contactSchema.safeParse(readEnquiryFormData(formData));
  if (result.success) return { ok: true, data: result.data };

  const errors: EnquiryFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof EnquiryInput;
    errors[field] ??= issue.message; // keep the first message per field
  }
  return { ok: false, errors };
}
