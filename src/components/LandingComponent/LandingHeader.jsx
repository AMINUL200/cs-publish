import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/AuthSlice";
import axios from "axios";
import { ChevronDown, UserCircle, User, Package, LogOut, Settings, CreditCard } from "lucide-react";

const LandingHeader = ({
  toggleMenu,
  settingsData = {},
  journalList = [],
  whoWeAreData = [],
  loading = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, userData, token } = useSelector(
    (state) => state.auth
  );

  const API_URL = import.meta.env.VITE_API_URL;

  const [scrolled, setScrolled] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileUserDropdownOpen, setMobileUserDropdownOpen] = useState(false);
  
  const dropdownRefs = useRef({});
  const userDropdownRef = useRef(null);
  const mobileUserDropdownRef = useRef(null);

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= CLOSE DROPDOWNS ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close nav dropdowns
      let clickedOutside = true;
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && ref.contains(event.target)) {
          clickedOutside = false;
        }
      });
      if (clickedOutside) {
        setOpenDropdowns({});
      }

      // Close user dropdown (desktop)
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }

      // Close user dropdown (mobile)
      if (mobileUserDropdownRef.current && !mobileUserDropdownRef.current.contains(event.target)) {
        setMobileUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}api/logout`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(logout());
      setUserDropdownOpen(false);
      setMobileUserDropdownOpen(false);
      navigate("/");
    }
  };

  /* ================= USER MENU ITEMS ================= */
  const userMenuItems = [
    {
      icon: UserCircle,
      label: "My Profile",
      path: "/my-profile",
    },
    {
      icon: Package,
      label: "My Subscription",
      path: "/my-subscription",
    },
   
  ];

  /* ================= HANDLE USER MENU CLICK ================= */
  const handleUserMenuClick = (item) => {
    if (item.path) {
      navigate(item.path);
    }
    setUserDropdownOpen(false);
    setMobileUserDropdownOpen(false);
  };

  /* ================= GET USER INITIALS ================= */
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  /* ================= NAV LINKS ================= */
  const navLinks = [
    { id: "home", label: "Home", path: "/" },
    {
      id: "whoweare",
      label: "Who We Are",
      dropdown: whoWeAreData.length
        ? whoWeAreData.map((w) => ({
            id: w.id,
            label: w.title,
            path: `/who-we-are/${w.slug}`,
          }))
        : [{ id: "no-who", label: "No Who We Are", path: "#" }],
    },
    {
      id: "journal",
      label: "Discover Journal",
      dropdown: journalList.length
        ? journalList.map((j) => ({
            id: j.id,
            label: j.j_title,
            path: `/journal/${j.j_title}`,
          }))
        : [{ id: "no-journal", label: "No Journals", path: "#" }],
    },
    { id: "mentor", label: "Mentor Hub", path: "/mentors" },
    {
      id: "service",
      label: "Service",
      dropdown: [
        { id: "author-services", label: "Author Services", path: "/author-services" },
        { id: "research-service", label: "Research Services", path: "/research-services" },
      ],
    },
  ];

  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /* ================= RENDER NAV ITEM ================= */
  const renderNavItem = (item) => {
    const isOpen = openDropdowns[item.id];
    const hasDropdown = item.dropdown?.length > 0;

    return (
      <div
        key={item.id}
        className="relative"
        ref={(el) => (dropdownRefs.current[item.id] = el)}
      >
        {hasDropdown ? (
          <button
            onClick={() => toggleDropdown(item.id)}
            className={`flex items-center gap-1 font-semibold transition-colors ${
              isOpen ? "text-[#ffba00]" : "text-gray-700 hover:text-[#ffba00]"
            }`}
          >
            {item.label}
            <ChevronDown
              size={16}
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        ) : (
          <RouterLink
            to={item.path}
            className="font-semibold text-gray-700 hover:text-[#ffba00] transition-colors"
          >
            {item.label}
          </RouterLink>
        )}

        {hasDropdown && isOpen && (
          <div className="absolute top-full left-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            {item.dropdown.map((d) => (
              <RouterLink
                key={d.id}
                to={d.path}
                onClick={() => setOpenDropdowns({})}
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#ffba00] first:rounded-t-lg last:rounded-b-lg"
              >
                {d.label}
              </RouterLink>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <header className="fixed w-full z-50 bg-white/90 backdrop-blur-sm shadow-md py-3">
        <div className="px-8 flex justify-between items-center animate-pulse">
          <div className="h-10 w-40 bg-gray-200 rounded-md"></div>
          <div className="hidden md:flex space-x-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-5 w-16 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="hidden md:block h-9 w-20 bg-gray-200 rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md py-2" : "bg-white/90 backdrop-blur-sm py-4"
        }`}
      >
        <div className="px-4 md:px-8 flex justify-between items-center">
          {/* Logo */}
          <div className="cursor-pointer" onClick={() => navigate("/")}>
            <img src={settingsData?.image} alt="logo" className="h-8 md:h-12" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(renderNavItem)}

            {/* Auth Section */}
            {!isAuthenticated ? (
              <RouterLink
                to="/signin"
                className="ml-4 bg-[#ffba00] text-white px-4 py-2 rounded-md hover:bg-black transition-all"
              >
                Login
              </RouterLink>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                {/* Dashboard Button */}
                {userData?.user_type != 4 && (
                  <RouterLink
                    to="/dashboard"
                    className="px-4 py-2 rounded-md bg-[#ffba00] text-white hover:bg-black transition-all"
                  >
                    Dashboard
                  </RouterLink>
                )}

                {/* User Dropdown (Desktop) */}
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-gray-100 ${
                      userDropdownOpen ? "bg-gray-100" : ""
                    }`}
                  >
                    {/* User Avatar */}
                    <div className="w-9 h-9 rounded-full bg-[#ffba00] flex items-center justify-center text-white font-semibold text-sm">
                      {getInitials(userData?.name)}
                    </div>

                    {/* User Info */}
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800 leading-tight">
                        {userData?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 leading-tight">
                        {userData?.email || "user@example.com"}
                      </p>
                    </div>

                    {/* Dropdown Icon */}
                    <ChevronDown
                      size={16}
                      className={`text-gray-600 transition-transform ${
                        userDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50 animate-fadeIn">
                      {/* User Info Header */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#ffba00] flex items-center justify-center text-white font-bold">
                            {getInitials(userData?.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              {userData?.name || "User"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {userData?.email || "user@example.com"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        {userMenuItems.map((item) => (
                          <button
                            key={item.label}
                            onClick={() => handleUserMenuClick(item)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-700 hover:bg-gray-100 transition-all text-left"
                          >
                            <item.icon size={18} className="text-gray-600" />
                            <span className="text-sm font-medium">{item.label}</span>
                          </button>
                        ))}

                        {/* Logout Button */}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-red-600 hover:bg-red-50 transition-all text-left mt-1 border-t border-gray-200"
                        >
                          <LogOut size={18} />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </nav>

          {/* Mobile Section */}
          <div className="md:hidden flex items-center space-x-3">
            {!isAuthenticated ? (
              <RouterLink
                to="/signin"
                className="px-3 py-1.5 text-sm bg-[#ffba00] text-white rounded-md"
              >
                Login
              </RouterLink>
            ) : (
              <>
                {/* Dashboard Button (Mobile) */}
                {userData?.user_type != 4 && (
                  <RouterLink
                    to="/dashboard"
                    className="px-3 py-1.5 text-sm bg-[#ffba00] text-white rounded-md"
                  >
                    Dashboard
                  </RouterLink>
                )}

                {/* User Dropdown (Mobile) */}
                <div className="relative" ref={mobileUserDropdownRef}>
                  <button
                    onClick={() => setMobileUserDropdownOpen(!mobileUserDropdownOpen)}
                    className="w-9 h-9 rounded-full bg-[#ffba00] flex items-center justify-center text-white font-semibold text-sm"
                  >
                    {getInitials(userData?.name)}
                  </button>

                  {/* Mobile User Dropdown Menu */}
                  {mobileUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 animate-fadeIn">
                      {/* User Info Header */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-[#ffba00] flex items-center justify-center text-white font-bold text-base">
                            {getInitials(userData?.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {userData?.name || "User"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {userData?.email || "user@example.com"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        {userMenuItems.map((item) => (
                          <button
                            key={item.label}
                            onClick={() => handleUserMenuClick(item)}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-gray-700 hover:bg-gray-100 transition-all text-left"
                          >
                            <item.icon size={18} className="text-gray-600" />
                            <span className="text-sm font-medium">{item.label}</span>
                          </button>
                        ))}

                        {/* Logout Button */}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-red-600 hover:bg-red-50 transition-all text-left mt-1 border-t border-gray-200"
                        >
                          <LogOut size={18} />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <button onClick={toggleMenu} aria-label="Toggle menu">
              <FontAwesomeIcon icon={faBars} className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default LandingHeader;