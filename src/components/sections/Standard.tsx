"use client";

import { ArrowUpRight } from "lucide-react";
import { materialRows, materials, type SystemId } from "@/lib/film";
import { Reveal } from "@/components/ui/Reveal";

const anatomy = [
  { index: "01", title: "Profile", copy: "Five-chamber, lead-free uPVC with a thermal break." },
  { index: "02", title: "Core", copy: "Galvanised steel reinforcement at full height." },
  { index: "03", title: "Seal", copy: "Dual EPDM compression gaskets, corner-welded." },
  { index: "04", title: "Glass", copy: "Double or triple glazing, low-e and laminated options." },
  { index: "05", title: "Hardware", copy: "Stainless rollers and multi-point locking." },
];

export default function Standard({ onSpec }: { onSpec: (system?: SystemId) => void }) {
  return (
    <section
      id="standard"
      className="relative scroll-mt-24 overflow-hidden bg-carbon py-24 md:py-32"
    >
      <div className="masonry-line pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-champagne/[0.06] blur-[110px]" />
      <div className="shell relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <span className="eyebrow">04 — The standard</span>
              <h2 className="display mt-6 text-[clamp(2.6rem,5vw,4.6rem)]">
                Built for
                <br />
                the <em>coast.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-8 max-w-md text-sm leading-relaxed text-offwhite/60">
                Odisha is a hard climate for joinery: salt in the air, monsoon across every
                elevation, and a sun that bleaches anything unstable. Each Sigma system is specified
                against that reality — not a showroom.
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-offwhite/45">
                Multi-chamber uPVC, galvanised steel reinforcement, EPDM gaskets and stainless
                hardware. Nothing in the assembly is there to be replaced after two monsoons.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.2em] text-champagne/80">
                <span>Coastal grade</span>
                <span className="text-offwhite/20">/</span>
                <span>UV stabilised</span>
                <span className="text-offwhite/20">/</span>
                <span>25–30 year service life</span>
              </div>
              <button
                type="button"
                onClick={() => onSpec("casement")}
                className="btn btn-outline mt-8"
              >
                Full material comparison
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal distance={36}>
              <div className="overflow-x-auto border border-offwhite/10 bg-obsidian/40 backdrop-blur-sm">
                <table className="w-full min-w-[520px] border-collapse text-left">
                  <caption className="sr-only">
                    Material comparison: uPVC, aluminium and timber
                  </caption>
                  <thead>
                    <tr>
                      <th className="w-[30%] border-b border-offwhite/10 px-4 py-5 text-[9px] uppercase tracking-[0.2em] text-offwhite/30">
                        Property
                      </th>
                      {materials.map((material) => (
                        <th
                          key={material.name}
                          className={`border-b px-4 py-5 align-bottom ${
                            material.accent
                              ? "border-champagne/40 bg-champagne/[0.05]"
                              : "border-offwhite/10"
                          }`}
                        >
                          <span
                            className={`block font-display text-[1.05rem] normal-case tracking-normal ${
                              material.accent ? "text-gold-light" : "text-offwhite/60"
                            }`}
                          >
                            {material.name}
                          </span>
                          <span className="mt-1 block text-[8px] uppercase tracking-[0.16em] text-offwhite/30">
                            {material.headline}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {materialRows.map((row, rowIndex) => (
                      <tr key={row} className="border-b border-offwhite/8 last:border-0">
                        <td className="px-4 py-4 text-[9px] uppercase tracking-[0.16em] text-offwhite/35">
                          {row}
                        </td>
                        {materials.map((material) => (
                          <td
                            key={material.name}
                            className={`px-4 py-4 text-[11px] ${
                              material.accent
                                ? "bg-champagne/[0.04] text-offwhite/85"
                                : "text-offwhite/40"
                            }`}
                          >
                            {material.rows[rowIndex]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[9px] uppercase leading-relaxed tracking-[0.16em] text-offwhite/25">
                Indicative ranges for comparable residential systems. Final values are confirmed in
                the project specification.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-16">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-[0.26em] text-champagne">
                The anatomy
              </span>
              <span className="h-px flex-1 bg-offwhite/10" />
            </div>
          </Reveal>
          <div className="mt-6 grid gap-px border border-offwhite/10 bg-offwhite/10 sm:grid-cols-2 lg:grid-cols-5">
            {anatomy.map((item, index) => (
              <Reveal key={item.title} delay={0.05 * index} className="h-full">
                <div className="group h-full bg-carbon p-5 transition-colors duration-500 hover:bg-obsidian md:p-6">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-sm text-champagne/70">{item.index}</span>
                    <span className="h-px w-6 bg-offwhite/15 transition-colors duration-500 group-hover:bg-champagne/50" />
                  </div>
                  <p className="mt-5 font-display text-lg text-offwhite/90">{item.title}</p>
                  <p className="mt-2 text-[11px] leading-relaxed text-offwhite/40">{item.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
