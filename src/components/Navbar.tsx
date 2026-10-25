"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { chapters } from "@/lib/film";
import { site, whatsappLink } from "@/lib/site";
import { useSmoothScroll } from "@/components/SmoothScroll";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

type NavbarProps = {
  activeChapter: number;
  ready: boolean;
  onSeekChapter: (index: number) => void;
  onQuote: () => void;
};

const sectionLinks = [
  { label: "Systems", href: "#systems" },
  { label: "Window studio", href: "#studio" },
  { label: "Standard", href: "#standard" },
  { label: "Process", href: "#process" },
];

export default function Navbar({ activeChapter, ready, onSeekChapter, onQuote }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollTo, stop, start } = useSmoothScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    stop();
    return () => start();
  }, [menuOpen, stop, start]);

  const goTo = (href: string) => {
    setMenuOpen(false);
    scrollTo(href, 1.4);
  };

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled || menuOpen
            ? "border-b border-offwhite/10 bg-ink/70 backdrop-blur-xl"
            : "border-b border-transparent bg-gradient-to-b from-ink/70 via-ink/20 to-transparent"
        }`}
      >
        <div
          className={`shell flex items-center justify-between gap-6 transition-[height] duration-500 ${
            scrolled ? "h-[68px]" : "h-[84px]"
          }`}
        >
          <a
            href="#top"
            aria-label={`${site.name} — home`}
            className="relative shrink-0 py-2"
            onClick={(event) => {
              event.preventDefault();
              scrollTo(0, 1.2);
            }}
          >
            <Image
              src="/brand/logo-horizontal.png"
              alt={`${site.name} logo`}
              width={655}
              height={170}
              priority
              className="h-[34px] w-auto md:h-[40px]"
            />
          </a>

          <nav aria-label="Film chapters" className="hidden items-center gap-0.5 xl:flex">
            {chapters.map((chapter, index) => {
              const isActive = activeChapter === index;
              return (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => onSeekChapter(index)}
                  aria-current={isActive ? "true" : undefined}
                  className={`group relative flex items-center gap-2 rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                    isActive
                      ? "text-gold-light"
                      : "text-offwhite/55 hover:text-offwhite/90"
                  }`}
                >
                  <span
                    className={`font-display text-[10px] transition-colors ${
                      isActive ? "text-champagne" : "text-offwhite/25 group-hover:text-champagne/70"
                    }`}
                  >
                    {chapter.index}
                  </span>
                  {chapter.nav}
                  <span
                    className={`absolute inset-x-3 -bottom-px h-px origin-left bg-champagne transition-transform duration-500 ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href={site.contact.phoneHref}
              className="hidden text-[11px] tracking-[0.12em] text-offwhite/55 transition-colors hover:text-gold-light 2xl:block"
            >
              {site.contact.phoneDisplay}
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold hidden !px-5 !py-3 sm:inline-flex"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
              WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="grid h-11 w-11 place-items-center border border-offwhite/15 text-offwhite/80 transition-colors hover:border-champagne/60 hover:text-gold-light xl:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.4} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[70] flex flex-col bg-obsidian/97 backdrop-blur-2xl xl:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="shell flex h-[84px] shrink-0 items-center justify-between">
              <Image
                src="/brand/logo-horizontal.png"
                alt={`${site.name} logo`}
                width={655}
                height={170}
                className="h-[34px] w-auto"
              />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center border border-offwhite/15 text-offwhite/80 transition-colors hover:border-champagne/60 hover:text-gold-light"
              >
                <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </div>

            <div className="shell flex min-h-0 flex-1 flex-col overflow-y-auto pb-10 pt-4">
              <p className="eyebrow">The film</p>
              <div className="mt-4 flex flex-col divide-y divide-offwhite/10 border-y border-offwhite/10">
                {chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      window.setTimeout(() => onSeekChapter(index), 350);
                    }}
                    className="group flex items-center justify-between py-3.5 text-left"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-display text-xs text-champagne/70">{chapter.index}</span>
                      <span className="font-display text-[1.45rem] text-offwhite/90 transition-colors group-hover:text-gold-light">
                        {chapter.headline}
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-offwhite/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-champagne" />
                  </button>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
                {sectionLinks.map((link) => (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => goTo(link.href)}
                    className="text-left text-[11px] uppercase tracking-[0.22em] text-offwhite/55 transition-colors hover:text-gold-light"
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              <div className="mt-auto grid gap-4 pt-10">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    window.setTimeout(onQuote, 350);
                  }}
                  className="btn btn-outline w-full"
                >
                  Request a quote
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold w-full"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
                <div className="mt-2 space-y-1 text-[11px] leading-relaxed tracking-[0.08em] text-offwhite/45">
                  <p>{site.contact.phoneDisplay}</p>
                  <p>{site.contact.address}</p>
                  <p>{site.contact.hours}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
