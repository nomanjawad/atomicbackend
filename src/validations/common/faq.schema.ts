/*
 * faq.schema.ts
 * @atomictemplate/validations
 */

import { validator } from "../validator"

export const FAQItemSchema = validator.object({
  question: validator.string().min(1, "Question is required"),
  answer: validator.string().min(1, "Answer is required"),
})

export const FAQSchema = validator.object({
  title: validator.string().optional(),
  description: validator.string().optional(),
  items: validator.array(FAQItemSchema),
})

export type FAQItem = validator.infer<typeof FAQItemSchema>
export type FAQ = validator.infer<typeof FAQSchema>
