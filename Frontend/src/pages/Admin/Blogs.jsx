import AdminSidebar from '@/components/AdminSidebar'
import BloggingPlatform from '../User/Blogs'

export default function AdminBlogsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <BloggingPlatform forceOwnOnly={true} embeddedInStaffLayout={true} />
      </div>
    </div>
  )
}
