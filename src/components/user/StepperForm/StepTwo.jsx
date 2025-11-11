import React from "react";
import TextEditor from "../../common/TextEditor";
// import TextEditor from "./TextEditor"; // Adjust the import path as needed

const StepTwo = ({ formData, handleChange }) => {
  const apikey = import.meta.env.VITE_TEXT_EDITOR_API_KEY;

  const handleEditorChange = (name, content) => {
    handleChange({ target: { name, value: content } });
  };

  const renderEditor = (label, name, height = 600, required = false, note = "") => (
    <div className="mb-6">
      <label className="block mb-1 font-medium">
        {label}{required && " *"}
      </label>
      <div style={{ height: `${height}px` }}>
        <TextEditor
          apiKey={apikey}
          value={formData[name]}
          onChange={(content) => handleEditorChange(name, content)}
          height={400}
        />
      </div>
      {note && <p className="text-xs text-red-500 mt-1">{note}</p>}
    </div>
  );

  return (
    <>
      <h2 className="text-xl mb-4 font-bold">Step 2: Manuscript Details</h2>

      {renderEditor("Title", "title", 500, true, "Enter title of your manuscript — only characters with space allowed.")}
      {renderEditor("Abstract", "abstract", 650, true, "The Abstract should be minimum 15278 words, not more than 500000.")}
      {renderEditor("Introduction", "introduction")}
      {renderEditor("Materials And Methods", "materials_and_methods")}
      {renderEditor("Results", "results")}
      {renderEditor("Discussion", "discussion")}
      {renderEditor("Conclusion", "conclusion")}
      {renderEditor("Author Contributions", "author_contributions")}
      {renderEditor("Conflict of Interest Statement", "conflict_of_interest_statement")}
    </>
  );
};

export default StepTwo;