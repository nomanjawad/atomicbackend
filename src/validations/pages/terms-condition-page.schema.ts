/*
 * terms-condition-page.schema.ts
 * @atomictemplate/validations
 */

import { validator } from "../validator"

export const TermsConditionListItemSchema = validator.object({
  listTitle: validator.string().optional(),
  description: validator.string(),
})

export const TermsConditionSectionSchema = validator.object({
  title: validator.string(),
  subtitle: validator.string().optional(),
  description: validator.string().optional(),
  list: validator.array(TermsConditionListItemSchema).optional(),
  summary: validator.string().optional(),
})

export const TermsConditionPageSchema = validator.object({
  title: validator.string(),
  lastUpdated: validator.string(),
  introduction: validator.string(),
  sections: validator.array(TermsConditionSectionSchema),
  contactInfo: validator.object({
    companyName: validator.string(),
    licenseNo: validator.string(),
    phone: validator.string(),
    mobile: validator.string(),
    email: validator.string(),
    website: validator.string(),
  }),
})

export type TermsConditionListItem = validator.infer<typeof TermsConditionListItemSchema>
export type TermsConditionSection = validator.infer<typeof TermsConditionSectionSchema>
export type TermsConditionPage = validator.infer<typeof TermsConditionPageSchema>
