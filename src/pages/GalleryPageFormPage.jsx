import React from "react"
import MasterLayout from "../masterLayout/MasterLayout"
import Breadcrumb from "../components/Breadcrumb"
import GalleryPageForm from "../components/GalleryPageForm"

const GalleryPageFormPage = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Gallery Page Form" />
      <GalleryPageForm />
    </MasterLayout>
  )
}

export default GalleryPageFormPage
