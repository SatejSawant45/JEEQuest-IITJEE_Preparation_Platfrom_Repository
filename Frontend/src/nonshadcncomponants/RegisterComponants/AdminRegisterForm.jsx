import React from 'react';
import { useForm } from 'react-hook-form';
import { User } from 'lucide-react';

export default function AdminRegisterForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  return (
    <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="flex items-center justify-center mb-4">
        <User className="h-12 w-12 text-indigo-600" />
      </div>
      <h2 className="text-2xl font-bold text-center mb-6">Create Admin (Mentor) Account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Basic fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input {...register('name', { required: 'Name is required' })} className="input" />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })} className="input" />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' }
          })} className="input" />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>

        {/* Mentor-specific fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input {...register('title', { required: 'Title is required' })} className="input" />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Company</label>
          <input {...register('company', { required: 'Company is required' })} className="input" />
          {errors.company && <p className="text-sm text-red-600">{errors.company.message}</p>}
        </div>

        

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input {...register('location', { required: 'Location is required' })} className="input" />
          {errors.location && <p className="text-sm text-red-600">{errors.location.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Experience (e.g. 5 years)</label>
          <input {...register('experience', { required: 'Experience is required' })} className="input" />
          {errors.experience && <p className="text-sm text-red-600">{errors.experience.message}</p>}
        </div>

        


        <button type="submit" className="w-full py-2 px-4 text-white bg-indigo-600 rounded hover:bg-indigo-700">
          Sign Up
        </button>
      </form>
    </div>
  );
}
