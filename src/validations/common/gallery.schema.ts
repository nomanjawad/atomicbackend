/*
 * gallery.schema.ts
 * @atomictemplate/validations
 */

import { validator, imageValidator } from "../validator"

export const GalleryItemSchema = validator.object({
  caption: validator.string().optional(),
  image: imageValidator,
})

export const GallerySchema = validator
  .array(GalleryItemSchema)
  .min(1, "At least one image is required")

export type GalleryItem = validator.infer<typeof GalleryItemSchema>
export type Gallery = validator.infer<typeof GallerySchema>
