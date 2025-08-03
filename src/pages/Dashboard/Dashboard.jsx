import React from 'react'
import AdminDashboard from '../../components/admin/dashboard/AdminDashboard'
import { useSelector } from 'react-redux';
import AuthorDashboard from '../user/dashboard/AuthorDashboard';
import ReviewerDashboard from '../Reviewer/ReviewerDashboard';
import EditorDashboard from '../Editor/dashboard/EditorDashboard';

const Dashboard = () => {
  const { userData } = useSelector((state) => state.auth);
  return (
    <>
      {userData.user_type === "0" &&
        <AdminDashboard /> 
      }
      {userData.user_type === "1" &&
        <EditorDashboard /> 
      }
      {userData.user_type === "2" &&
        <AuthorDashboard />
      }
      {userData.user_type === "3" &&
        <ReviewerDashboard />
      }

    </>
  )
}

export default Dashboard
