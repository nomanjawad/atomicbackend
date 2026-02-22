/*
 * gallery-page.schema.ts
 * @atomictemplate/validations
 */

import { validator } from "../validator"
import { BannerSchema } from "../common/banner.schema"

export const GalleryPageSchema = validator.object({
  slug: validator.string(),
  title: validator.string(),
  banner: BannerSchema,
  gallery: validator.object({
    title: validator.string(),
    description: validator.string(),
    images: validator.array(validator.string()),
  }),
})

export type GalleryPage = validator.infer<typeof GalleryPageSchema>
