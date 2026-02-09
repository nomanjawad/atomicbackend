/*
 * appointment-form.schema.ts
 * Created by Noman Jawad
 * Copyright (c) 2025 skytechSolutions
 * All rights reserved
 */

import { imageValidator, validator } from "@libs"
import { FormSchema } from "@validations"

export const AppointmentFormSchema = validator.object({
  imageUrl: imageValidator,
  form: FormSchema.shape,
})

export type AppointmentForm = validator.infer<typeof AppointmentFormSchema>
