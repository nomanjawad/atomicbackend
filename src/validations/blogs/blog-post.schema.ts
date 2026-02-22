/*
 * blog-post.schema.ts
 * @atomictemplate/validations
 */

import { validator, slugValidator } from "../validator"
import { AuthorSchema } from "../common/author.schema"
import { MetadataSchema } from "../common/metadata.schema"

export const BlogPostSchema = validator.object({
  id: validator.string().uuid().optional(),
  title: validator.string().min(5, "Title must be at least 5 characters"),
  slug: slugValidator,
  content: validator.string(),
  tags: validator.array(validator.string()),
  status: validator.enum(["draft", "published", "archived"]).default("draft"),
  metadata: MetadataSchema,
  author: AuthorSchema,
  createdAt: validator.coerce.date().optional(),
  updatedAt: validator.coerce.date().optional(),
})

export const BlogPostPreviewSchema = BlogPostSchema.pick({
  title: true,
  content: true,
})

export type BlogPost = validator.infer<typeof BlogPostSchema>
export type BlogPostPreview = validator.infer<typeof BlogPostPreviewSchema>
