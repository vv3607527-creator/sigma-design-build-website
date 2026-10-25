"use client";

import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import { systems, type SystemId } from "@/lib/film";
import { Reveal } from "@/components/ui/Reveal";

export default function Systems({ onSpec }: { onSpec: (system?: SystemId) => void }) {
  return (
    <section id="systems" className="relative scroll-mt-24 bg-ink py-24 md:py-32">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <span className="eyebrow">02 — Systems</span>
            <h2 className="display mt-6 text-[clamp(2.6rem,5.4vw,4.9rem)]">
              Openings,
              <br />
              <em>considered.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <p className="text-sm leading-relaxed text-offwhite/55">
              Four families, one engineering language. Each system is specified for its elevation —
              sightline, weather exposure, acoustics and the way you want the room to open.
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-champagne/80">
              Tap a system for the specification
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {systems.map((system, index) => {
            const wide = index === 0 || index === 3;
            return (
              <Reveal
                key={system.id}
                delay={0.04 * index}
                className={wide ? "lg:col-span-7" : "lg:col-span-5"}
              >
                <button
                  type="button"
                  onClick={() => onSpec(system.id)}
                  aria-label={`View ${system.name} specification`}
                  data-cursor="hover"
                  className="group relative block h-[380px] w-full overflow-hidden border border-offwhite/10 bg-carbon text-left transition-colors duration-500 hover:border-champagne/45 sm:h-[440px]"
                >
                  <Image
                    src={system.image}
                    alt={system.name}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.045]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/25 to-obsidian/35" />
                  <div className="absolute inset-0 bg-champagne/0 transition-colors duration-500 group-hover:bg-champagne/[0.05]" />

                  <div className="relative flex h-full flex-col justify-between p-5 sm:p-7">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-display text-xs text-champagne">{system.index}</span>
                        <span className="h-px w-6 bg-offwhite/30" />
                        <span className="text-[9px] uppercase tracking-[0.24em] text-offwhite/55">
                          {system.category}
                        </span>
                      </div>
                      <span className="grid h-10 w-10 place-items-center rounded-full border border-offwhite/20 bg-obsidian/20 text-offwhite/70 backdrop-blur-md transition-all duration-500 group-hover:border-champagne group-hover:bg-champagne group-hover:text-ink">
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-tight text-offwhite">
                        {system.name}
                      </h3>
                      <p className="mt-2 max-w-md text-[12px] leading-relaxed text-offwhite/55">
                        {system.summary}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {system.specs.slice(0, 2).map((spec) => (
                          <span
                            key={spec.label}
                            className="border border-offwhite/15 bg-obsidian/25 px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] text-offwhite/55 backdrop-blur-sm"
                          >
                            {spec.label} · {spec.value}
                          </span>
                        ))}
                        <span className="inline-flex items-center gap-1.5 px-2 py-1.5 text-[9px] uppercase tracking-[0.16em] text-champagne opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                          View spec
                          <ArrowUpRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.08}>
          <div className="mt-10 flex flex-col gap-5 border-t border-offwhite/10 pt-6 text-[10px] uppercase tracking-[0.2em] text-offwhite/40 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {["Site measured", "Factory glazed", "Made to measure"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-champagne" />
                  {item}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onSpec("sliding")}
              className="link-underline self-start text-champagne transition-colors hover:text-gold-light sm:self-auto"
            >
              Compare materials
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
