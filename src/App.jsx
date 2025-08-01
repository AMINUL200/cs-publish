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
import UpdateBlog from './components/admin/blog/UpdateBlog';
import AddUser from './pages/admin/userManager/AddUser';
import LatestNews from './pages/admin/setting/LatestNews';
import AddNews from './pages/admin/setting/AddNews';
import UpdateNews from './pages/admin/setting/UpdateNews';
import Contact from './pages/admin/contact/Contact';
import UserCheckListPage from './pages/user/checklist/UserCheckListPage';
import SubmitManuscript from './pages/user/SubmitManuscript/SubmitManuscript';
import ViewUser from './pages/admin/userManager/ViewUser';
import ViewGroups from './pages/admin/Groups/ViewGroups';
import AddGroups from './pages/admin/Groups/AddGroups';
import ViewCategories from './pages/admin/Categories/ViewCategories';
import AddCategories from './pages/admin/Categories/AddCategories';
import EditGroups from './pages/admin/Groups/EditGroups';
import EditCategories from './pages/admin/Categories/EditCategories';
import ViewJournal from './pages/admin/JournalManger/ViewJournal';
import AddJournal from './pages/admin/JournalManger/AddJournal';
import EditJournal from './pages/admin/JournalManger/EditJournal';

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
              <Route path="/contact" element={<Contact />} />

              {/* Add more protected routes here */}


              {/* Admin */}
              <Route path="/articlemanager/checklist" element={<ChecklistPage />} />
              {/* blog */}
              <Route path="/blog/add" element={<AddBlog />} />
              <Route path="/blog/view" element={<ViewBlog />} />
              <Route path="/blog/view/:id" element={<UpdateBlog />} />
              <Route path="/blog/categories" element={<BlogCategories />} />
              <Route path="/blog/addCategoryBlogpage" element={<AddCategory />} />
              {/* setting */}
              <Route path="/setting/news" element={<LatestNews/> } />
              <Route path="/setting/add-news" element={<AddNews/> } />
              <Route path="/setting/news/:id" element={<UpdateNews/> } />

              {/* user manger route */}
              <Route path='/users/add-user' element={<AddUser/>} />
              <Route path='/view-users' element={<ViewUser/>} />

              {/* Groups  */}
              <Route path='/groups/view-groups' element={<ViewGroups/>} />
              <Route path='/groups/add-groups' element={<AddGroups/>} />
              <Route path='/groups/edit/:id' element={<EditGroups/>} />

              {/* Categories */}
               <Route path='/categories/add-categories' element={<AddCategories/>} />
               <Route path='/categories/view-categories' element={<ViewCategories/>} />
               <Route path='/categories/edit/:id' element={<EditCategories/>} />

               {/* Journal Manger */}
               <Route path='/article-manger/journal' element={<ViewJournal/>} />
               <Route path='/article-manger/journal/add-journal' element={<AddJournal/>} />
               <Route path='/article-manger/journal/edit-journal/:id' element={<EditJournal/>} />



              {/* user */}
              <Route path='/confirmation/new-paper' element={<UserCheckListPage/>} />
              <Route path='/confirmation/add-new-paper' element={<SubmitManuscript/>} />

            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
