import React from "react"
import MasterLayout from "../masterLayout/MasterLayout"
import Breadcrumb from "../components/Breadcrumb"
import IndustriesPageForm from "../components/IndustriesPageForm"

const IndustriesPageFormPage = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Industries Page Form" />
      <IndustriesPageForm />
    </MasterLayout>
  )
}

export default IndustriesPageFormPage
