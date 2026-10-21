"use server";

// Server Action for the contact letter. There is no email or database yet: it validates, logs, and says thanks.

import { validateContact } from "@/lib/contactSchema";
import type { EnquiryFieldErrors } from "@/lib/enquirySchema";

export type ContactResult =
  { ok: true; name: string } | { ok: false; message: string; fieldErrors: EnquiryFieldErrors };

export async function submitContactLetter(formData: FormData): Promise<ContactResult> {
  // Bots fill every field, including the hidden "website" one. Pretend it worked so they learn nothing.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { ok: true, name: "friend" };
  }

  // Never trust the browser: validate again here with the same rules the form used.
  const result = validateContact(formData);
  if (!result.ok) {
    return {
      ok: false,
      message: "Please check the highlighted blanks and try again.",
      fieldErrors: result.errors,
    };
  }

  // Placeholder for "save it / email it": swap this log for a database insert or an email later.
  const { name, phone, email, area, message, puppyId } = result.data;
  console.log("[contact] new letter", { name, phone, email, area, message, puppyId });

  return { ok: true, name };
}
