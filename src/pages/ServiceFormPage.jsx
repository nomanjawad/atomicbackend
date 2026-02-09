import React from "react"
import MasterLayout from "../masterLayout/MasterLayout"
import Breadcrumb from "../components/Breadcrumb"
import ServiceForm from "../components/ServiceForm"

const ServiceFormPage = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Services Page Form" />
      <ServiceForm />
    </MasterLayout>
  )
}

export default ServiceFormPage
