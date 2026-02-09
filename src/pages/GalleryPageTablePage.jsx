import React from "react"
import MasterLayout from "../masterLayout/MasterLayout"
import Breadcrumb from "../components/Breadcrumb"
import GalleryPageTable from "../components/GalleryPageTable"

const GalleryPageTablePage = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Gallery Pages" />
      <GalleryPageTable />
    </MasterLayout>
  )
}

export default GalleryPageTablePage
