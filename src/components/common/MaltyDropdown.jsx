import React, { useState, useEffect, useRef } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

// Reusable recursive MenuItem
const MenuItem = ({ item }) => {
  const [open, setOpen] = useState(false);

  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  return (
    <li className="relative">
      {hasChildren ? (
        <>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex w-full items-center justify-between px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition duration-150"
          >
            {item.label}
            <ChevronRightIcon
              className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-90 text-blue-600" : "text-gray-400"
                }`}
            />
          </button>
          {open && (
            <ul className="ml-3 mt-2 border-l border-gray-200 pl-2 space-y-1">
              {item.children.map((child) => (
                <MenuItem key={child.id} item={child} />
              ))}
            </ul>
          )}
        </>
      ) : (
        <a
          href={item.link}
          className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition duration-150"
        >
          {item.label}
        </a>
      )}
    </li>
  );
};

const MaltyDropdown = () => {
  const [menuData, setMenuData] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Simulate API fetch
  useEffect(() => {
    const data = [
      {
        id: 1,
        label: "Dashboard",
        link: "/dashboard",
      },
      {
        id: 2,
        label: "Settings",
        children: [
          {
            id: 21,
            label: "Profile",
            link: "/settings/profile",
          },
          {
            id: 22,
            label: "Billing",
            children: [
              {
                id: 221,
                label: "Invoices",
                link: "/settings/billing/invoices",
              },
              {
                id: 222,
                label: "Payment",
                children: [
                  {
                    id: 223,
                    label: "Phone Pay",
                    link: "/settings/billing/payment/phonepay",
                  },
                  {
                    id: 224,
                    label: "Razor Pay",
                    link: "/settings/billing/payment/razorpay",
                  },
                  {
                    id: 225,
                    label: "Google Pay",
                    link: "/settings/billing/payment/googlepay",
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
    setMenuData(data);
  }, []);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex gap-2 items-center bg-gradient-to-r from-blue-600 to-purple-500 text-white px-5 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
      >
        Menu
        <ChevronRightIcon
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-90 text-white" : "text-white"
            }`}
        />
      </button>

      {open && (
        <ul className="absolute mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-3 space-y-1 z-20 animate-fadeIn">
          {menuData.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default MaltyDropdown;
