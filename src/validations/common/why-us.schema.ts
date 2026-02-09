/*
 * why-us.schema.ts
 * Created by Noman Jawad
 * Copyright (c) 2025 skytech_solutions
 * All rights reserved
 */

import { imageValidator, validator } from "@libs"
import { ButtonSchema, ContentBoxSchema } from "@validations"

export const WhyUsSchema = validator.object({
  title: validator.string("Title should be a string"),
  button: ButtonSchema.shape,
  imageUrl: imageValidator.optional(),
  items: validator.array(ContentBoxSchema),
})

export type WhyUs = validator.infer<typeof WhyUsSchema>
