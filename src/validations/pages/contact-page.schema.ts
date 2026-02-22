/*
 * contact-page.schema.ts
 * @atomictemplate/validations
 */

import { validator } from "../validator"

export const ContactInfoSchema = validator.object({
  icon: validator.string(),
  label: validator.string(),
  value: validator.string(),
  href: validator.string().optional(),
})

export const ContactFormFieldSchema = validator.object({
  name: validator.string(),
  label: validator.string(),
  type: validator.enum(["text", "email", "tel", "textarea"]),
  placeholder: validator.string(),
  required: validator.boolean(),
  rows: validator.number().optional(),
})

export const ContactPageSchema = validator.object({
  hero: validator.object({
    title: validator.string(),
    subtitle: validator.string(),
    description: validator.string(),
  }),
  contactInfo: validator.array(ContactInfoSchema),
  form: validator.object({
    title: validator.string(),
    description: validator.string(),
    fields: validator.array(ContactFormFieldSchema),
    submitButton: validator.string(),
  }),
  map: validator
    .object({
      title: validator.string(),
      embedUrl: validator.string(),
    })
    .optional(),
})

export type ContactInfo = validator.infer<typeof ContactInfoSchema>
export type ContactFormField = validator.infer<typeof ContactFormFieldSchema>
export type ContactPage = validator.infer<typeof ContactPageSchema>
