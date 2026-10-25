"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useSmoothScroll } from "@/components/SmoothScroll";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const barRef = useRef<HTMLSpanElement | null>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const { stop, start } = useSmoothScroll();

  useEffect(() => {
    stop();
    const duration = 1900;
    const started = performance.now();
    let raf = 0;
    let timer = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      if (counterRef.current) {
        counterRef.current.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${eased})`;
      }
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        start();
        timer = window.setTimeout(() => doneRef.current(), 320);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      start();
    };
  }, [start, stop]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col bg-obsidian text-offwhite"
      exit={{ y: "-100%" }}
      transition={{ duration: 1.05, ease: [0.76, 0, 0.24, 1] }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 46%, rgba(201,164,91,0.12) 0%, transparent 62%), radial-gradient(90% 80% at 50% 120%, rgba(201,164,91,0.08) 0%, transparent 60%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-offwhite/10 md:inset-x-10" />

      <div className="shell flex h-[84px] items-center justify-between">
        <span className="text-[9px] uppercase tracking-[0.36em] text-offwhite/40">
          Sigma Design &amp; Build
        </span>
        <span className="hidden text-[9px] uppercase tracking-[0.36em] text-offwhite/40 sm:block">
          Odisha · India
        </span>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <Image
            src="/brand/logo-mark.png"
            alt=""
            width={402}
            height={318}
            priority
            className="h-[92px] w-auto md:h-[118px]"
          />
          <p className="mt-7 font-display text-[1.35rem] tracking-[0.38em] text-offwhite/85 md:text-2xl">
            SIGMA
          </p>
          <p className="mt-2 text-[9px] uppercase tracking-[0.5em] text-champagne/80 md:text-[10px]">
            Design &amp; Build
          </p>
        </motion.div>

        <div className="mt-14 w-full max-w-[320px]">
          <div className="relative h-px w-full overflow-hidden bg-offwhite/12">
            <span
              ref={barRef}
              className="absolute inset-0 origin-left bg-champagne"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <div className="mt-4 flex items-center justify-between text-[9px] uppercase tracking-[0.28em] text-offwhite/35">
            <span>Initialising film</span>
            <span className="tabular-nums">
              <span ref={counterRef}>000</span>
              <span className="ml-1 text-offwhite/45">%</span>
            </span>
          </div>
        </div>
      </div>

      <div className="shell pb-8">
        <div className="flex flex-col gap-2 border-t border-offwhite/10 pt-5 text-[9px] uppercase tracking-[0.28em] text-offwhite/35 sm:flex-row sm:items-center sm:justify-between">
          <span>Engineered openings · Enduring architecture</span>
          <span className="hidden sm:block">Scroll-controlled film · 48 seconds</span>
        </div>
      </div>
    </motion.div>
  );
}
