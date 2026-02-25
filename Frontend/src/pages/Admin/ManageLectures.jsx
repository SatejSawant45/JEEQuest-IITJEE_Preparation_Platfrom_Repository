import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminSidebar from '@/components/AdminSidebar'
import { Search, Plus, Edit, Trash2, Video, Clock, Users } from 'lucide-react'

export default function ManageLectures() {
  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL
  const [lectures, setLectures] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [filterSubject, setFilterSubject] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchLectures()
  }, [])

  const fetchLectures = async () => {
    try {
      const token = localStorage.getItem('jwtToken')
      
      if (!token) {
        console.warn('⚠️ No JWT token found. User may need to login.')
        setLoading(false)
        return
      }

      const response = await fetch(`${primaryBackendUrl}/api/lectures`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      })

      if (response.status === 401) {
        console.error('❌ Unauthorized - Token may be expired. Please login again.')
        alert('Your session has expired. Please login again.')
        localStorage.clear()
        window.location.href = '/admin/login'
        return
      }

      if (response.ok) {
        const data = await response.json()
        setLectures(data.lectures || [])
      } else {
        console.error('❌ Failed to fetch lectures:', response.status)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching lectures:', error)
      setLoading(false)
    }
  }

  const handleDelete = async (lectureId) => {
    if (!confirm('Are you sure you want to delete this lecture?')) return

    try {
      const token = localStorage.getItem('jwtToken')
      const response = await fetch(`${primaryBackendUrl}/api/lectures/${lectureId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      })

      if (response.ok) {
        alert('✅ Lecture deleted successfully')
        fetchLectures()
      } else {
        alert('❌ Failed to delete lecture')
      }
    } catch (error) {
      console.error('Error deleting lecture:', error)
      alert('❌ Error deleting lecture')
    }
  }

  const filteredLectures = lectures.filter(lecture => {
    const matchesSearch = lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lecture.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = filterSubject === 'all' || lecture.subject === filterSubject
    const matchesStatus = filterStatus === 'all' || (lecture.status || 'published') === filterStatus
    return matchesSearch && matchesSubject && matchesStatus
  })

  const getSubjectColor = (subject) => {
    switch (subject) {
      case 'Physics':
        return 'bg-blue-100 text-blue-700'
      case 'Chemistry':
        return 'bg-green-100 text-green-700'
      case 'Mathematics':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700'
      case 'draft':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-green-100 text-green-700'
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Lectures</h1>
              <p className="text-sm text-gray-500 mt-1">
                Upload and organize video lectures with chapter-wise breakdown
              </p>
            </div>
            <Link
              to="/admin/lecture/create"
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Create Lecture
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search lectures..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterSubject('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterSubject === 'all'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Subjects
                </button>
                <button
                  onClick={() => setFilterSubject('Physics')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterSubject === 'Physics'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Physics
                </button>
                <button
                  onClick={() => setFilterSubject('Chemistry')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterSubject === 'Chemistry'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Chemistry
                </button>
                <button
                  onClick={() => setFilterSubject('Mathematics')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterSubject === 'Mathematics'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Mathematics
                </button>
                <div className="border-l border-gray-300 mx-2"></div>
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => setFilterStatus('published')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === 'published'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Published
                </button>
                <button
                  onClick={() => setFilterStatus('draft')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === 'draft'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Draft
                </button>
              </div>
            </div>
          </div>

          {/* Lectures Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="text-gray-500 mt-4">Loading lectures...</p>
            </div>
          ) : filteredLectures.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No lectures found</p>
              <p className="text-sm text-gray-500">Create your first lecture to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLectures.map((lecture) => (
                <div
                  key={lecture._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={lecture.thumbnail}
                      alt={lecture.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder.svg?height=200&width=300'
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(lecture.status || 'published')}`}>
                        {lecture.status || 'published'}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                      <Video className="w-12 h-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2 flex-1">
                        {lecture.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSubjectColor(lecture.subject)}`}>
                        {lecture.subject}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {lecture.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{lecture.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{lecture.enrolled || 0} enrolled</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/admin/lecture/${lecture._id}/edit`}
                        className="flex-1 text-center text-sm bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(lecture._id)}
                        className="text-sm bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
