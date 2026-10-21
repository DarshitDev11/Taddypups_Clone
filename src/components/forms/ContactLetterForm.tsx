// The contact page's fill-in-the-blanks letter. On submit it folds into an envelope and is "posted" into a mailbox.

"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { submitContactLetter } from "@/app/contact/actions";
import { PawIcon } from "@/components/decor/icons";
import { Envelope, Mailbox } from "@/components/contact/PostingScene";
import { Button } from "@/components/ui/Button";
import { validateContact } from "@/lib/contactSchema";
import type { EnquiryFieldErrors } from "@/lib/enquirySchema";

export interface PuppyOption {
  /** Puppy slug, sent as the form value. */
  value: string;
  /** e.g. "Max (Maltipoo, boy)". */
  label: string;
}

/**
 * The letter's life, in order. The CSS in contact.css reads it from data-phase on the wrapper.
 *   writing -> the form        sealing -> the letter folds up and an envelope appears
 *   posting -> the envelope drops into the mailbox        sent -> thank-you card
 */
type Phase = "writing" | "sealing" | "posting" | "sent";

/** Time the fold animation needs (0.65s) plus a beat, and the time the mailbox animation needs. */
const SEALING_MS = 900;
const POSTING_MS = 1700;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type BlankProps = {
  name: keyof EnquiryFieldErrors;
  label: string;
  /** Width of the blank in "ch" units, so it fits the kind of answer expected. */
  size: number;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "tel";
  maxLength?: number;
};

/** An underlined blank inside a sentence of the letter. */
function Blank({ name, label, size, error, ...inputProps }: BlankProps) {
  return (
    <span className="blank" style={{ "--size": `${size}ch` } as CSSProperties}>
      <input name={name} aria-label={label} aria-invalid={error ? true : undefined} {...inputProps} />
    </span>
  );
}

export function ContactLetterForm({ puppyOptions }: { puppyOptions: PuppyOption[] }) {
  const [phase, setPhase] = useState<Phase>("writing");
  const [errors, setErrors] = useState<EnquiryFieldErrors>({});
  const [formError, setFormError] = useState("");
  const [senderName, setSenderName] = useState("");
  const sentRef = useRef<HTMLDivElement>(null);
  const selectId = useId();
  const noteId = useId();

  // Move focus to the thank-you card so screen readers announce it.
  useEffect(() => {
    if (phase === "sent") sentRef.current?.focus();
  }, [phase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Check in the browser first for instant feedback. The Server Action checks again.
    const local = validateContact(formData);
    if (!local.ok) {
      setErrors(local.errors);
      setFormError("Please check the highlighted blanks and try again.");
      return;
    }

    setErrors({});
    setFormError("");
    setPhase("sealing");

    // Fold the letter and wait for the server at the same time, so the animation is never cut short.
    const [result] = await Promise.all([submitContactLetter(formData), wait(SEALING_MS)]);
    if (!result.ok) {
      setPhase("writing");
      setErrors(result.fieldErrors);
      setFormError(result.message);
      return;
    }

    setSenderName(result.name);
    setPhase("posting");
    await wait(POSTING_MS);
    setPhase("sent");
  }

  if (phase === "sent") {
    return (
      <div className="post" data-phase="sent">
        <div ref={sentRef} tabIndex={-1} role="status" className="post__sent">
          <Mailbox flagUp className="post__box--sent" />
          <h2 className="font-plush mt-4 text-[clamp(1.8rem,4vw,2.6rem)]">Your letter is in the post!</h2>
          <p className="mx-auto mt-3 max-w-[40ch]">
            Thank you, {senderName}. Our team will write back on WhatsApp or by email very soon.
          </p>
          <Button variant="ghost" className="mt-6 bg-milk" onClick={() => setPhase("writing")}>
            Write another letter
          </Button>
        </div>
      </div>
    );
  }

  const errorList = Object.values(errors);

  return (
    <div className="post" data-phase={phase}>
      <form noValidate className="letterform" onSubmit={handleSubmit}>
        <span aria-hidden="true" className="letter__stamp">
          <PawIcon className="size-9" />
        </span>

        <p className="font-scrawl letterform__greeting">Dear TeddyPups,</p>

        <p className="letterform__line">
          my name is{" "}
          <Blank
            name="name"
            label="Your name (required)"
            size={16}
            error={errors.name}
            autoComplete="name"
            maxLength={80}
          />
          , and you can reach me on{" "}
          <Blank
            name="phone"
            label="Phone or WhatsApp number with country code (required)"
            size={15}
            error={errors.phone}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+971 50 123 4567"
          />{" "}
          or by email at{" "}
          <Blank
            name="email"
            label="Email (optional)"
            size={20}
            error={errors.email}
            type="email"
            autoComplete="email"
            placeholder="optional"
          />
          .
        </p>

        <p className="letterform__line">
          I live in{" "}
          <Blank
            name="area"
            label="Your area (optional)"
            size={13}
            error={errors.area}
            autoComplete="address-level2"
            maxLength={80}
            placeholder="e.g. Dubai Marina"
          />
          , and I&apos;m curious about{" "}
          <span className="blank blank--select">
            <label htmlFor={selectId} className="sr-only">
              Puppy you&apos;re interested in (optional)
            </label>
            <select id={selectId} name="puppyId" defaultValue="">
              <option value="">any puppy (not sure yet)</option>
              {puppyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </span>
          .
        </p>

        <label htmlFor={noteId} className="sr-only">
          Your message (optional)
        </label>
        <textarea
          id={noteId}
          name="message"
          rows={4}
          maxLength={2000}
          placeholder="Anything else you'd like to tell us…"
          className="letterform__note"
          aria-invalid={errors.message ? true : undefined}
        />

        {/* Honeypot: invisible to people, tempting to bots. The Server Action drops letters that fill it. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>

        {formError && (
          <div role="alert" className="letterform__alert">
            <p className="font-semibold">{formError}</p>
            {errorList.length > 0 && (
              <ul>
                {errorList.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="letterform__sign">
          <p className="font-scrawl">with love, a future puppy parent</p>
          <button
            type="submit"
            className="btn btn-primary disabled:opacity-70"
            disabled={phase !== "writing"}
          >
            Post my letter
          </button>
        </div>
      </form>

      {/* Envelope and mailbox only exist while the letter is being posted. */}
      {(phase === "sealing" || phase === "posting") && (
        <div className="post__scene" aria-hidden="true">
          <Envelope className="post__envelope" />
          <Mailbox className="post__box" />
        </div>
      )}
    </div>
  );
}
