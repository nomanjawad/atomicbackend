/*
 * about-page.schema.ts
 * Created by Noman Jawad
 * Copyright (c) 2025 skytech_solutions
 * All rights reserved
 */

import { imageValidator, validator } from "@libs"
import {
  BannerSchema,
  ButtonSchema,
  ContentBoxSchema,
  GallerySchema,
  ListSchema,
} from "@validations"

export const AboutPageSchema = validator.object({
  id: validator.uuid().optional(),
  tags: validator.string().array().optional(),
  slug: validator.url("Slug should be a valid URL"),
  title: validator.string("Title should be a string"),
  banner: BannerSchema.shape,
  aboutSection: {
    topImageUrl: imageValidator,
    title: validator.string("Title should be a string"),
    description: validator.string("Description should be a string"),
    list: validator.array(ListSchema),
    button: ButtonSchema.shape,
    images: validator.array(validator.url("Images should be a valid URL")),
  },
  connectingManpowerSection: {
    title: validator.string("Title should be a string"),
    rotationText1: validator.string("Rotation Text 1 should be a string"),
    rotationText2: validator.string("Rotation Text 2 should be a string"),
    visionMission: {
      title: validator.string("Title should be a string"),
      items: validator.array(ContentBoxSchema),
    },
  },
  mapSection: {
    title: validator.string("Title should be a string"),
    mapImage: imageValidator,
  },
  certificatesSection: {
    title: validator.string("Title should be a string"),
    description: validator.string("Description should be a string"),
    imageGallery: GallerySchema,
    button: ButtonSchema.shape,
  },
  trustedCompaniesSection: {
    title: validator.string("Title should be a string"),
    logosLineOne: GallerySchema,
    logosLineTwo: GallerySchema,
  },
  socialResponsibilitySection: {
    title: validator.string("Title should be a string"),
    description: validator.string("Description should be a string"),
    image: imageValidator,
    list: validator.array(ListSchema),
    button: ButtonSchema.shape,
  },
})

export type AboutPage = validator.infer<typeof AboutPageSchema>
