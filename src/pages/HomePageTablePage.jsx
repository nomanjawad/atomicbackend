import React from "react"
import MasterLayout from "../masterLayout/MasterLayout"
import Breadcrumb from "../components/Breadcrumb"
import HomePageTable from "../components/HomePageTable"

const HomePageTablePage = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Home Page Table" />
      <HomePageTable />
    </MasterLayout>
  )
}

export default HomePageTablePage
