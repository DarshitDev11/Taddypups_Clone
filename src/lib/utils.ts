import clsx, { type ClassValue } from "clsx";

/**
 * Joins class names and drops falsy ones: cn("btn", isActive && "is-active").
 *
 * It is only clsx on purpose. tailwind-merge would also resolve conflicting utilities, but it
 * doesn't know our custom ones (text-giant, font-plush ...) and could wrongly drop them.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
