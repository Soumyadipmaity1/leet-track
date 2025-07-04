
"use client"

import { CalendarCog, CalendarRange, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useClerk } from "@clerk/nextjs";

interface SSidebarProps {
  children?: ReactNode;
  open: boolean;
  setOpen: (val: boolean) => void;
}

const elements = [
  { title: "Dashboard", url: "dashboard", icon: LayoutDashboard },
  { title: "Calendar", url: "calendar", icon: CalendarRange },
  { title: "Settings", url: "settings", icon: CalendarCog },
];

export function SSidebar({ children, open, setOpen }: SSidebarProps) {
  const pathname = usePathname();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { signOut } = useClerk();

  useEffect(() => {
    if (open && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [open]);

  const handleSignOut = () => {
    signOut({ redirectUrl: '/' });
  };

  const SidebarLinks = (
    <SidebarContent className="flex-1 flex flex-col px-2">
      <SidebarGroup>
        <SidebarGroupLabel className="mb-1" />
        <SidebarGroupContent>
          <SidebarMenu className="space-y-2">
            {elements.map((ele) => {
              const isActive =
                (ele.url === "dashboard" && pathname === "/") ||
                pathname.startsWith(`/${ele.url}`);
              return (
                <SidebarMenuItem key={ele.title}>
                  <SidebarMenuButton
                    asChild
                    className={`flex items-center gap-3 text-[#374151] dark:text-white hover:bg-[#e0e7ff] dark:hover:bg-[#4b5563] p-3 rounded-lg w-full text-left
                      ${isActive ? "bg-[#6366f1] text-white dark:text-[#0f172a] shadow-md" : ""}
                    `}
                  >
                    <Link
                      href={`/${ele.url}`}
                      prefetch
                      onClick={() => setOpen(false)} // Close sidebar when link is clicked on mobile
                    >
                      <ele.icon size={20} className="shrink-0" />
                      <span className="text-base font-medium">{ele.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );

  const SignOutButton = (
    <button
      onClick={handleSignOut}
      className="w-full flex items-center gap-3 px-4 py-3 mb-6 bg-[#d1d5db] text-black dark:text-black dark:bg-[#d1d5db] hover:bg-[#fee2e2] dark:hover:bg-[#7f1d1d] rounded-lg transition-colors cursor-pointer"
    >
      <LogOut size={20} className="shrink-0" />
      <span className="text-base font-medium">Sign Out</span>
    </button>
  );

  return (
    <div className="flex h-screen">
      {/* Desktop sidebar */}
      <Sidebar className="hidden md:flex md:w-64 h-full flex-col justify-between pt-10 bg-[#f3f4f6] [&>div]:dark:bg-[#1e293b] text-black dark:text-white shadow-md">
        <div className="flex-1 flex flex-col">{SidebarLinks}</div>
        <div className="px-2">{SignOutButton}</div>
      </Sidebar>

      {/* Main content area */}
      <main className="flex-1 bg-white dark:bg-[#0f172a] overflow-y-auto mt-16">
        {children}
      </main>

      {/* Mobile sidebar overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex md:hidden"
          aria-modal="true"
          role="dialog"
        >
          {/* Clickable overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Mobile Sidebar panel */}
          <div className="relative w-64 h-full bg-[#f3f4f6] dark:bg-[#1e293b] shadow-xl flex flex-col">
            {/* Close button */}
            <button
              ref={closeButtonRef}
              className="absolute top-4 right-4 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Mobile sidebar content */}
            <div className="flex-1 flex flex-col pt-16 pb-4">
              {SidebarLinks}
            </div>

            {/* Sign out button for mobile */}
            <div className="px-2 pb-4">
              {SignOutButton}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
