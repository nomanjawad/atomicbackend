/*
 * banner.schema.ts
 * @atomictemplate/validations
 */

import { validator, imageValidator } from "../validator"
import { ButtonSchema } from "./button.schema"

export const BannerSchema = validator.object({
  title: validator.string().min(1, "Title is required"),
  description: validator.string().optional(),
  backgroundImageUrl: imageValidator.optional(),
  heroImageUrl: imageValidator.optional(),
  button: ButtonSchema.optional(),
})

export type Banner = validator.infer<typeof BannerSchema>
