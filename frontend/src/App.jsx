import React, { useEffect, useTransition } from 'react'
import { Loader } from "lucide-react"
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import SideBar from './components/SideBar'
import SignupPage from './components/SignupPage'
import LoginPage from './components/LoginPage'
import DashboardPage from './components/DashboardPage'
import ProjectsPage from './components/ProjectsPage'
import TaskPage from './components/TaskPage'
import TeamPage from './components/TeamPage'
import SettingsPage from './components/SettingsPage'

import { useAuthStore } from './store/useAuthStore'



const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  )

  const location = useLocation();

  const hideUI = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen bg-[#060a1f] text-white">
      {!hideUI && <SideBar />}

      <div className={`${!hideUI ? "pl-20 md:pl-64 transition-all duration-300" : ""}`}>
        {!hideUI && <Navbar />}

        <main className={`${!hideUI ? "p-8" : ""}`}>
          <Routes>
            <Route
              path="/"
              element={authUser ? <DashboardPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/register"
              element={!authUser ? <SignupPage /> : <Navigate to="/" />}
            />
            <Route
              path="/login"
              element={!authUser ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
              path="/projects"
              element={authUser ? <ProjectsPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/tasks"
              element={authUser ? <TaskPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/team"
              element={authUser ? <TeamPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/settings"
              element={authUser ? <SettingsPage /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App