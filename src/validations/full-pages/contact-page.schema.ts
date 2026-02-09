/*
 * contact-page.schema.ts
 * Created by Noman Jawad
 * Copyright (c) 2025 skytech_solutions
 * All rights reserved
 */

import { imageValidator, validator } from "@libs"
import { BannerSchema, FormSchema } from "@validations"

export const ContactPageSchema = validator.object({
  id: validator.uuid().optional(),
  tags: validator.string().array().optional(),
  slug: validator.url("Slug should be a valid URL"),
  title: validator.string("Title should be a string"),
  banner: BannerSchema.shape,
  formRow: validator.object({
    title: validator.string("Title should be a string"),
    list: validator
      .object({
        text: validator.string("Text should be a string"),
        icon: imageValidator,
      })
      .array(),
    image: imageValidator.optional(),
    form: FormSchema.shape,
  }),
  map: imageValidator,
})

export type ContactPage = validator.infer<typeof ContactPageSchema>
