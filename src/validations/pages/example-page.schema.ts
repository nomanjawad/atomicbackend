/*
 * example-page.schema.ts
 * @atomictemplate/validations
 */

import { validator } from "../validator"
import { ButtonSchema } from "../common/button.schema"

// Link Schema
export const LinkSchema = validator.object({
  text: validator.string().min(1, "Link text is required"),
  href: validator.string().min(1, "Link href is required"),
})

// Hero Section Schema
export const ExampleHeroSchema = validator.object({
  title: validator
    .string()
    .min(10, "Hero title is too short (min 10 characters)")
    .max(100, "Hero title is too long (max 100 characters)"),
  subtitle: validator.string().optional(),
  description: validator
    .string()
    .min(20, "Hero description is too short (min 20 characters)")
    .max(500, "Hero description is too long (max 500 characters)"),
  primaryButton: ButtonSchema,
  secondaryButton: ButtonSchema.optional(),
  backgroundImage: validator.string().optional(),
  badges: validator
    .array(validator.string().min(1).max(30))
    .optional(),
})

// Feature Schema
export const ExampleFeatureSchema = validator.object({
  id: validator
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Feature ID must be lowercase with hyphens"),
  icon: validator.string().min(1),
  title: validator.string().min(3).max(100),
  description: validator.string().min(10).max(300),
  link: LinkSchema.optional(),
})

// Features Section Schema
export const ExampleFeaturesSchema = validator.object({
  sectionTitle: validator.string().min(3),
  sectionDescription: validator.string().optional(),
  features: validator.array(ExampleFeatureSchema).min(1).max(12),
  layout: validator.enum(["grid", "list", "carousel"]).optional(),
  columns: validator.number().int().min(2).max(4).optional(),
})

// Stat Schema
export const ExampleStatSchema = validator.object({
  value: validator.string().min(1).max(20),
  label: validator.string().min(2).max(50),
  description: validator.string().max(100).optional(),
  icon: validator.string().optional(),
})

// Stats Section Schema
export const ExampleStatsSchema = validator.object({
  sectionTitle: validator.string().optional(),
  stats: validator.array(ExampleStatSchema).min(2).max(6),
  background: validator.enum(["light", "dark", "gradient"]).optional(),
})

// Testimonial Schema
export const ExampleTestimonialSchema = validator.object({
  id: validator.string().min(1).regex(/^[a-z0-9-]+$/),
  name: validator.string().min(2),
  role: validator.string().min(2),
  company: validator.string().optional(),
  avatar: validator.string().optional(),
  rating: validator.number().int().min(1).max(5),
  quote: validator.string().min(20).max(500),
  date: validator.string().optional(),
})

// Testimonials Section Schema
export const ExampleTestimonialsSchema = validator.object({
  sectionTitle: validator.string().min(3),
  sectionDescription: validator.string().optional(),
  testimonials: validator.array(ExampleTestimonialSchema).min(1).max(10),
  displayStyle: validator.enum(["carousel", "grid", "masonry"]).optional(),
})

// FAQ Item Schema
export const ExampleFAQItemSchema = validator.object({
  id: validator.string().min(1).regex(/^[a-z0-9-]+$/),
  question: validator.string().min(10).max(200),
  answer: validator.string().min(20).max(1000),
  category: validator.string().optional(),
})

// FAQ Section Schema
export const ExampleFAQSchema = validator.object({
  sectionTitle: validator.string().min(3),
  sectionDescription: validator.string().optional(),
  faqs: validator.array(ExampleFAQItemSchema).min(3).max(20),
  categories: validator.array(validator.string()).optional(),
})

// CTA Section Schema
export const ExampleCTASchema = validator.object({
  title: validator.string().min(5),
  description: validator.string().min(10),
  button: ButtonSchema,
  background: validator.enum(["gradient", "solid", "image"]).optional(),
})

// Page Metadata Schema
export const ExamplePageMetaSchema = validator.object({
  title: validator.string().min(10).max(60),
  description: validator.string().min(50).max(160),
  keywords: validator.array(validator.string().min(2)).min(3).max(10),
})

// Complete Example Page Schema
export const examplePageSchema = validator.object({
  meta: ExamplePageMetaSchema,
  hero: ExampleHeroSchema,
  features: ExampleFeaturesSchema.optional(),
  stats: ExampleStatsSchema.optional(),
  testimonials: ExampleTestimonialsSchema.optional(),
  faq: ExampleFAQSchema.optional(),
  cta: ExampleCTASchema.optional(),
})

// Type exports
export type ExamplePageMeta = validator.infer<typeof ExamplePageMetaSchema>
export type ExampleHero = validator.infer<typeof ExampleHeroSchema>
export type ExampleFeature = validator.infer<typeof ExampleFeatureSchema>
export type ExampleFeatures = validator.infer<typeof ExampleFeaturesSchema>
export type ExampleStat = validator.infer<typeof ExampleStatSchema>
export type ExampleStats = validator.infer<typeof ExampleStatsSchema>
export type ExampleTestimonial = validator.infer<typeof ExampleTestimonialSchema>
export type ExampleTestimonials = validator.infer<typeof ExampleTestimonialsSchema>
export type ExampleFAQItem = validator.infer<typeof ExampleFAQItemSchema>
export type ExampleFAQ = validator.infer<typeof ExampleFAQSchema>
export type ExampleCTA = validator.infer<typeof ExampleCTASchema>
export type ExamplePage = validator.infer<typeof examplePageSchema>

// Validation helper functions
export function validateExamplePageData(data: unknown) {
  try {
    return examplePageSchema.parse(data)
  } catch (error) {
    console.error("Example page data validation failed:", error)
    return null
  }
}

export function safeValidateExamplePageData(data: unknown) {
  return examplePageSchema.safeParse(data)
}
