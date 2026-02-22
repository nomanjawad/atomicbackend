/*
 * author.schema.ts
 * @atomictemplate/validations
 */

import { validator, imageValidator } from "../validator"

export const AuthorSchema = validator.object({
  id: validator.string().uuid().optional(),
  name: validator.string().min(2, "Author name too short"),
  email: validator.string().email("Must be a valid email"),
  bio: validator.string().max(500).optional(),
  avatarUrl: imageValidator.optional(),
})

export type Author = validator.infer<typeof AuthorSchema>
