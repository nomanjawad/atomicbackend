import React from "react"
import MasterLayout from "../masterLayout/MasterLayout"
import Breadcrumb from "../components/Breadcrumb"
import ContactPageForm from "../components/ContactPageForm"

const ContactPageFormPage = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Contact Page Form" />
      <ContactPageForm />
    </MasterLayout>
  )
}

export default ContactPageFormPage
