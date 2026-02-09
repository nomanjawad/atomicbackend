import React from "react"
import MasterLayout from "../masterLayout/MasterLayout"
import Breadcrumb from "../components/Breadcrumb"
import BlogPostForm from "../components/BlogPostForm"

const BlogPostFormPage = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Blog Post Form" />
      <BlogPostForm />
    </MasterLayout>
  )
}

export default BlogPostFormPage
