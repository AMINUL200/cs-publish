// src/components/sidebarRoutes.js
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faTachometerAlt,
  faUsers,
  faFolder,
  faBook,
  faNewspaper,
  faCog,
  faEnvelope,
  faCreditCard,
  faList,
  faLock,
  faCheckCircle,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import { DashboardIcon, ProfileIcon } from "../utils/icons";
import { icon } from "@fortawesome/fontawesome-svg-core";

export const sidebarRoutes = [
  {
    title: "Navigation",
    type: "header",
    allowedRoles: ["0", "1", "2", "3", "4", "5"],
  },
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: <FontAwesomeIcon icon={faTachometerAlt} />,
    allowedRoles: ["0", "1", "2", "3", "4", "5"],
  },
  {
    path: "/profile",
    title: "Profile",
    icon: <FontAwesomeIcon icon={faUser} />,
    allowedRoles: ["0", "1", "2", "3", "4", "5"],
  },
  // Admin only routes
  {
    title: "User Management",
    icon: <FontAwesomeIcon icon={faUsers} />,
    allowedRoles: ["0"],
    subRoutes: [
      {
        path: "/users/add-user",
        title: "Add User",
        allowedRoles: ["0"],
      },
      {
        path: "/view-users",
        title: "View Users",
        allowedRoles: ["0"],
      },
      {
        path: "/users/subscription-users",
        title: "Subscription Users",
        allowedRoles: ["0"],
      },
    ],
  },
  {
    title: "Permission",
    icon: <FontAwesomeIcon icon={faLock} />,
    allowedRoles: ["0", "1"],
    subRoutes: [
      {
        path: "/permission/editor",
        title: "Editor",
        allowedRoles: ["0"],
      },
      {
        path: "/permission/assigned-manuscript-reviewer",
        title: "Manuscript Assigned to Reviewer",
        allowedRoles: ["1"],
      },
      {
        path: "/permission/check-list",
        title: "Check List",
        allowedRoles: ["1"],
      },
      {
        path: "/permission/add-reviewer",
        title: "Add Reviewer",
        allowedRoles: ["1"],
      },
      {
        path: "/permission/manage-reviewer",
        title: "Manage Reviewer",
        allowedRoles: ["1"],
      },
    ],
  },
  {
    title: "Groups",
    icon: <FontAwesomeIcon icon={faFolder} />,
    allowedRoles: ["0"],
    subRoutes: [
      {
        path: "/groups/add-groups",
        title: "Add Group",
        allowedRoles: ["0"],
      },
      {
        path: "/groups/view-groups",
        title: "View Group",
        allowedRoles: ["0"],
      },
    ],
  },
  {
    title: "Categories",
    icon: <FontAwesomeIcon icon={faFolder} />,
    allowedRoles: ["0"],
    subRoutes: [
      {
        path: "/categories/add-categories",
        title: "Add Categories",
        allowedRoles: ["0"],
      },
      {
        path: "/categories/view-categories",
        title: "View Categories",
        allowedRoles: ["0"],
      },
    ],
  },
  {
    title: "Journal Manager",
    icon: <FontAwesomeIcon icon={faBook} />,
    allowedRoles: ["0"],
    subRoutes: [
      {
        path: "/article-manger/journal/add-journal",
        title: "Add Journal",
        allowedRoles: ["0"],
      },
      {
        path: "/article-manger/journal",
        title: "Journal",
        allowedRoles: ["0"],
      },
      {
        path: "/handle-volume",
        title: "Handle Volume",
        allowedRoles:["0"],
      },
    ],
  },
  {
    title: "Article Management",
    icon: <FontAwesomeIcon icon={faNewspaper} />,
    allowedRoles: ["0"],
    subRoutes: [
      {
        path: "/articlemanager/checklist",
        title: "Checklist",
        allowedRoles: ["0"],
      },
      {
        path: "/articlemanager/view-manuscript",
        title: "View Manuscript",
        allowedRoles: ["0"],
      },
    ],
  },
  {
    title: "Blog",
    icon: <FontAwesomeIcon icon={faComments} />,
    allowedRoles: ["0"],
    subRoutes: [
      {
        path: "/blog/add",
        title: "Add Blog",
        allowedRoles: ["0"],
      },
      {
        path: "/blog/view",
        title: "View Blog",
        allowedRoles: ["0"],
      },
      {
        path: "/blog/categories",
        title: "Blog Categories",
        allowedRoles: ["0"],
      },
    ],
  },
  {
    title: "Setting",
    icon: <FontAwesomeIcon icon={faCog} />,
    allowedRoles: ["0"],
    subRoutes: [
      {
        path: "/setting/setting",
        title: "Setting",
        allowedRoles: ["0"],
      },
      {
        path: "/setting/news",
        title: "Latest News",
        allowedRoles: ["0"],
      },
      {
        path: "/setting/add-news",
        title: "Add News",
        allowedRoles: ["0"],
      },
      {
        path: "/setting/terms",
        title: "Terms & Condition",
        allowedRoles: ["0"],
      },
      {
        path: "/setting/policy",
        title: "Policy",
        allowedRoles: ["0"],
      },
      {
        path: "/setting/payment-policy",
        title: "Payment Policy",
        allowedRoles: ["0"],
      },
      {
        path: "/setting/research",
        title: "Handle Research ",
        allowedRoles: ["0"],
      },
      {
        path: "/setting/service",
        title: "Handle Service ",
        allowedRoles: ["0"],
      },
      {
        path: "/setting/teams",
        title: "Handle Teams",
        allowedRoles: ["0"],
      },
      {
        path: "/setting/handle-faqs",
        title: "Handle Faqs",
        allowedRoles: ["0"],
      },
    ],
  },
  // {
  //   path: "/contact",
  //   title: "Contact",
  //   icon: <FontAwesomeIcon icon={faEnvelope} />,
  //   allowedRoles: ["0"],
  // },
  {
    // path: "/payment",
    title: "Payment",
    icon: <FontAwesomeIcon icon={faCreditCard} />,
    allowedRoles: ["0"],
    subRoutes: [
      {
        // path: "/payment",
        title: "Featured Payment",
        icon: <FontAwesomeIcon icon={faCreditCard} />,
        allowedRoles: ["0"],
        path: "/payment/featured-payment",
      },
      {
        title: "Subscription Plans",
        icon: <FontAwesomeIcon icon={faCreditCard} />,
        path: "/payment/subscription-plans",
        allowedRoles: ["0"],
      },
      {
        title: "Subscription History",
        icon: <FontAwesomeIcon icon={faCreditCard} />,
        allowedRoles: ["0"],
        path: "/payment/subscription-history",
      },
      {
        title: "Author Paid",
        icon: <FontAwesomeIcon icon={faCreditCard} />,
        allowedRoles:["0"],
        path: "/payment/author-paid"
      }
    ],
  },
  {
    path: "/email-setting",
    title: "Email Setting",
    icon: <FontAwesomeIcon icon={faCog} />,
    allowedRoles: ["0"],
  },
  {
    title: "Handle Landing Page",
    icon: <FontAwesomeIcon icon={faCog} />,
    allowedRoles: ["0"],
    subRoutes: [
      {
        path: "/landing-page/banner",
        title: "Manage Banners",
        allowedRoles: ["0"],
      },
      {
        path: "/landing-page/about-us",
        title: "Manage About Us",
        allowedRoles: ["0"],
      },
      {
        path: "/landing-page/partners",
        title: "Manage Partners",
        allowedRoles: ["0"],
      },
    ],
  },
  {
    title: "Handle CMS Page",
    icon: <FontAwesomeIcon icon={faCog} />,
    allowedRoles: ["0"],
    subRoutes: [
      {
        path: "/add-cms-page",
        title: "Add CMS Page",
        allowedRoles: ["0"],
      },
      {
        path: "/list-cms-page",
        title: "CMS Page",
        allowedRoles: ["0"],
      },
    ],
  },
  {
    title: "Handle Innovation",
    icon: <FontAwesomeIcon icon={faCog} />,
    allowedRoles: ["0"],
    subRoutes:[
      {
        path: "add-innovation",
        title: "Add Innovation",
        allowedRoles:["0"]
      },
      {
        path: "/handle-innovation",
        title: "List of Innovation",
        allowedRoles:["0"]
      }
    ]
  },
  // Reviewer route
  {
    path: "/list-journals",
    title: "Journals List",
    icon: <FontAwesomeIcon icon={faList} />,
    allowedRoles: ["3"],
  },

  // Editor route
  {
    path: "/assigned-manuscript",
    title: "View Assigned Manuscript",
    icon: <FontAwesomeIcon icon={faCheckCircle} />,
    allowedRoles: ["1"],
  },

  // Author route

  // {
  //   path: "/confirmation/view-details-manuscript",
  //   title: "View Details Manuscript",
  //   icon: <FontAwesomeIcon icon={faCheckCircle} />,
  //   allowedRoles: ["2"],
  // },
  // {
  //   path: "/confirmation/view-details-manuscript2",
  //   title: "View Details Manuscript",
  //   icon: <FontAwesomeIcon icon={faCheckCircle} />,
  //   allowedRoles: ["2"],
  // },

  // Publisher route
  // {
  //   path: "/publisher/manuscripts/pending",
  //   title: "Pending Manuscripts",
  //   icon: <FontAwesomeIcon icon={faList} />,
  //   allowedRoles: ["5"],
  // },
  // {
  //   path: "/publisher/payments",
  //   title: "Payments",
  //   icon: <FontAwesomeIcon icon={faCreditCard} />,
  //   allowedRoles: ["5"],
  // },
  {
    path: "/publisher/published-manuscripts-list",
    title: "Published Manuscripts",
    icon: <FontAwesomeIcon icon={faList} />,
    allowedRoles: ["5"],
  },
  // {
  //   path: "/publisher/reports",
  //   title: "Reports",
  //   icon: <FontAwesomeIcon icon={faList} />,
  //   allowedRoles: ["5"],
  // },
  // {
  //   path: "/publisher/manuscripts/design/:id",
  //   title: "Design Manuscript",
  //   icon: <FontAwesomeIcon icon={faList} />,
  //   allowedRoles: ["5"],
  // },
  // {
  //   path: "/publisher/manuscripts/view/:id",
  //   title: "View Design Manuscript",
  //   icon: <FontAwesomeIcon icon={faList} />,
  //   allowedRoles: ["5"],
  // },
];
