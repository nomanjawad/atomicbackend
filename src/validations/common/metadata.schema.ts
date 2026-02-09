/*
 * metadata.schema.ts
 * Created by Dewan Meadown
 * meadown-frontend-nextJs-typescript
 * Copyright (c) 2025 dewan_meadown
 * All rights reserved
 */

import { validator } from "@libs"

export const MetadataSchema = validator.object({
  id: validator.uuid().optional(),
  metaTitle: validator
    .string()
    .max(60, "Meta title length maximum 60")
    .optional(),
  metaDescription: validator
    .string()
    .max(160, "Meta title length maximum 160")
    .optional()
})

export type MetaData = validator.infer<typeof MetadataSchema>
