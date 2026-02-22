/*
 * button.schema.ts
 * @atomictemplate/validations
 */

import { validator } from "../validator"

export const ButtonSchema = validator.object({
  text: validator.string().min(1, "Button text is required"),
  url: validator.string().url("Button URL must be a valid URL"),
})

export type Button = validator.infer<typeof ButtonSchema>
