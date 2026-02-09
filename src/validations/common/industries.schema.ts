/*
 * industry.schema.ts
 * Created by Noman Jawad
 * Copyright (c) 2025 skytech_solutions
 * All rights reserved
 */

import { imageValidator, validator } from "@libs"
import { ButtonSchema, CounterSchema, ListSchema } from "@validations"

const IndustriesItemSchema = validator.object({
  title: validator.string("Title should be a string"),
  description: validator.string("Description should be a string"),
  list: validator.array(ListSchema).optional(),
  imageUrl: imageValidator.optional(),
  iconUrl: imageValidator.optional(),
  counter: validator.array(CounterSchema),
})

export const IndustrySchema = validator.object({
  title: validator.string("Title should be a string"),
  button: ButtonSchema.optional(),
  items: validator.array(IndustriesItemSchema).optional(),
})

export type Industry = validator.infer<typeof IndustrySchema>
