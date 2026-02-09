import React from "react"
import MasterLayout from "../masterLayout/MasterLayout"
import Breadcrumb from "../components/Breadcrumb"
import AboutPageForm from "../components/AboutPageForm"

const AboutPageFormPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="About Page Form" />

        {/* AboutPageForm */}
        <AboutPageForm />
      </MasterLayout>
    </>
  )
}

export default AboutPageFormPage
