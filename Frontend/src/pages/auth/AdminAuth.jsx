import react from 'react';
import { useLocation, useNavigate , Link } from 'react-router-dom';
import AdminAuthForm from "../../nonshadcncomponants/AuthComponants/UserAuthFrom.jsx"

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
            <AdminAuthForm onSubmit={HandleSubmit}></AdminAuthForm>

            <p className="mt-4 text-center text-sm text-gray-600">
            {isLogin ? " Don't have an admin account? ":" Already have an admin account? "}

                <Link to={isLogin ? '/admin/signup':'/admin/login'} className="font-medium text-indigo-600 hover:text-indigo-500">{isLogin ? <button className="bg-blue-500 text-white p-2 ">Sign Up</button> : <button className="bg-blue-500 text-white p-2">Login</button> }</Link>

                
                
                
            </p>

        </div>
    )



}