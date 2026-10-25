export type ChapterMeta = {
  id: "ascent" | "approach" | "threshold" | "interior" | "craft" | "finale";
  clip: string;
  nav: string;
  label: string;
  headline: string;
  index: string;
  time: string;
};

export const FILM_SECONDS = 48;
export const CHAPTER_SCROLL_VH = 118;

export const chapters: ChapterMeta[] = [
  {
    id: "ascent",
    clip: "01-descent",
    nav: "Skyline",
    label: "The Ascent",
    headline: "Precision in every opening",
    index: "01",
    time: "00:00",
  },
  {
    id: "approach",
    clip: "02-arrival",
    nav: "Approach",
    label: "The Approach",
    headline: "Arrival, composed",
    index: "02",
    time: "00:08",
  },
  {
    id: "threshold",
    clip: "03-threshold",
    nav: "Thresholds",
    label: "The Threshold",
    headline: "Thresholds, made effortless",
    index: "03",
    time: "00:16",
  },
  {
    id: "interior",
    clip: "04-interior",
    nav: "Interior",
    label: "The Interior",
    headline: "Quiet by construction",
    index: "04",
    time: "00:24",
  },
  {
    id: "craft",
    clip: "05-floor",
    nav: "The Craft",
    label: "The Craft",
    headline: "Engineered under one roof",
    index: "05",
    time: "00:32",
  },
  {
    id: "finale",
    clip: "06-finale",
    nav: "Finale",
    label: "The Finale",
    headline: "Transform your vision",
    index: "06",
    time: "00:40",
  },
];

export type SystemId = "sliding" | "casement" | "tilt-turn" | "fixed";

export type System = {
  id: SystemId;
  index: string;
  name: string;
  category: string;
  summary: string;
  image: string;
  detail: string;
  specs: { label: string; value: string }[];
};

export const systems: System[] = [
  {
    id: "sliding",
    index: "01",
    name: "Multi-Track Sliding",
    category: "Door systems",
    summary:
      "Wide, uninterrupted panels that disappear into the frame — engineered for terraces, balconies and indoor–outdoor living.",
    image: "/media/film/03-threshold-still.jpg",
    detail:
      "Two, three and four-track configurations with independently sliding panels, stainless steel roller carriages and a flush floor track. Concealed multi-point locking keeps the opening secure without breaking the sightline.",
    specs: [
      { label: "Panel height", value: "Up to 2,400 mm" },
      { label: "Track options", value: "2 / 3 / 4 track" },
      { label: "Sightline", value: "From 45 mm" },
      { label: "Glazing", value: "Double or triple" },
      { label: "Threshold", value: "Flush, 3 mm" },
      { label: "Hardware", value: "Stainless rollers" },
    ],
  },
  {
    id: "casement",
    index: "02",
    name: "Casement Windows",
    category: "Window systems",
    summary:
      "Side-hung sashes that open fully to the breeze and seal tight against coastal weather when closed.",
    image: "/media/film/04-interior-still.jpg",
    detail:
      "Multi-chamber uPVC profiles with galvanised steel reinforcement, EPDM compression gaskets and multi-point locking. Projecting or top-hung configurations are available for ventilated façades.",
    specs: [
      { label: "Sash options", value: "Side / top hung" },
      { label: "Profile", value: "5-chamber" },
      { label: "Acoustic", value: "Up to 45 dB" },
      { label: "Locking", value: "Multi-point" },
      { label: "Gaskets", value: "Dual EPDM" },
      { label: "Finish", value: "UV stabilised" },
    ],
  },
  {
    id: "tilt-turn",
    index: "03",
    name: "Tilt & Turn",
    category: "Window systems",
    summary:
      "A single sash that tilts for secure ventilation and turns fully inward for cleaning and egress.",
    image: "/media/film/02-arrival-poster.jpg",
    detail:
      "A dual-action handle drives the sash through tilt, turn and lock positions. Ideal for upper floors, where ventilation can be held safely, and for elevations that need a deep, uninterrupted view.",
    specs: [
      { label: "Operation", value: "Tilt / turn / lock" },
      { label: "Hardware", value: "Concealed multi-point" },
      { label: "Ventilation", value: "Controlled tilt" },
      { label: "Cleaning", value: "Inward turn" },
      { label: "Thermal", value: "Multi-chamber" },
      { label: "Security", value: "Locking pins" },
    ],
  },
  {
    id: "fixed",
    index: "04",
    name: "Fixed & Structural Glazing",
    category: "Glazing systems",
    summary:
      "Framed picture windows and slim sightline glazing that hold the view and quiet the room.",
    image: "/media/film/01-descent-poster.jpg",
    detail:
      "Fixed lights are fabricated to the millimetre and can be combined with operable panels in the same elevation. Triple glazing and laminated acoustic builds are specified to the site's orientation and noise profile.",
    specs: [
      { label: "Configuration", value: "Made to measure" },
      { label: "Max light", value: "Site specific" },
      { label: "Glazing", value: "Triple / laminated" },
      { label: "Acoustic", value: "Up to 45 dB" },
      { label: "UV", value: "Stabilised profile" },
      { label: "Integration", value: "With operable units" },
    ],
  },
];

export const materials = [
  {
    name: "Sigma uPVC",
    headline: "The specified system",
    rows: ["0.9 – 1.3 W/m²K", "Up to 45 dB", "25 – 30 years", "Wipe clean", "Coastal grade"],
    accent: true,
  },
  {
    name: "Aluminium",
    headline: "Conductive frame",
    rows: ["2.5 – 4.0 W/m²K", "30 – 35 dB", "20 – 25 years", "Repaint / anodise", "Corrosion risk"],
    accent: false,
  },
  {
    name: "Timber",
    headline: "Natural, demanding",
    rows: ["1.5 – 2.5 W/m²K", "25 – 30 dB", "15 – 25 years", "Sand & seal yearly", "Moisture sensitive"],
    accent: false,
  },
];

export const materialRows = ["Thermal U-value", "Acoustic", "Service life", "Maintenance", "Coastal climate"];
