// import React from 'react'

import { landingLog } from "../../assets";

const LandingFooter = () => {
  const sections = [
    {
      title: "Product and services",
      items: [
        "Discover journals",
        "Books Hub",
        "Mentors",
        "Author Services",
        "Blog",
        "Events",
        "Conference"
      ]
    },
    {
      title: "Resources",
      items: [
        "Data Depository",
        "Find protocols",
        "Innovation",
        "Liberians Portal",
        "Promote and Advertise"
      ]
    },
    {
      title: "Policies and access",
      items: [
        "Open access",
        "Subscription",
        "Membership",
        "Editor Hub",
        "Reviewer hub",
        "Author hub",
        "Reprint",
        "Partnership",
        "Legal info"
      ]
    },
    {
      title: "Support and contact",
      items: [
        "Press office",
        "Our team",
        "FAQ",
        "Live chat",
        "Career opportunities",
        "Fellowship",
        "Feedback"
      ]
    }
  ];

  const legalLinks = [
    "Privacy & Cookies",
    "Terms & Conditions",
    "Legal Disclaimer",
    "Refunds Policy",
    "AML policy"
  ];

  return (
    <footer className=" text-gray-800">
      <div className=" mx-auto px-6 pt-12">
        {/* Address Section */}


        {/* Main Links Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-6">
          <div className="mb-12">
            
            <img src={landingLog} alt="" />
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
                      <a href="#" className="text-[0.8rem] hover:text-[#ffba00] transition-colors ">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
           

          ))}
        </div>




      </div>
      {/* Divider */}
      {/* <div className="border-t border-gray-300 my-8"></div> */}

      {/* Legal Links */}
      <div className="flex flex-wrap gap-2 justify-center bg-gray-500 p-4 text-white">
        {legalLinks.map((link, index) => (
          <>
            <a key={index} href="#" className="text-sm hover:text-blue-600 transition-colors text-white">
              {link}
            </a>
            {index < legalLinks.length - 1 && "|"}
          </>

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
