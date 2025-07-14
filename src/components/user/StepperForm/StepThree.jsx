import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const StepThree = ({ formData, handleChange }) => {
  const apikey = import.meta.env.VITE_TEXT_EDITOR_API_KEY;

  const handleEditorChange = (name, content) => {
    handleChange({ target: { name, value: content } });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "supplementary_files") {
      // Handle multiple files
      handleChange({ target: { name, value: Array.from(files) } });
    } else {
      // Handle single files
      handleChange({ target: { name, value: files[0] } });
    }
  };


  return (
    <>
      <h2 className="text-xl mb-4 font-bold">Step 3: Final Submission Details</h2>



      {/* References - Rich Text Editor */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">References</label>
        <Editor
          apiKey={apikey}
          value={formData.references}
          init={{
            height: 200,
            menubar: false,
            plugins: "lists link image preview",
            toolbar: "bold italic underline | bullist numlist | link | undo redo",
          }}
          onEditorChange={(content) => handleEditorChange("references", content)}
        />
      </div>

      {/* Keywords */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Keywords</label>
        <input
          type="text"
          name="keywords"
          value={formData.keywords}
          onChange={handleChange}
          placeholder="Enter keywords separated by commas"
          className="w-full p-2 border rounded"
        />
        <p className="text-xs text-red-500 mt-1">
          Keywords should be provided. Keywords should not reflect the title. Individual keywords should be separated by a (.)
        </p>
      </div>

      {/* Manuscript File */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Manuscript File</label>
        <input
          type="file"
          name="manuscript_file"  // ✅ FIXED
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />
      </div>


      {/* Copyright Form */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Copyright Form</label>
        <input
          type="file"
          name="copyright_form"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Supplementary Files */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Supplementary Files</label>
        <input
          type="file"
          name="supplementary_files"
          accept=".zip,.pdf,.doc,.docx"
          multiple
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />

      </div>
    </>
  );
};

export default StepThree;
