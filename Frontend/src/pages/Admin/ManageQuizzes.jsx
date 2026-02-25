import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminSidebar from '@/components/AdminSidebar'
import { Search, Plus, Edit, Trash2, Clock, FileQuestion } from 'lucide-react'

export default function ManageQuizzes() {
  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL
  const [quizzes, setQuizzes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [filterSubject, setFilterSubject] = useState('all')
  
  const currentAdminId = localStorage.getItem('id') // Get current admin ID

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('jwtToken')
      
      if (!token) {
        console.warn('⚠️ No JWT token found. User may need to login.')
        setLoading(false)
        return
      }

      const response = await fetch(`${primaryBackendUrl}/api/quiz`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
        console.log('📦 Fetched quizzes data:', data)
        console.log('👤 Current admin ID:', currentAdminId)
        
        // Show all quizzes
        const allQuizzes = data.quizzes || []
        console.log('✅ All quizzes:', allQuizzes)
        
        // Log creator info for debugging
        allQuizzes.forEach(quiz => {
          const createdById = quiz.createdBy?._id || quiz.createdBy
          console.log(`Quiz "${quiz.title}" created by:`, createdById, 'Type:', typeof createdById)
          console.log('Current admin:', currentAdminId, 'Type:', typeof currentAdminId)
          console.log('Match:', String(createdById) === String(currentAdminId))
        })
        
        setQuizzes(allQuizzes)
      } else {
        console.error('❌ Failed to fetch quizzes:', response.status)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching quizzes:', error)
      setLoading(false)
    }
  }

  const handleDelete = async (quizId, quiz) => {
    // Check if current admin is the creator
    const createdById = String(quiz.createdBy?._id || quiz.createdBy)
    const currentId = String(currentAdminId)
    
    if (createdById !== currentId) {
      alert('⚠️ You can only delete quizzes created by you')
      return
    }

    if (!confirm('Are you sure you want to delete this quiz?')) return

    try {
      const token = localStorage.getItem('jwtToken')
      const response = await fetch(`${primaryBackendUrl}/api/quiz/${quizId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('✅ Quiz deleted successfully')
        fetchQuizzes()
      } else {
        alert('❌ Failed to delete quiz')
      }
    } catch (error) {
      console.error('Error deleting quiz:', error)
      alert('❌ Error deleting quiz')
    }
  }

  const canEditQuiz = (quiz) => {
    const createdById = String(quiz.createdBy?._id || quiz.createdBy)
    const currentId = String(currentAdminId)
    return createdById === currentId
  }

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = filterSubject === 'all' || quiz.subject === filterSubject
    return matchesSearch && matchesSubject
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
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'draft':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
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
              <h1 className="text-2xl font-bold text-gray-900">Manage Quizzes</h1>
              <p className="text-sm text-gray-500 mt-1">
                {quizzes.length > 0 
                  ? `You have created ${quizzes.length} quiz${quizzes.length !== 1 ? 'es' : ''}`
                  : 'Create, edit, and manage your quizzes across all subjects'}
              </p>
            </div>
            <Link
              to="/admin/quiz/create"
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Create Quiz
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterSubject('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterSubject === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
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
              </div>
            </div>
          </div>

          {/* Quiz Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="text-gray-500 mt-4">Loading quizzes...</p>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FileQuestion className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No quizzes found</p>
              <p className="text-sm text-gray-500">
                {quizzes.length === 0 
                  ? "You haven't created any quizzes yet. Create your first quiz to get started!" 
                  : "No quizzes match your search criteria. Try adjusting your filters."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2 flex-1">
                        {quiz.title}
                      </h3>
                      <Link
                        to={`/admin/quiz/${quiz._id}/edit`}
                        className="ml-2 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSubjectColor(quiz.subject)}`}>
                        {quiz.subject}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(quiz.status || 'active')}`}>
                        {quiz.status || 'active'}
                      </span>
                      {quiz.difficulty && (
                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-orange-100 text-orange-700">
                          {quiz.difficulty}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {quiz.description}
                    </p>

                    {/* Tags */}
                    {quiz.tags && quiz.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {quiz.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                        {quiz.tags.length > 3 && (
                          <span className="text-xs text-gray-400">+{quiz.tags.length - 3} more</span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{quiz.duration}min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileQuestion className="w-4 h-4" />
                        <span>{quiz.questions?.length || 0} questions</span>
                      </div>
                    </div>

                    {/* Creator info and difficulty */}
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4 pb-4 border-b">
                      <span>By: {quiz.createdBy?.name || 'You'}</span>
                      <span className="capitalize">{quiz.difficulty || 'Medium'}</span>
                    </div>

                    <div className="flex gap-2">
                      {canEditQuiz(quiz) ? (
                        <>
                          <Link
                            to={`/admin/quiz/${quiz._id}/edit`}
                            className="flex-1 text-center text-sm bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-200 transition-colors font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(quiz._id, quiz)}
                            className="text-sm bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <div className="flex-1 text-center text-sm bg-gray-100 text-gray-400 px-3 py-2 rounded-lg cursor-not-allowed">
                          View Only
                        </div>
                      )}
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
