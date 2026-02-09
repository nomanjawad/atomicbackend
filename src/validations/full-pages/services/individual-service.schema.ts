/*
 * individual-service.schema.ts
 * Created by Noman Jawad
 * Copyright (c) 2025 skytech_solutions
 * All rights reserved
 */

import { validator } from "@libs"

import { BannerSchema, ContentBoxSchema } from "@validations"

export const IndividualServiceSchema = validator.object({
  id: validator.uuid().optional(),
  iconUrl: validator.string().optional(),
  tags: validator.string().array().optional(),
  slug: validator.string("Slug should be a string"),
  title: validator.string("Title should be a string"),
  description: validator.string("Description should be a string"),
  banner: BannerSchema,
  subService: validator.object({
    title: validator.string("Title should be a string"),
    description: validator.string("Description should be a string"),
    services: validator.array(ContentBoxSchema),
  }),
})

export type IndividualService = validator.infer<typeof IndividualServiceSchema>
