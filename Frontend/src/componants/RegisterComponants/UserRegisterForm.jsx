import react from 'react';
import { useForm } from 'react-hook-form';
import { User } from 'lucide-react';

export default function UserRegisterForm({onSubmit})
{

    const { register , handleSubmit , formState:{ errors } } = useForm();
    return(
        <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center justify-center mb-8">
                <User className="h-12 w-12 text-indigo-600" /> 
            </div>
            <h2 className="text-2xl font-bold text-center mb-8">
                Create User Account
            </h2>

            


            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
               
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" {...register('name',{required:'Name is required'})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )} 
                    </div>
                

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" {...register('email',{required:'Email is required',pattern:{value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,message:'Invalid email address'}} )}  
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" {...register('password',{required:'Password is required' , minLength:{ value : 6 , message:"password should have min 6 characters"}})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.password.message}
                        </p>
                    )}
                </div>


                
                    
                
                

                <button type='submit'  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                   Sign Up

                </button>

            </form>
        </div>


    )
}
