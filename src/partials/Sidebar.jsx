// src/components/Sidebar.js
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SidebarLinkGroup from "./SidebarLinkGroup";
import { landingLog } from "../assets";
import { useSelector } from "react-redux";
import { sidebarRoutes } from "./sidebarRoutes";
import { CloseIcon, ExpandIcon, ChevronDown } from "../utils/icons";

function Sidebar({ sidebarOpen, setSidebarOpen, variant = 'default' }) {
  const location = useLocation();
  const { pathname } = location;
  const { userData } = useSelector((state) => state.auth);
  const trigger = useRef(null);
  const sidebar = useRef(null);
  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // Close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  // Close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const renderRoute = (route, level = 0, parentIndex = 0) => {
    // Safety checks
    if (!route || !route.allowedRoles?.includes(userData?.user_type)) return null;
    // Create a unique key for each route
  const routeKey = `${route.path || route.title}-${level}-${parentIndex}`;

    if (route.type === "header") {
      return (
        <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
          <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6">
            •••
          </span>
          <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
            {route.title}
          </span>
        </h3>
      );
    }

    if (route.subRoutes) {
      const isActive = route.subRoutes.some(sub =>
        pathname.includes(sub.path) ||
        (sub.subRoutes && sub.subRoutes.some(subSub => pathname.includes(subSub.path)))
      );

      return (
        <SidebarLinkGroup
          key={routeKey}
          activecondition={isActive}
        >
          {(handleClick, open) => (
            <>
              <a
                href="#0"
                className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${isActive ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick();
                  setSidebarExpanded(true);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {route.icon && (
                      <div className={`shrink-0 ${isActive ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'
                        }`}>
                        {route.icon}
                      </div>
                    )}
                    <span className={`text-sm font-medium ${route.icon ? 'ml-4' : ''} lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200`}>
                      {route.title}
                    </span>
                  </div>
                  {route.subRoutes && <ChevronDown open={open} />}
                </div>
              </a>
              <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                <ul className={`pl-${4 + (level * 4)} mt-1 ${!open && "hidden"}`}>
                  {route.subRoutes.map((subRoute, index) => renderRoute(subRoute, level + 1, index))}
                </ul>
              </div>
            </>
          )}
        </SidebarLinkGroup>
      );
    }

    return (
      <li
        key={routeKey}
        className={`pl-${4 + (level * 4)} pr-3 py-2 rounded-lg mb-0.5 last:mb-0 ${pathname === route.path ? "bg-linear-to-r from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]" : ""
          }`}
      >
        
        <NavLink
          end
          to={route.path}
          className={({ isActive }) =>
            `block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${isActive ? "" : "hover:text-gray-900 dark:hover:text-white"
            }`
          }
        >
          <div className="flex items-center">
            {route.icon && (
              <div className={`shrink-0 ${pathname === route.path ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'
                }`}>
                {route.icon}
              </div>
            )}
            <span className={`text-sm font-medium ${route.icon ? 'ml-4' : ''} lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200`}>
              {route.title}
            </span>
          </div>
        </NavLink>
      </li>
    );
  };

  return (
    <div className="min-w-fit">
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-gray-900/30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex lg:flex! flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:w-64! shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-64"
          } ${variant === 'v2' ? 'border-r border-gray-200 dark:border-gray-700/60' : 'rounded-r-2xl shadow-xs'
          }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <CloseIcon />
          </button>
          {/* Logo */}
          <NavLink end to="/" className="block">
            <img src={landingLog} alt="Company Logo" />
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8">
          <ul className="mt-3">
            {sidebarRoutes.map((route) => renderRoute(route))}
          </ul>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto ">
          <div className="w-12 pl-4 pr-3 py-2">
            <button
              className="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400 cursor-pointer"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
            >
              <span className="sr-only">Expand / collapse sidebar</span>
              <ExpandIcon expanded={sidebarExpanded} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;