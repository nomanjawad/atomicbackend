/*
 * faq.schema.ts
 * Created by Noman Jawad
 * Copyright (c) 2025 skytechSolutions
 * All rights reserved
 */

import { validator } from "@libs"

export const FAQSchema = validator.object({
  title: validator.string("Title should be a string").optional(),
  description: validator.string("Description should be a string").optional(),
  items: validator
    .object({
      question: validator.string("Question should be a string"),
      answer: validator.string("Answer should be a string"),
    })
    .array(),
})

export type FAQ = validator.infer<typeof FAQSchema>
