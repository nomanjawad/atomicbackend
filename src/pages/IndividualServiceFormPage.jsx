import React from "react"
import MasterLayout from "../masterLayout/MasterLayout"
import Breadcrumb from "../components/Breadcrumb"
import IndividualServiceForm from "../components/IndividualServiceForm"

const IndividualServiceFormPage = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Individual Service Form" />
      <IndividualServiceForm />
    </MasterLayout>
  )
}

export default IndividualServiceFormPage
