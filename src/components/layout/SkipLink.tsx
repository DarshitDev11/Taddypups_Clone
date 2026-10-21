// "Skip to content" link: invisible until a keyboard user tabs to it, then jumps past the header to <main>.

export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only-focusable fixed top-4 left-4 z-[100] rounded-full bg-cocoa px-5 py-3 font-semibold text-milk"
    >
      Skip to content
    </a>
  );
}
