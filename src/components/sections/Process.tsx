import { Reveal } from "@/components/ui/Reveal";

const steps = [
  {
    index: "01",
    title: "Consult",
    meta: "Enquiry",
    copy: "Share a drawing, a photograph or a dimension. We advise on system, glazing, exposure and budget — before anything is priced.",
  },
  {
    index: "02",
    title: "Measure",
    meta: "Site visit",
    copy: "Every opening, reveal and level is measured on site. The elevation is then drawn and signed off with you.",
  },
  {
    index: "03",
    title: "Fabricate",
    meta: "In-house",
    copy: "Profiles are cut, seam-welded, reinforced and glazed in our Odisha facility, labelled to the elevation they belong to.",
  },
  {
    index: "04",
    title: "Install",
    meta: "Handover",
    copy: "Our team sets, seals and adjusts each unit, then leaves you with care guidance and a direct line for aftercare.",
  },
];

export default function Process() {
  return (
    <section id="process" className="relative scroll-mt-24 bg-ink py-24 md:py-32">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <span className="eyebrow">05 — Process</span>
            <h2 className="display mt-6 text-[clamp(2.6rem,5vw,4.6rem)]">
              From drawing
              <br />
              to <em>threshold.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <p className="text-sm leading-relaxed text-offwhite/55">
              One team carries the opening from the first conversation to the final seal. No
              handoffs, no vague dates, no second-guessing the drawing.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-px border-y border-offwhite/10 bg-offwhite/10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.index} delay={0.06 * index} className="h-full">
              <div className="group relative flex h-full flex-col bg-ink p-6 transition-colors duration-500 hover:bg-carbon md:p-7">
                <span className="absolute left-0 top-0 h-px w-0 bg-champagne transition-all duration-700 group-hover:w-full" />
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl text-champagne/80">{step.index}</span>
                  <span className="text-[9px] uppercase tracking-[0.22em] text-offwhite/30">
                    {step.meta}
                  </span>
                </div>
                <h3 className="mt-10 font-display text-[1.6rem] text-offwhite">{step.title}</h3>
                <p className="mt-3 text-[12px] leading-relaxed text-offwhite/45">{step.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 text-[10px] uppercase tracking-[0.22em] text-offwhite/30">
            Site measurement across Odisha · Factory visits by appointment
          </p>
        </Reveal>
      </div>
    </section>
  );
}
