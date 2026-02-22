/*
 * slider.schema.ts
 * @atomictemplate/validations
 */

import { validator } from "../validator"

// Image section schema
const ImageSectionSchema = validator.object({
  src: validator.string().optional(),
  alt: validator.string().optional(),
  width: validator.union([validator.number(), validator.string()]).optional(),
  height: validator.union([validator.number(), validator.string()]).optional(),
  objectFit: validator
    .enum(["contain", "cover", "fill", "none", "scale-down"])
    .optional(),
  priority: validator.boolean().optional(),
})

// Text section schema
const TextSectionSchema = validator.object({
  title: validator.string().optional(),
  description: validator.string().optional(),
  subTitle: validator.string().optional(),
})

// Link section schema
const LinkSchema = validator.object({
  href: validator.string().url(),
  type: validator.enum(["wrap", "button"]),
  buttonText: validator.string().optional(),
})

// InfoCard item schema
export const InfoCardItemSchema = validator.object({
  imageSection: ImageSectionSchema.optional(),
  textSection: TextSectionSchema.optional(),
  link: LinkSchema.optional(),
})

// Arrow options schema
const ArrowOptionsSchema = validator.object({
  position: validator.enum(["inside", "outside"]).optional(),
})

// Autoplay options schema
const AutoplayOptionsSchema = validator.object({
  enabled: validator.boolean().optional(),
  delay: validator.number().positive().optional(),
  pauseOnHover: validator.boolean().optional(),
})

// Responsive config schema
const ResponsiveConfigSchema = validator.object({
  slidesToShow: validator.number().positive().optional(),
  slidesToScroll: validator.number().positive().optional(),
})

// Responsive options schema
const ResponsiveOptionsSchema = validator.object({
  sm: ResponsiveConfigSchema.optional(),
  md: ResponsiveConfigSchema.optional(),
  lg: ResponsiveConfigSchema.optional(),
  xl: ResponsiveConfigSchema.optional(),
  "2xl": ResponsiveConfigSchema.optional(),
})

// Marquee options schema
const MarqueeOptionsSchema = validator.object({
  enabled: validator.boolean().optional(),
  speed: validator.number().positive().optional(),
  pauseOnHover: validator.boolean().optional(),
})

// Slider options schema
export const SliderOptionsSchema = validator.object({
  // Display
  slidesToShow: validator.number().positive().optional(),
  slidesToScroll: validator.number().positive().optional(),
  gap: validator.union([validator.number(), validator.string()]).optional(),
  stretch: validator.boolean().optional(),
  centerMode: validator.boolean().optional(),

  // Navigation
  pagination: validator.enum(["arrows", "dots", "both", "none"]).optional(),
  arrows: ArrowOptionsSchema.optional(),

  // Behavior
  autoplay: AutoplayOptionsSchema.optional(),
  marquee: MarqueeOptionsSchema.optional(),
  loop: validator.boolean().optional(),
  speed: validator.number().positive().optional(),
  direction: validator.enum(["ltr", "rtl"]).optional(),
  reverse: validator.boolean().optional(),
  draggable: validator.boolean().optional(),

  // Responsive
  responsive: ResponsiveOptionsSchema.optional(),
})

// Main slider schema
export const SliderSchema = validator.object({
  items: validator.array(InfoCardItemSchema).min(1),
  options: SliderOptionsSchema.optional(),
})

export type SliderData = validator.infer<typeof SliderSchema>
export type InfoCardItem = validator.infer<typeof InfoCardItemSchema>
export type SliderOptions = validator.infer<typeof SliderOptionsSchema>
