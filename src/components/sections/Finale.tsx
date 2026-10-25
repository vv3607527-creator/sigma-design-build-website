"use client";

import Image from "next/image";
import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export default function Finale({ onQuote }: { onQuote: () => void }) {
  return (
    <section
      id="enquire"
      className="relative scroll-mt-24 overflow-hidden border-t border-offwhite/10"
    >
      <Image
        src="/media/film/06-finale-still.jpg"
        alt="The Sigma fabrication floor"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-obsidian/88" />
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/75 to-obsidian/25" />

      <div className="shell relative py-24 md:py-36">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="eyebrow">The invitation</span>
              <h2 className="display mt-6 text-[clamp(2.7rem,5.8vw,5.4rem)]">
                Let&apos;s open
                <br />a <em>conversation.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-lg text-sm leading-relaxed text-offwhite/60">
                Send us the elevation, the opening size, or simply the idea. We will come back with
                the right system, a considered specification and a clear price.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={onQuote} className="btn btn-gold">
                  Request a quote
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.26}>
              <p className="mt-6 text-[10px] uppercase tracking-[0.22em] text-offwhite/30">
                Factory &amp; experience centre · visits by appointment
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.12}>
              <div className="glass p-6 md:p-7">
                <p className="text-[10px] uppercase tracking-[0.28em] text-champagne">
                  Direct to the studio
                </p>
                <div className="mt-5 divide-y divide-offwhite/10">
                  <a
                    href={site.contact.phoneHref}
                    className="group flex items-start gap-4 py-4 first:pt-0"
                  >
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-champagne/80" />
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-offwhite/35">
                        Telephone
                      </p>
                      <p className="mt-1 font-display text-lg text-offwhite/90 transition-colors group-hover:text-gold-light">
                        {site.contact.phoneDisplay}
                      </p>
                    </div>
                  </a>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 py-4"
                  >
                    <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-champagne/80" />
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-offwhite/35">
                        WhatsApp
                      </p>
                      <p className="mt-1 text-sm text-offwhite/80 transition-colors group-hover:text-gold-light">
                        Message the studio
                      </p>
                    </div>
                  </a>
                  <div className="flex items-start gap-4 py-4">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-champagne/80" />
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-offwhite/35">
                        Address
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-offwhite/80">
                        {site.contact.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 py-4 last:pb-0">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-champagne/80" />
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-offwhite/35">
                        Studio hours
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-offwhite/80">
                        {site.contact.hours}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.2}>
          <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-offwhite/10 pt-6 text-[9px] uppercase tracking-[0.26em] text-offwhite/30">
            <span>uPVC door &amp; window systems</span>
            <span className="h-1 w-1 rounded-full bg-champagne/50" />
            <span>Design · Fabricate · Install</span>
            <span className="h-1 w-1 rounded-full bg-champagne/50" />
            <span>Odisha, India</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
