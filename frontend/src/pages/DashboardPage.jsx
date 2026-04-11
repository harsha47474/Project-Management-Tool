import React from 'react'
import { useAuthStore } from '../store/useAuthStore';

const DashboardPage = () => {
  const { logout, authUser } = useAuthStore();
  console.log(authUser);

  return (
    <></>
  )
}

export default DashboardPage