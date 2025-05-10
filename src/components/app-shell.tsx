"use client";

import { useState, type ReactNode } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { MessageSquare, Settings, Files } from "lucide-react";
import { PopupDialog } from "@/components/popup-dialog";

export default function AppShell({ children }: { children: ReactNode }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); // Start collapsed (icon-only)

  return (
    <SidebarProvider open={isSidebarExpanded} onOpenChange={setIsSidebarExpanded}>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
        <SidebarMenu className="flex-1 mt-2 space-y-1 px-2"> {/* Adjusted padding and spacing */}
          {/* Placeholder for Explorer Icon - Not functional */}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={{ children: "Explorer", side: "right", className: "bg-popover text-popover-foreground border border-border shadow-md" }}
              className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Files />
              <span className="text-sm">Explorer</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={{ children: "Show Popup", side: "right", className: "bg-popover text-popover-foreground border border-border shadow-md" }}
              onClick={() => setIsPopupOpen(true)}
              isActive={isPopupOpen} // Visually indicate active state if popup is open
              className="text-sidebar-foreground data-[active=true]:text-primary hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <MessageSquare />
              <span className="text-sm">Show Popup</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarFooter className="p-2 mt-auto">
          {/* Placeholder for Settings Icon - Not functional */}
          <SidebarMenuItem className="!mt-auto list-none"> {/* Ensure it's at bottom */}
             <SidebarMenuButton
              tooltip={{ children: "Manage Settings", side: "right", className: "bg-popover text-popover-foreground border border-border shadow-md" }}
              className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Settings />
              <span className="text-sm">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* SidebarTrigger can be removed if activity bar should never expand text labels */}
          {/* <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" /> */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background"> {/* Ensure main content area uses app background */}
        {children}
      </SidebarInset>
      <PopupDialog isOpen={isPopupOpen} onOpenChange={setIsPopupOpen} />
    </SidebarProvider>
  );
}
