import React, { useState } from 'react';
import UserSidebar from '../../../components/user/UserSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const UserCheckListPage = () => {
  const navigate = useNavigate();
  // Array of checklist items
  const checklistItems = [
    {
      id: 1,
      text: "The submission has not been previously published.",
    },
    {
      id: 2,
      text: "The text is single-spaced; uses a 12-point font; employs italics, rather than underlining (except with URL addresses); and all illustrations, figures, and tables are placed within the text at the appropriate points, rather than at the end.",
    },
    {
      id: 3,
      text: "If submitting to a peer-reviewed section of the journal, the instructions in Ensuring a Blind Review have been followed.",
    },
    {
      id: 4,
      text: "I agreed to pay the prescribed amount for publishing my article in this journal",
    },
    {
      id: 5,
      text: "accept all terms and condition",
    },
    {
      id: 6,
      text: "DON'T PUT ANY RED COLOR AND DO A BEST WRITING PR",
    }
  ];

  // State to track checked items
  const [checkedItems, setCheckedItems] = useState(
    checklistItems.reduce((acc, item) => {
      acc[item.id] = false;
      return acc;
    }, {})
  );

  // Handle checkbox change
  const handleCheckboxChange = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Validate form before submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if all items are checked
    const allChecked = Object.values(checkedItems).every(Boolean);
    
    if (!allChecked) {
      toast.error('Please check all the checklist items before proceeding.');
      return;
    }else{
      navigate('/confirmation/add-new-paper')
    }
    
    // Proceed with submission if all checked
    // You can add your submission logic here
    console.log('All items checked, proceeding...');
    // navigate('/next-page'); // Uncomment if you have navigation
  };

  return (
    <>
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">New Manuscript</h1>
      </div>
      <div className="flex min-h-screen gap-4 flex-col lg:flex-row">
       
        {/* Main Content */}
        <div className=" p-8 bg-white border">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-lg font-semibold mb-6">Common.Submit New Manuscript</h2>

            <p className="mb-6">
              Indicate that this submission is ready to be considered by this journal by checking off the following
              (comments to the editor can be added below).
            </p>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-8 mt-4">
                {checklistItems.map((item) => (
                  <div key={item.id} className="flex items-start">
                    <input
                      type="checkbox"
                      id={`check-${item.id}`}
                      className="mt-1 mr-2"
                      checked={checkedItems[item.id]}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                    <label htmlFor={`check-${item.id}`} className="text-sm">
                      {item.text}
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mb-8">
                <button 
                  type="button"
                  className="px-4 py-2 bg-blue-100 text-orange-400 rounded hover:bg-blue-200 text-sm cursor-pointer transition-all duration-300"
                >
                  Download Paper Template
                </button>
                <button 
                  type="button"
                  className="px-4 py-2 bg-blue-100 text-orange-400 rounded hover:bg-blue-200 text-sm cursor-pointer transition-all duration-300"
                >
                  Download Copyright Form
                </button>
              </div>

              <div className="mb-8">
                <label htmlFor="comments" className="block text-sm font-medium mb-2">
                  Comments for the Editor: <span className="text-gray-500">(Optional)</span>
                </label>
                <textarea
                  id="comments"
                  className="w-full p-2 border rounded min-h-[100px] text-sm"
                  placeholder="Enter text"
                />
              </div>

              <div className='flex justify-end'>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer flex items-center"
                >
                  Next
                  <FontAwesomeIcon icon={faArrowCircleRight} className='ml-2'/>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCheckListPage;