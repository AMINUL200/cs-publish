import { useEffect } from "react";

const StepOne = ({ formData, setFormData, handleChange, journalData, authors, setAuthors, isUpdateMode = false }) => {

  const handleAddAuthor = () => {
    setAuthors([...authors, { name: "", email: "", university: "", affiliation: "" }]);
  };

  const handleAuthorChange = (index, field, value) => {
    const updatedAuthors = [...authors];
    updatedAuthors[index][field] = value;
    setAuthors(updatedAuthors);
  };

  const handleRemoveAuthor = (index) => {
    if (authors.length <= 1) return;

    const updatedAuthors = [...authors];
    updatedAuthors.splice(index, 1);
    setAuthors(updatedAuthors);
  };

  // Handle the add_myself dropdown properly as boolean
  const handleAddMyselfChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      add_myself: value === "true" || value === true ? true : false
    });
  };

  return (
    <>
      <h2 className="text-xl mb-4 font-bold">Step 1: Article Submission Info</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Select Journal *</label>
          <select
            name="journal_id"
            value={formData.journal_id}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${isUpdateMode ? 'bg-gray-200 cursor-not-allowed' : ''}`}
            required
            disabled={isUpdateMode} // Disable in update mode
          >
            <option value="">Select Journal</option>
            {journalData.map((journal) => (
              <option key={journal.id} value={journal.id}>
                {journal.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Username *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Mr.Pitu KUMAR"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Contact Number *</label>
          <input
            type="tel"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
            placeholder="9733499567"
            className="w-full p-2 border rounded"
            required
          />
          <p className="text-xs text-red-500">
            (SMS alert on status update will be sent to this mobile number)
          </p>
        </div>

        <div>
          <label className="block mb-1 font-medium">Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@example.com"
            className="w-full p-2 border rounded"
            required
          />
          <p className="text-xs text-red-500">
            (Email alert on status update will be sent to this email ID)
          </p>
        </div>

        <div>
          <label className="block mb-1 font-medium">Affiliation *</label>
          <input
            type="text"
            name="affiliation"
            value={formData.affiliation}
            onChange={handleChange}
            placeholder="IIT"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Plano, United States"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Country *</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="IN"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Add Myself *</label>
          <select
            name="add_myself"
            value={formData.add_myself}
            onChange={handleAddMyselfChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </div>
      </div>

      {/* Author Input Form Section */}
      <div className="mt-6 p-4 border rounded">
        <h3 className="text-lg font-bold mb-4">Author Information</h3>

        {authors.map((author, index) => (
          <div key={index} className="mb-6 p-4 border rounded relative">
            {authors.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveAuthor(index)}
                className="absolute top-2 right-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
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
                  onChange={(e) => handleAuthorChange(index, 'name', e.target.value)}
                  placeholder="Enter author name"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Email *</label>
                <input
                  type="email"
                  value={author.email}
                  onChange={(e) => handleAuthorChange(index, 'email', e.target.value)}
                  placeholder="author@example.com"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">University *</label>
                <input
                  type="text"
                  value={author.university}
                  onChange={(e) => handleAuthorChange(index, 'university', e.target.value)}
                  placeholder="University name"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Affiliation *</label>
                <input
                  type="text"
                  value={author.affiliation}
                  onChange={(e) => handleAuthorChange(index, 'affiliation', e.target.value)}
                  placeholder="Department/Institution"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddAuthor}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Add Another Author
        </button>
      </div>
    </>
  );
};

export default StepOne;