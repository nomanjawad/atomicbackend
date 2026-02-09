/*
 * button.schema.ts
 * Created by Noman Jawad
 * Copyright (c) 2025 skytech_solutions
 * All rights reserved
 */

import { validator } from "@libs";

export const ButtonSchema = validator.object({
  text: validator.string("Button text should be a string"),
  url: validator.url("Button URL should be a valid URL"),
});

export type Button = validator.infer<typeof ButtonSchema>;
