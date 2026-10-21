"use client";

// The result count plus the sketch grid (or the empty state) for the puppies that match the filters.

import { NoPuppiesCard } from "@/components/puppies/NoPuppiesCard";
import { SketchCard } from "@/components/puppies/SketchCard";
import type { Puppy } from "@/types/puppy";

type PuppyResultsProps = {
  puppies: Puppy[];
  /** Total before filtering, used for the "looking for a home" wording. */
  total: number;
  isFiltered: boolean;
  onClear?: () => void;
};

function countText(count: number, total: number, isFiltered: boolean) {
  if (!isFiltered) return `${total} ${total === 1 ? "puppy" : "puppies"} looking for a home`;
  return `${count} ${count === 1 ? "puppy" : "puppies"} match`;
}

export function PuppyResults({ puppies, total, isFiltered, onClear }: PuppyResultsProps) {
  return (
    <>
      {/* aria-live so screen readers hear the count change when a chip is pressed. */}
      <p className="font-scrawl mt-10 text-lg" aria-live="polite">
        {countText(puppies.length, total, isFiltered)}
      </p>

      {puppies.length > 0 ? (
        <ul className="sketches mt-8">
          {puppies.map((puppy, index) => (
            <SketchCard key={puppy.slug} puppy={puppy} index={index} />
          ))}
        </ul>
      ) : (
        <div className="mt-8">
          <NoPuppiesCard onClear={onClear} />
        </div>
      )}
    </>
  );
}
