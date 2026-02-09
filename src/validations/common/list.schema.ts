/*
 * list.schema.ts
 * Created by Noman Jawad
 * Copyright (c) 2025 skytech_solutions
 * All rights reserved
 */

import { imageValidator, validator } from "@libs"

export const ListSchema = validator.object({
  icon: imageValidator.optional(),
  title: validator.string("Title should be a string"),
})
