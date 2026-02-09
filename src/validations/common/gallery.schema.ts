/*
 * gallery.schema.ts
 * Created by Noman Jawad
 * Copyright (c) 2025 skytech_solutions
 * All rights reserved
 */

import { imageValidator, validator } from "@libs"

export const GallerySchema = validator
  .object({
    caption: validator.string().optional(),
    image: imageValidator,
  })
  .array()
  .min(1, "At least one image is required")

export type Gallery = validator.infer<typeof GallerySchema>
