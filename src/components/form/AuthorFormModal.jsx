import { useState, useEffect } from "react";

const AuthorFormModal = ({ authors, onAuthorChange, onAddAuthor, onRemoveAuthor, onSave }) => {
  const [localAuthors, setLocalAuthors] = useState(authors);

  useEffect(() => {
    setLocalAuthors(authors);
  }, [authors]);

  const handleInputChange = (index, field, value) => {
    const updatedAuthors = [...localAuthors];
    updatedAuthors[index][field] = value;
    setLocalAuthors(updatedAuthors);
    onAuthorChange(index, field, value);
  };

  const handleSave = () => {
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Author Information</h3>
        
        {localAuthors.map((author, index) => (
          <div key={index} className="mb-6 p-4 border rounded relative">
            {index > 0 && (
              <button
                type="button"
                onClick={() => onRemoveAuthor(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
            
            <h4 className="font-medium mb-2">Author {index + 1}</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Name *</label>
                <input
                  type="text"
                  value={author.name}
                  onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">Email *</label>
                <input
                  type="email"
                  value={author.email}
                  onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">University *</label>
                <input
                  type="text"
                  value={author.university}
                  onChange={(e) => handleInputChange(index, 'university', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">Affiliation *</label>
                <input
                  type="text"
                  value={author.affiliation}
                  onChange={(e) => handleInputChange(index, 'affiliation', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={onAddAuthor}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Add Another Author
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Authors
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthorFormModal;