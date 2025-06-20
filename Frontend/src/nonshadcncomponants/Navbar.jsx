import react from 'react';
import { Link } from 'react-router-dom';
import  useAuthStore  from '../store/authStore.jsx';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

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
                        <Button>
                            log out
                        </Button>
                        <Button>
                            View profile
                        </Button>
                    </div>

                </div>
            </div>

        </nav>
    )
}