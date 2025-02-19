"use client"

import * as React from "react"
import {
  AudioWaveform,
  CirclePlay,
  Command,
  File,
  GalleryVerticalEnd,
  Settings,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { title } from "process"
import { url } from "inspector"

const data = {
  user: {
    name: "Admin",
    email: "admin@admin.com",
    avatar: "",
  },
  teams: [
    {
      name: "Spriers",
      logo: GalleryVerticalEnd,
      plan: "Information Technology",
    },
    {
      name: "Google",
      logo: AudioWaveform,
      plan: "IT Corporation",
    },
    {
      name: "Microsoft",
      logo: Command,
      plan: "Technology Company",
    },
  ],
  navMain: [
    {
      title: "Lead",
      url: "#",
      icon: CirclePlay,
      isActive: window.location.pathname === "",
      items: [
        {
          title: "Create",
          url: "/lead",
        },
        {
          title: "List",
          
        },
        {
          title: "Graph",
          url: "",
        },
        {
          title: "Drag & Drop",
          url: "/lead/leadDrop",
        }
      ],
    },
    {
      title: "Invoice",
      url: "#",
      icon: CirclePlay,
      isActive: window.location.pathname === "",
      items: [
        {
          title: "Create",
          url: "/invocie",
        },
        {
          title: "List",
          url: "",
        },
        {
          title: "Graph",
          url: "",
        },
        {
          title: "Drag & Drop",
          url: "/invoice/invoiceDrop",
        }
      ],
    },
    {
      title: "Reminder",
      url: "#",
      icon: CirclePlay,
      isActive: window.location.pathname === "",
      items: [
        {
          title: "List",
          url: "/reminder",
        },
        {
          title: "Email",
          url: "",
        },
        {
          title: "Create",
          url: "",
        },
      ],
    },
    {
      title: "Deal",
      url: "#",
      icon: CirclePlay,
      isActive: window.location.pathname === "",
      items: [
        {
          title: "Create",
          url: "/deal",
        },
        {
          title: "List",
          url: "",
        },
        {
          title: "Graph",
          url: "",
        },
        {
          title: "Drag & Drop",
          url: "/deal/dealDrop",
        }
      ],
    },
    {
      title: "Task",
      url: "#",
      icon: CirclePlay,
      isActive: window.location.pathname === "",
      items: [
        {
          title: "Create",
          url: "/task",
        },
        {
          title: "List",
          url: "",
        },
        {
          title: "Graph",
          url: "",
        },
        {
          title: "Drag & Drop",
          url: "/task/taskDrop",
        }
      ],
    },
    {
      title: "Complaint",
      url: "#",
      icon: CirclePlay,
      isActive: window.location.pathname === "",
      items: [
        {
          title: "Create",
          url: "/complaint",
        },
        {
          title: "List",
          url: "",
        },
        {
          title: "Email",
          url: "",
        },
      ],
    },
    {
      title: "Contact",
      url: "#",
      icon: CirclePlay,
      isActive: window.location.pathname === "",
      items: [
        {
          title: "Create",
          url: "/contact",
        },
        {
          title: "List",
          url: "",
        },
        {
          title: "Email",
          url: "",
        },
      ],
    },
    {
      title: "Account",
      url: "#",
      icon: CirclePlay,
      isActive: window.location.pathname === "",
      items: [
        {
          title: "Create",
          url: "/Account",
        },
        {
          title: "List",
          url: "",
        },
      ],
    },
    {
      title: "Documents",
      url: "#",
      icon: CirclePlay,
      isActive: window.location.pathname === "",
      items: [
        {
          title: "Photos",
          url: "",
        },
        {
          title: "Videos",
          url: "",
        },
        {
          title: "Others",
          url: "",
        },
      ],
    },
    {
      title: "Schedule",
      url: "#",
      icon: CirclePlay,
      isActive: window.location.pathname === "",
      items: [
        {
          title: "Create",
          url: "/Scheduled",
        },
        {
          title: "List",
          url: "",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
  )
}

