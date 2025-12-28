import React from "react";
import { landingLog } from "../../assets";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const LandingFooter = ({
  settingsData = {},
  cmsPageList = [],
  policyData = [],
  loading = false,
}) => {
  // console.log(policyData);

  const sections = [
    {
      title: "Product and services",
      items: [
        // { name: "Discover Manuscript", path: "/view-published-manuscript-list" },
        { name: "Discover Journal", path: "/journal" },
        // { name: "Books Hub", path: "/products" },
        { name: "Mentors Hub", path: "/mentors" },
        { name: "Author Services", path: "/author-services" },
        { name: "Blog", path: "/blog" },
        { name: "Events & Conference", path: "/event-conference" },
        // { name: "Conference", path: "#" },
      ],
    },
    {
      title: "Resources",
      items: [
        // { name: "Data Depository", path: "#" },
        // { name: "Find protocols", path: "#" },
        { name: "Innovation", path: "/innovation" },
        { name: "Research Service", path: "/research-services" },
        { name: "Publication Charges", path: "/publication-charge" },
        { name: "OPen Access Policy", path: "/open-access-policy" },
        // { name: "Promote and Advertise", path: "#" }
      ],
    },
    {
      title: "Policies and access",
      items: [
        ...(cmsPageList?.policies_and_access?.length
          ? cmsPageList.policies_and_access.map((policies) => ({
              name: policies.page_title,
              path: `/cms-page/${policies.slug}`,
            }))
          : [{ name: "No Policies ", path: "#" }]),
          {name: "Author Hub", path:"/author-hub"},
          {name: "Editor Hub", path:"/editor-hub"},
          {name: "Subscription", path:"/subscription"},
      ],
    },
    {
      title: "Support and contact",
      items: [
        // ✅ Then dynamic CMS links if available
        ...(cmsPageList?.support_and_contact?.length
          ? cmsPageList.support_and_contact.map((support) => ({
              name: support.page_title,
              path: `/cms-page/${support.slug}`,
            }))
          : [{ name: "No support", path: "#" }]),
        // ✅ Static link first (example)
        { name: "Faq", path: "/faq" },
        { name: "Award", path: "/award" },
      ],
    },
  ];

  const legalLinks = [
    ...policyData.map((policy) => ({
      name: policy.page_title,
      path: `/policy-page/${policy.slug}`,
    })),
    { name: "Policy", path: "/policy" },
    { name: "Payment Policy", path: "/payment-policy" },
  ];

  return (
    <footer className="text-gray-800 relative bottom-0">
      <div className="mx-auto px-6 pt-12">
        {/* Main Links Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-6">
          <div className="mb-2 md:mb-16">
            <img
              src={settingsData?.image}
              alt="Company Logo"
              className="text-center mx-auto sm:mx-0"
            />
            <div className="space-y-1 mt-4 ml-4">
              <p className="text-[0.7rem]">{settingsData?.address_line1}</p>
              <p className="text-[0.7rem]">{settingsData?.address_line2}</p>
            </div>
            <div className="space-y-1 mt-4 ml-4">
              {/* Twitter Icon */}
              <a
                href={settingsData?.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-yellow-500 transition-colors duration-300 mr-2"
              >
                <FontAwesomeIcon icon={faTwitter} className="w-5 h-5" />
              </a>
              {/* instagram icon */}
              <a
                href={settingsData?.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-yellow-500 transition-colors duration-300 mr-2"
              >
                <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
              </a>
              {/* linkedin icon */}
              <a
                href={settingsData?.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-yellow-500 transition-colors duration-300 mr-2"
              >
                <FontAwesomeIcon icon={faLinkedin} className="w-5 h-5" />
              </a>
              {/* whatsapp icon */}
              <a
                href={settingsData?.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-yellow-500 transition-colors duration-300 mr-2"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
              </a>
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
      <div className="flex flex-wrap gap-2 justify-around bg-gray-500 p-4 text-white">
        <div>
          <img
            src="/images/creative_commons_white.png"
            className="h-9 w-25 object-fill"
          />
        </div>
        <div>
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
        <div></div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm bg-gray-700 w-full p-4 text-white">
        ©2023 cspublishinghouse.com All rights reserved.
      </div>
    </footer>
  );
};

export default LandingFooter;
