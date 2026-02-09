/*
 * home-page.schema.ts
 * Created by Noman Jawad
 * Copyright (c) 2025 skytechSolutions
 * All rights reserved
 */

import { imageValidator, validator } from "@libs"
import {
  BannerSchema,
  ButtonSchema,
  ContentBoxSchema,
  GallerySchema,
} from "@validations"

export const HomePageSchema = {
  id: validator.uuid("ID should be a valid UUID").optional(),
  tags: validator.string("Tags should be a string").array().optional(),
  slug: validator.url("Slug should be a valid URL"),
  title: validator.string("Title should be a string"),
  banner: BannerSchema.shape,
  journeyWithAmco: {
    item: validator.array(ContentBoxSchema),
  },
  deliverySkills: {
    title: validator.string("Title should be a string"),
    description: validator.string("Description should be a string"),
    imageUrl: imageValidator,
    floatingBox: ContentBoxSchema.shape,
  },
  trustedCompany: {
    title: validator.string("Title should be a string"),
    images: GallerySchema,
  },
  globalCertificates: {
    title: validator.string("Title should be a string"),
    description: validator.string("Description should be a string"),
    certificates: GallerySchema,
    imageUrl: imageValidator,
    button: ButtonSchema.shape,
  },
  WhatWeServe: {
    title: validator.string("Title should be a string"),
    item: validator.array(validator.string("Item should be a string")),
  },
  grabSkilledEmployees: {
    title: validator.string("Title should be a string"),
    button: ButtonSchema.shape,
  },
}
export type HomePage = validator.infer<typeof HomePageSchema>
