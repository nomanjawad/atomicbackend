// Page status constants
export const PAGE_STATUS = {
  DRAFT: "draft",
  REVIEW: "review",
  SCHEDULED: "scheduled",
  PUBLISHED: "published",
  ARCHIVED: "archived",
};

export const PAGE_STATUS_LABELS = {
  [PAGE_STATUS.DRAFT]: "Draft",
  [PAGE_STATUS.REVIEW]: "In Review",
  [PAGE_STATUS.SCHEDULED]: "Scheduled",
  [PAGE_STATUS.PUBLISHED]: "Published",
  [PAGE_STATUS.ARCHIVED]: "Archived",
};

export const PAGE_STATUS_COLORS = {
  [PAGE_STATUS.DRAFT]: "gray",
  [PAGE_STATUS.REVIEW]: "yellow",
  [PAGE_STATUS.SCHEDULED]: "blue",
  [PAGE_STATUS.PUBLISHED]: "green",
  [PAGE_STATUS.ARCHIVED]: "red",
};

// Section types that can be added to pages
// These map to schemas from @atomictemplate/validations
export const SECTION_TYPES = {
  HERO: "hero",
  BANNER: "banner",
  FEATURES: "features",
  CONTENT_BOX: "content_box",
  GALLERY: "gallery",
  FAQ: "faq",
  CTA: "cta",
  SLIDER: "slider",
  FORM: "form",
  TESTIMONIALS: "testimonials",
  STATS: "stats",
  TEAM: "team",
};

// Section metadata for UI display
export const SECTION_METADATA = {
  [SECTION_TYPES.HERO]: {
    label: "Hero Section",
    description: "Large banner with heading, subheading, and CTA",
    icon: "🎯",
  },
  [SECTION_TYPES.BANNER]: {
    label: "Banner",
    description: "Image banner with text overlay",
    icon: "🖼️",
  },
  [SECTION_TYPES.FEATURES]: {
    label: "Features Grid",
    description: "Grid of features with icons and descriptions",
    icon: "✨",
  },
  [SECTION_TYPES.CONTENT_BOX]: {
    label: "Content Box",
    description: "Rich content section with image and text",
    icon: "📦",
  },
  [SECTION_TYPES.GALLERY]: {
    label: "Image Gallery",
    description: "Grid or masonry layout of images",
    icon: "🖼️",
  },
  [SECTION_TYPES.FAQ]: {
    label: "FAQ Section",
    description: "Frequently asked questions with expandable answers",
    icon: "❓",
  },
  [SECTION_TYPES.CTA]: {
    label: "Call to Action",
    description: "Action-focused section with button",
    icon: "📢",
  },
  [SECTION_TYPES.SLIDER]: {
    label: "Slider/Carousel",
    description: "Rotating content slides",
    icon: "🎠",
  },
  [SECTION_TYPES.FORM]: {
    label: "Form",
    description: "Contact or data collection form",
    icon: "📝",
  },
  [SECTION_TYPES.TESTIMONIALS]: {
    label: "Testimonials",
    description: "Customer reviews and feedback",
    icon: "💬",
  },
  [SECTION_TYPES.STATS]: {
    label: "Statistics",
    description: "Number counters and metrics",
    icon: "📊",
  },
  [SECTION_TYPES.TEAM]: {
    label: "Team Section",
    description: "Team members grid with photos and bios",
    icon: "👥",
  },
};
