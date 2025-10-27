import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { landingLog } from "../../assets";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from '../../features/auth/AuthSlice';
import axios from "axios";
import { User2Icon } from "lucide-react";

const LandingHeader = ({ toggleMenu }) => {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const dropdownRefs = useRef({});
  const { isAuthenticated, userData, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL;

  // Logout handler
  //   const handleLogout = () => {
  //     dispatch(logout());
  //   };

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_URL}api/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      dispatch(logout());
      // toast.info(response.data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
      // toast.error(error.message)
      dispatch(logout());
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Updated navLinks with dropdown support
  const navLinks = [
    { id: "home", label: "Home", path: "/" },
    {
      id: "journals",
      label: "Journals",
      dropdown: [
        {
          id: "recent-journals",
          label: "Recent Journals",
          path: "/journals/recent",
        },
        {
          id: "published-journals",
          label: "Published Journals",
          path: "/journals/published",
        },
        {
          id: "categories",
          label: "Categories",
          dropdown: [
            {
              id: "science",
              label: "Science",
              path: "/journals/categories/science",
            },
            {
              id: "technology",
              label: "Technology",
              path: "/journals/categories/technology",
            },
            {
              id: "medicine",
              label: "Medicine",
              path: "/journals/categories/medicine",
            },
            {
              id: "engineering",
              label: "Engineering",
              path: "/journals/categories/engineering",
            },
          ],
        },
        { id: "archives", label: "Archives", path: "/journals/archives" },
      ],
    },
    {
      id: "post",
      label: "Post",
      dropdown: [
        { id: "latest-posts", label: "Latest Posts", path: "/posts/latest" },
        {
          id: "featured-posts",
          label: "Featured Posts",
          path: "/posts/featured",
        },
        { id: "author-posts", label: "Author Posts", path: "/posts/authors" },
      ],
    },
    {
      id: "research",
      label: "Research",
      dropdown: [
        {
          id: "ongoing-research",
          label: "Ongoing Research",
          path: "/research/ongoing",
        },
        {
          id: "completed-research",
          label: "Completed Research",
          path: "/research/completed",
        },
        {
          id: "research-areas",
          label: "Research Areas",
          dropdown: [
            {
              id: "artificial-intelligence",
              label: "Artificial Intelligence",
              path: "/research/ai",
            },
            {
              id: "machine-learning",
              label: "Machine Learning",
              path: "/research/ml",
            },
            {
              id: "data-science",
              label: "Data Science",
              path: "/research/data-science",
            },
            {
              id: "biotechnology",
              label: "Biotechnology",
              path: "/research/biotech",
            },
          ],
        },
        {
          id: "collaboration",
          label: "Collaboration",
          path: "/research/collaboration",
        },
      ],
    },
    {
      id: "services",
      label: "Services",
      dropdown: [
        {
          id: "consultation",
          label: "Consultation",
          path: "/services/consultation",
        },
        {
          id: "peer-review",
          label: "Peer Review",
          path: "/services/peer-review",
        },
        {
          id: "publication-support",
          label: "Publication Support",
          path: "/services/publication-support",
        },
        {
          id: "training",
          label: "Training Programs",
          path: "/services/training",
        },
      ],
    },
  ];

  // Helper function to get parent dropdown id from a sub-dropdown id
  const getParentDropdownId = (dropdownId) => {
    if (dropdownId.includes("-sub-")) {
      // Extract the parent id from sub-dropdown id
      const parts = dropdownId.split("-sub-");
      return parts[0];
    }
    return null;
  };

  // Helper function to check if one dropdown is a child of another
  const isChildDropdown = (childId, parentId) => {
    return childId.startsWith(parentId + "-sub-");
  };

  // Toggle dropdown function
  const toggleDropdown = (dropdownId) => {
    setOpenDropdowns((prev) => {
      const newState = { ...prev };

      // Close other main-level dropdowns (but not if we're opening a sub-dropdown)
      if (!dropdownId.includes("-sub-")) {
        // We're toggling a main dropdown, close other main dropdowns
        Object.keys(newState).forEach((key) => {
          if (key !== dropdownId && !key.includes("-sub-")) {
            newState[key] = false;
            // Also close all sub-dropdowns of the closed main dropdown
            Object.keys(newState).forEach((subKey) => {
              if (isChildDropdown(subKey, key)) {
                newState[subKey] = false;
              }
            });
          }
        });
      } else {
        // We're toggling a sub-dropdown
        const parentId = getParentDropdownId(dropdownId);

        // Close other sub-dropdowns at the same level (same parent)
        Object.keys(newState).forEach((key) => {
          if (key !== dropdownId && getParentDropdownId(key) === parentId) {
            newState[key] = false;
            // Also close nested sub-dropdowns
            Object.keys(newState).forEach((nestedKey) => {
              if (isChildDropdown(nestedKey, key)) {
                newState[nestedKey] = false;
              }
            });
          }
        });
      }

      // Toggle the current dropdown
      newState[dropdownId] = !prev[dropdownId];
      return newState;
    });
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      let clickedOutside = true;
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && ref.contains(event.target)) {
          clickedOutside = false;
        }
      });
      if (clickedOutside) {
        setOpenDropdowns({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle navigation click
  const handleNavClick = (path) => {
    if (path && path.startsWith("#")) {
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    }
    setOpenDropdowns({});
  };

  // Render dropdown items recursively
  const renderDropdownItem = (item, level = 1) => {
    const hasSubDropdown = item.dropdown && item.dropdown.length > 0;
    const dropdownKey = `${item.id}-sub-${level}`;
    const isOpen = openDropdowns[dropdownKey];

    return (
      <div key={item.id} className="relative group">
        {hasSubDropdown ? (
          <div
            className={`flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#ffba00] cursor-pointer transition-colors ${
              level > 1 ? "pl-8" : ""
            }`}
            onClick={() => toggleDropdown(dropdownKey)}
          >
            <span>{item.label}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        ) : (
          <RouterLink
            to={item.path}
            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#ffba00] transition-colors ${
              level > 1 ? "pl-8" : ""
            }`}
            onClick={() => setOpenDropdowns({})}
          >
            {item.label}
          </RouterLink>
        )}

        {hasSubDropdown && isOpen && (
          <div className="bg-gray-50 border-l-2 border-[#ffba00] ml-2">
            {item.dropdown.map((subItem) =>
              renderDropdownItem(subItem, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  // Render navigation item
  const renderNavItem = (item) => {
    const hasDropdown = item.dropdown && item.dropdown.length > 0;
    const isOpen = openDropdowns[item.id];

    return (
      <div
        key={item.id}
        className="relative"
        ref={(el) => (dropdownRefs.current[item.id] = el)}
      >
        {hasDropdown ? (
          <div
            className={`text-gray-700 font-semibold hover:text-[#ffba00] cursor-pointer transition-colors px-2 py-1 flex items-center space-x-1 ${
              isOpen ? "text-[#ffba00]" : ""
            }`}
            onClick={() => toggleDropdown(item.id)}
          >
            <span>{item.label}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        ) : (
          <RouterLink
            to={item.path}
            className="text-gray-700 font-semibold hover:text-[#ffba00] cursor-pointer transition-colors px-2 py-1 flex items-center space-x-1"
            onClick={() => setOpenDropdowns({})}
          >
            {item.label}
          </RouterLink>
        )}

        {hasDropdown && isOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="py-2">
              {item.dropdown.map((dropdownItem) =>
                renderDropdownItem(dropdownItem)
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md py-2"
          : "bg-white/90 backdrop-blur-sm py-4"
      }`}
    >
      <div
        className="px-8 flex justify-between items-center"
        style={{ margin: "0 auto" }}
      >
        {/* Logo */}
        <div className="flex items-center">
          <div
            className="text-2xl font-bold text-indigo-600 flex items-center cursor-pointer"
            onClick={() => handleNavClick("#home")}
          >
            <img src={landingLog} alt="logo" height={10} className="h-8 md:h-14" />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((item) => renderNavItem(item))}

          {/* ✅ Auth Button Logic */}
          {!isAuthenticated && (
            <RouterLink
              to="/signin"
              className="ml-4 custom-btn px-4 py-2 rounded-md  transition-all duration-300"
            >
              Login
            </RouterLink>
          )}

          {isAuthenticated && userData?.user_type == 4 && (
            <button
              onClick={handleLogout}
              className="ml-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-black transition-all duration-300 cursor-pointer"
            >
              Logout
            </button>
          )}

          {isAuthenticated && userData?.user_type != 4 && (
            <RouterLink
              to="/dashboard"
              className="ml-4 bg-[#ffba00] text-white px-4 py-2 rounded-md hover:bg-black transition-all duration-300"
            >
              Dashboard
            </RouterLink>
          )}

          <button
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon
              className="w-8 h-8"
              icon={faBars}
              style={{ height: "1.5rem" }}
            />
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          {!isAuthenticated && (
            <RouterLink
              to="/signin"
              className=" text-black px-3 py-1  text-sm border border-black rounded-4xl flex justify-center items-center"
            >
              {/* Login  */}
              <User2Icon className="inline-block w-6 h-6 ml-1 text-yellow-800" />
            </RouterLink>
          )}

          {isAuthenticated && userData?.user_type == 4 && (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
            >
              Logout
            </button>
          )}

          {isAuthenticated && userData?.user_type != 4 && (
            <RouterLink
              to="/dashboard"
              className="bg-[#ffba00] text-white px-3 py-1 rounded-md text-sm"
            >
              Dashboard
            </RouterLink>
          )}

          <button
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon
              className="w-8 h-8"
              icon={faBars}
              style={{ height: "1.5rem" }}
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
