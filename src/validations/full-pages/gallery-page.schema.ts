/*
 * gallery-page.schema.ts
 * Created by Noman E Jawad
 * Copyright (c) 2025 skytech_solutions
 * All rights reserved
 */

import { validator } from "@libs"
import { BannerSchema, GallerySchema } from "@validations"

export const GalleryPageSchema = validator.object({
  id: validator.uuid().optional(),
  tags: validator.string().array().optional(),
  slug: validator.url("Slug should be a valid URL"),
  title: validator.string("Title should be a string"),
  banner: BannerSchema.shape,
  gallery: {
    title: validator.string(),
    description: validator.string(),
    images: GallerySchema,
  },
})

export type GalleryPage = validator.infer<typeof GalleryPageSchema>
