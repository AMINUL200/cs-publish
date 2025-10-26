import React from "react";
import AdminDashboard from "../../components/admin/dashboard/AdminDashboard";
import { useSelector } from "react-redux";
import AuthorDashboard from "../user/dashboard/AuthorDashboard";
import ReviewerDashboard from "../Reviewer/ReviewerDashboard";
import EditorDashboard from "../Editor/dashboard/EditorDashboard";
import PublisherDashboard from "../publisher/PublisherDashboard";

const Dashboard = () => {
  const { userData } = useSelector((state) => state.auth);

  console.log("User Data in Dashboard:", userData);

  return (
    <>
      {/* Admin  */}
      {userData.user_type == 0 && <AdminDashboard />}

      {/* Editor */}
      {userData.user_type == 1 && <EditorDashboard />}

      {/* Author */}
      {userData.user_type == 2 && <AuthorDashboard />}

      {/* Reviewer */}
      {userData.user_type == 3 && <ReviewerDashboard />}

    
      {userData.user_type == 5 && <PublisherDashboard />}
    </>
  );
};

export default Dashboard;
