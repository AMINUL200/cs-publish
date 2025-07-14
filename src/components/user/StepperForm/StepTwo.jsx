import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const StepTwo = ({ formData, handleChange }) => {
  const apikey = import.meta.env.VITE_TEXT_EDITOR_API_KEY;

  const handleEditorChange = (name, content) => {
    handleChange({ target: { name, value: content } });
  };

  const renderEditor = (label, name, height = 200, required = false, note = "") => (
    <div className="mb-6">
      <label className="block mb-1 font-medium">{label}{required && " *"}</label>
      <Editor
        apiKey={apikey}
        value={formData[name]}
        init={{
          height,
          menubar: false,
          plugins: "lists link image preview",
          toolbar: "bold italic underline | bullist numlist | link | undo redo",
        }}
        onEditorChange={(content) => handleEditorChange(name, content)}
      />
      {note && <p className="text-xs text-red-500 mt-1">{note}</p>}
    </div>
  );

  return (
    <>
      <h2 className="text-xl mb-4 font-bold">Step 2: Manuscript Details</h2>

      {renderEditor("Title", "title", 200, true, "Enter title of your manuscript — only characters with space allowed.")}

      {renderEditor("Abstract", "abstract", 250, true, "The Abstract should be minimum 15278 words, not more than 500000.")}

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
