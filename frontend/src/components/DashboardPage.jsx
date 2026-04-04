import React from 'react'
import { useAuthStore } from '../store/useAuthStore';

const DashboardPage = () => {
  const { logout } = useAuthStore();

  return (
    <div>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default DashboardPage