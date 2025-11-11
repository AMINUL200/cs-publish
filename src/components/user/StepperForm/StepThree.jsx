import React from "react";
// import TextEditor from "./TextEditor"; // Adjust the import path as needed
import ArrayInput from "../../form/ArrayInput";
import { toast } from "react-toastify";
import TextEditor from "../../common/TextEditor";

const StepThree = ({ formData, setFormData, handleChange, isUpdateMode = false }) => {
  const apikey = import.meta.env.VITE_TEXT_EDITOR_API_KEY;
  const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  const handleEditorChange = (name, content) => {
    handleChange({ target: { name, value: content } });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "supplementary_files") {
      handleChange({ target: { name, value: files[0] } });
    } else {
      // Handle single files
      handleChange({ target: { name, value: files[0] } });
    }
  };

  // ✅ Handle multiple figure images
  const handleFiguresChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate that all files are images
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !validImageTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      toast.info(`Please select only image files (JPEG, PNG, GIF, WebP). Invalid files: ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }

    // Limit to 10 files
    if (files.length + (formData.figures?.length || 0) > 8) {
      toast.info("You can upload a maximum of 8 figures.");
      return;
    }

    // Update formData with new figures array
    setFormData(prev => ({
      ...prev,
      figures: [...(prev.figures || []), ...files] // append to existing figures
    }));
  };

  // ✅ Remove a specific figure
  const removeFigure = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      figures: prev.figures.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Helper function to resolve file URL
  const resolveFileUrl = (pathOrFile) => {
    if (!pathOrFile) return null;

    // If it's a File object, create a blob URL for preview
    if (pathOrFile instanceof File) {
      return URL.createObjectURL(pathOrFile);
    }

    // If it's a string path, resolve the URL
    if (typeof pathOrFile === 'string') {
      const isAbsolute = /^https?:\/\//i.test(pathOrFile);
      return isAbsolute ? pathOrFile : `${VITE_STORAGE_URL || ''}${pathOrFile}`;
    }

    return null;
  };

  // Helper function to get filename from path or File object
  const getFileName = (pathOrFile) => {
    if (!pathOrFile) return '';

    // If it's a File object, return the file name
    if (pathOrFile instanceof File) {
      return pathOrFile.name;
    }

    // If it's a string path, extract filename
    if (typeof pathOrFile === 'string') {
      return pathOrFile.split('/').pop() || pathOrFile;
    }

    return '';
  };

  // Component for displaying existing file
  const ExistingFileDisplay = ({ filePath, fileType, onRemove }) => {
    if (!filePath) return null;

    const fileUrl = resolveFileUrl(filePath);
    const fileName = getFileName(filePath);
    const isFileObject = filePath instanceof File;

    const handleViewFile = () => {
      if (fileUrl) {
        window.open(fileUrl, '_blank');
      }
    };

    return (
      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-blue-700 font-medium">
            {isFileObject ? 'New' : 'Current'} {fileType}:
          </span>
          <span className="text-sm text-gray-700">{fileName}</span>
          {isFileObject && (
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
              New file selected
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {fileUrl && (
            <button
              type="button"
              onClick={handleViewFile}
              className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
            >
              {isFileObject ? 'Preview' : 'View'}
            </button>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    );
  };

  // ✅ Component for displaying figures with preview
  const FiguresDisplay = () => {
    if (!formData.figures || formData.figures.length === 0) return null;

    return (
      <div className="mt-3 space-y-2">
        <p className="text-sm font-medium text-gray-700">Selected Figures ({formData.figures.length}):</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {formData.figures.map((figure, index) => {
            const figureUrl = resolveFileUrl(figure);
            const fileName = getFileName(figure);
            const isFileObject = figure instanceof File;

            return (
              <div key={index} className="relative group bg-gray-50 border border-gray-200 rounded p-2">
                {/* Image Preview */}
                {figureUrl && (
                  <div className="aspect-square mb-2 overflow-hidden rounded border">
                    <img
                      src={figureUrl}
                      alt={`Figure ${index + 1}`}
                      className="w-full h-full object-cover"
                      
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    {/* Fallback for broken images */}
                    <div
                      className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-xs"
                      style={{ display: 'none' }}
                    >
                      No Preview
                    </div>
                  </div>
                )}

                {/* File Info */}
                <div className="space-y-1">
                  <p className="text-xs text-gray-600 truncate" title={fileName}>
                    {fileName}
                  </p>
                  {isFileObject && (
                    <p className="text-xs text-green-600">
                      Size: {(figure.size / 1024).toFixed(1)} KB
                    </p>
                  )}
                  {!isFileObject && (
                    <span className="text-xs px-1 py-0.5 bg-blue-100 text-blue-700 rounded">
                      Existing
                    </span>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeFigure(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove figure"
                >
                  ×
                </button>

                {/* View Full Size Button */}
                {figureUrl && (
                  <button
                    type="button"
                    onClick={() => window.open(figureUrl, '_blank')}
                    className="absolute bottom-1 right-1 w-6 h-6 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="View full size"
                  >
                    👁
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <h2 className="text-xl mb-4 font-bold">Step 3: Final Submission Details</h2>

      {/* References - Rich Text Editor */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">References</label>
        <div style={{ height: "600px" }}>
          <TextEditor
            apiKey={apikey}
            value={formData.references}
            onChange={(content) => handleEditorChange("references", content)}
          />
        </div>
      </div>

      {/* Keywords */}
      <div className="mb-4">
        <ArrayInput
          label='Keywords'
          values={formData.keywords}
          onChange={(newKeywords) =>
            setFormData({ ...formData, keywords: newKeywords })
          }
          placeholder="Enter keywords separated by commas"
          className="w-full p-2 border rounded"
        />
        <p className="text-xs text-red-500 mt-1">
          Keywords should be provided. Keywords should not reflect the title. Individual keywords should be separated by a (.)
        </p>
      </div>

      {/* ✅ FIGURES - Multiple Image Upload */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">
          Figures {isUpdateMode && "(Upload new images to replace current figures)"}
        </label>

        {/* Current Figures Display */}
        <FiguresDisplay />

        {/* File Input for Multiple Images */}
        <input
          type="file"
          name="figures"
          accept="image/*"
          multiple
          onChange={handleFiguresChange}
          className="w-full p-2 border rounded mt-3"
        />

        <div className="mt-2 space-y-1">
           <p className="text-xs text-red-600">
            • Select Maximum 8 Images
          </p>
          <p className="text-xs text-gray-600">
            • Select multiple image files (JPEG, PNG, GIF, WebP)
          </p>
          <p className="text-xs text-gray-600">
            • You can select multiple files at once by holding Ctrl/Cmd while clicking
          </p>
          {isUpdateMode && (
            <p className="text-xs text-blue-600">
              • Selecting new images will replace all existing figures
            </p>
          )}
          <p className="text-xs text-green-600">
            • Current selection: {formData.figures?.length || 0} figure(s)
          </p>
        </div>
      </div>

      {/* Manuscript File */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Manuscript File {isUpdateMode && "(Upload new file to replace current)"}
        </label>

        {/* Show existing file if in update mode - Updated field names */}
        {(isUpdateMode || !isUpdateMode) && formData.manuscript_file && (
          <ExistingFileDisplay
            filePath={formData.manuscript_file}
            fileType="Manuscript File"
            onRemove={() => {
              setFormData({ ...formData, manuscript_file: null });
              // Also clear the file input
              const fileInput = document.querySelector('input[name="manuscript_file"]');
              if (fileInput) fileInput.value = '';
            }}
          />
        )}

        <input
          type="file"
          name="manuscript_file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="w-full p-2 border rounded mt-2"
        />

        {isUpdateMode && (
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to keep the current file, or select a new file to replace it.
          </p>
        )}
      </div>

      {/* Copyright Form */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Copyright Form {isUpdateMode && "(Upload new file to replace current)"}
        </label>

        {/* Show existing file if in update mode - Updated field names */}
        {(isUpdateMode || !isUpdateMode) && formData.copyright_form && (
          <ExistingFileDisplay
            filePath={formData.copyright_form}
            fileType="Copyright Form"
            onRemove={() => {
              setFormData({ ...formData, copyright_form: null });
              // Also clear the file input
              const fileInput = document.querySelector('input[name="copyright_form"]');
              if (fileInput) fileInput.value = '';
            }}
          />
        )}

        <input
          type="file"
          name="copyright_form"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="w-full p-2 border rounded mt-2"
        />

        {isUpdateMode && (
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to keep the current file, or select a new file to replace it.
          </p>
        )}
      </div>

      {/* Supplementary Files */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Supplementary Files {isUpdateMode && "(Upload new file to replace current)"}
        </label>

        {/* Show existing file if in update mode - Updated field names */}
        {(isUpdateMode || !isUpdateMode) && formData.supplementary_files && (
          <ExistingFileDisplay
            filePath={formData.supplementary_files}
            fileType="Supplementary Files"
            onRemove={() => {
              setFormData({ ...formData, supplementary_files: null });
              // Also clear the file input
              const fileInput = document.querySelector('input[name="supplementary_files"]');
              if (fileInput) fileInput.value = '';
            }}
          />
        )}

        <input
          type="file"
          name="supplementary_files"
          accept=".zip,.pdf,.doc,.docx"
          onChange={handleFileChange}
          className="w-full p-2 border rounded mt-2"
        />

        {isUpdateMode && (
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to keep the current file, or select a new file to replace it.
          </p>
        )}
      </div>

      {/* Update Mode Information */}
      {isUpdateMode && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h4 className="font-medium text-yellow-800 mb-2">Update Information:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Existing files are shown above each upload field</li>
            <li>• Click "View" to open files in a new tab</li>
            <li>• Upload a new file only if you want to replace the existing one</li>
            <li>• Click "Remove" to delete an existing file without replacement</li>
            <li>• Leave upload fields empty to keep current files</li>
            <li>• For figures: selecting new images will replace ALL existing figures</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default StepThree;