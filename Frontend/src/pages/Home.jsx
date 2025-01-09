import react from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Trophy , Clock } from 'lucide-react';
import Navbar from '../componants/Navbar';

export default function Home()
{
    return(
        <div className="space-y-16">
            <Navbar></Navbar>

            <section className="text-center space-y-4">
                <h1  className="text-4xl font-bold text-gray-900">
                    Prepare for IIT JEE with Interactive Quizzes
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Practice with our comprehensive question bank and track your progress
                    through detailed analytics and performance metrics.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/signup" className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"> Get Started as Student</Link>
                    <Link to="/admin/signup" className="bg-white text-indigo-600 px-6 py-3 rounded-md border border-indigo-600 hover:bg-indigo-50 transition-colors">Join as Admin</Link>
                </div>
                <div className="mt-2">
                    <Link to="/leaderboard" className="text-indigo-600 hover:text-indigo-700 font-medium">View Leaderboard →</Link>
                </div>
            </section>

            <section className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <BookOpen className="w-12 h-12 mx-auto text-indigo-600 mb-4" ></BookOpen>
                    <h3 className="text-xl font-semibold mb-2">Comprehensive Coverage</h3>
                    <p  className="text-gray-600">Questions covering all IIT JEE topics with detailed solutions</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <Clock className="w-12 h-12 mx-auto text-indigo-600 mb-4" ></Clock>
                    <h3 className="text-xl font-semibold mb-2">Timed Practice</h3>
                    <p  className="text-gray-600">Simulate exam conditions with timed quizzes</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <Trophy className="w-12 h-12 mx-auto text-indigo-600 mb-4" ></Trophy>
                    <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                    <p  className="text-gray-600">Monitor your performance and compete with peers</p>
                </div>
                    
            </section>



        </div>
    )

}