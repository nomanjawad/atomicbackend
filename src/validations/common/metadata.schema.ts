/*
 * metadata.schema.ts
 * @atomictemplate/validations
 */

import { validator } from "../validator"

export const MetadataSchema = validator.object({
  id: validator.string().uuid().optional(),
  metaTitle: validator
    .string()
    .max(60, "Meta title maximum 60 characters")
    .optional(),
  metaDescription: validator
    .string()
    .max(160, "Meta description maximum 160 characters")
    .optional(),
})

export type MetaData = validator.infer<typeof MetadataSchema>
