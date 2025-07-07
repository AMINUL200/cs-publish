import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from 'react-router-dom';

import './css/style.css';
// import './css/additional-styles/LandingPage.css'



// Import pages
import AppLayout from './layout/AppLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import ProfilePage from './pages/Profile/ProfilePage';
import SignIn from './pages/Auth/SignIn';
import { ToastContainer } from 'react-toastify';
import SignUp from './pages/Auth/SignUp';
import { useSelector } from 'react-redux';
import HomePage from './pages/landingpage/HomePage';
import ChecklistPage from './pages/Articlemanager/ChecklistPage';
import AddBlog from './components/admin/blog/AddBlog';
import ViewBlog from './components/admin/blog/ViewBlog';
import BlogCategories from './components/admin/blog/BlogCategories';
import AddCategory from './components/admin/blog/AddCategory';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Protected Route Component
  const ProtectedRoute = ({ isAuthenticated, redirectPath = '/' }) => {
    if (!isAuthenticated) {
      return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
  };

  // Public Route Component (for already authenticated users)
  const PublicRoute = ({ isAuthenticated, redirectPath = '/dashboard' }) => {
    if (isAuthenticated) {
      return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
  };


  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          {/* Public routes - only accessible when not authenticated */}
          <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
            <Route index path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          {/* Protected routes - only accessible when authenticated */}
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* Add more protected routes here */}


              {/* Admin */}
              <Route path="/articlemanager/checklist" element={<ChecklistPage />} />
              {/* blog */}
              <Route path="/blog/add" element={<AddBlog/>} />
              <Route path="/blog/view" element={<ViewBlog />} />
              <Route path="/blog/categories" element={<BlogCategories />} />
              <Route path="/blog/addCategoryBlogpage" element={<AddCategory />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
