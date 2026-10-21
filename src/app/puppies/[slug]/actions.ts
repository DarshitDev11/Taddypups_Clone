"use server";

// Server Action for the puppy enquiry form. There is no email or database yet: it validates, logs, and says thanks.

import { validateEnquiry, type EnquiryFieldErrors } from "@/lib/enquirySchema";

export type EnquiryState =
  | { status: "idle" }
  | { status: "success"; name: string }
  | { status: "error"; message: string; fieldErrors: EnquiryFieldErrors };

export async function submitEnquiry(_previous: EnquiryState, formData: FormData): Promise<EnquiryState> {
  // Never trust the browser: validate again here with the same rules the form used.
  const result = validateEnquiry(formData);

  // Bots fill every field, including the hidden "website" one. Pretend it worked so they learn nothing.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { status: "success", name: "friend" };
  }

  if (!result.ok) {
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      fieldErrors: result.errors,
    };
  }

  // Placeholder for "save it / email it": swap this log for a database insert or an email later.
  const { name, phone, email, area, message, puppyId } = result.data;
  console.log("[enquiry] new puppy enquiry", { name, phone, email, area, message, puppyId });

  return { status: "success", name: result.data.name };
}
