"use client";

import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { chapters, type SystemId } from "@/lib/film";
import { whatsappLink } from "@/lib/site";
import { SmoothScrollProvider, useSmoothScroll } from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import ScrollFilm from "@/components/ScrollFilm";
import Marquee from "@/components/sections/Marquee";
import Manifesto from "@/components/sections/Manifesto";
import Systems from "@/components/sections/Systems";
import Standard from "@/components/sections/Standard";
import Process from "@/components/sections/Process";
import Finale from "@/components/sections/Finale";
import SiteFooter from "@/components/SiteFooter";
import FloatingContact from "@/components/FloatingContact";
import QuickQuoteModal from "@/components/QuickQuoteModal";
import ProductSpecDrawer from "@/components/ProductSpecDrawer";

const WindowStudio = dynamic(() => import("@/components/sections/WindowStudio"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[520px] items-center justify-center border-y border-offwhite/10 bg-obsidian">
      <span className="text-[10px] uppercase tracking-[0.28em] text-offwhite/30">
        Loading the window studio
      </span>
    </div>
  ),
});

function Shell() {
  const [intro, setIntro] = useState(true);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteSystem, setQuoteSystem] = useState<SystemId | undefined>(undefined);
  const [specOpen, setSpecOpen] = useState(false);
  const [specSystem, setSpecSystem] = useState<SystemId | undefined>(undefined);
  const [activeChapter, setActiveChapter] = useState(0);
  const { scrollTo } = useSmoothScroll();

  const finishIntro = useCallback(() => setIntro(false), []);

  const openQuote = useCallback((system?: SystemId) => {
    setSpecOpen(false);
    setQuoteSystem(system);
    setQuoteOpen(true);
  }, []);

  const closeQuote = useCallback(() => setQuoteOpen(false), []);

  const openSpec = useCallback((system?: SystemId) => {
    setQuoteOpen(false);
    setSpecSystem(system);
    setSpecOpen(true);
  }, []);

  const closeSpec = useCallback(() => setSpecOpen(false), []);

  const seekChapter = useCallback(
    (index: number) => {
      const section = document.getElementById("film");
      if (!section) return;
      const top = section.getBoundingClientRect().top + window.scrollY;
      const distance = section.offsetHeight - window.innerHeight;
      const progress = index === 0 ? 0.02 : (index + 0.45) / chapters.length;
      scrollTo(top + distance * progress, 1.7);
    },
    [scrollTo],
  );

  const openWhatsapp = useCallback(() => {
    window.open(whatsappLink, "_blank", "noopener,noreferrer");
  }, []);

  const exploreSystems = useCallback(() => scrollTo("#systems", 1.5), [scrollTo]);

  return (
    <>
      <CustomCursor />

      <AnimatePresence>{intro && <Preloader onDone={finishIntro} />}</AnimatePresence>

      <Navbar
        activeChapter={activeChapter}
        ready={!intro}
        onSeekChapter={seekChapter}
        onQuote={() => openQuote()}
      />

      <main id="top" className="relative bg-ink">
        <h1 className="sr-only">
          Sigma Design &amp; Build — architectural uPVC doors and windows, engineered in Odisha
        </h1>

        <ScrollFilm
          onChapterChange={setActiveChapter}
          onSeekChapter={seekChapter}
          onQuote={openQuote}
          onSpec={openSpec}
          onWhatsapp={openWhatsapp}
          onExplore={exploreSystems}
        />
        <Marquee />
        <Manifesto />
        <Systems onSpec={openSpec} />
        <WindowStudio onQuote={openQuote} onSpec={openSpec} />
        <Standard onSpec={openSpec} />
        <Process />
        <Finale onQuote={() => openQuote()} />
      </main>

      <SiteFooter />
      <FloatingContact visible={!intro} />

      <QuickQuoteModal open={quoteOpen} initialSystem={quoteSystem} onClose={closeQuote} />
      <ProductSpecDrawer
        open={specOpen}
        initialSystem={specSystem}
        onClose={closeSpec}
        onQuote={openQuote}
      />
    </>
  );
}

export default function SiteShell() {
  return (
    <SmoothScrollProvider>
      <Shell />
    </SmoothScrollProvider>
  );
}
