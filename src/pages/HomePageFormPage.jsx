import React from "react"
import MasterLayout from "../masterLayout/MasterLayout"
import Breadcrumb from "../components/Breadcrumb"
import HomePageForm from "../components/HomePageForm"

const HomePageFormPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Home Page Form" />

        {/* HomePageForm */}
        <HomePageForm />
      </MasterLayout>
    </>
  )
}

export default HomePageFormPage
