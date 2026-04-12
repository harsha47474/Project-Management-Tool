import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PlusCircle
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const SideBar = () => {
  const location = useLocation();
  const { logout } = useAuthStore();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", key: 1, path: "/" },
    { icon: FolderKanban, label: "Projects", key: 2, path: "/projects" },
    { icon: ListTodo, label: "Tasks", key: 3, path: "/tasks" },
    { icon: Users, label: "Team", key: 4, path: "/team" },
  ];

  const bottomItems = [
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out z-50 flex flex-col w-64`}
    >
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <PlusCircle className="text-white" size={20} />
          </div>
          <span className="text-foreground font-bold text-lg tracking-tight">ProFlow</span>
        </div>
      </div>
      <hr className="border-border" />

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.key}
              to={item.path}
              className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all group ${isActive
                  ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <item.icon
                size={22}
                className={`flex-shrink-0 transition-colors ${isActive ? "text-blue-400" : "group-hover:text-foreground"
                  }`}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border space-y-2">
        {bottomItems.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className="flex items-center gap-4 px-3 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all group"
          >
            <item.icon size={22} className="flex-shrink-0 group-hover:text-foreground" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}

        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all group"
        >
          <LogOut size={22} className="flex-shrink-0" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;