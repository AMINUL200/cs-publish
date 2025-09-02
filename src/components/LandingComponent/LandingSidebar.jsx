import React, { useState } from 'react';

const LandingSidebar = ({ sidebarOpen, toggleSidebar }) => {
    // Sidebar navigation data
    const sidebarLinks = [
        {
            name: 'Home',
            path: '#home'
        },
        {
            name: 'About',
            path: '#about'
        },
        {
            name: 'Services',
            path: null,
            dropdown: [
                { name: 'Web Development', path: '#web-development' },
                { name: 'Mobile Apps', path: '#mobile-apps' },
                { 
                    name: 'Digital Marketing',
                    path: null,
                    dropdown: [
                        { name: 'SEO Services', path: '#seo' },
                        { name: 'Social Media', path: '#social-media' },
                        { name: 'Content Marketing', path: '#content-marketing' }
                    ]
                },
                { name: 'Consulting', path: '#consulting' }
            ]
        },
        {
            name: 'Portfolio',
            path: null,
            dropdown: [
                { name: 'Web Projects', path: '#web-projects' },
                { name: 'Mobile Projects', path: '#mobile-projects' },
                { name: 'Case Studies', path: '#case-studies' }
            ]
        },
        {
            name: 'Portfolio',
            path: null,
            dropdown: [
                { name: 'Web Projects', path: '#web-projects' },
                { name: 'Mobile Projects', path: '#mobile-projects' },
                { name: 'Case Studies', path: '#case-studies' }
            ]
        },
        {
            name: 'Portfolio',
            path: null,
            dropdown: [
                { name: 'Web Projects', path: '#web-projects' },
                { name: 'Mobile Projects', path: '#mobile-projects' },
                { name: 'Case Studies', path: '#case-studies' }
            ]
        },
        {
            name: 'Blog',
            path: '#blog'
        },
        {
            name: 'Contact',
            path: '#contact'
        }
    ];

    // State for dropdown management
    const [openDropdowns, setOpenDropdowns] = useState({});

    // Toggle dropdown function
    const toggleDropdown = (index) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [index]: !prev[index]
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
                    className={`flex items-center justify-between px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200 font-medium cursor-pointer`}
                    style={{ paddingLeft: `${16 + paddingLeft}px` }}
                    onClick={hasDropdown ? () => toggleDropdown(`${level}-${index}`) : undefined}
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
                            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    )}
                </div>

                {/* Dropdown items */}
                {hasDropdown && (
                    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
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
                    sidebarOpen ? 'translate-x-0' : 'translate-x-full'
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
                                <a
                                    href="#"
                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                    aria-label="Facebook"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                    aria-label="Twitter"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                    aria-label="LinkedIn"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                    aria-label="Instagram"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.897 3.5 13.539 3.5 12.017c0-1.523.698-2.88 1.626-3.674.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.794 1.626 2.151 1.626 3.674 0 1.522-.698 2.88-1.626 3.674-.875.807-2.026 1.297-3.323 1.297zm7.074 0c-1.297 0-2.448-.49-3.323-1.297-.928-.794-1.626-2.152-1.626-3.674 0-1.523.698-2.88 1.626-3.674.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.794 1.626 2.151 1.626 3.674 0 1.522-.698 2.88-1.626 3.674-.875.807-2.026 1.297-3.323 1.297z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="mt-6 space-y-3">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                Contact Info
                            </h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span>+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span>hello@example.com</span>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>123 Business Ave<br />Suite 100<br />City, State 12345</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="mt-8">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LandingSidebar;