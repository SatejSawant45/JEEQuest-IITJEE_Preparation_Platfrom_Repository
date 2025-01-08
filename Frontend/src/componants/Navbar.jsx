import react from 'react';
import { Link } from 'react-router-dom';
import  useAuthStore  from '../store/authStore.jsx';
import { GraduationCap } from 'lucide-react';

export default function Navbar()
{
    const { user, logout } = useAuthStore();

    return(
        <nav className="bg-indigo-600 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <GraduationCap className="h-8 w-8"></GraduationCap>
                        <span className="font-bold text-xl">IITJEE Quiz</span>
                    </Link>
                    
                    <div className="flex items-center space-x-4">
                        {!user ? 
                        (
                            <>
                            <Link to="/login" className="hover:text-indigo-200">Login</Link>
                            <Link to="/signup" className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50">Sign Up</Link>
                            </>
                        ):(
                            <>
                            <Link to="/lectures" className="hover:text-indigo-200">Video Lectures</Link>
                            <Link to={user.role==='admin' ? '/admin/dashboard' : '/dashboard'} className="hover:text-indigo-200">Dashboard</Link>
                            <button onClick={logout}  className="bg-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-800">Logout</button>
                            </>


                        )}
                    </div>

                </div>
            </div>

        </nav>
    )
}