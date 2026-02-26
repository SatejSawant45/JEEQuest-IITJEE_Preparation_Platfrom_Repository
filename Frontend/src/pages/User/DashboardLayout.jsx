import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"

import { NavLink, Outlet, useLocation } from "react-router-dom"
import { io } from 'socket.io-client'
import { SocketContext } from "@/context/socket"
import { useContext } from "react"
import HomeDashboard from "./HomeDashboard"
import UserHeader from "@/components/UserHeader"

// Breadcrumb route mapping
const routeLabels = {
  '/user/dashboard': 'Overview',
  '/user/dashboard/chatbot': 'AI Study Assistant',
  '/user/dashboard/analysis': 'Test Analysis',
  '/user/dashboard/blogs': 'Study Blogs',
  '/user/dashboard/admins': 'Chat with Mentor',
  '/user/dashboard/lectures': 'Video Lectures',
  '/user/dashboard/quizzes': 'Practice Quizzes',
  '/user/dashboard/profile': 'My Profile',
  '/user/dashboard/profile/edit': 'Edit Profile',
}

export default function DashboardLayout() {
  const location = useLocation()
  const currentPath = location.pathname
  const currentPageLabel = routeLabels[currentPath] || 'Dashboard'
 
    

    const jwtToken = localStorage.getItem("jwtToken");
    const headerToken = "Bearer "+jwtToken;
    console.log(`headerToken : ${headerToken}`);

    const socket = useContext(SocketContext);
        
    useEffect(()=>{

        const userId = localStorage.getItem("id");
        console.log("Log from Dashbpard page")

        socket.connect();

        console.log(socket);
        console.log(socket.id)

        socket.on("message",(arg)=>{
            console.log("Message : " , arg);
        });

        return () => {
            socket.off("message");
        };

        

    },[socket]);





  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
              />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/user/dashboard">
                    Student Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {currentPath !== '/user/dashboard' && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbLink href={currentPath}>
                        {currentPageLabel}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="px-4">
            <UserHeader />
          </div>
        </header>
            <Outlet></Outlet>

      </SidebarInset>
    </SidebarProvider>
  )
}