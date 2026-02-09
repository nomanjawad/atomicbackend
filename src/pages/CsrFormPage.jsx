import React from "react"
import MasterLayout from "../masterLayout/MasterLayout"
import Breadcrumb from "../components/Breadcrumb"
import CsrForm from "../components/CsrForm"

const CsrFormPage = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="CSR Form" />
      <CsrForm />
    </MasterLayout>
  )
}

export default CsrFormPage
