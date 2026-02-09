/*
 * industries-page.schema.ts
 * Created by Noman Jawad
 * Copyright (c) 2025 skytech_solutions
 * All rights reserved
 */

import { validator } from "@libs"
import { BannerSchema, IndustrySchema } from "@validations"

export const IndustriesPageSchema = validator.object({
  id: validator.uuid().optional(),
  tags: validator.string().array().optional(),
  slug: validator.string("Slug should be a string"),
  title: validator.string("Title should be a string"),
  banner: BannerSchema,
  industries: IndustrySchema,
})

export type IndustriesPage = validator.infer<typeof IndustriesPageSchema>
