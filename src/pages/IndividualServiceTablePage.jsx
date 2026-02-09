import React from "react"
import MasterLayout from "../masterLayout/MasterLayout"
import Breadcrumb from "../components/Breadcrumb"
import IndividualServiceTable from "../components/IndividualServiceTable"

const IndividualServiceTablePage = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Individual Services" />
      <IndividualServiceTable />
    </MasterLayout>
  )
}

export default IndividualServiceTablePage
