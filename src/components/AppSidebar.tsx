import { Home, Calendar, BarChart3, Settings } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: Home,
    description: "Your daily overview"
  },
  { 
    title: "Calendar", 
    url: "/calendar", 
    icon: Calendar,
    description: "Schedule & plan tasks"
  },
  { 
    title: "Analytics", 
    url: "/analytics", 
    icon: BarChart3,
    description: "Track your progress"
  },
  { 
    title: "Settings", 
    url: "/settings", 
    icon: Settings,
    description: "Customize your experience"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = (path: string) => 
    isActive(path) 
      ? "bg-gradient-to-r from-primary/10 to-primary-glow/10 text-primary border-r-2 border-primary font-medium" 
      : "hover:bg-muted/50 transition-colors duration-200";

  return (
    <Sidebar
      className={state === "collapsed" ? "w-16" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="bg-gradient-to-b from-card to-muted/20">
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <Home className="h-4 w-4 text-primary-foreground" />
            </div>
            {!state || state !== "collapsed" && (
              <div>
                <h2 className="font-semibold text-foreground text-sm">TaskFlow</h2>
                <p className="text-xs text-muted-foreground">Your productivity companion</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className={state === "collapsed" ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12">
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={getNavCls(item.url)}
                    >
                      <item.icon className="h-5 w-5 min-w-5" />
                      {(!state || state !== "collapsed") && (
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-sm">{item.title}</span>
                          <span className="text-xs text-muted-foreground leading-tight">
                            {item.description}
                          </span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom section */}
        {(!state || state !== "collapsed") && (
          <div className="mt-auto p-4 border-t border-border/50">
            <div className="bg-gradient-to-r from-wellness/10 to-emerald-50 p-3 rounded-lg border border-wellness/20">
              <p className="text-xs text-wellness font-medium mb-1">Daily Tip 💡</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Small consistent actions lead to extraordinary results!
              </p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}