/*
 * form.schema.ts
 * Created by Noman Jawad
 * Copyright (c) 2025 skytech_solutions
 * All rights reserved
 */

import { validator } from "@libs"

export const FormSchema = validator.object({
  formId: validator.string("Form ID should be a string"),
  formName: validator.string("Form name should be a string"),
  formFields: validator.array(
    validator
      .object({
        fieldName: validator.string("Field name should be a string"),
        fieldType: validator.string("Field type should be a string"),
        fieldLabel: validator
          .string("Field label should be a string")
          .optional(),
        isRequired: validator
          .boolean("isRequired should be a boolean")
          .optional(),
        placeholder: validator
          .string("Placeholder should be a string")
          .optional(),
      })
      .array()
  ),
  submitButtonText: validator.string("Submit button text should be a string"),
})

export type Form = validator.infer<typeof FormSchema>
