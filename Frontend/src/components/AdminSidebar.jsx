import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Video,
  MessageSquare,
  Inbox,
  Bell,
  GraduationCap,
  UserCircle,
  ChevronDown,
  ChevronRight,
  LogOut
} from 'lucide-react'

export default function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [openSections, setOpenSections] = useState({
    management: true,
    communication: false
  })

  const adminName = localStorage.getItem('name') || 'Admin'
  const adminEmail = localStorage.getItem('email') || 'admin@quizmaster.com'

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/admin/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="w-64 bg-gray-950 text-white h-screen flex flex-col fixed left-0 top-0 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">QuizMaster</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {/* Dashboard */}
        <Link
          to="/admin/dashboard"
          className={`flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-colors ${
            isActive('/admin/dashboard') ? 'bg-slate-800 border-l-4 border-indigo-500' : ''
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>

        {/* Content Management */}
        <div className="mt-6">
          <div className="px-6 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Content
          </div>
          
          <button
            onClick={() => toggleSection('management')}
            className="w-full flex items-center justify-between px-6 py-3 hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5" />
              <span>Management</span>
            </div>
            {openSections.management ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {openSections.management && (
            <div className="bg-slate-800/50">
              <Link
                to="/admin/quizzes"
                className={`flex items-center gap-3 px-12 py-2 hover:bg-slate-800 transition-colors text-sm ${
                  isActive('/admin/quizzes') ? 'text-indigo-400' : 'text-slate-300'
                }`}
              >
                Manage Quizzes
              </Link>
              <Link
                to="/admin/lectures"
                className={`flex items-center gap-3 px-12 py-2 hover:bg-slate-800 transition-colors text-sm ${
                  isActive('/admin/lectures') ? 'text-indigo-400' : 'text-slate-300'
                }`}
              >
                Manage Lectures
              </Link>
              <Link
                to="/admin/questions"
                className={`flex items-center gap-3 px-12 py-2 hover:bg-slate-800 transition-colors text-sm ${
                  isActive('/admin/questions') ? 'text-indigo-400' : 'text-slate-300'
                }`}
              >
                Question Bank
              </Link>
              <Link
                to="/admin/profile"
                className={`flex items-center gap-3 px-12 py-2 hover:bg-slate-800 transition-colors text-sm ${
                  isActive('/admin/profile') ? 'text-indigo-400' : 'text-slate-300'
                }`}
              >
                Edit Profile
              </Link>
              <Link
                to="/admin/blogs"
                className={`flex items-center gap-3 px-12 py-2 hover:bg-slate-800 transition-colors text-sm ${
                  isActive('/admin/blogs') ? 'text-indigo-400' : 'text-slate-300'
                }`}
              >
                Study Blogs
              </Link>
            </div>
          )}

          <Link
            to="/admin/video-lectures"
            className={`flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-colors ${
              isActive('/admin/video-lectures') ? 'bg-slate-800 border-l-4 border-indigo-500' : ''
            }`}
          >
            <Video className="w-5 h-5" />
            <span>Video Lectures</span>
          </Link>
        </div>

        {/* Communication */}
        <div className="mt-6">
          <div className="px-6 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Communication
          </div>

          <button
            onClick={() => toggleSection('communication')}
            className="w-full flex items-center justify-between px-6 py-3 hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </div>
            {openSections.communication ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {openSections.communication && (
            <div className="bg-slate-800/50">
              <Link
                to="/admin/dashboard/chats"
                className={`flex items-center gap-3 px-12 py-2 hover:bg-slate-800 transition-colors text-sm ${
                  isActive('/admin/dashboard/chats') ? 'text-indigo-400' : 'text-slate-300'
                }`}
              >
                Inbox & Calls
              </Link>
              <Link
                to="/admin/announcements"
                className={`flex items-center gap-3 px-12 py-2 hover:bg-slate-800 transition-colors text-sm ${
                  isActive('/admin/announcements') ? 'text-indigo-400' : 'text-slate-300'
                }`}
              >
                Announcements
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-slate-700 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">{adminName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{adminName}</p>
            <p className="text-xs text-slate-400 truncate">{adminEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
