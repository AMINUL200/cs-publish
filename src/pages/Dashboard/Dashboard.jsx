import React from 'react'
import AdminDashboard from '../../components/admin/dashboard/AdminDashboard'
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { userData } = useSelector((state) => state.auth);
  return (
    <>
    <h1>Dashboard</h1>
      {userData.user_type === 1 && <AdminDashboard />}
    </>
  )
}

export default Dashboard
