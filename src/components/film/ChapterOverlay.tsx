"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, MapPin, Plus, Ruler, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { SystemId } from "@/lib/film";
import { site } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

type ChapterOverlayProps = {
  index: number;
  onQuote: (system?: SystemId) => void;
  onSpec: (system?: SystemId) => void;
  onExplore: () => void;
  onWhatsapp: () => void;
};

const ease = [0.22, 1, 0.36, 1] as const;

function Fade({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Metric({
  value,
  label,
  align = "right",
}: {
  value: string;
  label: string;
  align?: "left" | "right";
}) {
  return (
    <div className={`flex flex-col gap-1 ${align === "right" ? "items-end text-right" : ""}`}>
      <span className="font-display text-[clamp(1.9rem,3vw,2.9rem)] leading-none text-offwhite">
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-[0.26em] text-offwhite/55">{label}</span>
    </div>
  );
}

function ChapterOne({ onExplore }: { onExplore: () => void }) {
  return (
    <div className="flex h-full items-end pb-[9vh]">
      <div className="shell">
        <Fade>
          <span className="eyebrow">Sigma Design &amp; Build — Odisha</span>
        </Fade>
        <Fade delay={0.1}>
          <h2 className="display mt-6 text-[clamp(3.2rem,8.4vw,7.6rem)]">
            Precision,
            <br />
            <em>elevated.</em>
          </h2>
        </Fade>
        <Fade delay={0.22}>
          <p className="mt-7 max-w-xl text-[0.98rem] leading-relaxed text-offwhite/70">
            Architectural uPVC door and window systems, engineered for coastal climates and made to
            hold a view for a lifetime.
          </p>
        </Fade>
        <Fade delay={0.32}>
          <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
            <button
              type="button"
              onClick={onExplore}
              className="btn btn-outline pointer-events-auto group"
            >
              Explore the systems
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
            <div className="flex items-center gap-4">
              <span className="relative block h-12 w-px overflow-hidden bg-offwhite/15">
                <span className="absolute inset-0 block bg-champagne animate-scroll-line" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-offwhite/55">
                Scroll to explore
              </span>
            </div>
          </div>
        </Fade>
      </div>
    </div>
  );
}

function ChapterTwo() {
  const items = [
    ["5-chamber profile", "Steel-reinforced, thermally broken"],
    ["Concealed locking", "Multi-point security, no visible gear"],
    ["Flush threshold", "A 3 mm line underfoot"],
    ["Triple glazing", "Acoustic and solar control"],
  ];
  return (
    <div className="flex h-full items-end pb-[8vh]">
      <div className="shell grid w-full grid-cols-12 items-end gap-8">
        <div className="col-span-12 lg:col-span-7">
          <Fade>
            <span className="eyebrow">02 — The Approach</span>
          </Fade>
          <Fade delay={0.1}>
            <h2 className="display mt-5 text-[clamp(2.7rem,6vw,5.4rem)]">
              Arrival begins
              <br />
              at the <em>frame.</em>
            </h2>
          </Fade>
          <Fade delay={0.2}>
            <p className="mt-6 max-w-lg text-[0.95rem] leading-relaxed text-offwhite/68">
              Drawn as one elevation, fabricated as one system. Profiles, hardware and glazing arrive
              together — and meet at tolerances measured in millimetres.
            </p>
          </Fade>
        </div>
        <div className="col-span-12 lg:col-span-4 lg:col-start-9">
          <Fade delay={0.28}>
            <div className="glass pointer-events-auto p-6 sm:p-7">
              <div className="flex items-baseline justify-between border-b border-offwhite/10 pb-4">
                <span className="text-[10px] uppercase tracking-[0.28em] text-champagne">
                  The Sigma elevation
                </span>
                <span className="font-display text-lg text-offwhite/45">S/01</span>
              </div>
              <ul className="mt-2 divide-y divide-offwhite/8">
                {items.map(([title, copy], i) => (
                  <li key={title} className="flex gap-4 py-3.5">
                    <span className="mt-1 font-display text-xs text-champagne/70">0{i + 1}</span>
                    <div>
                      <p className="text-[0.82rem] text-offwhite/90">{title}</p>
                      <p className="mt-0.5 text-[0.72rem] leading-relaxed text-offwhite/45">{copy}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Fade>
        </div>
      </div>
    </div>
  );
}

function ChapterThree({
  onSpec,
  onQuote,
}: {
  onSpec: (system?: SystemId) => void;
  onQuote: (system?: SystemId) => void;
}) {
  return (
    <div className="relative flex h-full items-end pb-[8vh]">
      <div className="shell w-full">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <Fade>
              <span className="eyebrow">03 — The Threshold</span>
            </Fade>
            <Fade delay={0.1}>
              <h2 className="display mt-5 text-[clamp(2.7rem,6vw,5.4rem)]">
                Thresholds,
                <br /> made <em>effortless.</em>
              </h2>
            </Fade>
            <Fade delay={0.2}>
              <p className="mt-6 max-w-lg text-[0.95rem] leading-relaxed text-offwhite/68">
                Twin, triple and four-track sliders travel on sealed stainless carriages with a flush
                floor line. The wall opens. The view stays.
              </p>
            </Fade>
            <Fade delay={0.3}>
              <div className="pointer-events-auto mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={() => onQuote("sliding")} className="btn btn-gold">
                  Enquire about sliders
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onSpec("sliding")}
                  className="btn btn-outline"
                >
                  <Ruler className="h-4 w-4" />
                  Specification
                </button>
              </div>
            </Fade>
          </div>

          <Fade delay={0.32}>
            <div className="grid grid-cols-3 gap-6 border-t border-offwhite/15 pt-6 lg:gap-10 lg:border-t-0 lg:pt-0">
              <Metric value="2.4 m" label="Panel height" align="left" />
              <Metric value="45 dB" label="Acoustic" align="left" />
              <Metric value="3 mm" label="Flush track" align="left" />
            </div>
          </Fade>
        </div>
      </div>
    </div>
  );
}

const hotspots = [
  {
    x: 63,
    y: 34,
    title: "Triple-glazed glass",
    copy: "Up to 45 dB of sound reduction, with low-e coatings tuned to the elevation.",
  },
  {
    x: 72,
    y: 56,
    title: "Multi-chamber profile",
    copy: "Insulated chambers that reduce heat transfer — up to 35% less cooling load.",
  },
  {
    x: 56,
    y: 68,
    title: "UV-stabilised surface",
    copy: "Titanium dioxide formulation built for the Indian sun. No fading, no chalking.",
  },
];

function Hotspot({ spot, index }: { spot: (typeof hotspots)[number]; index: number }) {
  const [open, setOpen] = useState(false);
  const alignLeft = spot.x > 70;
  return (
    <div
      className="pointer-events-auto absolute hidden -translate-x-1/2 -translate-y-1/2 md:block"
      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={spot.title}
        className="hotspot-ring relative grid h-10 w-10 place-items-center rounded-full border border-gold-light/60 bg-black/35 text-gold-light backdrop-blur-md transition-colors hover:bg-champagne hover:text-ink"
      >
        {open ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-champagne text-[8px] font-medium text-ink">
          {index + 1}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease }}
            className={`glass absolute top-1/2 z-10 w-64 -translate-y-1/2 p-4 text-left ${
              alignLeft ? "right-full mr-4" : "left-full ml-4"
            }`}
          >
            <p className="text-[10px] uppercase tracking-[0.22em] text-champagne">{spot.title}</p>
            <p className="mt-2 text-[0.76rem] leading-relaxed text-offwhite/75">{spot.copy}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChapterFour() {
  return (
    <div className="relative flex h-full items-end pb-[8vh]">
      <div className="shell w-full">
        <div className="grid grid-cols-12 items-end gap-8">
          <div className="col-span-12 lg:col-span-7">
            <Fade>
              <span className="eyebrow">04 — The Interior</span>
            </Fade>
            <Fade delay={0.1}>
              <h2 className="display mt-5 text-[clamp(2.7rem,6vw,5.4rem)]">
                Quiet by
                <br />
                <em>construction.</em>
              </h2>
            </Fade>
            <Fade delay={0.2}>
              <div className="glass mt-8 max-w-md p-6">
                <span className="text-[10px] uppercase tracking-[0.26em] text-champagne">
                  Thermal &amp; acoustic shielding
                </span>
                <dl className="mt-4 space-y-3">
                  {[
                    ["Up to 45 dB", "Sound reduction with triple glazing"],
                    ["Up to 35%", "Cooling load offset by insulated chambers"],
                    ["Zero fade", "UV-stabilised profile under tropical sun"],
                  ].map(([value, label]) => (
                    <div key={value} className="flex gap-4 border-t border-offwhite/10 pt-3">
                      <dt className="w-24 shrink-0 font-display text-lg text-offwhite">{value}</dt>
                      <dd className="text-[0.76rem] leading-relaxed text-offwhite/55">{label}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-offwhite/35 md:hidden">
                  Tap the view for detail
                </p>
              </div>
            </Fade>
          </div>
          <div className="col-span-12 hidden lg:col-span-5 lg:block" />
        </div>
      </div>
      {hotspots.map((spot, i) => (
        <Hotspot key={spot.title} spot={spot} index={i} />
      ))}
    </div>
  );
}

function ChapterFive({ onSpec }: { onSpec: (system?: SystemId) => void }) {
  return (
    <div className="flex h-full items-end pb-[8vh]">
      <div className="shell grid w-full grid-cols-12 items-end gap-8">
        <div className="col-span-12 lg:col-span-7">
          <Fade>
            <span className="eyebrow">05 — The Craft</span>
          </Fade>
          <Fade delay={0.1}>
            <h2 className="display mt-5 text-[clamp(2.7rem,6vw,5.4rem)]">
              Engineered
              <br />
              under <em>one roof.</em>
            </h2>
          </Fade>
          <Fade delay={0.2}>
            <p className="mt-6 max-w-lg text-[0.95rem] leading-relaxed text-offwhite/68">
              Profiles are cut, welded and glazed in our own facility — so the tolerance you specify
              is the tolerance that arrives on site.
            </p>
          </Fade>
        </div>
        <div className="col-span-12 lg:col-span-4 lg:col-start-9">
          <Fade delay={0.28}>
            <div className="glass p-6 sm:p-7">
              <div className="flex items-baseline justify-between border-b border-offwhite/10 pb-4">
                <span className="text-[10px] uppercase tracking-[0.26em] text-champagne">
                  Precision at scale
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-offwhite/35">
                  S/02
                </span>
              </div>
              <ul className="mt-4 space-y-4">
                {[
                  ["CNC 4-point welding", "Seam-fused corners, never screwed."],
                  ["Galvanised steel core", "Rigidity at full panel height."],
                  ["100% calibration", "Every unit checked before dispatch."],
                ].map(([title, copy]) => (
                  <li key={title} className="border-t border-offwhite/8 pt-4 first:border-0 first:pt-0">
                    <p className="text-[0.82rem] text-offwhite/90">{title}</p>
                    <p className="mt-1 text-[0.72rem] leading-relaxed text-offwhite/45">{copy}</p>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => onSpec("casement")}
                className="pointer-events-auto mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-champagne transition-colors hover:text-gold-light"
              >
                Compare materials
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </Fade>
        </div>
      </div>
    </div>
  );
}

function ChapterSix({
  onQuote,
  onWhatsapp,
}: {
  onQuote: (system?: SystemId) => void;
  onWhatsapp: () => void;
}) {
  return (
    <div className="flex h-full items-center pb-6 pt-24">
      <div className="shell">
        <div className="mx-auto max-w-3xl text-center">
          <Fade>
            <span className="eyebrow eyebrow--plain justify-center">The invitation</span>
          </Fade>
          <Fade delay={0.1}>
            <h2 className="display mt-5 text-[clamp(2.5rem,5.8vw,5.2rem)]">
              Transform your
              <br />
              architectural <em>vision.</em>
            </h2>
          </Fade>
          <Fade delay={0.2}>
            <p className="mx-auto mt-5 max-w-lg text-[0.95rem] leading-relaxed text-offwhite/65">
              Bring us a drawing, a dimension or a photograph. We will return a specification, a
              price and a date.
            </p>
          </Fade>
          <Fade delay={0.28}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onWhatsapp}
                className="btn btn-gold pointer-events-auto w-full sm:w-auto"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Chat on WhatsApp
              </button>
              <button
                type="button"
                onClick={() => onQuote()}
                className="btn btn-outline pointer-events-auto w-full sm:w-auto"
              >
                Request a quote
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </Fade>
          <Fade delay={0.36}>
            <div className="glass mx-auto mt-8 inline-flex max-w-full items-center gap-3 px-5 py-3 text-left">
              <MapPin className="h-4 w-4 shrink-0 text-champagne" />
              <span className="text-[0.7rem] uppercase tracking-[0.16em] text-offwhite/60">
                Factory &amp; experience centre — {site.contact.address}
              </span>
            </div>
          </Fade>
          <Fade delay={0.44}>
            <p className="mt-5 text-[10px] uppercase tracking-[0.26em] text-offwhite/30">
              Factory visits by appointment · {site.contact.hours}
            </p>
          </Fade>
        </div>
      </div>
    </div>
  );
}

export default function ChapterOverlay({
  index,
  onQuote,
  onSpec,
  onExplore,
  onWhatsapp,
}: ChapterOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease }}
          className="absolute inset-0"
        >
          {index === 0 && <ChapterOne onExplore={onExplore} />}
          {index === 1 && <ChapterTwo />}
          {index === 2 && <ChapterThree onSpec={onSpec} onQuote={onQuote} />}
          {index === 3 && <ChapterFour />}
          {index === 4 && <ChapterFive onSpec={onSpec} />}
          {index === 5 && <ChapterSix onQuote={onQuote} onWhatsapp={onWhatsapp} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
