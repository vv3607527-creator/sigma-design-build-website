"use client";

import { motion } from "framer-motion";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export default function FloatingContact({ visible }: { visible: boolean }) {
  return (
    <motion.a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Sigma Design & Build on WhatsApp"
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 18,
        scale: visible ? 1 : 0.96,
      }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: visible ? 0.5 : 0 }}
      whileHover={{ y: -3 }}
      className="group fixed bottom-5 right-4 z-40 inline-flex items-center gap-3 rounded-full border border-gold-light/40 bg-champagne px-4 py-3 text-ink shadow-[0_18px_50px_-12px_rgba(0,0,0,0.75)] transition-colors hover:bg-gold-light sm:bottom-7 sm:right-7 sm:px-5"
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2f7d52] opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2f7d52]" />
      </span>
      <WhatsAppIcon className="h-[18px] w-[18px]" />
      <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] sm:block">
        WhatsApp us
      </span>
      <span className="sr-only">Chat on WhatsApp</span>
    </motion.a>
  );
}
