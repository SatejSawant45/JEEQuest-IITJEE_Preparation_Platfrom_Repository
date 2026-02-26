import * as React from "react"
import {
  BookOpen,
  Brain,
  MessageSquare,
  PenTool,
  Trophy,
  Users,
  Video,
  BarChart,
  User,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavLink, Outlet } from 'react-router-dom'
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Quiz Website Dashboard Data
const data = {
  user: {
    name: "Student",
    email: "student@quizapp.com",
    avatar: "/avatars/student.jpg",
  },
  teams: [
    {
      name: "JEEQuest",
      logo: Brain,
      plan: "Student",
    },
  ],
  navMain: [
    {
      title: "Learning",
      url: "#",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "Practice Quizzes",
          url: "quizzes",
        },
        {
          title: "Test Analysis",
          url: "analysis",
        },
        {
          title: "Video Lectures",
          url: "lectures",
        },
      ],
    },
    {
      title: "Community",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Study Blogs",
          url: "blogs",
        },
        {
          title: "Chat with Mentor",
          url: "admins",
        },
        {
          title: "AI Study Assistant",
          url: "chatbot",
        },
      ],
    },
    {
      title: "Account",
      url: "#",
      icon: User,
      items: [
        {
          title: "My Profile",
          url: "profile",
        },
      ],
    },
  ],
  projects: [],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
