import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { landingLog } from "../../assets";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/AuthSlice";
import axios from "axios";
import { User2Icon } from "lucide-react";
import { id } from "date-fns/locale/id";

const LandingHeader = ({
  toggleMenu,
  settingsData = {},
  journalList = [],
  whoWeAreData = [],
  loading = false,
}) => {
  console.log(whoWeAreData);

  const [scrolled, setScrolled] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const dropdownRefs = useRef({});
  const { isAuthenticated, userData, token } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_URL;

  // Remove the scroll effect useEffect since we don't need it anymore
  // useEffect(() => {
  //   if (location.state?.scrollTo && location.pathname === "/") {
  //     const timer = setTimeout(() => {
  //       scrollToSection(location.state.scrollTo);
  //       window.history.replaceState({ ...location.state, scrollTo: null }, "");
  //     }, 100);
  //     return () => clearTimeout(timer);
  //   }
  // }, [location]);

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
      id: "whoweare",
      label: "Who We Are",
      dropdown: whoWeAreData.length
        ? whoWeAreData.map((who) => ({
            id: `${who.id}`,
            label: who.title,
            path: `/who-we-are/${who.slug}`,
          }))
        : [{ id: "no-Who we are", label: "No Who We Are", path: "#" }],
    },
    {
      id: "journal",
      label: "Discover Journal",
      dropdown: journalList.length
        ? journalList.map((journal) => ({
            id: `${journal.id}`,
            label: journal.j_title,
            path: `/journal/${journal.j_title}`,
          }))
        : [{ id: "no-journal", label: "No Journals Available", path: "#" }],
    },
    { id: "mentor", label: "Mentor Hub", path: "/mentors" },
    { id: "service", label: "Author Service", path: "/author-services" }, // Simple route navigation
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

  // Remove scrollToSection function since we don't need it anymore
  // const scrollToSection = (id) => {
  //   const section = document.getElementById(id);
  //   if (section) {
  //     section.scrollIntoView({
  //       behavior: "smooth",
  //       block: "start",
  //     });
  //   }
  // };

  const handleNavClick = (path) => {
    // Simple navigation without scroll behavior
    navigate(path);
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
          <div
            className="text-gray-700 font-semibold hover:text-[#ffba00] cursor-pointer transition-colors px-2 py-1 flex items-center space-x-1"
            onClick={() => handleNavClick(item.path)}
          >
            {item.label}
          </div>
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

  if (loading) {
    return (
      <header className="fixed w-full z-50 bg-white/90 backdrop-blur-sm shadow-md py-3">
        <div className="px-8 flex justify-between items-center animate-pulse">
          {/* Skeleton for logo */}
          <div className="flex items-center">
            <div className="h-10 w-40 bg-gray-200 rounded-md"></div>
          </div>

          {/* Skeleton for nav links */}
          <div className="hidden md:flex space-x-6">
            <div className="h-5 w-16 bg-gray-200 rounded"></div>
            <div className="h-5 w-20 bg-gray-200 rounded"></div>
            <div className="h-5 w-24 bg-gray-200 rounded"></div>
            <div className="h-5 w-16 bg-gray-200 rounded"></div>
          </div>

          {/* Skeleton for button */}
          <div className="hidden md:block h-9 w-20 bg-gray-200 rounded"></div>
        </div>
      </header>
    );
  }

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
            onClick={() => navigate("/")}
          >
            <img
              src={settingsData?.image}
              alt="logo"
              height={10}
              className="h-8 md:h-14"
            />
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
            className="md:hidden  text-gray-700 focus:outline-none cursor-pointer"
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