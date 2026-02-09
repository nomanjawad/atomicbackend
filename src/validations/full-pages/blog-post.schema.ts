/*
 * blog-post.ts
 * Created by Dewan Meadown
 * meadown-frontend-nextJs-typescript
 * Copyright (c) 2025 dewan_meadown
 * All rights reserved
 */

import { validator } from "@libs"

import { AuthorSchema, MetadataSchema } from "@validations"

export const BlogPostSchema = validator.object({
  id: validator.uuid().optional(),
  title: validator.string().min(5, "Title must be at least 5 characters"),
  slug: validator
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be URL-friendly (kebab-case)"
    ),
  content: validator.string(),
  tags: validator.array(validator.string()),
  status: validator.enum(["draft", "published", "archived"]).default("draft"),
  metadata: MetadataSchema,
  author: AuthorSchema,
  createdAt: validator.date().optional(),
  updatedAt: validator.date().optional(),
})

export const BlogPostPreviewSchema = BlogPostSchema.pick({
  title: true,
  content: true,
})

export type BlogPost = validator.infer<typeof BlogPostSchema>
export type BlogPostPreview = validator.infer<typeof BlogPostPreviewSchema>
