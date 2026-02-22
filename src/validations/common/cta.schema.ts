/*
 * cta.schema.ts
 * @atomictemplate/validations
 */

import { validator, imageValidator } from "../validator"
import { ButtonSchema } from "./button.schema"

export const CtaSchema = validator.object({
  ctaTitle: validator.string().min(1, "CTA title is required"),
  ctaDescription: validator.string().optional(),
  ctaBackgroundImageUrl: imageValidator.optional(),
  ctaButton: ButtonSchema,
})

export type Cta = validator.infer<typeof CtaSchema>
