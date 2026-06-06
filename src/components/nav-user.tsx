"use client";

import { getCookieByName } from "@/actions/auth/cookie";
import { logoutAction } from "@/actions/auth/logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  CaretUpDownIcon,
  CreditCardIcon,
  BellIcon,
  SignOutIcon,
} from "@phosphor-icons/react";
import { MoonIcon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const handleLogout = async () => {
    // Implement logout logic here, e.g., call a logout API route or clear auth tokens
    console.log("Logging out...");
    await logoutAction(); // Call the server action to clear cookies
    router.push("/login"); // Redirect to login page after logout
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const email = await getCookieByName("userEmail");
      const name = await getCookieByName("userName");
      setUserEmail(email);
      setUserName(name);
    };
    fetchUserInfo();
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={userName || "User"} />
                <AvatarFallback className="rounded-lg">
                  {userName ? userName.split(" ")[0] : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userName}</span>
                <span className="truncate text-xs">{userEmail}</span>
              </div>
              <CaretUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-fit"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={userName || "User"} />
                  <AvatarFallback className="rounded-lg">
                    {userName
                      ? `${userName.split(" ")[0][0]}${userName.split(" ")[1]?.[0] || ""}`
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userName}</span>
                  <span className="truncate text-xs">{userEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <CreditCardIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
              {theme === "dark" ? (
                <DropdownMenuItem onSelect={() => setTheme("light")}>
                  <Sun />
                  Light
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onSelect={() => setTheme("dark")}>
                  <MoonIcon />
                  Dark
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <SignOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
