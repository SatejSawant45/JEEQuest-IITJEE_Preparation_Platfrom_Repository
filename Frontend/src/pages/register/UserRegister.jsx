import react from 'react';
import { useLocation, useNavigate , Link } from 'react-router-dom';
// import UserAuthForm from "../../componants/AuthComponants/UserAuthFrom.jsx"
import UserRegisterForm from '../../nonshadcncomponants/RegisterComponants/UserRegisterForm.jsx';


export default function UserRegister()
{
    const navigate = useNavigate();
    const location = useLocation();
    const isLogin = location.pathname === '/user/login';
    const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL;

    const HandleSubmit = async(data) =>{
        
        console.log('User auth data',data);
        // TODO: Implement actual authentication

        const url = isLogin ? `${primaryBackendUrl}/api/auth/login` : `${primaryBackendUrl}/api/auth/register`;
        
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
                    localStorage.setaItem('jwtToken', response.data.token);
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
            <UserRegisterForm onSubmit={HandleSubmit}></UserRegisterForm>

            <p className="mt-4 text-center text-sm text-gray-600">
            {isLogin ? " Don't have a user account? ":" Already have an user account? "}

                <Link to={ isLogin ? '/user/signup':'/user/login'} className="font-medium text-indigo-600 hover:text-indigo-500"> {isLogin ? <button className="bg-blue-500 text-white p-2 ">Sign Up</button> : <button className="bg-blue-500 text-white p-2">Login</button> } </Link>

                
                
                
            </p>

            

        </div>
    )



}