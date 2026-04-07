import { Link } from 'react-router-dom'
import { MessageSquare, Video, FileText } from 'lucide-react'
import MentorSidebar from '@/components/MentorSidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function MentorDashboard() {
  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL
  const profilePicture = localStorage.getItem('profilePicture') || localStorage.getItem('avatar')
  const resolvedProfilePicture =
    profilePicture && !profilePicture.startsWith('http')
      ? `${primaryBackendUrl}${profilePicture}`
      : profilePicture
  const userName = localStorage.getItem('name') || 'Mentor'

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MentorSidebar />

      <div className="flex-1 ml-64">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mentor Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Chat with students and handle video call feedback sessions.
                </p>
              </div>
              <Link
                to="/mentor/profile"
                className="hover:opacity-90 transition-opacity"
                title="Open profile"
              >
                <Avatar className="w-10 h-10 border border-emerald-200">
                  <AvatarImage src={resolvedProfilePicture || '/placeholder.svg'} alt={userName} />
                  <AvatarFallback className="bg-emerald-600 text-white font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </header>

        <main className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-5xl">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Student Inbox</h3>
              <p className="text-sm text-gray-600 mb-4">
                Respond to student questions and continue mentorship conversations.
              </p>
              <Link
                to="/mentor/dashboard/chats"
                className="w-full block text-center bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Open Inbox
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Video Calls</h3>
              <p className="text-sm text-gray-600 mb-4">
                Accept incoming calls and review your recent call history in inbox tabs.
              </p>
              <Link
                to="/mentor/dashboard/chats"
                className="w-full block text-center bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Open Calls
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Study Blogs</h3>
              <p className="text-sm text-gray-600 mb-4">
                Create and manage your own educational blogs for students.
              </p>
              <Link
                to="/mentor/blogs"
                className="w-full block text-center bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Open Blogs
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
