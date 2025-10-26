import React from 'react'
import { landingLog } from "../../assets";
import { Link } from 'react-router-dom';

const LandingFooter = () => {
  const sections = [
    {
      title: "Product and services",
      items: [
        { name: "Discover journals", path: "#" },
        { name: "Books Hub", path: "/products" },
        { name: "Mentors", path: "/mentors" },
        { name: "Author Services", path: "#" },
        { name: "Blog", path: "/blog" },
        { name: "Events", path: "#" },
        { name: "Conference", path: "#" }
      ]
    },
    {
      title: "Resources",
      items: [
        { name: "Data Depository", path: "#" },
        { name: "Find protocols", path: "#" },
        { name: "Innovation", path: "/innovation" },
        { name: "Research Service", path: "/research-services" },
        { name: "Liberians Portal", path: "#" },
        { name: "Promote and Advertise", path: "#" }
      ]
    },
    {
      title: "Policies and access",
      items: [
        { name: "Open access", path: "#" },
        { name: "Subscription", path: "#" },
        { name: "Membership", path: "#" },
        { name: "Editor Hub", path: "#" },
        { name: "Reviewer hub", path: "#" },
        { name: "Author hub", path: "#" },
        { name: "Reprint", path: "#" },
        { name: "Partnership", path: "#" },
        { name: "Legal info", path: "#" }
      ]
    },
    {
      title: "Support and contact",
      items: [
        { name: "Press office", path: "#" },
        { name: "Our team", path: "#" },
        { name: "FAQ", path: "#" },
        { name: "Live chat", path: "#" },
        { name: "Career opportunities", path: "#" },
        { name: "Fellowship", path: "#" },
        { name: "Feedback", path: "#" }
      ]
    }
  ];

  const legalLinks = [
    { name: "Privacy & Cookies", path: "#" },
    { name: "Terms & Conditions", path: "/terms" },
    { name: "Legal Disclaimer", path: "#" },
    { name: "Policy", path: "/policy" },
    { name: "Payment Policy", path: "/payment-policy" }
  ];

  return (
    <footer className="text-gray-800 relative bottom-0">
      <div className="mx-auto px-6 pt-12">
        {/* Main Links Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-6">
          <div className="mb-12">
            <img src={landingLog} alt="Company Logo" />
            <div className="space-y-1 mt-4">
              <p className="text-[0.7rem]">Address line 1: Address here</p>
              <p className="text-[0.7rem]">Address line 2: Address here</p>
              <p className="text-[0.7rem]">Address line 3: Address here</p>
            </div>
          </div>
          
          {sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-lg font-semibold mb-4">{section.title}</h2>
              <ul className="space-y-2 pl-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="mb-0">
                    <Link 
                      to={item.path} 
                      className="text-[0.8rem] hover:text-[#ffba00] transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Links */}
      <div className="flex flex-wrap gap-2 justify-center bg-gray-500 p-4 text-white">
        {legalLinks.map((link, index) => (
          <React.Fragment key={index}>
            <a 
              href={link.path} 
              className="text-sm hover:text-[#ffba00] transition-colors text-white"
            >
              {link.name}
            </a>
            {index < legalLinks.length - 1 && <span className="mx-1">|</span>}
          </React.Fragment>
        ))}
      </div>
      
      {/* Copyright */}
      <div className="text-center text-sm bg-gray-700 w-full p-4 text-white">
        ©2023 republication.com All rights reserved.
      </div>
    </footer>
  )
}

export default LandingFooter