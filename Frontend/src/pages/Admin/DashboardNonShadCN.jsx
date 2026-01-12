import { useState, useEffect } from "react";
import { Plus, Video, Trash2, MessageSquare, PhoneMissed } from 'lucide-react';
import QuizCard from "../../nonshadcncomponants/QuizCard.jsx";
import { Link } from "react-router-dom";
import Navbar from "../../nonshadcncomponants/Navbar.jsx";
import UserHeader from "@/components/UserHeader";

const mockQuizzes = [
    {
      id: '1',
      title: 'Physics Mechanics',
      description: "Test your knowledge of Newton's laws and kinematics",
      duration: 60,
      questions: [],
      createdBy: 'admin1',
      createdAt: new Date(),
    },
    {
        id: '2',
        title: 'Physics electorostatics',
        description: "Test your knowledge of Newton's laws and kinematics",
        duration: 60,
        questions: [],
        createdBy: 'admin1',
        createdAt: new Date(),
      },
      {
        id: '3',
        title: 'Physics electorostatics',
        description: "Test your knowledge of Newton's laws and kinematics",
        duration: 60,
        questions: [],
        createdBy: 'admin1',
        createdAt: new Date(),
      },
      {
        id: '4',
        title: 'Physics electorostatics',
        description: "Test your knowledge of Newton's laws and kinematics",
        duration: 60,
        questions: [],
        createdBy: 'admin1',
        createdAt: new Date(),
      },
      {
        id: '5',
        title: 'Physics electorostatics',
        description: "Test your knowledge of Newton's laws and kinematics",
        duration: 60,
        questions: [],
        createdBy: 'admin1',
        createdAt: new Date(),
      },
      {
        id: '6',
        title: 'Physics electorostatics',
        description: "Test your knowledge of Newton's laws and kinematics",
        duration: 60,
        questions: [],
        createdBy: 'admin1',
        createdAt: new Date(),
      },
  ];

export default function AdminDashboard()
{
    const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL;
    const [searchTerm , setSearchTerm] = useState('');
    const [lectures, setLectures] = useState([]);
    const [lectureSearchTerm, setLectureSearchTerm] = useState('');
    const [isLoadingLectures, setIsLoadingLectures] = useState(true);

    useEffect(() => {
        fetchLectures();
    }, []);

    const fetchLectures = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`${primaryBackendUrl}/api/lectures`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setLectures(data.lectures);
            }
        } catch (error) {
            console.error('Error fetching lectures:', error);
        } finally {
            setIsLoadingLectures(false);
        }
    };

    const handleDeleteLecture = async (lectureId) => {
        if (!confirm('Are you sure you want to delete this lecture?')) {
            return;
        }

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`${primaryBackendUrl}/api/lectures/${lectureId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
            });

            if (response.ok) {
                alert('✅ Lecture deleted successfully');
                fetchLectures(); // Refresh the list
            } else {
                alert('❌ Failed to delete lecture');
            }
        } catch (error) {
            console.error('Error deleting lecture:', error);
            alert('❌ Error deleting lecture');
        }
    };

    const filteredQuizzes = mockQuizzes.filter(quiz=>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredLectures = lectures.filter(lecture =>
        lecture.title.toLowerCase().includes(lectureSearchTerm.toLowerCase())
    );

    return(
        <div className="space-y-8">

            <Navbar></Navbar>

            {/* Quick Actions Bar */}
            <div className="m-8">
                <div className="flex justify-end gap-4 mb-6">
                    <Link 
                        to="/admin/dashboard/chats" 
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-md"
                    >
                        <MessageSquare className="w-5 h-5" />
                        Inbox & Calls
                    </Link>
                </div>
            </div>

            <div className="m-8">

                <div className="flex justify-between items-center m-8">
                    <h2 className="text-2xl font-bold">Manage Quizzes</h2>
                    <Link to="/admin/quiz/create" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"><Plus className="w-5 h-5" ></Plus>Create Quiz</Link>
                </div>

                <div className="flex justify-between items-center m-8">
                    <input type="text" placeholder="Search quizzes..." value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)} className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"></input>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-8">
                    {filteredQuizzes.map((quiz)=>(
                        <div key={quiz.id} className="relative">
                            <QuizCard quiz={quiz} showActions={false}></QuizCard>
                            <div  className="absolute top-4 right-4 space-x-2">
                            <Link to={`/admin/quiz/${quiz.id}/edit`}  className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-200">Edit</Link>
                            <button onClick={()=>{
                                // to be implemented
                            }} className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200">Delete</button>
                            </div>
                           
                        </div>
                    ))}

                </div>

            </div>

            {/* Manage Lectures Section */}
            <div className="m-8">

                <div className="flex justify-between items-center m-8">
                    <h2 className="text-2xl font-bold">Manage Lectures</h2>
                    <Link to="/admin/lecture/create" className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                        <Plus className="w-5 h-5" />
                        Create Lecture
                    </Link>
                </div>

                <div className="flex justify-between items-center m-8">
                    <input 
                        type="text" 
                        placeholder="Search lectures..." 
                        value={lectureSearchTerm} 
                        onChange={(e)=> setLectureSearchTerm(e.target.value)} 
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                {isLoadingLectures ? (
                    <div className="text-center py-8">Loading lectures...</div>
                ) : filteredLectures.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No lectures found. Create your first lecture!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-8">
                        {filteredLectures.map((lecture)=>(
                            <div key={lecture._id} className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <img 
                                    src={lecture.thumbnail} 
                                    alt={lecture.title}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        e.target.src = '/placeholder.svg?height=200&width=300';
                                    }}
                                />
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{lecture.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{lecture.description}</p>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Video className="w-4 h-4" />
                                            {lecture.duration}
                                        </span>
                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                            {lecture.subject}
                                        </span>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 space-x-2">
                                    <Link 
                                        to={`/admin/lecture/${lecture._id}/edit`}  
                                        className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200"
                                    >
                                        Edit
                                    </Link>
                                    <button 
                                        onClick={() => handleDeleteLecture(lecture._id)} 
                                        className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>



                



        </div>
    )


}

