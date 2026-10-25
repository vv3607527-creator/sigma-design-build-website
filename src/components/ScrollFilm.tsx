"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CHAPTER_SCROLL_VH, FILM_SECONDS, chapters, type SystemId } from "@/lib/film";
import ChapterOverlay from "@/components/film/ChapterOverlay";

gsap.registerPlugin(ScrollTrigger);

type ScrollFilmProps = {
  onChapterChange: (index: number) => void;
  onSeekChapter: (index: number) => void;
  onQuote: (system?: SystemId) => void;
  onSpec: (system?: SystemId) => void;
  onWhatsapp: () => void;
  onExplore: () => void;
};

const FPS = 24;
const FRAME = 1 / FPS;
const MASTER = {
  desktop: "/media/film/film-master-960.mp4",
  mobile: "/media/film/film-master-854.mp4",
  poster: "/media/film/film-master-poster.jpg",
};

const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");

export default function ScrollFilm(props: ScrollFilmProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const posterRef = useRef<HTMLImageElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<HTMLSpanElement | null>(null);
  const pctRef = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState(0);

  const callbacks = useRef(props);
  callbacks.current = props;

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!section || !video || !canvas) return;
    // desynchronized keeps the canvas off the compositor's normal frame queue,
    // which shaves the latency between a decoded frame and its paint.
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });

    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /*
     * One decode pipeline for the whole film. The six shots are cut into a
     * single all-intra master, so a scroll position maps to exactly one
     * timestamp and the browser keeps one decoder alive instead of six.
     */
    video.src = isMobile ? MASTER.mobile : MASTER.desktop;
    video.load();

    /*
     * The decoder writes into a canvas instead of being composited directly.
     * A paused video element that has to be re-rastered at viewport size on
     * every seek is far slower than blitting the decoded frame once; the
     * canvas is then scaled by the compositor.
     */
    const paint = () => {
      if (!ctx || video.readyState < 2) return;
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        if (!video.videoWidth || !video.videoHeight) return;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      if (posterRef.current) posterRef.current.style.opacity = "0";
    };
    const onSeeked = () => paint();
    video.addEventListener("loadeddata", paint, { once: true });
    video.addEventListener("seeked", onSeeked);

    let progress = 0;
    let target = 0;
    let raf = 0;
    let last = performance.now();
    let lastPct = -1;
    let lastSecond = -1;
    let activeIndex = -1;

    const seekTo = (normalised: number) => {
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0 || video.readyState < 1) return;
      // Land on the source's own frame grid, clamped one frame inside the end.
      const maxTime = Math.max(0, duration - FRAME);
      const time = Math.min(maxTime, Math.max(0, Math.round(normalised * duration * FPS) / FPS));
      if (video.seeking) return;
      if (Math.abs(video.currentTime - time) < FRAME * 0.5) return;
      try {
        video.currentTime = time;
      } catch {
        /* metadata not ready yet; the next tick retries */
      }
    };

    const onMeta = () => {
      seekTo(progress);
      paint();
    };
    video.addEventListener("loadedmetadata", onMeta);

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        target = self.progress;
      },
      onRefresh: (self) => {
        target = self.progress;
      },
    });
    target = trigger.progress;
    progress = trigger.progress;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(now - last, 64);
      last = now;
      if (document.hidden) return;

      target = trigger.progress;

      if (reduceMotion) {
        progress = target;
      } else {
        // Lenis already smooths the page; this only irons out per-frame jitter
        // so the film never lurches backwards on a wheel tick.
        const factor = 1 - Math.pow(0.62, dt / 16.667);
        progress += (target - progress) * factor;
        if (Math.abs(target - progress) < 0.00002) progress = target;
      }

      seekTo(progress);

      const index = Math.min(chapters.length - 1, Math.floor(progress * chapters.length + 1e-6));
      if (index !== activeIndex) {
        activeIndex = index;
        setActive(index);
        callbacks.current.onChapterChange(index);
      }

      const seconds = Math.floor(progress * FILM_SECONDS);
      if (seconds !== lastSecond) {
        lastSecond = seconds;
        const timecode = `${pad(seconds / 60)}:${pad(seconds % 60)}`;
        if (timeRef.current && timeRef.current.textContent !== timecode) {
          timeRef.current.textContent = timecode;
        }
      }

      const pct = Math.round(progress * 100);
      if (pct !== lastPct) {
        lastPct = pct;
        if (pctRef.current) pctRef.current.textContent = pad(pct);
        railRef.current?.style.setProperty("--film-progress", `${progress * 100}%`);
      }
    };
    raf = requestAnimationFrame(tick);

    const onVisibility = () => {
      lastPct = -1;
      lastSecond = -1;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      trigger.kill();
      document.removeEventListener("visibilitychange", onVisibility);
      video.removeEventListener("loadeddata", paint);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadedmetadata", onMeta);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, []);

  return (
    <section
      id="film"
      ref={sectionRef}
      aria-label="A scroll-controlled film through Sigma architecture"
      className="relative"
      style={{ height: `${chapters.length * CHAPTER_SCROLL_VH}vh` }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-obsidian">
        <div
          className="absolute inset-0"
          role="img"
          aria-label="Cinematic drone film descending past a tower, through sliding doors, across an interior and into the Sigma factory"
        >
          <Image
            ref={posterRef}
            src={MASTER.poster}
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="h-full w-full object-cover transition-opacity duration-700"
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full object-cover"
            width={960}
            height={540}
            aria-hidden="true"
          />
          <video
            ref={videoRef}
            className="pointer-events-none absolute left-0 top-0 h-[2px] w-[2px] opacity-[0.01]"
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 vignette" />
        <div className="pointer-events-none absolute inset-0 hidden scrim-left md:block" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/25 to-obsidian/60 md:hidden" />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-offwhite/10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-offwhite/10" />

        <div className="absolute right-5 top-24 z-20 hidden text-right md:block md:right-8">
          <p className="text-[9px] uppercase tracking-[0.34em] text-offwhite/35">
            A Sigma film · 48 seconds
          </p>
          <p className="mt-2 font-display text-sm tracking-[0.16em] text-offwhite/75">
            <span ref={timeRef}>00:00</span>
            <span className="mx-1 text-offwhite/25">/</span>
            <span className="text-offwhite/35">00:48</span>
          </p>
        </div>

        <div className="pointer-events-none absolute left-8 top-1/2 z-20 hidden -translate-y-1/2 lg:block">
          <p className="text-[9px] uppercase tracking-[0.4em] text-offwhite/30 [writing-mode:vertical-rl]">
            Odisha · India
          </p>
        </div>

        <div
          ref={railRef}
          className="absolute right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex"
        >
          <span className="font-display text-xs text-champagne">{chapters[active].index}</span>
          <div className="relative h-52 w-px bg-offwhite/15">
            <span
              className="absolute left-0 top-0 w-px bg-champagne"
              style={{ height: "var(--film-progress, 0%)" }}
            />
            {chapters.map((chapter, i) => (
              <button
                key={chapter.id}
                type="button"
                aria-label={`Jump to ${chapter.label}`}
                onClick={() => callbacks.current.onSeekChapter(i)}
                style={{ top: `${(i / (chapters.length - 1)) * 100}%` }}
                className={`pointer-events-auto absolute left-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ${
                  i === active
                    ? "scale-150 border-champagne bg-champagne ring-4 ring-champagne/15"
                    : i < active
                      ? "border-champagne/70 bg-champagne/70"
                      : "border-offwhite/30 bg-ink"
                }`}
              />
            ))}
          </div>
          <span className="text-[9px] tracking-[0.18em] text-offwhite/30">06</span>
        </div>

        <div className="absolute bottom-6 right-5 z-20 hidden items-center gap-3 md:right-8 md:flex">
          <span className="h-px w-8 bg-champagne/50" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-offwhite/35">
            <span ref={pctRef}>00</span>% scrubbed
          </span>
        </div>

        <ChapterOverlay
          index={active}
          onQuote={props.onQuote}
          onSpec={props.onSpec}
          onExplore={props.onExplore}
          onWhatsapp={props.onWhatsapp}
        />
      </div>
    </section>
  );
}
