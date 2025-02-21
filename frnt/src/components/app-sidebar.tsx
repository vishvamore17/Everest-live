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
      items: [
        { title: "Create", url: "/lead" },
        { title: "List", url: "/lead/list" },
        { title: "Graph", url: "/Lead-chart" },
        { title: "Drag & Drop", url: "/lead/leadDrop" }
      ],
    },
    {
      title: "Invoice",
      url: "#",
      icon: CirclePlay,
      items: [
        { title: "Create", url: "/invoice" },
        { title: "List", url: "/invoice/list" },
        { title: "Graph", url: "/Invoice-chart" },
        { title: "Drag & Drop", url: "/invoice/invoiceDrop" }
      ],
    },
    {
      title: "Reminder",
      url: "#",
      icon: CirclePlay,
      items: [
        { title: "List", url: "/reminder/list" },
        { title: "Email", url: "/reminder/reminderEmail" },
        { title: "Create", url: "/reminder" }
      ],
    },
    {
      title: "Deal",
      url: "#",
      icon: CirclePlay,
      items: [
        { title: "Create", url: "/deal" },
        { title: "List", url: "/deal/list" },
        { title: "Graph", url: "/Deal-chart" },
        { title: "Drag & Drop", url: "/deal/drag-drop" }
      ],
    },
    {
      title: "Task",
      url: "#",
      icon: CirclePlay,
      items: [
        { title: "Create", url: "/task" },
        { title: "List", url: "/task/list" },
        { title: "Graph", url: "/Task-chart" },
        { title: "Drag & Drop", url: "/task/drag-drop" }
      ],
    },
    {
      title: "Complaint",
      url: "#",
      icon: CirclePlay,
      items: [
        { title: "Create", url: "/complaint" },
        { title: "List", url: "/complaint/list" },
        { title: "Email", url: "/complaint/complaintEmail" }
      ],
    },
    {
      title: "Contact",
      url: "#",
      icon: CirclePlay,
      items: [
        { title: "Create", url: "/contact" },
        { title: "List", url: "/contact/list" },
        { title: "Email", url: "/contact/contactEmail" }
      ],
    },
    {
      title: "Account",
      url: "#",
      icon: CirclePlay,
      items: [
        { title: "Create", url: "/account" },
        { title: "List", url: "/account" }
      ],
    },
    {
      title: "Documents",
      url: "#",
      icon: CirclePlay,
      items: [
        { title: "Photos", url: "/document" },
        { title: "Videos", url: "/video" },
        { title: "Others", url: "/flipflap" }
      ],
    },
    {
      title: "Schedule",
      url: "#",
      icon: CirclePlay,
      items: [
        { title: "Create", url: "/scheduled" },
        { title: "List", url: "/scheduled/list" }
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isClient, setIsClient] = React.useState(false)
  const [activePath, setActivePath] = React.useState("")

  // Update active state on the client side
  React.useEffect(() => {
    setIsClient(true) // Ensure this runs only on the client side
    setActivePath(window.location.pathname)
  }, [])

  // Modify navMain items based on the current active path
  const updatedNavMain = React.useMemo(
    () =>
      data.navMain.map((item) => ({
        ...item,
        isActive: isClient && activePath === item.items[0].url, // Check active path for the first item
        items: item.items.map((subItem) => ({
          ...subItem,
          isActive: isClient && activePath === subItem.url, // Check active path for sub-items
        })),
      })),
    [isClient, activePath]
  )

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={updatedNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}