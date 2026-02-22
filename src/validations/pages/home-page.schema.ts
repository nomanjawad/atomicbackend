/*
 * home-page.schema.ts
 * @atomictemplate/validations
 */

import { validator } from "../validator"
import { BannerSchema } from "../common/banner.schema"

export const HomePageSchema = validator.object({
  title: validator.string().optional(),
  banner: BannerSchema,
})

export type HomePage = validator.infer<typeof HomePageSchema>
