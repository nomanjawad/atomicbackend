/*
 * services.schema.ts
 * Created by Noman Jawad
 * Copyright (c) 2025 skytech_solutions
 * All rights reserved
 */

import { validator } from "@libs"
import {
  BannerSchema,
  ContentBoxSchema,
  IndividualServiceSchema,
} from "@validations"

export const ServiceSchema = validator.object({
  id: validator.uuid().optional(),
  tags: validator.string().array().optional(),
  slug: validator.url("Slug should be a valid URL"),
  title: validator.string("Title should be a string"),
  banner: BannerSchema.shape,
  services: validator.array(IndividualServiceSchema),
  industrySection: ContentBoxSchema.optional(),
})

export type Service = validator.infer<typeof ServiceSchema>
