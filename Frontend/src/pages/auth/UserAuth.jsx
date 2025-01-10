import react from 'react';
import { useLocation, useNavigate , Link } from 'react-router-dom';
import AuthForm from "../../componants/AuthFrom.jsx"

export default function UserAuth()
{
    const navigate = useNavigate();
    const location = useLocation();
    const isLogin = location.pathname === '/admin/login';

    const HandleSubmit = async(data) =>{
        
        console.log('User auth data',data);
        // TODO: Implement actual authentication

        const url = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
        
            try{
                const response = await fetch(url,{
                    method:'POST',
                    headers:{
                        'Content-Type' : 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const responseData = await response.json(); 
                
                if(response.ok)
                {
                    console.log('Authentication sucessful',responseData);
                    navigate("/dashboard");
                }
                else
                {
                    console.error('Authentication failed:', responseData);
                }

            }catch(error){
                console.error('Error:',error.message);
            }
            

      
        
        
    }
    return(
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
            <AuthForm mode={isLogin ? 'login' : 'signup'} type='user' onSubmit={HandleSubmit}></AuthForm>

            <p className="mt-4 text-center text-sm text-gray-600">
            to={isLogin ? " Don't have an admin account? ":" Already have an admin account? "}

                <Link to={isLogin ? '/signup':'/login'} className="font-medium text-indigo-600 hover:text-indigo-500"></Link>

                {isLogin ? 'Sign Up' : 'Log in'}
                
                
            </p>

        </div>
    )



}