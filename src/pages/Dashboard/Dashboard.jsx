import React from 'react'
import AdminDashboard from '../../components/admin/dashboard/AdminDashboard'
import { useSelector } from 'react-redux';
import AuthorDashboard from '../user/dashboard/AuthorDashboard';

const Dashboard = () => {
  const { userData } = useSelector((state) => state.auth);
  return (
    <>
      {userData.user_type === "1" ?
        <AdminDashboard /> :
        <AuthorDashboard />
      }

    </>
  )
}

export default Dashboard
