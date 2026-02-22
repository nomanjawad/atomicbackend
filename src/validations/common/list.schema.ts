/*
 * list.schema.ts
 * @atomictemplate/validations
 */

import { validator, imageValidator } from "../validator"

export const ListItemSchema = validator.object({
  icon: imageValidator.optional(),
  title: validator.string().min(1, "Title is required"),
})

export const ListSchema = validator.array(ListItemSchema)

export type ListItem = validator.infer<typeof ListItemSchema>
export type List = validator.infer<typeof ListSchema>
