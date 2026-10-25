"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Ruler, X } from "lucide-react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { systems, type SystemId } from "@/lib/film";
import { buildWhatsappLink, site } from "@/lib/site";
import { useSmoothScroll } from "@/components/SmoothScroll";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

type QuickQuoteModalProps = {
  open: boolean;
  initialSystem?: SystemId;
  onClose: () => void;
};

const projectTypes = ["Villa", "Apartment", "Commercial"];
const WIDTH_RANGE = { min: 600, max: 4200, step: 50 };
const HEIGHT_RANGE = { min: 600, max: 3000, step: 50 };

function rangeStyle(value: number, min: number, max: number): CSSProperties {
  return {
    ["--range-progress" as string]: `${((value - min) / (max - min)) * 100}%`,
  };
}

export default function QuickQuoteModal({ open, initialSystem, onClose }: QuickQuoteModalProps) {
  const [project, setProject] = useState(projectTypes[0]);
  const [system, setSystem] = useState<SystemId>("sliding");
  const [width, setWidth] = useState(2400);
  const [height, setHeight] = useState(2100);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [sentLink, setSentLink] = useState("");
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const { stop, start } = useSmoothScroll();

  useEffect(() => {
    if (!open) return;
    setSystem(initialSystem ?? "sliding");
    setSent(false);
    setError("");
  }, [open, initialSystem]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    stop();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const focusTimer = window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>("input, button")?.focus();
    }, 120);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
      start();
      previous?.focus?.();
    };
  }, [open, onClose, start, stop]);

  const areaM2 = (width * height) / 1_000_000;
  const areaFt2 = areaM2 * 10.7639;
  const selectedSystem = systems.find((item) => item.id === system) ?? systems[0];

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const digits = phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
      if (name.trim().length < 2) {
        setError("Please add your name.");
        return;
      }
      if (!/^[6-9]\d{9}$/.test(digits)) {
        setError("Please add a valid 10-digit mobile number.");
        return;
      }
      setError("");

      const message = [
        "Project enquiry — Sigma Design & Build",
        "",
        `Project: ${project}`,
        `System: ${selectedSystem.name}`,
        `Opening: ${width} × ${height} mm (${areaM2.toFixed(2)} m² / ${areaFt2.toFixed(1)} sq ft)`,
        `Name: ${name.trim()}`,
        `Mobile: +91 ${digits}`,
        city.trim() ? `Location: ${city.trim()}` : "",
        "",
        "Please share the catalogue, a detailed quote and the next available installation window.",
      ]
        .filter(Boolean)
        .join("\n");

      const link = buildWhatsappLink(message);
      setSentLink(link);
      window.open(link, "_blank", "noopener,noreferrer");
      setSent(true);

      void import("canvas-confetti")
        .then(({ default: confetti }) => {
          confetti({
            particleCount: 90,
            spread: 68,
            startVelocity: 34,
            gravity: 0.9,
            scalar: 0.8,
            origin: { y: 0.72 },
            colors: ["#C9A45B", "#E7C97A", "#F2F0EB", "#8C7A50"],
          });
        })
        .catch(() => undefined);
    },
    [areaFt2, areaM2, city, height, name, phone, project, selectedSystem.name, width],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto p-3 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            aria-hidden="true"
            className="fixed inset-0 bg-obsidian/85 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Request a quote"
            initial={{ opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.99 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 my-auto grid w-full max-w-[1060px] overflow-hidden border border-offwhite/12 bg-carbon shadow-[0_40px_120px_rgba(0,0,0,0.65)] md:grid-cols-[0.86fr_1.14fr]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close quote form"
              className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center bg-obsidian/50 text-offwhite/70 backdrop-blur transition-colors hover:bg-obsidian hover:text-gold-light"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative hidden min-h-full flex-col justify-between overflow-hidden p-8 md:flex lg:p-10">
              <Image
                src="/media/film/03-threshold-poster.jpg"
                alt="A Sigma sliding door opening to an interior"
                fill
                sizes="(min-width: 768px) 420px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/25 to-obsidian/92" />
              <div className="relative">
                <Image
                  src="/brand/logo-mark.png"
                  alt=""
                  width={402}
                  height={318}
                  className="h-14 w-auto"
                />
                <p className="mt-6 font-display text-[2rem] leading-[1.05] text-offwhite">
                  Every opening is drawn
                  <br />
                  before it is <em className="italic text-champagne">fabricated.</em>
                </p>
              </div>
              <div className="relative mt-10 space-y-4">
                <div className="h-px w-full bg-offwhite/15" />
                <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.24em] text-offwhite/50">
                  <span>Made to measure</span>
                  <span>Odisha</span>
                </div>
                <p className="text-[11px] leading-relaxed text-offwhite/45">
                  Share the opening size and project type. Your enquiry opens in WhatsApp, already
                  formatted with the specification.
                </p>
              </div>
            </div>

            <div className="relative max-h-[92svh] overflow-y-auto bg-carbon px-5 py-8 sm:px-8 md:max-h-none md:px-10">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex min-h-[420px] flex-col justify-center py-10"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-full border border-champagne/50 bg-champagne/10 text-gold-light">
                      <Check className="h-5 w-5" />
                    </div>
                    <h3 className="display mt-6 text-4xl">Enquiry ready.</h3>
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-offwhite/60">
                      Your specification has been formatted for WhatsApp. If the chat did not open,
                      use the button below — we reply Monday to Saturday, 9:30 am – 7:00 pm.
                    </p>
                    <a
                      href={sentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-gold mt-8 self-start"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                      Open WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-4 self-start text-[10px] uppercase tracking-[0.24em] text-offwhite/40 transition-colors hover:text-gold-light"
                    >
                      Back to the site
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-7"
                  >
                    <div>
                      <span className="eyebrow">Project enquiry</span>
                      <h3 className="display mt-4 text-[clamp(1.8rem,3vw,2.6rem)]">
                        Tell us about the opening.
                      </h3>
                    </div>

                    <fieldset>
                      <legend className="mb-2.5 text-[10px] uppercase tracking-[0.24em] text-offwhite/45">
                        Project type
                      </legend>
                      <div className="grid grid-cols-3 gap-2">
                        {projectTypes.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setProject(type)}
                            aria-pressed={project === type}
                            className={`border px-2 py-2.5 text-[10px] uppercase tracking-[0.16em] transition-colors ${
                              project === type
                                ? "border-champagne bg-champagne/10 text-gold-light"
                                : "border-offwhite/12 text-offwhite/50 hover:border-offwhite/30"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend className="mb-2.5 text-[10px] uppercase tracking-[0.24em] text-offwhite/45">
                        System
                      </legend>
                      <div className="grid grid-cols-2 gap-2">
                        {systems.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSystem(item.id)}
                            aria-pressed={system === item.id}
                            className={`flex items-center gap-2 border px-3 py-2.5 text-left text-[10px] uppercase tracking-[0.12em] transition-colors ${
                              system === item.id
                                ? "border-champagne bg-champagne/10 text-gold-light"
                                : "border-offwhite/12 text-offwhite/50 hover:border-offwhite/30"
                            }`}
                          >
                            <span className="font-display text-[9px] opacity-50">{item.index}</span>
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend className="sr-only">Approx. opening size</legend>
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-[0.24em] text-offwhite/45">
                          Approx. opening size
                        </span>
                        <span className="flex items-center gap-2 font-display text-sm text-offwhite/80">
                          <Ruler className="h-3.5 w-3.5 text-champagne" />
                          {width} × {height} mm
                        </span>
                      </div>
                      <div className="space-y-4">
                        <label className="block">
                          <span className="mb-2 flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-offwhite/35">
                            <span>Width</span>
                            <span className="tabular-nums text-offwhite/60">{width} mm</span>
                          </span>
                          <input
                            type="range"
                            min={WIDTH_RANGE.min}
                            max={WIDTH_RANGE.max}
                            step={WIDTH_RANGE.step}
                            value={width}
                            onChange={(event) => setWidth(Number(event.target.value))}
                            aria-label="Opening width in millimetres"
                            style={rangeStyle(width, WIDTH_RANGE.min, WIDTH_RANGE.max)}
                          />
                        </label>
                        <label className="block">
                          <span className="mb-2 flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-offwhite/35">
                            <span>Height</span>
                            <span className="tabular-nums text-offwhite/60">{height} mm</span>
                          </span>
                          <input
                            type="range"
                            min={HEIGHT_RANGE.min}
                            max={HEIGHT_RANGE.max}
                            step={HEIGHT_RANGE.step}
                            value={height}
                            onChange={(event) => setHeight(Number(event.target.value))}
                            aria-label="Opening height in millimetres"
                            style={rangeStyle(height, HEIGHT_RANGE.min, HEIGHT_RANGE.max)}
                          />
                        </label>
                      </div>
                      <div className="mt-4 flex items-center justify-between border border-offwhite/10 bg-ink/50 px-4 py-3">
                        <span className="text-[9px] uppercase tracking-[0.22em] text-offwhite/35">
                          Glazed area
                        </span>
                        <span className="font-display text-lg text-champagne">
                          {areaM2.toFixed(2)} m²
                          <span className="ml-2 text-[10px] tracking-[0.12em] text-offwhite/35">
                            {areaFt2.toFixed(0)} sq ft
                          </span>
                        </span>
                      </div>
                    </fieldset>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1 block text-[10px] uppercase tracking-[0.22em] text-offwhite/40">
                          Name
                        </span>
                        <input
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          placeholder="Your name"
                          autoComplete="name"
                          className="w-full border-b border-offwhite/15 bg-transparent py-2.5 text-sm text-offwhite placeholder:text-offwhite/20 focus:border-champagne focus:outline-none"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-[10px] uppercase tracking-[0.22em] text-offwhite/40">
                          Mobile
                        </span>
                        <input
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          placeholder="10-digit number"
                          inputMode="tel"
                          autoComplete="tel"
                          className="w-full border-b border-offwhite/15 bg-transparent py-2.5 text-sm text-offwhite placeholder:text-offwhite/20 focus:border-champagne focus:outline-none"
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className="mb-1 block text-[10px] uppercase tracking-[0.22em] text-offwhite/40">
                        Location <span className="text-offwhite/20">(optional)</span>
                      </span>
                      <input
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        placeholder="City or project site"
                        autoComplete="address-level2"
                        className="w-full border-b border-offwhite/15 bg-transparent py-2.5 text-sm text-offwhite placeholder:text-offwhite/20 focus:border-champagne focus:outline-none"
                      />
                    </label>

                    {error && (
                      <p role="alert" className="text-[11px] tracking-[0.06em] text-[#e0a37a]">
                        {error}
                      </p>
                    )}

                    <button type="submit" className="btn btn-gold w-full">
                      <WhatsAppIcon className="h-4 w-4" />
                      Send direct to WhatsApp
                      <ArrowUpRight className="h-4 w-4" />
                    </button>

                    <p className="text-[10px] leading-relaxed tracking-[0.04em] text-offwhite/30">
                      No forms sitting in an inbox. Your enquiry opens a WhatsApp chat with our
                      team at {site.contact.whatsappDisplay}, pre-filled with the details above.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
