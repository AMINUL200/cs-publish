const StepOne = ({ formData, handleChange }) => (
  <>
    <h2 className="text-xl mb-4 font-bold">Step 1: Article Submission Info</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block mb-1 font-medium">Type of Article *</label>
        <select
          name=" type_of_article"
          value={formData. type_of_article}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select</option>
          <option value="Research">Research</option>
          <option value="Review">Review</option>
          <option value="Case Study">Case Study</option>
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
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select</option>
          <option value="Mr.Pitu KUMAR">Mr.Pitu KUMAR</option>
          <option value="Dr.Aminul Islam">Dr.Aminul Islam</option>
        </select>
      </div>
    </div>

    {/* Full-width input for Add Author */}
    <div className="mt-4">
      <label className="block mb-1 font-medium">Add Author</label>
      <input
        type="text"
        name="add_author"
        value={formData.add_author}
        onChange={handleChange}
        placeholder="Enter co-author names"
        className="w-full p-2 border rounded"
      />
    </div>
  </>
);

export default StepOne;
