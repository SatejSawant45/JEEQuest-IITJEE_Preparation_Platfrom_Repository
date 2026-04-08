import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminSidebar from '@/components/AdminSidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  FileText, 
  Video, 
  TrendingUp,
  BookOpen,
  MessageSquare,
  BarChart3,
  FileQuestion,
  Bell,
  UserCircle,
  Edit,
  Trash2,
  Search
} from 'lucide-react'

export default function Dashboard() {
  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL
  const profilePicture = localStorage.getItem('profilePicture') || localStorage.getItem('avatar')
  const resolvedProfilePicture =
    profilePicture && !profilePicture.startsWith('http')
      ? `${primaryBackendUrl}${profilePicture}`
      : profilePicture
  const userName = localStorage.getItem('name') || 'Admin'
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeQuizzes: 0,
    lectures: 0,
    avgScore: 0
  })
  const [quizzes, setQuizzes] = useState([])
  const [lectures, setLectures] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwtToken')
      
      console.log('🔍 Checking token:', token ? `Token exists (${token.substring(0, 20)}...)` : 'No token found')
      
      if (!token) {
        console.warn('⚠️ No JWT token found. User may need to login.')
        setLoading(false)
        return
      }
      
      console.log('📡 Fetching quizzes with token...')
      
      // Fetch quizzes
      const quizzesRes = await fetch(`${primaryBackendUrl}/api/quiz`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      console.log('📊 Quiz response status:', quizzesRes.status)
      
      if (quizzesRes.status === 401) {
        console.error('❌ Token validation failed on server')
        console.log('🔑 Current token:', token)
        alert('Your session has expired. Please login again.')
        localStorage.clear()
        window.location.href = '/admin/login'
        return
      }
      
      const quizzesData = await quizzesRes.json().catch(() => ({ quizzes: [] }))
      
      // Fetch lectures
      const lecturesRes = await fetch(`${primaryBackendUrl}/api/lectures`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      const lecturesData = await lecturesRes.json().catch(() => ({ lectures: [] }))
      
      setQuizzes(quizzesData.quizzes || [])
      setLectures(lecturesData.lectures || [])
      
      // Calculate stats
      setStats({
        totalStudents: 1240, // Mock data - replace with actual API
        activeQuizzes: (quizzesData.quizzes || []).length,
        lectures: (lecturesData.lectures || []).length,
        avgScore: 73 // Mock data - replace with actual API
      })
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your IIT JEE platform content, students, and communications.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Welcome back,</span>
                <span className="font-semibold text-gray-900">
                  {localStorage.getItem('name') || 'Admin'}
                </span>
                <Link
                  to="/admin/profile"
                  className="hover:opacity-90 transition-opacity"
                  title="Open profile"
                >
                  <Avatar className="w-10 h-10 border border-indigo-200">
                    <AvatarImage src={resolvedProfilePicture || '/placeholder.svg'} alt={userName} />
                    <AvatarFallback className="bg-indigo-600 text-white font-bold">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Quizzes</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeQuizzes}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Lectures</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.lectures}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg. Score</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.avgScore}%</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quiz Management */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Quiz Management</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                        {stats.activeQuizzes} Active
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Create, edit, and manage quizzes across Physics, Chemistry, and Mathematics for...
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Avg. 30 Qs</span>
                      <span>•</span>
                      <span>3 Subjects</span>
                    </div>
                  </div>
                </div>
                <Link
                  to="/admin/quizzes"
                  className="mt-4 w-full block text-center bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Manage Quizzes
                </Link>
              </div>

              {/* Inbox & Calls */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Inbox & Calls</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                        12 New
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Respond to student queries, manage mentor communications, and schedule...
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Real-time</span>
                      <span>•</span>
                      <span>Active</span>
                    </div>
                  </div>
                </div>
                <Link
                  to="/admin/dashboard/chats"
                  className="mt-4 w-full block text-center bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Open Inbox
                </Link>
              </div>

              {/* Video Lectures */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Video className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Video Lectures</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                        {stats.lectures} Published
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload and organize video lectures for students with chapter-wise breakdown...
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>60-90min</span>
                      <span>•</span>
                      <span>HD Quality</span>
                    </div>
                  </div>
                </div>
                <Link
                  to="/admin/lectures"
                  className="mt-4 w-full block text-center bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Manage Lectures
                </Link>
              </div>

              {/* Analytics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Analytics</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                        Live
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Track student performance, quiz completion rates, and identify areas...
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Real-time</span>
                      <span>•</span>
                      <span>Detailed</span>
                    </div>
                  </div>
                </div>
                <button
                  className="mt-4 w-full text-center bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  View Analytics
                </button>
              </div>

              {/* Profile */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UserCircle className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Profile</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                        Editable
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Update your name, title, company, contact links, avatar, and description.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Admin-only</span>
                      <span>•</span>
                      <span>Secure</span>
                    </div>
                  </div>
                </div>
                <Link
                  to="/admin/profile"
                  className="mt-4 w-full block text-center bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Edit Profile
                </Link>
              </div>

              {/* Question Bank */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileQuestion className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Question Bank</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded-full font-medium">
                        500+ Qs
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Curate and organize questions by topic, difficulty, and previous year appearances.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Tagged</span>
                      <span>•</span>
                      <span>Categorized</span>
                    </div>
                  </div>
                </div>
                <button
                  className="mt-4 w-full text-center bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Manage Questions
                </button>
              </div>

              {/* Announcements */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Announcements</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                        3 Pending
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Publish announcements, study tips, and important updates for all enrolled...
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Push Notify</span>
                      <span>•</span>
                      <span>All Students</span>
                    </div>
                  </div>
                </div>
                <button
                  className="mt-4 w-full text-center bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Post Update
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
