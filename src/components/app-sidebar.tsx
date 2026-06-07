"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";

import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  RowsIcon,
  WaveformIcon,
  CommandIcon,
  TerminalIcon,
  RobotIcon,
  BookOpenIcon,
  GearIcon,
} from "@phosphor-icons/react";
import { LayoutDashboard, Projector, Workflow } from "lucide-react";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: <Projector />,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: <WaveformIcon />,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: <CommandIcon />,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: <LayoutDashboard />,
      isActive: true,
      items: [
        {
          title: "Analytics",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Projects",
      url: "#",
      icon: <Workflow />,
      isActive: true,
      items: [
        {
          title: "projects",
          url: "/dashboard/projects",
        },
        {
          title: "Tasks",
          url: "/dashboard/tasks",
        },
      ],
    },
    // {
    //   title: "Models",
    //   url: "#",
    //   icon: <RobotIcon />,
    //   items: [
    //     {
    //       title: "Genesis",
    //       url: "#",
    //     },
    //     {
    //       title: "Explorer",
    //       url: "#",
    //     },
    //     {
    //       title: "Quantum",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
};

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
  );
}
