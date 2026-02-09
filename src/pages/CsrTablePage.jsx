import React from "react"
import MasterLayout from "../masterLayout/MasterLayout"
import Breadcrumb from "../components/Breadcrumb"
import CsrTable from "../components/CsrTable"

const CsrTablePage = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="CSR Initiatives" />
      <CsrTable />
    </MasterLayout>
  )
}

export default CsrTablePage
