import React from "react"
import MasterLayout from "../masterLayout/MasterLayout"
import Breadcrumb from "../components/Breadcrumb"
import AboutPageTable from "../components/AboutPageTable"

const AboutPageTablePage = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="About Page Table" />
      <AboutPageTable />
    </MasterLayout>
  )
}

export default AboutPageTablePage
