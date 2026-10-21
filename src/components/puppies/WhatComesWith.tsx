// The "what comes with" card: the promises that come with every puppy, on a slightly crooked paper sheet.

import { CheckIcon } from "@/components/decor/icons";
import { ChapterLabel } from "@/components/puppies/ChapterLabel";

const PROMISES = [
  "Vaccinated",
  "Dewormed",
  "Verified health certificate from licensed vets",
  "Thoroughly checked before joining your family",
];

type WhatComesWithProps = {
  chapter: number;
  puppyName: string;
};

export function WhatComesWith({ chapter, puppyName }: WhatComesWithProps) {
  return (
    <div className="paper mt-8 -rotate-1">
      <ChapterLabel number={chapter}>what comes with {puppyName}</ChapterLabel>
      <h2 className="font-plush mt-1 text-[1.9rem]">Every Teddy Pup comes</h2>
      <ul className="mt-4 space-y-2.5">
        {PROMISES.map((promise) => (
          <li key={promise} className="flex items-start gap-3 font-semibold">
            <CheckIcon className="mt-0.5 size-6 shrink-0 text-toffee-deep" />
            {promise}
          </li>
        ))}
      </ul>
    </div>
  );
}
