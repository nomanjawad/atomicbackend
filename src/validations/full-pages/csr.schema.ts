/*
 * csr.schema.ts
 * Created by Noman E Jawad
 * Copyright (c) 2025 skytech_solutions
 * All rights reserved
 */

import { imageValidator, validator } from "@libs"
import {
  BannerSchema,
  ListSchema,
  ContentBoxSchema,
  CounterSchema,
} from "@validations"

export const CsrSchema = validator.object({
  id: validator.uuid().optional(),
  tags: validator.string().array().optional(),
  slug: validator.url("Slug should be a valid URL"),
  title: validator.string("Title should be a string"),
  banner: BannerSchema,
  vision: {
    imageUrl: imageValidator,
    title: validator.string("Title should be a string"),
    description: validator.string("Description should be a string"),
    list: validator.array(ListSchema),
  },
  csrInitiative: {
    title: validator.string("Title should be a string"),
    item: validator.array(ContentBoxSchema),
  },
  workerEmpowerment: {
    title: validator.string("Title should be a string"),
    description: validator.string("Description should be a string"),
    list: validator.array(ListSchema),
    counters: validator.array(CounterSchema),
  },
})

export type Csr = validator.infer<typeof CsrSchema>
