/*
 * leader-talk.schema.ts
 * Created by Noman Jawad
 * Copyright (c) 2025 skytech_solutions
 * All rights reserved
 */

import { imageValidator, validator } from "@libs"

export const LeaderTalkSchema = validator.object({
  title: validator.string("Title should be a string"),
  name: validator.string("Name should be a string"),
  position: validator.string("Position should be a string"),
  message: validator.string("Message should be a string"),
  imageUrl: imageValidator.optional(),
  socialLinks: validator.url("Social Link should be a valid URL").optional(),
})

export type LeaderTalk = validator.infer<typeof LeaderTalkSchema>
