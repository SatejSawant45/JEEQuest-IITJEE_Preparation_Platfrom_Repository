import react from 'react';
import QuizCard from '../../componants/QuizCard.jsx';
import LeaderboardTable from "../../componants/LeaderboardTable.jsx";
import Navbar from "../../componants/Navbar.jsx";

const mockQuizzes = [
    {
      id: '1',
      title: 'Physics Mechanics',
      description: 'Test your knowledge of Newton\'s laws and kinematics',
      duration: 60,
      questions: [],
      createdBy: 'admin1',
      createdAt: new Date(),
    },
    // Add more mock quizzes as needed
  ];
  
  const mockLeaderboard = [
    {
      userId: '1',
      userName: 'John Doe',
      quizId: '1',
      quizTitle: 'Physics Mechanics',
      score: 95,
      completedAt: new Date(),
    },
    // Add more mock entries as needed
  ];

export default function UserDashboard(){
    return(
        <div className="space-y-8">
            <Navbar></Navbar>
            <section className='m-8'>
                <h2 className='text-2xl font-bold mb-4'>Available Quizzes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockQuizzes.map((quiz)=>(
                        <QuizCard key={quiz.id} quiz={quiz}></QuizCard>
                    ))}
                </div>
            </section>

            <section className='m-8'>
                <h2 className="text-2xl font-bold mb-4">
                    Your recent performance
                </h2>
                <LeaderboardTable entries={mockLeaderboard}></LeaderboardTable>
            </section>

        </div>
    )
}

