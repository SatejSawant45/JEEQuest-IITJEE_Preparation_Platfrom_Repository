import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, FileText, UserCircle, LogOut, GraduationCap } from 'lucide-react'

export default function MentorSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const mentorName = localStorage.getItem('name') || 'Mentor'
  const mentorEmail = localStorage.getItem('email') || 'mentor@quizmaster.com'

  const handleLogout = () => {
    localStorage.clear()
    navigate('/mentor/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="w-64 bg-gray-950 text-white h-screen flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">QuizMaster</h1>
            <p className="text-xs text-slate-400">Mentor Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4">
        <Link
          to="/mentor/dashboard"
          className={`flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-colors ${
            isActive('/mentor/dashboard') ? 'bg-slate-800 border-l-4 border-emerald-500' : ''
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/mentor/dashboard/chats"
          className={`flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-colors ${
            isActive('/mentor/dashboard/chats') ? 'bg-slate-800 border-l-4 border-emerald-500' : ''
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Inbox & Calls</span>
        </Link>

        <Link
          to="/mentor/blogs"
          className={`flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-colors ${
            isActive('/mentor/blogs') ? 'bg-slate-800 border-l-4 border-emerald-500' : ''
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Study Blogs</span>
        </Link>

        <Link
          to="/mentor/profile"
          className={`flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-colors ${
            isActive('/mentor/profile') ? 'bg-slate-800 border-l-4 border-emerald-500' : ''
          }`}
        >
          <UserCircle className="w-5 h-5" />
          <span>Edit Profile</span>
        </Link>
      </nav>

      <div className="border-t border-slate-700 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">{mentorName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{mentorName}</p>
            <p className="text-xs text-slate-400 truncate">{mentorEmail}</p>
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
