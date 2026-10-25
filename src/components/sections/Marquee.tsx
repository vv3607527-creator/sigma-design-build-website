const items = [
  "Multi-track sliding",
  "Casement windows",
  "Tilt & turn",
  "Fixed glazing",
  "Made to measure",
];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-offwhite/10 bg-obsidian py-5 md:py-6">
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap md:gap-16">
        {row.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center gap-10 md:gap-16">
            <span
              className={`font-display text-[1.35rem] uppercase tracking-[0.04em] md:text-[1.7rem] ${
                index % 2 === 0 ? "text-offwhite/85" : "text-outline"
              }`}
            >
              {item}
            </span>
            <span className="h-1 w-1 rounded-full bg-champagne/70" />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-obsidian to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-obsidian to-transparent" />
      <span className="sr-only">Sigma systems: {items.join(", ")}</span>
    </div>
  );
}
