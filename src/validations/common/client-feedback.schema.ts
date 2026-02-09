/*
 * client-feedback.schema.ts
 * Created by Noman Jawad
 * Copyright (c) 2025 skytechSolutions
 * All rights reserved
 */

import { imageValidator, validator } from "@libs"
import { ContentBoxSchema } from "@validations"

export const ourClientFeedback = {
  title: validator.string("Title should be a string"),
  items: validator
    .object({
      clientVideo: imageValidator,
      clientName: validator.string("Client name should be a string"),
      clientPosition: validator.string("Client position should be a string"),
      clientFeedback: validator.string("Client feedback should be a string"),
      clientLogo: imageValidator,
    })
    .array(),
}
export type OurClientFeedback = validator.infer<typeof ourClientFeedback>
