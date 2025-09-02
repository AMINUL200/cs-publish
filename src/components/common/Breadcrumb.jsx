import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faFile, faFolder, faHome } from '@fortawesome/free-solid-svg-icons';

// Mock Link component for demo - replace with your router's Link
const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>
    {children}
  </a>
);

const Breadcrumb = ({ items = [], pageTitle = "", pageDescription = "" }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const getIcon = (type) => {
    switch (type) {
      case 'home':
        return <FontAwesomeIcon icon={faHome} className="w-4 h-4" />;
      case 'folder':
        return <FontAwesomeIcon icon={faFolder} className="w-4 h-4" />;
      case 'file':
        return <FontAwesomeIcon icon={faFile} className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative pt-10">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3Ccircle cx='53' cy='7' r='7'/%3E%3Ccircle cx='53' cy='53' r='7'/%3E%3Ccircle cx='7' cy='53' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-20 px-8">
        <div className="max-w-full mx-auto">
          {/* Combined Container */}
          <div className="relative backdrop-blur-md bg-white/70 border border-white/20 rounded-2xl shadow-xl shadow-black/5 p-8">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl" />

            <div className="relative z-10">
              {/* Page Title Section - Centered */}
              {pageTitle && (
                <div className="text-center">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {pageTitle}
                  </h1>

                  {pageDescription && (
                    <h5 className="text-lg text-gray-700 max-w-2xl mx-auto">
                      {pageDescription}
                    </h5>
                  )}
                </div>
              )}
              {/* Breadcrumb */}
              <nav className="flex justify-start  mt-2 mb-6" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm font-medium">
                  {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    const isHovered = hoveredIndex === index;

                    return (
                      <li
                        key={index}
                        className="flex items-center group"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        {/* Separator */}
                        {index > 0 && (
                          <div className="flex items-center mx-3">
                            <FontAwesomeIcon
                              icon={faChevronRight}
                              className="w-3 h-3 text-gray-400 transition-colors duration-200 group-hover:text-blue-500"
                            />
                          </div>
                        )}

                        {/* Breadcrumb Item */}
                        <div className="relative flex items-center">
                          {/* Hover background */}
                          <div
                            className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 transition-all duration-300 transform ${isHovered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                              }`}
                          />

                          <div className="relative flex items-center px-3 py-1 space-x-2">
                            {/* Icon */}
                            {item.icon && (
                              <div className={`transition-all duration-200 ${isHovered ? 'text-blue-600 scale-110' : 'text-gray-500'
                                }`}>
                                {getIcon(item.icon)}
                              </div>
                            )}

                            {/* Label */}
                            {item.path && !isLast ? (
                              <Link
                                to={item.path}
                                className={`relative transition-all duration-200 ${isHovered
                                    ? 'text-blue-600 transform translate-x-1'
                                    : 'text-gray-700 hover:text-blue-600'
                                  }`}
                              >
                                {item.label}

                                {/* Underline animation */}
                                <span
                                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${isHovered ? 'w-full' : 'w-0'
                                    }`}
                                />
                              </Link>
                            ) : (
                              <span
                                className={`transition-all duration-200 ${isLast
                                    ? 'text-gray-900 font-semibold'
                                    : 'text-gray-500'
                                  }`}
                              >
                                {item.label}
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </nav>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;