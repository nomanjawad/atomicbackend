/*
 * cta.schema.ts
 * Created by Noman Jawad
 * Copyright (c) 2025 skytech_solutions
 * All rights reserved
 */

import { imageValidator, validator } from "@libs"
import { ButtonSchema } from "@validations"

export const CtaSchema = validator.object({
  ctaTitle: validator.string("Title should be a string"),
  ctaDescription: validator.string("Description should be a string").optional(),
  ctaBackgroundImageUrl: imageValidator.optional(),
  ctaButton: ButtonSchema.shape,
})

export type Cta = validator.infer<typeof CtaSchema>
