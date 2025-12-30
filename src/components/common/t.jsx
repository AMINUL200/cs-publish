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

const LandingHeader = ({
  toggleMenu,
  settingsData = {},
  journalList = [],
  whoWeAreData = [],
  loading = false,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRefs = useRef({});
  const userMenuRef = useRef(null);
  const userIconRef = useRef(null);
  const { isAuthenticated, userData, token } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_URL}api/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      dispatch(logout());
      navigate("/");
      setUserMenuOpen(false);
    } catch (error) {
      console.log(error);
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close user menu if clicked outside
      if (
        userMenuRef.current && 
        !userMenuRef.current.contains(event.target) &&
        userIconRef.current && 
        !userIconRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
      
      // Close navigation dropdowns
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
    document.addEventListener("touchstart", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setUserMenuOpen(!userMenuOpen);
    // Close other dropdowns when opening user menu
    setOpenDropdowns({});
  };

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
    { 
      id: "service", 
      label: "Service",
      dropdown:[
        { id: "author-services", label: "Author Services", path: "/author-services" },
        { id: "research-service", label: "Research Services", path: "/research-services" },
      ]
    },
  ];

  const toggleDropdown = (dropdownId) => {
    setOpenDropdowns((prev) => {
      const newState = { ...prev };
      newState[dropdownId] = !prev[dropdownId];
      return newState;
    });
    // Close user menu when opening nav dropdown
    setUserMenuOpen(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setOpenDropdowns({});
    setUserMenuOpen(false);
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
              {item.dropdown.map((dropdownItem) => (
                <RouterLink
                  key={dropdownItem.id}
                  to={dropdownItem.path}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#ffba00] transition-colors"
                  onClick={() => setOpenDropdowns({})}
                >
                  {dropdownItem.label}
                </RouterLink>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // User dropdown component for desktop
  const UserDropdownDesktop = () => {
    const userName = userData?.name || userData?.email?.split('@')[0] || 'User';
    const userEmail = userData?.email || '';
    
    return (
      <div className="relative">
        <button
          ref={userIconRef}
          onClick={toggleUserMenu}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none"
        >
          <div className="w-8 h-8 bg-[#ffba00] rounded-full flex items-center justify-center text-white font-medium">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="text-left hidden lg:block">
            <p className="text-sm font-medium text-gray-700">{userName}</p>
            <p className="text-xs text-gray-500 truncate max-w-[150px]">{userEmail}</p>
          </div>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              userMenuOpen ? "rotate-180" : ""
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
        </button>

        {userMenuOpen && (
          <div 
            ref={userMenuRef}
            className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            <div className="p-4 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-700">{userName}</p>
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
            </div>
            
            <div className="py-2">
              <RouterLink
                to="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#ffba00] transition-colors"
                onClick={() => setUserMenuOpen(false)}
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </RouterLink>
              
              <RouterLink
                to="/my-subscription"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#ffba00] transition-colors"
                onClick={() => setUserMenuOpen(false)}
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                My Subscription
              </RouterLink>
              
              {userData?.user_type != 4 && (
                <RouterLink
                  to="/dashboard"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#ffba00] transition-colors"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                  Dashboard
                </RouterLink>
              )}
              
              <div className="border-t border-gray-100 my-2"></div>
              
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Mobile user icon component
  const MobileUserIcon = () => {
    const userName = userData?.name || userData?.email?.split('@')[0] || 'User';
    const userEmail = userData?.email || '';
    
    return (
      <div className="relative">
        <button
          ref={userIconRef}
          onClick={toggleUserMenu}
          className="focus:outline-none"
        >
          <div className="w-10 h-10 bg-[#ffba00] rounded-full flex items-center justify-center text-white font-medium">
            {userName.charAt(0).toUpperCase()}
          </div>
        </button>
        
        {userMenuOpen && (
          <div 
            ref={userMenuRef}
            className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            <div className="p-4 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-700">{userName}</p>
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
            </div>
            
            <div className="py-2">
              <RouterLink
                to="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#ffba00] transition-colors"
                onClick={() => {
                  setUserMenuOpen(false);
                  toggleMenu(); // Close mobile menu
                }}
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </RouterLink>
              
              <RouterLink
                to="/my-subscription"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#ffba00] transition-colors"
                onClick={() => {
                  setUserMenuOpen(false);
                  toggleMenu();
                }}
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                My Subscription
              </RouterLink>
              
              {userData?.user_type != 4 && (
                <RouterLink
                  to="/dashboard"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#ffba00] transition-colors"
                  onClick={() => {
                    setUserMenuOpen(false);
                    toggleMenu();
                  }}
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                  Dashboard
                </RouterLink>
              )}
              
              <div className="border-t border-gray-100 my-2"></div>
              
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
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
          <div className="flex items-center">
            <div className="h-10 w-40 bg-gray-200 rounded-md"></div>
          </div>
          <div className="hidden md:flex space-x-6">
            <div className="h-5 w-16 bg-gray-200 rounded"></div>
            <div className="h-5 w-20 bg-gray-200 rounded"></div>
            <div className="h-5 w-24 bg-gray-200 rounded"></div>
            <div className="h-5 w-16 bg-gray-200 rounded"></div>
          </div>
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
        className="px-4 sm:px-8 flex justify-between items-center"
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

          {/* Auth Section */}
          {!isAuthenticated ? (
            <RouterLink
              to="/signin"
              className="ml-4 custom-btn px-4 py-2 rounded-md transition-all duration-300"
            >
              Login
            </RouterLink>
          ) : (
            <UserDropdownDesktop />
          )}
        </nav>

        {/* Mobile Header Right Section */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Show user icon if logged in, otherwise login button */}
          {isAuthenticated ? (
            <MobileUserIcon />
          ) : (
            <RouterLink
              to="/signin"
              className="px-3 py-1.5 text-sm bg-[#ffba00] text-white rounded-md hover:bg-black transition-all duration-300"
            >
              Login
            </RouterLink>
          )}
          
          {/* Hamburger menu */}
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