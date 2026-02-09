import React from "react"
import MasterLayout from "../masterLayout/MasterLayout"
import Breadcrumb from "../components/Breadcrumb"
import ServicesPageTable from "../components/ServicesPageTable"

const ServicesPageTablePage = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Services Pages" />
      <ServicesPageTable />
    </MasterLayout>
  )
}

export default ServicesPageTablePage
