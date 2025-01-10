import react from 'react';
import { useLocation, useNavigate , Link } from 'react-router-dom';
import AuthForm from "../../componants/AuthFrom.jsx"

export default function AdminAuth()
{
    const navigate = useNavigate();
    const location = useLocation();
    const isLogin = location.pathname === '/admin/login';

    const HandleSubmit = async(data) =>{
        
        // TODO: Implement actual authentication
        console.log('Admin auth data',data);
        navigate("/admin/dashboard");
        
    }
    return(
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
            <AuthForm mode={isLogin ? 'login' : 'signup'} type='admin' onSubmit={HandleSubmit}></AuthForm>

            <p className="mt-4 text-center text-sm text-gray-600">
            to={isLogin ? " Don't have an admin account? ":" Already have an admin account? "}

                <Link to={isLogin ? '/admin/signup':'/admin/login'} className="font-medium text-indigo-600 hover:text-indigo-500"></Link>

                {isLogin ? 'Sign Up' : 'Log in'}
                
                
            </p>

        </div>
    )



}