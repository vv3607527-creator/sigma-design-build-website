# Sigma Design & Build

A scroll-driven cinematic website for Sigma Design & Build — architectural uPVC door and window
systems, engineered in Odisha.

The film is a six-chapter, scroll-scrubbed sequence cut from the six supplied drone and interior
clips. One sticky canvas, one continuous timeline: scroll forward to fly from the tower façade
through the sliding threshold and into the factory floor; scroll back to reverse it.

## Stack

- Next.js 15 (App Router, React 19) + TypeScript
- Tailwind CSS v4, custom brand tokens in `src/app/globals.css`
- Lenis smooth scroll, GSAP ScrollTrigger, Framer Motion
- Canvas 2D scrubbing with requestAnimationFrame and all-intra encoded MP4s
- three.js window/door configurator (procedural geometry, no external model)
- lucide-react icons, canvas-confetti on enquiry handoff

## Run

```bash
npm install
npm run dev
```

Production check:

```bash
npm run build
npm run start
```

## Edit the contact details

Everything customer-facing lives in `src/lib/site.ts`:

- `contact.phoneDisplay`, `contact.phoneHref`
- `contact.whatsapp` (international format, digits only — used for `wa.me`)
- `contact.address`, `contact.hours`
- `url` — set `NEXT_PUBLIC_SITE_URL` in production so canonical/OG/JSON-LD URLs resolve.

The enquiry form, floating WhatsApp pill, navigation CTA, finale and footer all read from that file.

## The film

- Sources: the six original clips in the parent folder.
- Encoded output: one continuous master per width — `film-master-960.mp4` (desktop),
  `film-master-854.mp4` (mobile) — plus `film-master-poster.jpg` and a poster per chapter.
- Encoding: `scripts/encode-film.sh` — the six clips are cut into a single film, every frame a
  keyframe (`-g 1`), no B-frames, no audio, so any seek resolves in one decode. Re-run it after
  replacing the source footage.
- Chapters, copy hooks and system data: `src/lib/film.ts`.
- Scroll length: `CHAPTER_SCROLL_VH` (118vh per chapter by default).
- Scrub engine: `src/components/ScrollFilm.tsx`. One paused `<video>` decodes the master and each
  presented frame is blitted into a canvas; the poster holds until the first frame arrives. The
  chapter overlays are driven by scroll progress, so copy and imagery stay in step even on a slow
  decoder. Keep the master all-intra: with six decoders or a long GOP the scrub collapses to a few
  frames a second.

## Brand assets

The logo artwork was extracted from the supplied brand board into `public/brand/`:

- `logo-stacked.png` — mark + wordmark (footer, editorial use)
- `logo-horizontal.png` — mark + wordmark side by side (navigation)
- `logo-mark.png` — skyline mark on transparent (preloader, accents)
- `logo-wordmark.png` — wordmark only

If the logo is replaced, keep those filenames and update the intrinsic `width`/`height` props in
`src/components/Navbar.tsx` and `src/components/SiteFooter.tsx` if the aspect ratio changes.

Brand tokens: near black `#0B0B0B`, champagne gold `#C9A45B`, warm light gold `#E7C97A`,
off-white `#F2F0EB`.

## Notes

- The 3D studio is illustrative — geometry is procedural and dimensions are confirmed at site
  measurement. It disables gracefully when WebGL is unavailable.
- Motion respects `prefers-reduced-motion`: Lenis smoothing and the custom cursor are disabled, and
  the film tracks scroll directly.
- The film assets total ~51 MB on disk; a device only ever downloads one width and preloads chapters
  as you approach them.
