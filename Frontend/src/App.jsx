import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from "./nonshadcncomponants/Layout.jsx";
import UserAuth from "./pages/auth/UserAuth.jsx";
import AdminAuth from "./pages/auth/AdminAuth.jsx";
import UserDashboard from "./pages/User/DashboardNonShadCNuser.jsx";
import AdminDashboard from "./pages/Admin/DashboardNonShadCN.jsx";
import CreateQuiz from "./pages/Admin/CreateQuiz.jsx";
import EditQuiz from "./pages/Admin/EditQuiz.jsx";
import TakeQuiz from "./pages/quiz/TakeQuiz.jsx";
import Home from "./pages/Home.jsx";
import AdminRegisterForm from './nonshadcncomponants/RegisterComponants/AdminRegisterForm.jsx';
import UserRegisterForm from './nonshadcncomponants/RegisterComponants/UserRegisterForm.jsx';
import UserRegister from './pages/register/UserRegister.jsx';
import AdminRegister from './pages/register/AdminRegister.jsx';
import Dashboard from './pages/User/Dashboard.jsx';
import ChatBot from './pages/User/ChatBot.jsx';
import Chats from './pages/User/Chats.jsx';
import AnalysisPage from './pages/User/AnalysisPage.jsx';
import AdminsPage from './pages/User/MentorList.jsx';
import QuizPage from './pages/User/QuizPage.jsx';
import VideoLecturesPage from './pages/User/VideoLecturePage.jsx';
import BloggingPlatform from './pages/User/Blogs.jsx';
import AdminProfile from './pages/Admin/AdminProfile.jsx';
import Profile from './pages/User/Profile.jsx';
import CurrentQuiz from './pages/quiz/CurrentQuiz.jsx';
import AdminInbox from './pages/Admin/AdminInbox.jsx';
import { SocketContext } from './context/socket.js';
import socket from './context/socket.js';
import VideoCall from './pages/User/VideoCall.jsx';
import AdminVideoCall from './pages/Admin/AdminVideoCall.jsx';

function App() {
    return (
        <div className='font-main'>

            <SocketContext.Provider value={socket}>

                <Routes>
                    <Route path="/" element={<Layout></Layout>}></Route>
                    <Route index element={<Home></Home>}></Route>
                    <Route path="/user/login" element={<UserAuth></UserAuth>}></Route>
                    <Route path="/user/signup" element={<UserRegister></UserRegister>}></Route>
                    <Route path="/admin/login" element={<AdminAuth></AdminAuth>}></Route>
                    <Route path="/admin/signup" element={<AdminRegister></AdminRegister>}></Route>
                    <Route path="/admin/profile" element={<AdminProfile></AdminProfile>}></Route>
                    <Route path="chat/:adminId" element={<Chats></Chats>}></Route>
                    <Route path="/videocall/:roomId" element={<VideoCall />} />
                    <Route path="/user/dashboard" element={<Dashboard></Dashboard>}>
                        <Route path="chatbot" element={<ChatBot></ChatBot>}></Route>
                        <Route path="analysis" element={<AnalysisPage></AnalysisPage>}></Route>
                        <Route path="blogs" element={<BloggingPlatform></BloggingPlatform>}></Route>
                        <Route path="admins" element={<AdminsPage></AdminsPage>}></Route>
                        <Route path="lectures" element={<VideoLecturesPage></VideoLecturesPage>}></Route>
                        <Route path="quizzes" element={<QuizPage></QuizPage>}></Route>
                        <Route path="profile" element={<Profile></Profile>}></Route>
                    </Route>

                    <Route path="/user/takequiz/:id" element={<CurrentQuiz></CurrentQuiz>}></Route>
                    <Route path="admin/dashboard" element={<AdminDashboard></AdminDashboard>}></Route>
                    <Route path="admin/dashboard/chats" element={<AdminInbox></AdminInbox>}></Route>
                    <Route path="admin/quiz/create" element={<CreateQuiz></CreateQuiz>}></Route>
                    <Route path="admin/quiz/:id/edit" element={<EditQuiz></EditQuiz>}></Route>
                    <Route path="admin/videocall/:roomId" element={<AdminVideoCall></AdminVideoCall>} />
                    <Route path="/quiz/:id" element={<TakeQuiz></TakeQuiz>}></Route>
                </Routes>
            </SocketContext.Provider>
        </div>


    )
}

export default App;