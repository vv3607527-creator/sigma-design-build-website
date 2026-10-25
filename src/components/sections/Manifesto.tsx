import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const stats = [
  { value: "45 dB", label: "Acoustic reduction", note: "Triple glazing" },
  { value: "35%", label: "Cooling load offset", note: "Multi-chamber" },
  { value: "05", label: "Chamber profile", note: "Steel reinforced" },
  { value: "100%", label: "In-house fabrication", note: "One roof" },
];

export default function Manifesto() {
  return (
    <section id="about" className="relative scroll-mt-24 overflow-hidden bg-ink py-24 md:py-32">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <span className="eyebrow">01 — The studio</span>
              <h2 className="display mt-6 text-[clamp(2.6rem,5.2vw,4.7rem)]">
                The line between
                <br />
                inside and <em>out.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-8 max-w-sm text-sm leading-relaxed text-offwhite/55">
                Sigma Design &amp; Build is a design-led fabricator of architectural uPVC openings.
                We work with architects, builders and homeowners who care how a threshold feels
                underfoot and how a room sounds when it closes.
              </p>
              <a href="#systems" className="btn btn-outline mt-8 inline-flex">
                Explore the systems
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="text-[1.3rem] leading-relaxed text-offwhite/85 md:text-[1.5rem] md:leading-relaxed">
                We do not sell windows from a catalogue. Every elevation is drawn, profiled and
                fabricated for the opening it will occupy.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-6 text-sm leading-relaxed text-offwhite/55">
                The result is a quieter room, a lower cooling load, and a frame that holds its line
                through monsoon, salt air and sun. Engineered in Odisha, for the way Odisha builds.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-px border border-offwhite/10 bg-offwhite/10">
              {stats.map((stat, index) => (
                <Reveal key={stat.label} delay={0.06 * index}>
                  <div className="h-full bg-ink p-5 md:p-6">
                    <p className="font-display text-[clamp(1.8rem,2.6vw,2.4rem)] leading-none text-offwhite">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-champagne/80">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-[10px] tracking-[0.08em] text-offwhite/30">{stat.note}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <p className="mt-3 text-[9px] uppercase tracking-[0.16em] text-offwhite/25">
                Indicative system performance · varies with glazing and installation
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="shell mt-16 md:mt-20">
        <Reveal distance={40}>
          <figure className="group relative aspect-[16/9] overflow-hidden border border-offwhite/10 md:aspect-[21/9]">
            <Image
              src="/media/film/04-interior-still.jpg"
              alt="Interior study with panoramic glazing and a corner window"
              fill
              sizes="(min-width: 1480px) 1400px, 92vw"
              className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.025]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-obsidian/20" />
            <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-2 px-5 py-5 sm:flex-row sm:items-end sm:justify-between md:px-8 md:py-7">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-champagne">
                  Interior study · 01
                </p>
                <p className="mt-2 font-display text-xl text-offwhite md:text-2xl">
                  Panoramic casement &amp; tilt-turn
                </p>
              </div>
              <p className="max-w-xs text-[10px] uppercase leading-relaxed tracking-[0.18em] text-offwhite/40">
                Flush thresholds · concealed hardware · triple glazing
              </p>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
