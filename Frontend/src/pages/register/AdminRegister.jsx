import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AdminRegisterForm from '../../nonshadcncomponants/RegisterComponants/AdminRegisterForm.jsx';

export default function AdminRegister() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === '/admin/login';
  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL;

  const handleSubmit = async (data) => {
    console.log('Admin (mentor) auth data:', data);

    const url = isLogin
      ? `${primaryBackendUrl}/api/admin/login`
      : `${primaryBackendUrl}/api/admin/register`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('Authentication successful', responseData);
        localStorage.setItem('jwtToken', responseData.token);
        navigate("/admin/profile");
      } else {
        console.error('Authentication failed:', responseData.message || responseData.errors);
        alert('Authentication failed: ' + (responseData.message || "Unknown error"));
      }
    } catch (error) {
      console.error('Error during auth:', error.message);
      alert('Error during authentication. Please try again later.');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <AdminRegisterForm onSubmit={handleSubmit} />

      <p className="mt-4 text-center text-sm text-gray-600">
        {isLogin ? "Don't have an admin account?" : "Already have an admin account?"}
        <Link
          to={isLogin ? '/admin/signup' : '/admin/login'}
          className="font-medium text-indigo-600 hover:text-indigo-500 ml-2"
        >
          {isLogin ? (
            <button className="bg-blue-500 text-white p-2">Sign Up</button>
          ) : (
            <button className="bg-blue-500 text-white p-2">Login</button>
          )}
        </Link>
      </p>
    </div>
  );
}
