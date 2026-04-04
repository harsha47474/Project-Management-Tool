import React , { useEffect } from 'react'
import { Loader } from "lucide-react"
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import SignupPage from './components/SignupPage'
import LoginPage from './components/LoginPage'
import DashboardPage from './components/DashboardPage'
import { useAuthStore } from './store/useAuthStore'



const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(authUser)

  if(isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  )

  const location = useLocation();

  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";
  
  return (
    <div>
      {!hideNavbar && <Navbar />}

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
      </Routes>
    </div>
  );
}

export default App