import React, { useEffect } from 'react'
import { Loader } from "lucide-react"
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import SideBar from './components/SideBar'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailsPage from './pages/ProjectDetailsPage'
import TaskPage from './pages/TaskPage' 
import TeamPage from './pages/TeamPage'
import SettingsPage from './pages/SettingsPage'
import AcceptInvitePage from './pages/AcceptInvitePage'

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
              path="/projects/:id"
              element={authUser ? <ProjectDetailsPage /> : <Navigate to="/login" />}
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
            <Route
              path="/accept-invite"
              element={authUser ? <AcceptInvitePage /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App