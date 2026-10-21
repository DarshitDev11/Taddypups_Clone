"use client";

// "Menu" button plus the full-screen <dialog> it opens on phones and tablets (below 1024px).
// The dialog grows out of the button as a circle; links pop in one after another.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, type MouseEvent, type SyntheticEvent } from "react";
import { PawIcon } from "@/components/decor/icons";
import { Button } from "@/components/ui/Button";
import { HandwrittenLabel } from "@/components/ui/HandwrittenLabel";
import { siteConfig } from "@/data/siteConfig";
import { isActivePath } from "@/lib/navigation";
import { generalWhatsAppLink } from "@/lib/whatsapp";

export function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  const open = () => dialogRef.current?.showModal();

  /** Plays the closing animation, then really closes the dialog when it ends. */
  const close = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog?.open || dialog.hasAttribute("data-closing")) return;

    const finish = () => {
      dialog.removeEventListener("animationend", onAnimationEnd);
      clearTimeout(fallback);
      dialog.removeAttribute("data-closing");
      dialog.close();
    };
    // animationend also fires for the link and backdrop animations, so wait for the right one.
    const onAnimationEnd = (event: AnimationEvent) => {
      if (event.target === dialog && event.animationName === "menu-out") finish();
    };
    // Safety net in case the animation never runs (e.g. the menu was hidden by a resize).
    const fallback = setTimeout(finish, 600);

    dialog.setAttribute("data-closing", "");
    dialog.addEventListener("animationend", onAnimationEnd);
  }, []);

  // Navigating to another page closes the menu.
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Esc triggers the dialog's "cancel" event; take over so the closing animation still plays.
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    close();
  };

  // A click on the backdrop lands on the <dialog> itself (its content fills the rest).
  // Clicking a link closes the menu even when it points to the page we're already on.
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    const target = event.target as HTMLElement;
    if (target === dialogRef.current || target.closest("a")) close();
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-cocoa bg-milk px-4 text-[0.95rem] font-semibold lg:hidden"
      >
        <PawIcon className="size-4" />
        Menu
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Site menu"
        onCancel={handleCancel}
        onClick={handleClick}
        className="mobile-menu m-0 h-dvh max-h-none w-screen max-w-none bg-honey p-0 text-cocoa backdrop:bg-cocoa/40"
      >
        <div className="gutter flex h-full flex-col pt-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between">
            <HandwrittenLabel tone="inherit" className="text-lg">
              where to, friend?
            </HandwrittenLabel>
            <button
              type="button"
              onClick={close}
              className="h-11 rounded-full bg-cocoa px-5 font-semibold text-milk"
            >
              Close
            </button>
          </div>

          <nav aria-label="Mobile" className="mt-10 flex-1">
            <ul className="space-y-1">
              {siteConfig.nav.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      data-active={active}
                      aria-current={active ? "page" : undefined}
                      className="mobile-menu__link font-plush block py-2 text-[clamp(2.4rem,11vw,3.4rem)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="space-y-3">
            <Button variant="whatsapp" href={generalWhatsAppLink} className="w-full">
              WhatsApp us
            </Button>
            <a href={siteConfig.contact.phoneHref} className="block text-center text-sm font-medium">
              {siteConfig.contact.phoneDisplay}
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
