/*
 * @atomictemplate/validations
 * Shared Zod validation schemas for AtomicTemplate frontend and backend
 * 
 * Usage:
 * import { HomePageSchema, BlogPostSchema, validator } from '@atomictemplate/validations'
 * 
 * // Validate data
 * const validData = HomePageSchema.parse(data)
 * 
 * // Safe parse with error handling
 * const result = BlogPostSchema.safeParse(data)
 * if (result.success) {
 *   console.log(result.data)
 * } else {
 *   console.log(result.error.issues)
 * }
 */

// Core validator (Zod wrapper)
export {
  validator,
  imageValidator,
  urlValidator,
  emailValidator,
  uuidValidator,
  slugValidator,
  phoneValidator,
} from "./validator"

// Re-export zod for direct access if needed
export { z } from "zod"

// Common schemas
export * from "./common"

// Page schemas
export * from "./pages"

// Blog schemas
export * from "./blogs"
