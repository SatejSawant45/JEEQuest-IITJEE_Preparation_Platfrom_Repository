import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AdminAuthForm from "../../nonshadcncomponants/AuthComponants/UserAuthFrom.jsx";

export default function AdminAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === '/admin/login';

  const HandleSubmit = async (data) => {
    console.log('Admin auth data:', data);

    const url = isLogin
      ? 'http://localhost:5000/api/admin/login'
      : 'http://localhost:5000/api/admin/register'; // Make sure this exists in your backend if using signup

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
        const { token, id, name, email } = responseData;

        console.log('✅ Authentication successful:', token);

        // ✅ Store admin details in localStorage
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('id', id);
        localStorage.setItem('name', name);
        localStorage.setItem('email', email);
        localStorage.setItem('role', 'admin');

        // ✅ Redirect to admin dashboard
        navigate("/admin/dashboard");
      } else {
        console.error('❌ Authentication failed:', responseData.message || responseData);
        alert(responseData.message || "Authentication failed.");
      }
    } catch (error) {
      console.error('❌ Error during authentication:', error.message);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <AdminAuthForm onSubmit={HandleSubmit} />

      <p className="mt-4 text-center text-sm text-gray-600">
        {isLogin ? "Don't have an admin account? " : "Already have an admin account? "}
        <Link to={isLogin ? '/admin/signup' : '/admin/login'}>
          <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </Link>
      </p>
    </div>
  );
}
