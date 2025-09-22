import { useState } from "react";
import { 
  Home, 
  FileText, 
  Upload, 
  Users, 
  Shield, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Building,
  Wrench,
  CreditCard,
  UserCheck,
  Scale,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const mainNavItems = [
  { title: "Dashboard", icon: Home, href: "/dashboard" },
  { title: "Documents", icon: FileText, href: "/documents" },
  { title: "Upload", icon: Upload, href: "/upload" },
  { title: "Compliance", icon: Shield, href: "/compliance" },
  { title: "Analytics", icon: BarChart3, href: "/analytics" },
];

const departmentItems = [
  { title: "Operations", icon: Building, href: "/departments/operations" },
  { title: "Engineering", icon: Wrench, href: "/departments/engineering" },
  { title: "Finance", icon: CreditCard, href: "/departments/finance" },
  { title: "HR", icon: UserCheck, href: "/departments/hr" },
  { title: "Legal", icon: Scale, href: "/departments/legal" },
  { title: "Executive", icon: Crown, href: "/departments/executive" },
];

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDepartmentsOpen, setIsDepartmentsOpen] = useState(true);

  return (
    <div className={cn(
      "flex h-full flex-col border-r bg-background transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!isCollapsed && (
          <span className="font-inter font-medium text-sm text-muted-foreground">
            NAVIGATION
          </span>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {mainNavItems.map((item) => (
            <Button
              key={item.title}
              variant="ghost"
              className={cn(
                "w-full justify-start h-10",
                isCollapsed ? "px-2" : "px-3"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && (
                <span className="ml-3 truncate">{item.title}</span>
              )}
            </Button>
          ))}
        </nav>

        {/* Departments Section */}
        <div className="mt-6 px-3">
          <Collapsible open={isDepartmentsOpen} onOpenChange={setIsDepartmentsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-10 text-muted-foreground",
                  isCollapsed ? "px-2" : "px-3"
                )}
              >
                <Users className="h-4 w-4 shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="ml-3 truncate">Departments</span>
                    <ChevronRight className={cn(
                      "ml-auto h-4 w-4 transition-transform",
                      isDepartmentsOpen && "rotate-90"
                    )} />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            {!isCollapsed && (
              <CollapsibleContent className="space-y-1 mt-1">
                {departmentItems.map((item) => (
                  <Button
                    key={item.title}
                    variant="ghost"
                    className="w-full justify-start h-9 pl-6 text-sm"
                  >
                    <item.icon className="h-3 w-3 shrink-0" />
                    <span className="ml-3 truncate">{item.title}</span>
                  </Button>
                ))}
              </CollapsibleContent>
            )}
          </Collapsible>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-3">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start h-10",
            isCollapsed ? "px-2" : "px-3"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!isCollapsed && (
            <span className="ml-3 truncate">Settings</span>
          )}
        </Button>
      </div>
    </div>
  );
};