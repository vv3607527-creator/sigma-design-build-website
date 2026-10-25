export const site = {
  name: "Sigma Design & Build",
  shortName: "Sigma",
  wordmark: "SIGMA",
  wordmarkSub: "DESIGN & BUILD",
  tagline: "Engineered openings. Enduring architecture.",
  description:
    "Sigma Design & Build engineers architectural uPVC door and window systems in Odisha — multi-track sliders, casement and tilt-and-turn windows, and made-to-measure glazing for homes and commercial projects.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contact: {
    phoneDisplay: "+91 70088 59673",
    phoneHref: "tel:+917008859673",
    whatsapp: "917008859673",
    whatsappDisplay: "+91 70088 59673",
    address: "Odisha, India — site survey by appointment",
    region: "Odisha",
    country: "IN",
    hours: "Mon – Sat, 9:30 am – 7:00 pm",
  },
} as const;

export const whatsappMessage =
  "Hello Sigma Design & Build, I am interested in your premium uPVC doors and windows. Please share the catalogue and a quote.";

export const whatsappLink = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
  whatsappMessage,
)}`;

export function buildWhatsappLink(message: string) {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
