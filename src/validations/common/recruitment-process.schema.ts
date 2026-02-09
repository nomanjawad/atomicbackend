/*
 * recruitment-process.schema.ts
 * Created by Noman Jawad
 * Copyright (c) 2025 skytech_solutions
 * All rights reserved
 */

import { validator } from "@libs"
import { ButtonSchema, ContentBoxSchema } from "@validations"

export const RecruitmentProcessSchema = validator.object({
  title: validator.string("Title should be a string"),
  description: validator.string("Description should be a string"),
  button: ButtonSchema.shape,
  steps: validator.array(ContentBoxSchema),
})

export type RecruitmentProcess = validator.infer<
  typeof RecruitmentProcessSchema
>
