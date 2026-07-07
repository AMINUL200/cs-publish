import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../../common/Loader";
import { generateManuscriptPDF } from "../../../utils/pdfGenerator";

const STORAGE_KEY = "manuscript_draft";

const StepperForm = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token, userData } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [journalData, setJournalData] = useState([]);
  const navigate = useNavigate();

  // ✅ Check if we're in update mode
  const updateId = searchParams.get("update");
  const isUpdateMode = Boolean(updateId);

  // ✅ Single source of truth for authors
  const [authors, setAuthors] = useState([
    { name: "", email: "", university: "", affiliation: "" },
  ]);

  const [formData, setFormData] = useState({
    journal_id: "",
    article_type: "",
    username: "",
    contact_number: "",
    email: "",
    affiliation: "",
    address: "",
    country: "",
    add_myself: true,

    // Manuscript details
    title: "",
    abstract: "",
    introduction: "",
    materials_and_methods: "",
    results: "",
    discussion: "",
    conclusion: "",
    author_contributions: "",
    conflict_of_interest_statement: "",

    // References and files
    references: "",
    keywords: [],

    // Files
    manuscript_file: null,
    copyright_form: null,
    supplementary_files: null,
    figures: [],

    // For storing existing file paths when updating
    existing_manuscript_file: null,
    existing_copyright_form: null,
    existing_supplementary_files: null,
    existing_figures: [],
  });

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isDraftRestored, setIsDraftRestored] = useState(false);

  // ✅ Helper function to save draft to localStorage
  const saveDraft = (data, authorsData, currentStep) => {
    if (isUpdateMode) return; // Don't save drafts in update mode

    try {
      // Create a clean copy without File objects
      const draftData = {
        formData: {
          ...data,
          // Exclude File objects
          manuscript_file: null,
          copyright_form: null,
          supplementary_files: null,
          figures: Array.isArray(data.figures) 
            ? data.figures.filter(f => !(f instanceof File))
            : [],
        },
        authors: authorsData,
        step: currentStep,
        timestamp: new Date().toISOString(),
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  // ✅ Helper function to load draft from localStorage
  const loadDraft = () => {
    if (isUpdateMode) return null;
    
    try {
      const draft = localStorage.getItem(STORAGE_KEY);
      if (!draft) return null;
      
      const parsedDraft = JSON.parse(draft);
      return parsedDraft;
    } catch (error) {
      console.error("Error loading draft:", error);
      return null;
    }
  };

  // ✅ Helper function to clear draft
  const clearDraft = () => {
    if (isUpdateMode) return;
    localStorage.removeItem(STORAGE_KEY);
  };

  // ✅ Function to restore draft on load
  const restoreDraft = () => {
    if (isUpdateMode) return false;
    
    const draft = loadDraft();
    if (!draft) return false;

    try {
      // Restore form data (excluding files)
      setFormData(prev => ({
        ...prev,
        journal_id: draft.formData.journal_id || "",
        article_type: draft.formData.article_type || "",
        username: draft.formData.username || "",
        contact_number: draft.formData.contact_number || "",
        email: draft.formData.email || "",
        affiliation: draft.formData.affiliation || "",
        address: draft.formData.address || "",
        country: draft.formData.country || "",
        add_myself: draft.formData.add_myself ?? true,
        title: draft.formData.title || "",
        abstract: draft.formData.abstract || "",
        introduction: draft.formData.introduction || "",
        materials_and_methods: draft.formData.materials_and_methods || "",
        results: draft.formData.results || "",
        discussion: draft.formData.discussion || "",
        conclusion: draft.formData.conclusion || "",
        author_contributions: draft.formData.author_contributions || "",
        conflict_of_interest_statement: draft.formData.conflict_of_interest_statement || "",
        references: draft.formData.references || "",
        keywords: Array.isArray(draft.formData.keywords) ? draft.formData.keywords : [],
        figures: Array.isArray(draft.formData.figures) ? draft.formData.figures : [],
        // Files should be null (user needs to reselect)
        manuscript_file: null,
        copyright_form: null,
        supplementary_files: null,
      }));

      // Restore authors
      if (Array.isArray(draft.authors) && draft.authors.length > 0) {
        setAuthors(draft.authors);
      }

      // Restore step
      if (draft.step && draft.step >= 1 && draft.step <= 3) {
        setStep(draft.step);
      }

      setIsDraftRestored(true);
      toast.success("Draft restored successfully.");
      return true;
    } catch (error) {
      console.error("Error restoring draft:", error);
      return false;
    }
  };

  // ✅ Function to fetch manuscript data for update mode
  const fetchManuscriptForUpdate = async (manuscriptId) => {
    try {
      const response = await axios.get(
        `${API_URL}api/author/manuscript-edit/${manuscriptId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        },
      );

      if (response.data.flag === 1) {
        const manuscript = response.data.data;

        // Update form data with existing manuscript data
        setFormData({
          ...formData,
          journal_id: manuscript.journal_id || "",
          article_type: manuscript.article_type || "",
          username: manuscript.username || "",
          contact_number: manuscript.contact_number || "",
          email: manuscript.email || "",
          affiliation: manuscript.affiliation || "",
          address: manuscript.address || "",
          country: manuscript.country || "",
          add_myself:
            manuscript.add_myself === "1" || manuscript.add_myself === 1
              ? true
              : false,
          title: manuscript.title || "",
          abstract: manuscript.abstract || "",
          introduction: manuscript.introduction || "",
          materials_and_methods: manuscript.materials_and_methods || "",
          results: manuscript.results || "",
          discussion: manuscript.discussion || "",
          conclusion: manuscript.conclusion || "",
          author_contributions: manuscript.author_contributions || "",
          conflict_of_interest_statement:
            manuscript.conflict_of_interest_statement || "",
          references: manuscript.references || "",
          keywords: Array.isArray(manuscript.keywords)
            ? manuscript.keywords
            : [],
          manuscript_file: manuscript.manuscript_file || null,
          copyright_form: manuscript.copyright_form || null,
          supplementary_files: manuscript.supplementary_files || null,
          figures: Array.isArray(manuscript.figures) ? manuscript.figures : [],
        });

        // Update authors if they exist
        if (Array.isArray(manuscript.author) && manuscript.author.length > 0) {
          setAuthors(
            manuscript.author.map((aut) => ({
              name: aut.name || "",
              email: aut.email || "",
              university: aut.university || "",
              affiliation: aut.affiliation || "",
            })),
          );
        }

        toast.success("Manuscript data loaded for editing");
      } else {
        toast.error("Failed to load manuscript data");
      }
    } catch (error) {
      console.error("Error fetching manuscript:", error);
      toast.error("Failed to load manuscript for update");
    }
  };

  const nextStep = () => {
    // ✅ Basic validation before moving to next step
    if (step === 1) {
      if (!formData.journal_id || !formData.article_type || !formData.username || !formData.email) {
        toast.error("Please fill all required fields in Step 1");
        return;
      }

      // Check if at least one author has name and email
      const hasValidAuthor = authors.some(
        (author) => author.name && author.email,
      );
      if (!hasValidAuthor) {
        toast.error("Please add at least one author with name and email");
        return;
      }
    }

    // Save draft when moving to next step
    if (!isUpdateMode) {
      saveDraft(formData, authors, step + 1);
    }
    
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    // Save draft when going back
    if (!isUpdateMode) {
      saveDraft(formData, authors, step - 1);
    }
    setStep((prev) => prev - 1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };
    setFormData(newFormData);

    // ✅ Auto-save on any change (only for new submission)
    if (!isUpdateMode) {
      saveDraft(newFormData, authors, step);
    }
  };

  // ✅ Form validation before submission
  const validateForm = () => {
    const requiredFields = [
      "journal_id",
      "article_type",
      "username",
      "contact_number",
      "email",
      "affiliation",
      "address",
      "country",
      "title",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`${field.replace("_", " ")} is required`);
        return false;
      }
    }

    // Validate authors
    const validAuthors = authors.filter(
      (author) =>
        author.name && author.email && author.university && author.affiliation,
    );

    if (validAuthors.length === 0) {
      toast.error("Please add at least one complete author");
      return false;
    }

    return true;
  };

  const handleGeneratePDF = async () => {
    // Basic validation for PDF generation
    if (!formData.title || !formData.journal_id) {
      toast.error(
        "Please fill in at least the title and select a journal to generate PDF",
      );
      return;
    }

    const validAuthors = authors.filter(
      (author) => author.name && author.email,
    );
    if (validAuthors.length === 0) {
      toast.error("Please add at least one author to generate PDF");
      return;
    }

    try {
      setSubmitLoading(true);
      const filename = await generateManuscriptPDF(
        formData,
        authors,
        journalData,
      );
      toast.success(`PDF generated successfully: ${filename}`);
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("PDF generation failed: " + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);
    try {
      const validAuthors = authors.filter(
        (author) =>
          author.name &&
          author.email &&
          author.university &&
          author.affiliation,
      );

      if (isUpdateMode) {
        // For update mode: Use FormData and only include changed files
        const formDataToSend = new FormData();

        // Add all text fields
        formDataToSend.append("journal_id", formData.journal_id);
        formDataToSend.append("article_type", formData.article_type);
        formDataToSend.append("username", formData.username);
        formDataToSend.append("contact_number", formData.contact_number);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("affiliation", formData.affiliation);
        formDataToSend.append("address", formData.address);
        formDataToSend.append("country", formData.country);
        formDataToSend.append("add_myself", formData.add_myself ? 1 : 0);
        formDataToSend.append("title", formData.title);
        formDataToSend.append("abstract", formData.abstract);
        formDataToSend.append("introduction", formData.introduction);
        formDataToSend.append(
          "materials_and_methods",
          formData.materials_and_methods,
        );
        formDataToSend.append("results", formData.results);
        formDataToSend.append("discussion", formData.discussion);
        formDataToSend.append("conclusion", formData.conclusion);
        formDataToSend.append(
          "author_contributions",
          formData.author_contributions,
        );
        formDataToSend.append(
          "conflict_of_interest_statement",
          formData.conflict_of_interest_statement,
        );
        formDataToSend.append("references", formData.references);

        // Add authors as Laravel-style array fields
        validAuthors.forEach((author, index) => {
          formDataToSend.append(`author[${index}][name]`, author.name || "");
          formDataToSend.append(`author[${index}][email]`, author.email || "");
          formDataToSend.append(
            `author[${index}][university]`,
            author.university || "",
          );
          formDataToSend.append(
            `author[${index}][affiliation]`,
            author.affiliation || "",
          );
        });

        // Add keywords as array
        const keywordsArray = Array.isArray(formData.keywords)
          ? formData.keywords
          : String(formData.keywords || "")
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean);
        keywordsArray.forEach((kw, index) => {
          formDataToSend.append(`keywords[${index}]`, kw);
        });

        // Handle figures - only append new File objects
        if (Array.isArray(formData.figures)) {
          formData.figures.forEach((figure, index) => {
            if (figure instanceof File) {
              formDataToSend.append(`figures[${index}]`, figure);
            }
          });
        }

        // Only append files if they are File objects (newly selected files)
        if (formData.manuscript_file instanceof File) {
          formDataToSend.append("manuscript_file", formData.manuscript_file);
        }
        if (formData.copyright_form instanceof File) {
          formDataToSend.append("copyright_form", formData.copyright_form);
        }
        if (formData.supplementary_files instanceof File) {
          formDataToSend.append(
            "supplementary_files",
            formData.supplementary_files,
          );
        }

        // Use POST method with _method override for Laravel
        formDataToSend.append("_method", "PUT");

        const response = await axios.post(
          `${API_URL}api/author/manuscript-update/${updateId}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        console.log("Update successful:", response.data);
        if (response.data.flag === 1) {
          toast.success(
            response.data.message || "Manuscript updated successfully",
          );

          // Generate PDF after successful update
          try {
            const filename = await generateManuscriptPDF(
              formData,
              authors,
              journalData,
            );
            toast.success(`PDF generated successfully: ${filename}`);
          } catch (error) {
            console.error("PDF generation error:", error);
            toast.error(
              "PDF generation failed, but manuscript was submitted successfully",
            );
          }
          navigate("/dashboard");
        } else {
          toast.error(response.data.message || "Update failed");
        }
      } else {
        // For create mode: Use FormData as before
        const formDataToSend = new FormData();

        // Add all fields to FormData
        Object.keys(formData).forEach((key) => {
          if (key === "keywords" || key === "figures") {
            return;
          } else if (key === "add_myself") {
            formDataToSend.append(key, formData[key] ? 1 : 0);
          } else if (
            formData[key] !== null &&
            formData[key] !== undefined &&
            !key.startsWith("existing_")
          ) {
            formDataToSend.append(key, formData[key]);
          }
        });

        // Add authors as Laravel-style array fields
        validAuthors.forEach((author, index) => {
          formDataToSend.append(`author[${index}][name]`, author.name || "");
          formDataToSend.append(`author[${index}][email]`, author.email || "");
          formDataToSend.append(
            `author[${index}][university]`,
            author.university || "",
          );
          formDataToSend.append(
            `author[${index}][affiliation]`,
            author.affiliation || "",
          );
        });

        // Add keywords as array
        const createKeywordsArray = Array.isArray(formData.keywords)
          ? formData.keywords
          : String(formData.keywords || "")
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean);
        createKeywordsArray.forEach((kw, index) => {
          formDataToSend.append(`keywords[${index}]`, kw);
        });

        // Add figures as array for create mode
        if (Array.isArray(formData.figures)) {
          formData.figures.forEach((figure, index) => {
            if (figure instanceof File) {
              formDataToSend.append(`figures[${index}]`, figure);
            }
          });
        }

        const response = await axios.post(
          `${API_URL}api/manuscript`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        console.log("Submission successful:", response.data);
        if (response.data.flag === 1) {
          toast.success(
            response.data.message || "Manuscript submitted successfully",
          );

          // ✅ Clear draft after successful submission
          clearDraft();

          // Generate PDF after successful submission
          try {
            const filename = await generateManuscriptPDF(
              formData,
              authors,
              journalData,
            );
            toast.success(`PDF generated successfully: ${filename}`);
          } catch (error) {
            console.error("PDF generation error:", error);
            toast.error(
              "PDF generation failed, but manuscript was submitted successfully",
            );
          }
        } else {
          toast.error(response.data.message || "Submission failed");
          // ✅ Keep draft if submission fails
        }
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(
        isUpdateMode
          ? "Update failed. Check console for details."
          : "Submission failed. Check console for details.",
      );
      console.error("Submission error:", error.response?.data || error.message);
      // ✅ Keep draft if submission fails
    } finally {
      setSubmitLoading(false);
    }
  };

  const fetchJournalData = async () => {
    try {
      const response = await axios.get(`${API_URL}api/admin/journals`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (response.data.success) {
        setJournalData(
          response.data.data.map((journal) => ({
            id: journal.id,
            name: journal.j_title,
          })),
        );
      } else {
        toast.error(response.data.message || "Failed to fetch journals");
      }
    } catch (error) {
      toast.error("Failed to fetch journals: " + error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeForm = async () => {
      // First fetch journal data
      await fetchJournalData();

      // If in update mode, fetch manuscript data
      if (isUpdateMode && updateId) {
        await fetchManuscriptForUpdate(updateId);
        // Clear draft if it exists in update mode
        clearDraft();
      } else {
        // ✅ Restore draft for new submission
        restoreDraft();
      }
    };

    initializeForm();
  }, [updateId, isUpdateMode]);

  // ✅ Auto-save effect for any changes
  useEffect(() => {
    // Don't save if in update mode or if no data yet
    if (isUpdateMode || loading) return;
    
    // Save draft whenever formData or authors change
    saveDraft(formData, authors, step);
  }, [formData, authors, step, isUpdateMode, loading]);

  // ✅ Save draft when authors change
  useEffect(() => {
    if (isUpdateMode || loading) return;
    saveDraft(formData, authors, step);
  }, [authors]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded">
      {/* ✅ Dynamic title based on mode */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {isUpdateMode
            ? `Update Manuscript (ID: ${updateId})`
            : "Submit New Manuscript"}
        </h1>
        {isUpdateMode && (
          <p className="text-sm text-blue-600 mt-1">
            You are editing an existing manuscript. All changes will be saved as
            an update.
          </p>
        )}
        {!isUpdateMode && isDraftRestored && (
          <p className="text-sm text-green-600 mt-1">
            ✓ Draft restored - continue where you left off
          </p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-gray-200 rounded mb-4">
        <div
          className={`h-full bg-blue-500 rounded transition-all duration-300`}
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="mb-6 flex justify-between">
        {["Article Info", "Manuscript", "Files"].map((label, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-semibold ${
                step === idx + 1
                  ? "bg-blue-500"
                  : step > idx + 1
                    ? "bg-green-500"
                    : "bg-gray-300"
              }`}
            >
              {step > idx + 1 ? "✓" : idx + 1}
            </div>
            <span className="text-sm mt-1 text-center">{label}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 1 && (
        <StepOne
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          journalData={journalData}
          authors={authors}
          setAuthors={setAuthors}
          isUpdateMode={isUpdateMode}
        />
      )}

      {step === 2 && (
        <StepTwo
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
        />
      )}

      {step === 3 && (
        <StepThree
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          isUpdateMode={isUpdateMode}
        />
      )}

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between items-center">
        <div className="flex gap-2">
          {step > 1 && (
            <button
              onClick={prevStep}
              disabled={submitLoading}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 cursor-pointer"
            >
              ← Back
            </button>
          )}

          {/* PDF Generation Button - Show on all steps */}
          <button
            onClick={handleGeneratePDF}
            disabled={submitLoading || !formData.title || !formData.journal_id}
            className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 cursor-pointer"
            title={
              !formData.title || !formData.journal_id
                ? "Fill in title and select journal to generate PDF"
                : "Generate PDF from current form data"
            }
          >
            📄 Generate PDF
          </button>
        </div>

        {step < 3 ? (
          <button
            onClick={nextStep}
            disabled={submitLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
          >
            Save & Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className={`px-6 py-2 text-white rounded ${
              submitLoading
                ? "bg-gray-500 cursor-not-allowed"
                : isUpdateMode
                  ? "bg-orange-500 hover:bg-orange-600 cursor-pointer"
                  : "bg-green-500 hover:bg-green-600 cursor-pointer"
            }`}
            disabled={submitLoading}
          >
            {submitLoading
              ? isUpdateMode
                ? "Updating..."
                : "Submitting..."
              : isUpdateMode
                ? "Update Manuscript"
                : "Submit Manuscript"}
          </button>
        )}
      </div>
    </div>
  );
};

export default StepperForm;