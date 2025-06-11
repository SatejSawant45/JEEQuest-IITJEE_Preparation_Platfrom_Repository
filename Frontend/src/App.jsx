import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from "./componants/Layout.jsx";
import UserAuth from "./pages/auth/UserAuth.jsx";
import AdminAuth from "./pages/auth/AdminAuth.jsx";
import UserDashboard from "./pages/User/Dashboard.jsx";
import AdminDashboard from "./pages/Admin/Dashboard.jsx";
import CreateQuiz from "./pages/Admin/CreateQuiz.jsx";
import EditQuiz from "./pages/Admin/EditQuiz.jsx";
import TakeQuiz from "./pages/quiz/TakeQuiz.jsx";
import Home from "./pages/Home.jsx";
import AdminRegisterForm from './componants/RegisterComponants/AdminRegisterForm.jsx';
import UserRegisterForm from './componants/RegisterComponants/UserRegisterForm.jsx';
import UserRegister from './pages/register/UserRegister.jsx';
import AdminRegister from './pages/register/AdminRegister.jsx';


function App()
{
    return(
            <Routes>
                <Route path="/" element={<Layout></Layout>}></Route>
                <Route index element={<Home></Home>}></Route>
                <Route path="/user/login" element={<UserAuth></UserAuth>}></Route>
                <Route path="/user/signup" element={<UserRegister></UserRegister>}></Route>
                <Route path="/admin/login" element={<AdminAuth></AdminAuth>}></Route>
                <Route path="/admin/signup" element={<AdminRegister></AdminRegister>}></Route>
                <Route path="dashboard" element={<UserDashboard></UserDashboard>}></Route>
                <Route path="admin/dashboard" element={<AdminDashboard></AdminDashboard>}></Route>
                <Route path="admin/quiz/create" element={<CreateQuiz></CreateQuiz>}></Route>
                <Route path="admin/quiz/:id/edit" element={<EditQuiz></EditQuiz>}></Route>
                <Route path="/quiz/:id" element={<TakeQuiz></TakeQuiz>}></Route>
            </Routes>
        
                
    )
}

export default App;