import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";

const TextEditor = ({ apiKey, value, onChange }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  
  return (
    <Editor
      apiKey={apiKey}
      value={value}
      onEditorChange={onChange}
      init={{
        height: "100%",
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
          'paste', 'importcss', 'autosave', 'save', 'directionality',
          'emoticons', 'template', 'codesample', 'hr', 'pagebreak',
          'nonbreaking', 'toc', 'imagetools', 'textpattern', 'noneditable'
        ],
        toolbar: [
          'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify',
          'outdent indent | numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat',
          'pagebreak | charmap emoticons | fullscreen preview save print | insertfile image media pageembed template link anchor codesample',
          'a11ycheck ltr rtl | showcomments addcomment | code | help'
        ],
        font_family_formats:
          'Arial=arial,helvetica,sans-serif; Times New Roman=times new roman,times,serif; Courier New=courier new,courier,monospace; Georgia=georgia,serif; Verdana=verdana,sans-serif; Tahoma=tahoma,sans-serif; Comic Sans MS=comic sans ms,cursive; Impact=impact,sans-serif; Trebuchet MS=trebuchet ms,sans-serif',
        font_size_formats:
          '8px 9px 10px 11px 12px 14px 16px 18px 20px 22px 24px 26px 28px 30px 32px 34px 36px 38px 40px 42px 44px 46px 48px 50px 52px 54px 56px 58px 60px 62px 64px 66px 68px 70px 72px',
        content_style: `
          body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            margin: 1rem;
          }
          /* Enhanced image styling for better text flow */
          img {
            max-width: 100%;
            height: auto;
            margin: 10px 0;
            border-radius: 4px;
          }
          p {
            margin: 1em 0;
          }
        `,
        
        // Image upload configuration
        images_upload_url: false,
        automatic_uploads: true,
        images_reuse_filename: true,
        file_picker_types: "image",
        
        // Fixed images_upload_handler
        images_upload_handler: async (blobInfo, progress) => {
          return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", blobInfo.blob(), blobInfo.filename());

            axios.post(`https://api.cspublishinghouse.com/public/api/image-upload`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              onUploadProgress: (e) => {
                progress((e.loaded / e.total) * 100);
              },
            })
              .then(res => {
                console.log('Upload response:', res.data);
                if (res.data?.data?.url) {
                  resolve(res.data.data.url);
                } else {
                  console.error('Invalid response structure:', res.data);
                  reject("Upload failed: Invalid response structure");
                }
              })
              .catch(error => {
                console.error('Upload error:', error);
                reject(`Upload error: ${error.message}`);
              });
          });
        },

        // Enhanced file picker for local image selection
        file_picker_callback: (callback, value, meta) => {
          if (meta.filetype === "image") {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            
            input.onchange = function () {
              const file = this.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = function () {
                  const id = "blobid" + new Date().getTime();
                  const blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                  const base64 = reader.result.split(",")[1];
                  const blobInfo = blobCache.create(id, file, base64);
                  blobCache.add(blobInfo);
                  
                  // Return the blob URI to TinyMCE with enhanced attributes
                  callback(blobInfo.blobUri(), { 
                    title: file.name,
                    alt: file.name.replace(/\.[^/.]+$/, ""), // Remove extension for alt text
                  });
                };
                reader.readAsDataURL(file);
              }
            };
            
            input.click();
          }
        },

        // Enhanced image handling
        image_advtab: true,
        image_caption: true,
        image_title: true,
        
        branding: false,
        statusbar: true,
        resize: true,
        autosave_interval: '30s',
        autosave_prefix: 'tinymce-autosave-{path}{query}-{id}-',
        autosave_restore_when_empty: false,
        autosave_retention: '2m',
        elementpath: true,
        contextmenu: 'link image imagetools table configurepermanentpen',
        quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
        quickbars_insert_toolbar: 'quickimage quicktable',
        toolbar_mode: 'sliding',
        link_assume_external_targets: true,
        target_list: false,
        link_title: true,
        default_link_target: '_blank',
        table_toolbar:
          'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
        table_appearance_options: true,
        table_grid: true,
        table_resize_bars: true,
        codesample_languages: [
          { text: 'HTML/XML', value: 'markup' },
          { text: 'JavaScript', value: 'javascript' },
          { text: 'CSS', value: 'css' },
          { text: 'PHP', value: 'php' },
          { text: 'Ruby', value: 'ruby' },
          { text: 'Python', value: 'python' },
          { text: 'Java', value: 'java' },
          { text: 'C', value: 'c' },
          { text: 'C#', value: 'csharp' },
          { text: 'C++', value: 'cpp' }
        ],
        
        // Enhanced setup for better image handling
        setup: function (editor) {
          editor.on('init', function () {
            console.log('TinyMCE Editor initialized');
          });
          
          editor.on('change', function () {
            console.log('Editor content changed');
          });
          
          // Handle upload errors
          editor.on('UploadFailure', function (e) {
            console.error('Upload failure:', e);
          });
          
          // Enhanced image insertion handling
          editor.on('ExecCommand', function (e) {
            if (e.command === 'mceImage' || e.command === 'mceInsertContent') {
              // Ensure cursor positioning after image insertion
              setTimeout(() => {
                const selection = editor.selection;
                const selectedNode = selection.getNode();
                
                if (selectedNode.tagName === 'IMG') {
                  // Move cursor after the image
                  const paragraph = editor.dom.create('p', {}, '<br>');
                  editor.dom.insertAfter(paragraph, selectedNode);
                  selection.setCursorLocation(paragraph, 0);
                }
              }, 100);
            }
          });
          
          // Improved paste handling for images
          editor.on('paste', function (e) {
            const items = e.clipboardData?.items;
            if (items) {
              for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                  const blob = items[i].getAsFile();
                  const reader = new FileReader();
                  reader.onload = function () {
                    const id = 'blobid' + new Date().getTime();
                    const blobCache = editor.editorUpload.blobCache;
                    const base64 = reader.result.split(',')[1];
                    const blobInfo = blobCache.create(id, blob, base64);
                    blobCache.add(blobInfo);
                    
                    // Insert image with proper spacing
                    const content = `<p>&nbsp;</p><img src="${blobInfo.blobUri()}" alt="Pasted image" /><p>&nbsp;</p>`;
                    editor.insertContent(content);
                  };
                  reader.readAsDataURL(blob);
                  e.preventDefault();
                  return false;
                }
              }
            }
          });
        }
      }}
    />
  );
};

export default TextEditor;