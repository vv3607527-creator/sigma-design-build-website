"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fine && !reduce) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("cursor-none");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let scale = 1;
    let targetScale = 1;
    let visible = false;
    let raf = 0;

    const applyVisibility = (next: boolean) => {
      visible = next;
      dot.style.opacity = next ? "1" : "0";
      ring.style.opacity = next ? "1" : "0";
    };
    applyVisibility(false);

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      dot.style.transform = `translate3d(${targetX - 2.5}px, ${targetY - 2.5}px, 0)`;
      if (!visible) applyVisibility(true);
    };

    const interactiveSelector = "a, button, [data-cursor='hover'], input, label";

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest(interactiveSelector);
      targetScale = interactive ? 1.75 : 1;
      ring.style.backgroundColor = interactive ? "rgba(201, 164, 91, 0.09)" : "transparent";
      ring.style.borderColor = interactive
        ? "rgba(231, 201, 122, 0.9)"
        : "rgba(201, 164, 91, 0.55)";
    };

    const onDown = () => {
      targetScale *= 0.82;
      window.setTimeout(() => {
        targetScale = 1;
      }, 160);
    };

    const onLeave = () => applyVisibility(false);
    const onEnter = () => applyVisibility(true);

    const loop = () => {
      raf = requestAnimationFrame(loop);
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      scale += (targetScale - scale) * 0.14;
      ring.style.transform = `translate3d(${ringX - 17}px, ${ringY - 17}px, 0) scale(${scale})`;
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("cursor-none");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="custom-cursor h-[5px] w-[5px] bg-gold-light opacity-0"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="custom-cursor h-[34px] w-[34px] border border-champagne/55 opacity-0"
        style={{ transition: "background-color 300ms ease, border-color 300ms ease" }}
      />
    </>
  );
}
