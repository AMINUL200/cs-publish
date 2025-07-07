// src/components/JournalMenu.jsx
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBookOpen, 
  faLayerGroup, 
  faChevronDown, 
  faChevronRight,
  faFolder,
  faFolderOpen,
  faBook,
  faInfoCircle,
  faQuestionCircle,
  faMousePointer
} from '@fortawesome/free-solid-svg-icons';

const JournalMenu = () => {
  const [activeMenu, setActiveMenu] = useState({
    category: null,
    subcategory: null
  });
  const menuRef = useRef(null);

  const menuData = {
    categories: [
      {
        name: "Science",
        id: "science",
        subcategories: [
          {
            name: "Applied Mathematics And Statistics",
            id: "ams",
            journals: [
              "Journal of Organic Chemistry",
              "Journal of Nature Management"
            ]
          },
          {
            name: "Science-1",
            id: "science1",
            journals: ["No Journal"]
          },
          {
            name: "IITK",
            id: "iitk",
            journals: ["Index of Food Science"]
          },
          {
            name: "ASSAM",
            id: "assam",
            journals: ["No Journals"]
          }
        ]
      },
      {
        name: "Health",
        id: "health",
        subcategories: [
          {
            name: "Medicine",
            id: "medicine",
            journals: ["Earth and Planetary Science Journal"]
          },
          {
            name: "INDIA",
            id: "india",
            journals: ["No Journals"]
          },
          {
            name: "BIOTECHNOLOGY",
            id: "biotechnology",
            journals: ["No Journals"]
          }
        ]
      }
    ],
    uncategorized: ["No Category"]
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu({ category: null, subcategory: null });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleCategory = (categoryId) => {
    setActiveMenu(prev => ({
      category: prev.category === categoryId ? null : categoryId,
      subcategory: null
    }));
  };

  const toggleSubcategory = (subcategoryId) => {
    setActiveMenu(prev => ({
      ...prev,
      subcategory: prev.subcategory === subcategoryId ? null : subcategoryId
    }));
  };

  const hasValidJournals = (journals) => {
    return !(journals.length === 0 || 
            journals[0] === 'No Journal' || 
            journals[0] === 'No Journals');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-indigo-800 mb-8 flex items-center">
        <FontAwesomeIcon icon={faBookOpen} className="mr-3" />
        Journal Collections
      </h1>
      
      {/* Main Dropdown */}
      <div className="relative inline-block text-left mb-6" ref={menuRef}>
        <button
          onClick={() => toggleCategory(activeMenu.category ? null : 'open')}
          className="inline-flex justify-center w-full px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
        >
          <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
          Browse Categories
          <FontAwesomeIcon icon={faChevronDown} className="ml-2 mt-1" />
        </button>
        
        {/* Categories Menu */}
        {activeMenu.category && (
          <div className="absolute left-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1">
              {menuData.categories.map((category) => (
                <div key={category.id} className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategory(category.id);
                    }}
                    className={`flex items-center justify-between w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors duration-150 ${
                      activeMenu.category === category.id ? 'bg-indigo-50 text-indigo-900' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faFolder} className="mr-3 text-indigo-500" />
                      <span>{category.name}</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                  </button>
                  
                  {/* Subcategories Menu */}
                  {activeMenu.category === category.id && (
                    <div className="absolute left-full top-0 ml-1 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                      <div className="py-1">
                        {category.subcategories.map((subcategory) => (
                          <div key={subcategory.id} className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSubcategory(subcategory.id);
                              }}
                              className={`flex items-center justify-between w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors duration-150 ${
                                activeMenu.subcategory === subcategory.id ? 'bg-indigo-50 text-indigo-900' : ''
                              }`}
                            >
                              <div className="flex items-center">
                                <FontAwesomeIcon icon={faFolderOpen} className="mr-3 text-indigo-400" />
                                <span>{subcategory.name}</span>
                              </div>
                              {hasValidJournals(subcategory.journals) && (
                                <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                              )}
                            </button>
                            
                            {/* Journals List */}
                            {activeMenu.subcategory === subcategory.id && hasValidJournals(subcategory.journals) && (
                              <div className="absolute left-full top-0 ml-1 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-30 max-h-80 overflow-y-auto">
                                <div className="py-2 px-3">
                                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                    Journals
                                  </h4>
                                  <ul>
                                    {subcategory.journals.map((journal, index) => (
                                      <li 
                                        key={index}
                                        className="px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 rounded cursor-pointer flex items-center"
                                      >
                                        <FontAwesomeIcon icon={faBook} className="mr-2 text-indigo-300" />
                                        <span>{journal}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Uncategorized */}
              <div className="border-t border-gray-100 mt-1 pt-1">
                <a
                  href="#"
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors duration-150"
                >
                  <FontAwesomeIcon icon={faQuestionCircle} className="mr-3 text-gray-500" />
                  <span>{menuData.uncategorized[0]}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Selected Journal Display */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <FontAwesomeIcon icon={faInfoCircle} className="text-indigo-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">How to use</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Click on the "Browse Categories" button above to explore our journal collections. 
          Click on categories to see subcategories and available journals.
        </p>
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
          <p className="text-indigo-800 flex items-center">
            <FontAwesomeIcon icon={faMousePointer} className="mr-2" />
            <span>Currently selected journal will appear here</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default JournalMenu;