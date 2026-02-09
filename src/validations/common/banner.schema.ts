/*
 * banner.schema.ts
 * Created by Noman Jawad
 * Copyright (c) 2025 skytech_solutions
 * All rights reserved
 */

import { imageValidator, validator } from "@libs"
import { ButtonSchema } from "@validations"

export const BannerSchema = validator.object({
  title: validator.string("Title should be a string"),
  description: validator.string("Description should be a string").optional(),
  backgroundImageUrl: imageValidator.optional(),
  heroImageUrl: imageValidator.optional(),
  button: ButtonSchema.optional(),
})

export type Banner = validator.infer<typeof BannerSchema>
