import Image from "next/image";
import { ArrowUp } from "lucide-react";
import { chapters } from "@/lib/film";
import { site, whatsappLink } from "@/lib/site";

const explore = [
  { label: "The studio", href: "#about" },
  { label: "Systems", href: "#systems" },
  { label: "Window studio", href: "#studio" },
  { label: "The standard", href: "#standard" },
  { label: "Process", href: "#process" },
];

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-offwhite/10 bg-obsidian">
      <div className="shell relative py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <a href="#top" aria-label={`${site.name} — home`} className="inline-block">
              <Image
                src="/brand/logo-stacked.png"
                alt={`${site.name} logo`}
                width={679}
                height={417}
                className="h-28 w-auto"
              />
            </a>
            <p className="mt-6 max-w-xs text-[12px] leading-relaxed text-offwhite/45">
              Architectural uPVC door and window systems, engineered for the coast and fabricated in
              Odisha.
            </p>
            <p className="mt-5 text-[10px] uppercase tracking-[0.24em] text-champagne/80">
              {site.tagline}
            </p>
          </div>

          <div className="lg:col-span-2">
            <p className="text-[9px] uppercase tracking-[0.26em] text-offwhite/30">Explore</p>
            <ul className="mt-5 space-y-3">
              {explore.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="link-underline text-[12px] text-offwhite/55 transition-colors hover:text-gold-light"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-[9px] uppercase tracking-[0.26em] text-offwhite/30">The film</p>
            <ul className="mt-5 space-y-3">
              {chapters.map((chapter) => (
                <li key={chapter.id}>
                  <a
                    href="#film"
                    className="link-underline text-[12px] text-offwhite/55 transition-colors hover:text-gold-light"
                  >
                    {chapter.nav}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="text-[9px] uppercase tracking-[0.26em] text-offwhite/30">Contact</p>
            <div className="mt-5 space-y-3 text-[12px] leading-relaxed text-offwhite/55">
              <p className="max-w-[240px]">{site.contact.address}</p>
              <p>
                <a
                  href={site.contact.phoneHref}
                  className="transition-colors hover:text-gold-light"
                >
                  {site.contact.phoneDisplay}
                </a>
              </p>
              <p>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold-light"
                >
                  WhatsApp
                </a>
              </p>
              <p className="text-offwhite/35">{site.contact.hours}</p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-offwhite/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[9px] uppercase tracking-[0.22em] text-offwhite/25">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <p className="text-[9px] uppercase tracking-[0.22em] text-offwhite/25">
              Engineered in Odisha
            </p>
            <a
              href="#top"
              className="group inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-offwhite/40 transition-colors hover:text-gold-light"
            >
              Back to top
              <span className="grid h-7 w-7 place-items-center border border-offwhite/15 transition-colors group-hover:border-champagne/60">
                <ArrowUp className="h-3 w-3" />
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="pointer-events-none relative select-none overflow-hidden">
        <p className="whitespace-nowrap text-center font-display text-[clamp(5rem,19vw,17rem)] leading-[0.72] tracking-[0.06em] text-outline opacity-40">
          SIGMA
        </p>
      </div>
    </footer>
  );
}
