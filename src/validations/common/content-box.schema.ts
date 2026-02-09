/*
 * content-box.schema.ts
 * Created by Noman Jawad
 * Copyright (c) 2025 skytech_solutions
 * All rights reserved
 */

import { imageValidator, validator } from "@libs"
import { ButtonSchema } from "@validations"

export const ContentBoxSchema = validator.object({
  textHeading: validator.string("Text heading should be a string").optional(),
  iconUrl: imageValidator.optional(),
  imageUrl: imageValidator.optional(),

  title: validator.string("Title should be a string"),
  content: validator.string("Content should be a string").optional(),

  button: ButtonSchema.optional(),
  linkUrl: validator.url("Link URL should be a valid URL").optional(),
})

export type ContentBox = validator.infer<typeof ContentBoxSchema>
