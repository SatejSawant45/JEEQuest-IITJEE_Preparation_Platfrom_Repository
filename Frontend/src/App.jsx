import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import UserAuth from './pages/auth/UserAuth';
import AdminAuth from './pages/auth/AdminAuth';
import UserDashboard from './pages/user/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import CreateQuiz from './pages/admin/CreateQuiz';
import EditQuiz from './pages/admin/EditQuiz';
import TakeQuiz from './pages/quiz/TakeQuiz';
import VideoLectures from './pages/lectures/VideoLectures';
import UserChat from './pages/chat/UserChat';

function App()
{
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Layout></Layout>}></Route>
                <Route index element={<Home></Home>}></Route>
                <Route path="/login" element={<UserAuth></UserAuth>}></Route>
                <Route path="/signup" element={<UserAuth></UserAuth>}></Route>
                <Route path="/admin/login" element={<AdminAuth></AdminAuth>}></Route>
                <Route path="/admin/signup" element={<AdminAuth></AdminAuth>}></Route>
                <Route path="dashboard" element={<UserDashboard></UserDashboard>}></Route>
                <Route path="admin/dashboard" element={<AdminDashboard></AdminDashboard>}></Route>
                <Route path="admin/quiz/create" element={<CreateQuiz></CreateQuiz>}></Route>
                <Route path="admin/quiz/:id/edit" element={<EditQuiz></EditQuiz>}></Route>
                <Route path="/quiz/:id" element={<TakeQuiz></TakeQuiz>}></Route>
                
            </Routes>
        </Router>
    )
}
