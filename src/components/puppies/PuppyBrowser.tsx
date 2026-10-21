"use client";

// Filter pad + results, with the chosen filters kept in the URL (?origin=&collection=&breed=&gender=).

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { FilterPad, type FilterPatch } from "@/components/puppies/FilterPad";
import { PuppyResults } from "@/components/puppies/PuppyResults";
import { breedFilterOptions } from "@/data/puppyFilters";
import { filterPuppies, type PuppyFilters } from "@/lib/puppies";
import type { Puppy } from "@/types/puppy";

type PuppyBrowserProps = {
  /** Every available puppy. The server renders them all; filtering happens here in the browser. */
  puppies: Puppy[];
};

const FILTER_KEYS = ["origin", "collection", "breed", "gender"] as const;

/** Reads the URL into filters, ignoring any value we don't offer (so ?breed=cat just means "no breed filter"). */
function readFilters(params: URLSearchParams): PuppyFilters {
  const origin = params.get("origin");
  const collection = params.get("collection");
  const breed = params.get("breed");
  const gender = params.get("gender");

  return {
    origin: origin === "imported" || origin === "local" ? origin : undefined,
    collection: collection === "korean-teacup" ? collection : undefined,
    breed: breedFilterOptions.find((option) => option.slug === breed)?.slug,
    gender: gender === "male" || gender === "female" ? gender : undefined,
  };
}

export function PuppyBrowser({ puppies }: PuppyBrowserProps) {
  // Read-only: updates arrive when we call history.replaceState below (Next.js syncs it).
  const searchParams = useSearchParams();
  const filters = useMemo(() => readFilters(new URLSearchParams(searchParams.toString())), [searchParams]);

  const results = useMemo(() => filterPuppies(puppies, filters), [puppies, filters]);
  const isFiltered = FILTER_KEYS.some((key) => filters[key]);

  /**
   * Writes the new filters to the URL. replaceState (not router.push) because a filter click is not a
   * page change: no server round trip, no scroll jump, and Back still leaves the page in one step.
   * A changed key is removed and re-added, so the URL lists filters in the order they were clicked.
   */
  function updateUrl(update: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    update(params);
    const query = params.toString();
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }

  function changeFilters(patch: FilterPatch) {
    updateUrl((params) => {
      for (const [key, value] of Object.entries(patch)) {
        params.delete(key);
        if (value) params.set(key, value);
      }
    });
  }

  function clearFilters() {
    updateUrl((params) => FILTER_KEYS.forEach((key) => params.delete(key)));
  }

  return (
    <>
      <FilterPad filters={filters} onChange={changeFilters} onClear={clearFilters} />
      <PuppyResults puppies={results} total={puppies.length} isFiltered={isFiltered} onClear={clearFilters} />
    </>
  );
}
