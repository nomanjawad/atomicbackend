import React from "react"
import MasterLayout from "../masterLayout/MasterLayout"
import Breadcrumb from "../components/Breadcrumb"
import ContactPageTable from "../components/ContactPageTable"

const ContactPageTablePage = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Contact Page Table" />
      <ContactPageTable />
    </MasterLayout>
  )
}

export default ContactPageTablePage
