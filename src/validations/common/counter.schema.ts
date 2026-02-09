/*
 * counter.schema.ts
 * Created by Noman Jawad
 * Copyright (c) 2025 skytech_solutions
 * All rights reserved
 */

import { validator } from "@libs";

export const CounterSchema = validator.object({
  label: validator.string("Label should be a string"),
  value: validator.number("Value should be a number"),
  prefix: validator.string("Prefix should be a string").optional(),
  suffix: validator.string("Suffix should be a string").optional(),
});

export type Counter = validator.infer<typeof CounterSchema>;
