import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

import "./css/style.css";
// import './css/additional-styles/LandingPage.css'

// Import pages
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProfilePage from "./pages/Profile/ProfilePage";
import SignIn from "./pages/Auth/SignIn";
import { ToastContainer } from "react-toastify";
import SignUp from "./pages/Auth/SignUp";
import { useSelector } from "react-redux";
import HomePage from "./pages/landingpage/HomePage";
import ChecklistPage from "./pages/Articlemanager/ChecklistPage";
import AddBlog from "./components/admin/blog/AddBlog";
import ViewBlog from "./components/admin/blog/ViewBlog";
import BlogCategories from "./components/admin/blog/BlogCategories";
import AddCategory from "./components/admin/blog/AddCategory";
import UpdateBlog from "./components/admin/blog/UpdateBlog";
import AddUser from "./pages/admin/userManager/AddUser";
import LatestNews from "./pages/admin/setting/LatestNews";
import AddNews from "./pages/admin/setting/AddNews";
import UpdateNews from "./pages/admin/setting/UpdateNews";
import Contact from "./pages/admin/contact/Contact";
import UserCheckListPage from "./pages/user/checklist/UserCheckListPage";
import SubmitManuscript from "./pages/user/SubmitManuscript/SubmitManuscript";
import ViewUser from "./pages/admin/userManager/ViewUser";
import ViewGroups from "./pages/admin/Groups/ViewGroups";
import AddGroups from "./pages/admin/Groups/AddGroups";
import ViewCategories from "./pages/admin/Categories/ViewCategories";
import AddCategories from "./pages/admin/Categories/AddCategories";
import EditGroups from "./pages/admin/Groups/EditGroups";
import EditCategories from "./pages/admin/Categories/EditCategories";
import ViewJournal from "./pages/admin/JournalManger/ViewJournal";
import AddJournal from "./pages/admin/JournalManger/AddJournal";
import EditJournal from "./pages/admin/JournalManger/EditJournal";
import ReviewSubmission from "./pages/Reviewer/ReviewSubmission ";
import ReviewerManuscriptView from "./pages/Reviewer/ReviewerManuscriptView ";
import ReviewerDashboard from "./pages/Reviewer/ReviewerDashboard";
import EditorPermission from "./pages/admin/permission/EditorPermission";
import ReviewerPermission from "./pages/Editor/permission/ReviewerPermission";
import ViewSubmittedManuscript from "./pages/Articlemanager/ViewSubmittedManuscript";
import Payment from "./pages/admin/payment/Payment";
import EmailTemplate from "./pages/admin/email/EmailTemplate";
import EditorDashboard from "./pages/Editor/dashboard/EditorDashboard";
import EditorCheckList from "./pages/Editor/checklist/EditorCheckList";
import AssignedManuscript from "./pages/Editor/assigned manuscript/AssignedManuscript";
import AppLayout2 from "./layout/AppLayout2";
import AuthorViewSubmittedManuscript from "./pages/user/view submitted manuscript/AuthorViewSubmittedManuscript";
import AddReviewer from "./pages/Editor/add reviewer/AddReviewer";
import EditorMangeReviewer from "./pages/Editor/mange reviewer/EditorMangeReviewer";
import ReviewerActivationPage from "./pages/Editor/reviewer activation/ReviewerActivationPage";
import BlogDetails from "./pages/user/blog details/BlogDetails";
import UserBlogPage from "./pages/user/blog page/UserBlogPage";
import InnovationPage from "./pages/user/innovation/InnovationPage";
import InnoVationDetailsPage from "./pages/user/innovation/InnoVationDetailsPage";
import BookStorePage from "./pages/user/books page/BookStorePage";
import BookDetailsPage from "./pages/user/books page/BookDetailsPage";
import BookCartPage from "./pages/user/books page/BookCartPage";
import BookCheckoutPage from "./pages/user/books page/BookCheckoutPage";
import MentorsHubPage from "./pages/user/mentor hub/MentorsHubPage";
import MentorHubDetails from "./pages/user/mentor hub/MentorHubDetails";
import ResearchAndServicePage from "./pages/user/research service/ResearchAndServicePage";
import ResearchAndServicePageDetail from "./pages/user/research service/ResearchAndServicePageDetail";
import AuthorViewSubmitManuscriptDetail from "./pages/user/view submitted manuscript/AuthorViewSubmitManuscriptDetail";
import Demo from "./pages/user/view submitted manuscript/Demo";
import PublisherViewPendingManuscripts from "./pages/publisher/PublisherViewPendingManuscripts";
import PublisherViewPayments from "./pages/publisher/PublisherViewPayments";
import PublisherViewPublishedManuscript from "./pages/publisher/PublisherViewPublishedManuscript";
import PublisherViewReports from "./pages/publisher/PublisherViewReports";
import PublisherDesignManuscript from "./pages/publisher/PublisherDesignManuscript";
import PublisherViewManuscript from "./pages/publisher/PublisherViewManuscript";
import PublisherViewDesignManuscript from "./pages/publisher/PublisherViewDesignManuscript";
import TermsAndCondition from "./pages/user/company policy/TermsAndCondition";
import CompanyPolicy from "./pages/user/company policy/CompanyPolicy";
import HandleTermsAndCondition from "./pages/admin/policy/HandleTermsAndCondition";
import HandleCompanyPolicy from "./pages/admin/policy/HandleCompanyPolicy";
import { el } from "date-fns/locale/el";
import FeaturePayment from "./pages/admin/payment/FeaturePayment";
import ForgotPassword from "./pages/Auth/ForgetPassword";
import ArticleFrontView from "./pages/ArtiicleFrontView";
import HandlePaymentPolicy from "./pages/admin/policy/HandlePaymentPolicy";
import PaymentPolicy from "./pages/user/company policy/PaymentPolicy";
import HandleBannerPage from "./pages/admin/handle landing page/HandleBannerPage";
import HandleAbout from "./pages/admin/handle landing page/HandleAbout";
import AddAbout from "./pages/admin/handle landing page/AddAbout";
import HandlePartners from "./pages/admin/handle landing page/Handlepartners";

function App() {
  const { isAuthenticated, userData } = useSelector((state) => state.auth);

  console.log("app:: ", userData);

  // Protected Route Component
  const ProtectedRoute = ({ isAuthenticated, redirectPath = "/" }) => {
    if (!isAuthenticated) {
      return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
  };

  // Public Route Component (for already authenticated users)
  const PublicRoute = ({ isAuthenticated, redirectPath = "/dashboard", userData }) => {
    if (isAuthenticated) {
      // return <Navigate to={redirectPath} replace />;
      if(userData?.user_type == 4){
        return <Navigate to='/' replace/>;
      }else{
        return <Navigate to={redirectPath} replace/>;
      }

    }
    return <Outlet />;
  };

  // Custom route guard
  const PublicOrType4Route = ({ isAuthenticated, userData }) => {
    // if not logged in → allow
    if (!isAuthenticated) {
      return <Outlet />;
    }

    // if logged in and user_type === 4 → allow
    if (isAuthenticated && userData?.user_type == 4) {
      return <Outlet />;
    }

    // otherwise redirect to dashboard or some restricted page
    return <Navigate to="/dashboard" replace />;
  };

  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route
            element={
              <PublicOrType4Route
                isAuthenticated={isAuthenticated}
                userData={userData}
              />
            }
          >
            <Route element={<AppLayout2 />}>
              <Route index path="/" element={<HomePage />} />
              <Route path="/blog" element={<UserBlogPage />} />
              <Route path="/blog/:id" element={<BlogDetails />} />
              <Route path="/innovation" element={<InnovationPage />} />
              <Route
                path="/innovation/:id"
                element={<InnoVationDetailsPage />}
              />

              {/* Book Related route */}
              <Route path="/products" element={<BookStorePage />} />
              <Route path="/products/:id" element={<BookDetailsPage />} />
              <Route path="/cart" element={<BookCartPage />} />
              <Route path="/checkout" element={<BookCheckoutPage />} />

              {/* Mentors route */}
              <Route path="/mentors" element={<MentorsHubPage />} />
              <Route path="/mentors/:id" element={<MentorHubDetails />} />

              {/* Research Services */}
              <Route
                path="/research-services"
                element={<ResearchAndServicePage />}
              />
              <Route
                path="/research-services/:serviceId"
                element={<ResearchAndServicePageDetail />}
              />

              {/* company policy */}
              <Route path="/terms" element={<TermsAndCondition />} />
              <Route path="/policy" element={<CompanyPolicy />} />
              <Route path="/payment-policy" element={<PaymentPolicy />} />

              <Route path="/font-vew" element={<ArticleFrontView />} />
            </Route>
          </Route>

          <Route element={<PublicRoute isAuthenticated={isAuthenticated} userData={userData} />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/reviewer-activation"
              element={<ReviewerActivationPage />}
            />
          </Route>

          {/* Protected routes - only accessible when authenticated */}
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/contact" element={<Contact />} />

              {/* Add more protected routes here */}

              {/* Admin */}
              <Route path="/permission/editor" element={<EditorPermission />} />
              <Route
                path="/articlemanager/checklist"
                element={<ChecklistPage />}
              />
              <Route
                path="/articlemanager/view-manuscript"
                element={<ViewSubmittedManuscript />}
              />
              <Route path="/payment" element={<Payment />} />
              <Route path="/email-setting" element={<EmailTemplate />} />
              {/* blog */}
              <Route path="/blog/add" element={<AddBlog />} />
              <Route path="/blog/view" element={<ViewBlog />} />
              <Route path="/blog/view/:id" element={<UpdateBlog />} />
              <Route path="/blog/categories" element={<BlogCategories />} />
              <Route
                path="/blog/addCategoryBlogpage"
                element={<AddCategory />}
              />
              {/* setting */}
              <Route path="/setting/news" element={<LatestNews />} />
              <Route path="/setting/add-news" element={<AddNews />} />
              <Route path="/setting/news/:id" element={<UpdateNews />} />
              <Route
                path="/setting/terms"
                element={<HandleTermsAndCondition />}
              />
              <Route path="/setting/policy" element={<HandleCompanyPolicy />} />
              <Route path="/setting/payment-policy" element={<HandlePaymentPolicy />} />

              {/* user manger route */}
              <Route path="/users/add-user" element={<AddUser />} />
              <Route path="/view-users" element={<ViewUser />} />

              {/* Groups  */}
              <Route path="/groups/view-groups" element={<ViewGroups />} />
              <Route path="/groups/add-groups" element={<AddGroups />} />
              <Route path="/groups/edit/:id" element={<EditGroups />} />

              {/* Categories */}
              <Route
                path="/categories/add-categories"
                element={<AddCategories />}
              />
              <Route
                path="/categories/view-categories"
                element={<ViewCategories />}
              />
              <Route path="/categories/edit/:id" element={<EditCategories />} />

              {/* Journal Manger */}
              <Route path="/article-manger/journal" element={<ViewJournal />} />
              <Route
                path="/article-manger/journal/add-journal"
                element={<AddJournal />}
              />
              <Route
                path="/article-manger/journal/edit-journal/:id"
                element={<EditJournal />}
              />

              {/* Payment */}
              <Route path="/payment/featured-payment" element={<FeaturePayment />} />

              {/* handle landing page route */}
              <Route path="/landing-page/banner" element={<HandleBannerPage />} />
              <Route path="/landing-page/about-us" element={<HandleAbout />} />
              <Route path="/landing-page/add-about" element={<AddAbout />} />
              <Route path="/landing-page/partners" element={<HandlePartners />} />



              {/* ------------------------------------------ Admin Route End--------------------- */}

              {/* Editor */}
              <Route
                path="/permission/assigned-manuscript-reviewer"
                element={<ReviewerPermission />}
              />
              <Route
                path="/permission/check-list"
                element={<EditorCheckList />}
              />
              <Route
                path="/permission/add-reviewer"
                element={<AddReviewer />}
              />
              <Route
                path="/permission/manage-reviewer"
                element={<EditorMangeReviewer />}
              />
              <Route
                path="/assigned-manuscript"
                element={<AssignedManuscript />}
              />

              {/* Reviewer */}
              <Route path="/list-journals" element={<ReviewerDashboard />} />
              <Route
                path="/view-manuscript/:id"
                element={<ReviewerManuscriptView />}
              />
              <Route path="/submit-review/:id" element={<ReviewSubmission />} />

              {/* author */}
              <Route
                path="/confirmation/new-paper"
                element={<UserCheckListPage />}
              />
              <Route
                path="/confirmation/add-new-paper"
                element={<SubmitManuscript />}
              />
              <Route
                path="/confirmation/view-manuscript"
                element={<AuthorViewSubmittedManuscript />}
              />
              <Route
                path="/confirmation/view-manuscript/:id"
                element={<AuthorViewSubmitManuscriptDetail />}
              />
              {/* demo */}
              <Route
                path="/confirmation/view-details-manuscript"
                element={<AuthorViewSubmitManuscriptDetail />}
              />
              <Route
                path="/confirmation/view-details-manuscript2"
                element={<Demo />}
              />

              {/* Publisher */}
              <Route
                path="/publisher/view-manuscript/:id"
                element={<PublisherViewManuscript />}
              />
              <Route
                path="/publisher/manuscripts/pending"
                element={<PublisherViewPendingManuscripts />}
              />
              <Route
                path="/publisher/payments"
                element={<PublisherViewPayments />}
              />
              <Route
                path="/publisher/reports"
                element={<PublisherViewReports />}
              />
              <Route
                path="/publisher/manuscripts/published"
                element={<PublisherViewPublishedManuscript />}
              />

              <Route
                path="/publisher/manuscripts/design/:id"
                element={<PublisherDesignManuscript />}
              />
              <Route
                path="/publisher/manuscripts/view/:id"
                element={<PublisherViewDesignManuscript />}
              />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
