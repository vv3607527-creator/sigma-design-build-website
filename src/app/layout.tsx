import type { Metadata, Viewport } from "next";
import { Playfair_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const title = `${site.name} — Architectural uPVC Doors & Windows`;
const description = site.description;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s — ${site.name}`,
  },
  description,
  applicationName: site.name,
  keywords: [
    "uPVC doors Odisha",
    "uPVC windows Odisha",
    "architectural windows",
    "sliding doors",
    "tilt and turn windows",
    "Sigma Design & Build",
    "uPVC fabrication",
    "double glazing",
    "coastal grade windows",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: site.name,
    title,
    description,
    images: [
      {
        url: "/brand/og.jpg",
        width: 1200,
        height: 630,
        alt: "Sigma Design & Build — engineered uPVC openings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/brand/og.jpg"],
  },
  robots: { index: true, follow: true },
  category: "architecture",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#0b0b0b",
};

const schema = {
  "@context": "https://schema.org",
  "@type": ["HomeAndConstructionBusiness", "LocalBusiness"],
  name: site.name,
  alternateName: "Sigma Design and Build",
  description,
  slogan: site.tagline,
  image: `${site.url}/brand/og.jpg`,
  logo: `${site.url}/brand/logo-horizontal.png`,
  telephone: "+917008859673",
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    addressRegion: site.contact.region,
    addressCountry: site.contact.country,
  },
  areaServed: { "@type": "State", name: "Odisha" },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:30",
    closes: "19:00",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "uPVC door and window systems",
    itemListElement: [
      "Multi-track sliding doors",
      "Casement windows",
      "Tilt and turn windows",
      "Fixed and structural glazing",
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Product", name },
    })),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${playfair.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-ink text-offwhite/80 antialiased">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </body>
    </html>
  );
}
