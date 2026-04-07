import MentorSidebar from '@/components/MentorSidebar'
import BloggingPlatform from '../User/Blogs'

export default function MentorBlogsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <MentorSidebar />
      <div className="flex-1 ml-64">
        <BloggingPlatform forceOwnOnly={true} embeddedInStaffLayout={true} />
      </div>
    </div>
  )
}
