import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";

const StepTwo = ({ formData, handleChange }) => {
  const apikey = import.meta.env.VITE_TEXT_EDITOR_API_KEY;
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token"); // Or however you store token

  const handleEditorChange = (name, content) => {
    handleChange({ target: { name, value: content } });
  };

  const renderEditor = (label, name, height = 400, required = false, note = "") => (
    <div className="mb-6">
      <label className="block mb-1 font-medium">
        {label}{required && " *"}
      </label>
      <Editor
        apiKey={apikey}
        value={formData[name]}
        init={{
          height,
          menubar: true,
          plugins: [
            "image",
            "advlist",
            "autolink",
            "lists",
            "link",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | fontfamily fontsize | bold italic forecolor backcolor | " +
            "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | " +
            "image media | removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          font_formats: `
            Arial=arial,helvetica,sans-serif;
            Courier New=courier new,courier,monospace;
            Georgia=georgia,palatino;
            Tahoma=tahoma,arial,helvetica,sans-serif;
            Times New Roman=times new roman,times;
            Verdana=verdana,geneva;
          `,
          fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
          automatic_uploads: true,
          file_picker_types: "image",

          // ✅ Custom handler for uploading image to backend
          images_upload_handler: async (blobInfo, progress) => {
            return new Promise((resolve, reject) => {
              const formData = new FormData();
              formData.append("file", blobInfo.blob(), blobInfo.filename());

              axios.post(`${API_URL}api/upload-image`, formData, {
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (e) => {
                  progress((e.loaded / e.total) * 100);
                },
              })
              .then(res => {
                if (res.data?.url) {
                  resolve(res.data.url); // ✅ TinyMCE inserts <img src="url" />
                } else {
                  reject("Upload failed");
                }
              })
              .catch(() => {
                reject("Upload error");
              });
            });
          },

          // ✅ Optional local file picker (base64 preview before upload)
          file_picker_callback: (callback, value, meta) => {
            if (meta.filetype === "image") {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");
              input.onchange = function () {
                const file = this.files[0];
                const reader = new FileReader();
                reader.onload = function () {
                  callback(reader.result, { title: file.name });
                };
                reader.readAsDataURL(file);
              };
              input.click();
            }
          },
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
