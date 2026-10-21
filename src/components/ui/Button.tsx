// Pill button. Renders a <button>, a Next <Link> (internal href) or a plain <a> (external, tel:, mailto:).

import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "ghost" | "whatsapp";
type ButtonSize = "default" | "compact";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

type ButtonAsButton = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = BaseProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  ghost: "btn-ghost",
  whatsapp: "btn-whatsapp",
};

/** Internal = a page or hash on this site; everything else leaves the site. */
const isInternal = (href: string) => href.startsWith("/") || href.startsWith("#");

/** Only http(s) links open in a new tab; tel: and mailto: hand over to the phone/mail app. */
const isWebLink = (href: string) => /^https?:\/\//.test(href);

export function Button({ variant = "primary", size = "default", className, ...props }: ButtonProps) {
  const classes = cn("btn", VARIANT_CLASS[variant], size === "compact" && "btn--compact", className);

  if (props.href === undefined) {
    // type="button" so a Button inside a <form> doesn't submit unless the caller says type="submit".
    return <button type="button" className={classes} {...props} />;
  }

  const { href, ...anchorProps } = props;

  if (isInternal(href)) {
    return <Link href={href} className={classes} {...anchorProps} />;
  }

  const externalProps = isWebLink(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return <a href={href} className={classes} {...externalProps} {...anchorProps} />;
}
