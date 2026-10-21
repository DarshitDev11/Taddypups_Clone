// Renders text with every match of the search query wrapped in <mark>.

import type { ReactNode } from "react";

/** Escapes characters that mean something in a regular expression, so "c++" or "(" search literally. */
function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function Highlight({ text, query }: { text: string; query: string }): ReactNode {
  const needle = query.trim();
  if (!needle) return text;

  // A capture group makes split() keep the matches, at the odd positions of the result.
  const parts = text.split(new RegExp(`(${escapeRegExp(needle)})`, "gi"));
  return parts.map((part, index) => (index % 2 === 1 ? <mark key={index}>{part}</mark> : part));
}
