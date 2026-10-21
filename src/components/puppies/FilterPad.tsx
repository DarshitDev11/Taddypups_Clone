"use client";

// The taped-on "sketchpad" with three rows of sticker chips: where, breed, boy or girl.

import type { ReactNode } from "react";
import { breedFilterOptions, genderFilterOptions, whereFilterOptions } from "@/data/puppyFilters";
import type { PuppyFilters } from "@/lib/puppies";

/** What a click changes. `null` removes that filter. Where-chips set two keys because "Imported" and "Korean Teacup" replace each other. */
export type FilterPatch = Partial<Record<keyof PuppyFilters, string | null>>;

type FilterPadProps = {
  filters: PuppyFilters;
  /** Left out in the static (pre-hydration) render, where the chips are inert. */
  onChange?: (patch: FilterPatch) => void;
  onClear?: () => void;
};

type ChipProps = { label: string; pressed: boolean; onClick?: () => void };

function StickerChip({ label, pressed, onClick }: ChipProps) {
  return (
    <button type="button" className="sticker-chip" aria-pressed={pressed} onClick={onClick}>
      {label}
    </button>
  );
}

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="font-scrawl mr-1 w-full shrink-0 text-cocoa-soft sm:w-28">{label}</span>
      {children}
    </div>
  );
}

export function FilterPad({ filters, onChange, onClear }: FilterPadProps) {
  const hasFilters = Object.values(filters).some(Boolean);

  // Clicking the chip that is already on switches it off, so every row can go back to "any".
  const toggle = <K extends keyof PuppyFilters>(key: K, value: string): FilterPatch => ({
    [key]: filters[key] === value ? null : value,
  });

  return (
    <div role="group" aria-label="Filter puppies" className="sketchpad flex flex-col gap-4">
      <FilterRow label="where">
        <StickerChip
          label="Everywhere"
          pressed={!filters.origin && !filters.collection}
          onClick={() => onChange?.({ origin: null, collection: null })}
        />
        {whereFilterOptions.map((option) => {
          const active = filters[option.param] === option.value;
          // Picking one "where" clears the other, so only one of the two is ever in the URL.
          const other = option.param === "origin" ? "collection" : "origin";
          return (
            <StickerChip
              key={option.value}
              label={option.label}
              pressed={active}
              onClick={() => onChange?.({ [option.param]: active ? null : option.value, [other]: null })}
            />
          );
        })}
      </FilterRow>

      <FilterRow label="breed">
        {breedFilterOptions.map((option) => (
          <StickerChip
            key={option.slug}
            label={option.label}
            pressed={filters.breed === option.slug}
            onClick={() => onChange?.(toggle("breed", option.slug))}
          />
        ))}
      </FilterRow>

      <FilterRow label="boy or girl">
        {genderFilterOptions.map((option) => (
          <StickerChip
            key={option.value}
            label={option.label}
            pressed={filters.gender === option.value}
            onClick={() => onChange?.(toggle("gender", option.value))}
          />
        ))}
        {hasFilters && (
          <button type="button" className="link-ink font-scrawl ml-auto" onClick={onClear}>
            Clear filters
          </button>
        )}
      </FilterRow>
    </div>
  );
}
