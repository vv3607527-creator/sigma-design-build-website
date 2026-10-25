"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  materialRows,
  materials,
  systems,
  type SystemId,
} from "@/lib/film";
import { whatsappLink } from "@/lib/site";
import { useSmoothScroll } from "@/components/SmoothScroll";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

type ProductSpecDrawerProps = {
  open: boolean;
  initialSystem?: SystemId;
  onClose: () => void;
  onQuote: (system?: SystemId) => void;
};

export default function ProductSpecDrawer({
  open,
  initialSystem,
  onClose,
  onQuote,
}: ProductSpecDrawerProps) {
  const [systemId, setSystemId] = useState<SystemId>("sliding");
  const [tab, setTab] = useState<"system" | "materials">("system");
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { stop, start } = useSmoothScroll();

  useEffect(() => {
    if (!open) return;
    setSystemId(initialSystem ?? "sliding");
    setTab("system");
  }, [open, initialSystem]);

  useEffect(() => {
    if (!open) return;
    stop();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    }, 120);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timer);
      start();
    };
  }, [open, onClose, start, stop]);

  const system = systems.find((item) => item.id === systemId) ?? systems[0];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${system.name} specification`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[580px] flex-col border-l border-offwhite/12 bg-obsidian"
          >
            <div className="relative h-52 shrink-0 overflow-hidden sm:h-60">
              <Image
                src={system.image}
                alt={system.name}
                fill
                sizes="(min-width: 640px) 580px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-obsidian/20" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close specification"
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center border border-offwhite/20 bg-obsidian/50 text-offwhite/75 backdrop-blur transition-colors hover:border-champagne/60 hover:text-gold-light"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute inset-x-5 bottom-4 sm:inset-x-7">
                <span className="text-[9px] uppercase tracking-[0.3em] text-champagne">
                  {system.category} · {system.index}
                </span>
                <h2 className="mt-2 font-display text-[1.9rem] leading-tight text-offwhite sm:text-[2.2rem]">
                  {system.name}
                </h2>
              </div>
            </div>

            <div role="tablist" aria-label="Specification views" className="flex shrink-0 gap-6 border-b border-offwhite/10 px-5 sm:px-7">
              {(["system", "materials"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  onClick={() => setTab(item)}
                  aria-selected={tab === item}
                  className={`relative py-4 text-[10px] uppercase tracking-[0.24em] transition-colors ${
                    tab === item ? "text-gold-light" : "text-offwhite/40 hover:text-offwhite/70"
                  }`}
                >
                  {item === "system" ? "The system" : "Materials"}
                  <span
                    className={`absolute inset-x-0 bottom-0 h-px origin-left bg-champagne transition-transform duration-400 ${
                      tab === item ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7">
              {tab === "system" ? (
                <div className="space-y-7">
                  <p className="text-sm leading-relaxed text-offwhite/65">{system.detail}</p>

                  <div className="grid grid-cols-2 gap-px overflow-hidden border border-offwhite/10 bg-offwhite/10">
                    {system.specs.map((spec) => (
                      <div key={spec.label} className="bg-obsidian p-4">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-offwhite/35">
                          {spec.label}
                        </p>
                        <p className="mt-1.5 font-display text-base text-offwhite/90">
                          {spec.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-champagne">
                      Included as standard
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {[
                        "Galvanised steel reinforcement in every profile",
                        "Dual EPDM compression gaskets",
                        "Multi-point locking with keyed or thumb-turn cylinder",
                        "Stainless steel hardware and rollers",
                        "Factory-glazed, sealed and labelled per elevation",
                      ].map((item) => (
                        <li key={item} className="flex gap-3 text-[12px] leading-relaxed text-offwhite/55">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-champagne" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border border-champagne/20 bg-champagne/[0.04] p-4 text-[11px] leading-relaxed text-offwhite/50">
                    Every unit is made to measure. Sizes, glazing build-up and finish are confirmed
                    after a site measurement.
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-sm leading-relaxed text-offwhite/65">
                    uPVC is specified for its thermal break, coastal resilience and near-zero
                    maintenance. The comparison below is indicative — the right system always depends
                    on the elevation, the orientation and the budget.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[460px] border-collapse text-left">
                      <thead>
                        <tr>
                          <th className="w-[34%] border-b border-offwhite/10 pb-3 text-[9px] uppercase tracking-[0.18em] text-offwhite/35">
                            Property
                          </th>
                          {materials.map((material) => (
                            <th
                              key={material.name}
                              className={`border-b border-offwhite/10 px-2 pb-3 text-[10px] uppercase tracking-[0.12em] ${
                                material.accent ? "text-gold-light" : "text-offwhite/50"
                              }`}
                            >
                              {material.name}
                              <span className="mt-1 block text-[8px] normal-case tracking-[0.08em] text-offwhite/30">
                                {material.headline}
                              </span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {materialRows.map((row, rowIndex) => (
                          <tr key={row} className="border-b border-offwhite/8 last:border-0">
                            <td className="py-3 pr-2 text-[10px] uppercase tracking-[0.12em] text-offwhite/40">
                              {row}
                            </td>
                            {materials.map((material) => (
                              <td
                                key={material.name}
                                className={`px-2 py-3 text-[11px] ${
                                  material.accent
                                    ? "bg-champagne/[0.05] text-offwhite/85"
                                    : "text-offwhite/45"
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

                  <p className="text-[10px] leading-relaxed tracking-[0.04em] text-offwhite/30">
                    Values are indicative ranges for comparable residential systems and vary with
                    profile, glazing specification and installation.
                  </p>
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-offwhite/10 bg-obsidian px-5 py-4 sm:px-7">
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => onQuote(systemId)}
                  className="btn btn-gold flex-1 !py-3.5"
                >
                  Request a quote
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline flex-1 !py-3.5"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
