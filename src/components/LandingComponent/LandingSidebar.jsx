import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { logout } from "../../features/auth/AuthSlice";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";

const LandingSidebar = ({
  sidebarOpen,
  toggleSidebar,
  settingsData = {},
  journalList = [],
  whoWeAreData = [],
}) => {
  console.log(whoWeAreData);

  const { isAuthenticated, userData, token } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}api/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(logout());
    }
  };

  // Sidebar navigation data
  const sidebarLinks = [
    {
      name: "Home",
      path: "/",
    },

    {
      name: "Who We Are",
      path: null,
      dropdown: whoWeAreData.length
        ? whoWeAreData.map((who) => ({
            // id: `${who.id}`,
            name: who.title,
            path: `/who-we-are/${who.slug}`,
          }))
        : [{ id: "no-Who we are", label: "No Who We Are", path: "#" }],
    },
    {
      name: "Discover Journal",
      path: null,
      dropdown: journalList.length
        ? journalList.map((journal) => ({
            name: journal.j_title,
            path: `/journal/${journal.j_title}`,
          }))
        : [{ name: "No Journals Available", path: "#" }],
    },
    {
      name: "Mentor Hub",
      path: "/mentors",
    },
    {
      name: "Author Service",
      path: "/author-services",
    },
  ];

  // State for dropdown management
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Toggle dropdown function
  const toggleDropdown = (index) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Render navigation item with dropdown support
  const renderNavItem = (item, index, level = 0) => {
    const hasDropdown = item.dropdown && item.dropdown.length > 0;
    const isOpen = openDropdowns[`${level}-${index}`];
    const paddingLeft = level * 16; // Indent nested items

    return (
      <div key={`${level}-${index}`}>
        {/* Main nav item */}
        <div
          className={`flex items-center justify-between px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-yellow-600 transition-colors duration-200 font-medium cursor-pointer`}
          style={{ paddingLeft: `${16 + paddingLeft}px` }}
          onClick={
            hasDropdown ? () => toggleDropdown(`${level}-${index}`) : undefined
          }
        >
          {item.path ? (
            <a
              href={item.path}
              className="flex-1"
              onClick={(e) => {
                if (!hasDropdown) {
                  toggleSidebar();
                }
              }}
            >
              {item.name}
            </a>
          ) : (
            <span className="flex-1">{item.name}</span>
          )}

          {hasDropdown && (
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
          )}
        </div>

        {/* Dropdown items */}
        {hasDropdown && (
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-1 mt-1">
              {item.dropdown.map((dropdownItem, dropdownIndex) =>
                renderNavItem(dropdownItem, dropdownIndex, level + 1)
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Backdrop/Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Close sidebar"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Content */}
        <div className="p-6 space-y-6 overflow-y-auto h-full custom-scrollbar">
          {/* Navigation Links */}
          <nav className="space-y-2">
            {sidebarLinks.map((item, index) => renderNavItem(item, index))}
          </nav>

          {/* Divider */}
          <div className="border-t border-gray-200 pt-6 pb-22">
            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Connect With Us
              </h3>
              <div className="flex space-x-4">
                {settingsData?.twitter && (
                  <a
                    href={settingsData.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-gray-100 rounded-lg"
                  >
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                )}
                {settingsData?.linkedin && (
                  <a
                    href={settingsData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-gray-100 rounded-lg"
                  >
                    {/* <i className="fab fa-linkedin-in"></i> */}
                    <FontAwesomeIcon icon={faLinkedinIn} />
                  </a>
                )}
                {settingsData?.instagram && (
                  <a
                    href={settingsData.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-gray-100 rounded-lg"
                  >
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                )}
                {settingsData?.whatsapp && (
                  <a
                    href={settingsData.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-gray-100 rounded-lg"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} />
                  </a>
                )}
                {settingsData?.web && (
                  <a
                    href={settingsData.web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-gray-100 rounded-lg"
                  >
                    <FontAwesomeIcon icon={faGlobe} />
                  </a>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Contact Info
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                {settingsData?.phone && (
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>{settingsData.phone}</span>
                  </div>
                )}

                {settingsData?.email && (
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{settingsData.email}</span>
                  </div>
                )}

                {settingsData?.address_line1 && (
                  <div className="flex items-start space-x-2">
                    <svg
                      className="w-4 h-4 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{settingsData.address_line1}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8">
              {!isAuthenticated && (
                <button
                  onClick={() => navigate(`/signin`)}
                  //   to="/signin"
                  className="w-full custom-btn font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  Login
                  {/* <User2Icon className="inline-block w-6 h-6 ml-1 text-yellow-800" /> */}
                </button>
              )}

              {isAuthenticated && userData?.user_type == 4 && (
                <button
                  onClick={handleLogout}
                  className="w-full custom-btn font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  Logout
                </button>
              )}

              {isAuthenticated && userData?.user_type != 4 && (
                <RouterLink
                  to="/dashboard"
                  className="w-full custom-btn font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  Dashboard
                </RouterLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingSidebar;
