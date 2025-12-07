import { cn } from "@/lib/utils";
import {
  ArrowLeftRight,
  BarChart3,
  ChartBarStacked,
  Home,
  Settings,
  Target,
  TrendingUp,
  type LucideIcon
} from "lucide-react";
import { NavLink, useLocation } from "react-router";

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: Home
  },
  {
    label: "Transactions",
    path: "/transactions",
    icon: ArrowLeftRight
  },
  {
    label: "Budgets",
    path: "/budgets",
    icon: Target
  },
  {
    label: "Categories",
    path: "/categories",
    icon: ChartBarStacked
  },
  {
    label: "Investments",
    path: "/investments",
    icon: TrendingUp
  },
  {
    label: "Reports",
    path: "/reports",
    icon: BarChart3
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings
  }
];

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname === path;
  };

  return (
    <aside className="w-64 border-r bg-muted/30">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
