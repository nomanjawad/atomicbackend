import React from "react"
import MasterLayout from "../masterLayout/MasterLayout"
import Breadcrumb from "../components/Breadcrumb"
import BlogPostTable from "../components/BlogPostTable"

const BlogPostTablePage = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Blog Posts" />
      <BlogPostTable />
    </MasterLayout>
  )
}

export default BlogPostTablePage
