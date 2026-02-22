/*
 * form.schema.ts
 * @atomictemplate/validations
 */

import { validator } from "../validator"

export const FormFieldSchema = validator.object({
  fieldName: validator.string().min(1, "Field name is required"),
  fieldType: validator.string().min(1, "Field type is required"),
  fieldLabel: validator.string().optional(),
  isRequired: validator.boolean().optional(),
  placeholder: validator.string().optional(),
})

export const FormSchema = validator.object({
  formId: validator.string().min(1, "Form ID is required"),
  formName: validator.string().min(1, "Form name is required"),
  formFields: validator.array(validator.array(FormFieldSchema)),
  submitButtonText: validator.string().min(1, "Submit button text is required"),
})

export type FormField = validator.infer<typeof FormFieldSchema>
export type Form = validator.infer<typeof FormSchema>
