/*
 * author.schema.ts
 * Created by Dewan Meadown
 * meadown-frontend-nextJs-typescript
 * Copyright (c) 2025 dewan_meadown
 * All rights reserved
 */

import { imageValidator, validator } from "@libs"

export const AuthorSchema = validator.object({
  id: validator.uuid().optional(),
  name: validator.string().min(2, "Author name too short"),
  email: validator.email(),
  bio: validator.string().max(500).optional(),
  avatarUrl: imageValidator.optional(),
})

export type Author = validator.infer<typeof AuthorSchema>
