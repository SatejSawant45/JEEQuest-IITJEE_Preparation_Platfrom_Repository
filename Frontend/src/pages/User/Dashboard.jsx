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

import { NavLink,Outlet } from "react-router-dom"
import { io } from 'socket.io-client'

export default function Page() {
 
    

    const [socket,setSocket] = useState({});
    const [msg,setMsg] = useState("");
    const url = "http://localhost:5000/api/auth/login"
    const jwtToken = localStorage.getItem("jwtToken");
    const headerToken = "Bearer "+jwtToken;
    console.log(`headerToken : ${headerToken}`);
    
    
    useEffect(()=>{
        const userId = localStorage.getItem("id");

        console.log("Log from Dashbpard page")

        const newSocket = io("http://localhost:7000");
        
        newSocket.on("connect",()=>{
            console.log(newSocket);
            console.log('Student Connected');
            console.log(newSocket.id);
            console.log(userId);
            
            setSocket(socket);
            console.log(socket);

            const messageFromUser = { 
                message : "hello from user",
                user_Id : userId

            }
            socket.emit("message",JSON.stringify(messageFromUser))
        })


    },[]);





  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
              />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
          </div>
        </header>
            <Outlet></Outlet>
        
        {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div> */}
      </SidebarInset>
    </SidebarProvider>
  )
}