import { useState } from "react";
import { Plus } from 'lucide-react';
import QuizCard from "../../componants/QuizCard.jsx";
import { Link } from "react-router-dom";

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
  ];

export default function AdminDashboard()
{
    const [searchTerm , setSearchTerm] = useState('');

    const filteredQuizzes = mockQuizzes.filter(quiz=>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return(
        <div className="space-y-8">

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Quizzes</h2>
                <Link to="/adminquiz/create" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"><Plus className="w-5 h-5" ></Plus>Create Quiz</Link>
            </div>

            <div className="flex justify-between items-center">
                <input type="text" placeholder="Search quizzes..." value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)} className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"></input>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuizzes.map((quiz)=>(
                    <div key={quiz.id} className="relative">
                        <QuizCard quiz={quiz} showActions={false}></QuizCard>
                        <div  className="absolute top-4 right-4 space-x-2"></div>
                        <Link to={`/admin/quiz/${quiz.id}/edit`}  className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-200">Edit</Link>
                        <button onClick={()=>{
                            // to be implemented
                        }} className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200">Delete</button>
                    </div>
                ))}

            </div>




                



        </div>
    )


}

