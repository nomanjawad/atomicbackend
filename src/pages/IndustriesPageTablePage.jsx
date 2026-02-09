import React from "react"
import MasterLayout from "../masterLayout/MasterLayout"
import Breadcrumb from "../components/Breadcrumb"
import IndustriesPageTable from "../components/IndustriesPageTable"

const IndustriesPageTablePage = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Industries Pages" />
      <IndustriesPageTable />
    </MasterLayout>
  )
}

export default IndustriesPageTablePage
