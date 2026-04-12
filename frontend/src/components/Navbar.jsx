import React from "react";
import { useLocation } from "react-router-dom";
import {
  Bell,
  MessageSquare,
  Settings,
  Search,
  User,
  Projector,
  ChevronDown,
  Sun,
  Moon
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

const Navbar = () => {
  const location = useLocation();
  const { authUser } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const getPageTitle = (path) => {
    switch (path) {
      case "/": return { title: "Dashboard", description: "Overview of all projects" };
      case "/projects": return { title: "Projects", description: "Manage your projects" };
      case "/tasks": return { title: "Tasks", description: "Manage your tasks" };
      case "/team": return { title: "Team", description: "Manage your team" };
      case "/settings": return { title: "Settings", description: "Manage your settings" };
      default: return { title: "Overview", description: "Overview of all projects" };
    }
  };

  return (
    <header className="h-20 bg-background/80 backdrop-blur-xl border-b border-border px-8 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300">
      <div className="flex flex-col items-start gap-1">
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          {getPageTitle(location.pathname).title}
        </h1>
        <p className="text-sm text-muted-foreground">{getPageTitle(location.pathname).description}</p>
      </div>

      <div className="flex items-center gap-4">

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="h-8 w-[1px] bg-border mx-2"></div>

        <button className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-xl hover:bg-muted transition-all group">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
            {authUser?.name?.charAt(0) || "U"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-foreground leading-tight">{authUser?.name || "User"}</p>
            <p className="text-[11px] text-muted-foreground font-medium tracking-wider">{authUser?.role || "User"}</p>
          </div>
          <ChevronDown size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;