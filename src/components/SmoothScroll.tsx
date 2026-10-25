"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

gsap.registerPlugin(ScrollTrigger);

type ScrollContextValue = {
  scrollTo: (target: number | string, duration?: number) => void;
  stop: () => void;
  start: () => void;
  refresh: () => void;
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function useSmoothScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useSmoothScroll must be used inside SmoothScrollProvider");
  return ctx;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const locksRef = useRef(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const lenis = new Lenis({
      lerp: 0.11,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      autoRaf: true,
    });

    lenisRef.current = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    const refreshTimer = window.setTimeout(onLoad, 900);

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(refreshTimer);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback((target: number | string, duration?: number) => {
    const resolved =
      typeof target === "string"
        ? (() => {
            const element = document.querySelector(target);
            if (!element) return null;
            return element.getBoundingClientRect().top + window.scrollY - 76;
          })()
        : target;

    if (resolved === null) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(resolved, {
        duration: duration ?? 1.5,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      });
      return;
    }
    window.scrollTo({ top: resolved, behavior: "smooth" });
  }, []);

  const stop = useCallback(() => {
    locksRef.current += 1;
    lenisRef.current?.stop();
    document.documentElement.style.overflow = "hidden";
  }, []);

  const start = useCallback(() => {
    locksRef.current = Math.max(0, locksRef.current - 1);
    if (locksRef.current > 0) return;
    lenisRef.current?.start();
    document.documentElement.style.overflow = "";
  }, []);

  const refresh = useCallback(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <ScrollContext.Provider value={{ scrollTo, stop, start, refresh }}>
      {children}
    </ScrollContext.Provider>
  );
}
