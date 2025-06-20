import react from 'react';
import { useLocation, useNavigate , Link } from 'react-router-dom';
import UserAuthForm from "../../nonshadcncomponants/AuthComponants/UserAuthFrom.jsx"
import { Button } from "@/components/ui/button"

export default function UserAuth()
{
    const navigate = useNavigate();
    const location = useLocation();
    const isLogin = location.pathname === '/user/login';

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
                    const recievedToken  = responseData.token;
                    console.log('Authentication sucessful',recievedToken);

                    localStorage.setItem("jwtToken", recievedToken);
                    navigate("/user/dashboard");
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
           
            <UserAuthForm onSubmit={HandleSubmit}></UserAuthForm>




            <p className="mt-4 text-center text-sm text-gray-600">
            {isLogin ? " Don't have a user account? ":" Already have an user account? "}

                <Link to={ isLogin ? '/user/signup':'/user/login'} className="font-medium text-indigo-600 hover:text-indigo-500"> {isLogin ? <button className="bg-blue-500 text-white p-2 ">Sign Up</button> : <button className="bg-blue-500 text-white p-2">Login</button> } </Link>

                
                
                
            </p>

        </div>
    )



}