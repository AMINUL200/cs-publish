import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faFileAlt,
  faFilePdf,
  faDownload,
  faCheckCircle,
  faTimesCircle,
  faEdit,
  faLock,
  faUserShield,
  faCheckSquare,
  faPaperclip
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { faFlask } from '@fortawesome/free-solid-svg-icons';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import { faComments } from '@fortawesome/free-solid-svg-icons';

const ReviewerManuscriptView = ({ manuscript = {} }) => {
  const navigate = useNavigate();
  const [decision, setDecision] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [confidentialComments, setConfidentialComments] = useState('');
  const [reviewFile, setReviewFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Checklist state
  const [checklist, setChecklist] = useState([
    { id: 1, label: "Minimal spelling/grammar mistakes", checked: false },
    { id: 2, label: "Clear and concise abstract", checked: false },
    { id: 3, label: "Appropriate methodology", checked: false },
    { id: 4, label: "Results properly analyzed", checked: false },
    { id: 5, label: "Relevant references", checked: false },
    { id: 6, label: "Original contribution to field", checked: false },
  ]);

  // Default manuscript data
  const defaultManuscript = {
    title: "A Study on the Effects of React Hooks in Modern Web Development",
    abstract: "This paper examines how React Hooks have transformed state management in functional components...",
    introduction: "React Hooks were introduced in version 16.8 to allow functional components to manage state...",
    materials_and_methods: "We conducted a comparative analysis of 50 projects using both class and functional components...",
    results: "Our findings show a 40% reduction in code complexity when using Hooks...",
    discussion: "The results suggest that Hooks improve code maintainability while potentially introducing new learning curves...",
    conclusion: "React Hooks represent a significant advancement in frontend development paradigms...",
    author_contributions: "JD designed the study. JS implemented the analysis. MJ performed statistical validation.",
    conflict_of_interest_statement: "The authors declare no conflicts of interest.",
    references: "1. React Documentation (2023). Hooks API Reference...",
    keywords: ["React", "Hooks", "Frontend", "Web Development"],
    manuscript_file: "manuscript.pdf",
    supplementary_files: ["data.xlsx", "figures.zip"]
  };

  // Merge incoming manuscript with defaults
  const data = { ...defaultManuscript, ...manuscript };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API submission
    setTimeout(() => {
      console.log("Review submitted:", {
        decision,
        reviewText,
        confidentialComments,
        reviewFile: reviewFile ? reviewFile.name : null,
        checklist: checklist.filter(item => item.checked),
        manuscriptId: data.journal_id || 1
      });
      setIsSubmitting(false);
      navigate('/reviewer-dashboard', { state: { reviewSubmitted: true } });
    }, 1500);
  };

  const handleCheckboxChange = (id) => {
    setChecklist(checklist.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleFileChange = (e) => {
    setReviewFile(e.target.files[0]);
  };

  const downloadFile = (filename) => {
    console.log(`Downloading ${filename}`);
    // In a real app, this would trigger a file download
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with back button */}
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          Review Manuscript: {data.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-10">
        {/* Files Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-18">
            <div className=" bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 ">
              <div className="p-5 pb-3 bg-blue-50">
                <h2 className="text-lg font-bold text-gray-800">
                  <FontAwesomeIcon icon={faFilePdf} className="mr-2 text-blue-500" />
                  Manuscript Files
                </h2>
              </div>
              <div className="px-5 py-3 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Manuscript</span>
                  <button
                    onClick={() => downloadFile(data.manuscript_file)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <FontAwesomeIcon icon={faDownload} className="mr-1" />
                    Download
                  </button>
                </div>
                {data.supplementary_files && data.supplementary_files.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Supplementary Files</p>
                    <ul className="space-y-1">
                      {data.supplementary_files.map((file, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <span className="text-sm">{file}</span>
                          <button
                            onClick={() => downloadFile(file)}
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                          >
                            <FontAwesomeIcon icon={faDownload} className="mr-1" />
                            Download
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Manuscript Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Abstract */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-5 pb-3 bg-blue-50">
              <h2 className="text-lg font-bold text-gray-800">
                <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-blue-500" />
                Abstract
              </h2>
            </div>
            <div className="px-5 py-3">
              <p className="text-sm text-gray-700 whitespace-pre-line">{data.abstract}</p>
            </div>
          </div>

          {/* Keywords */}
          {data.keywords && data.keywords.length > 0 && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-5 pb-3 bg-blue-50">
                <h2 className="text-lg font-bold text-gray-800">Keywords</h2>
              </div>
              <div className="px-5 py-3">
                <div className="flex flex-wrap gap-2">
                  {data.keywords.map((keyword, index) => (
                    <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Manuscript Sections */}
          <div className="space-y-6">
            {/* Introduction */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-5 pb-3 bg-blue-50">
                <h2 className="text-lg font-bold text-gray-800">
                  <FontAwesomeIcon icon={faLightbulb} className="mr-2 text-blue-500" />
                  Introduction
                </h2>
              </div>
              <div className="px-5 py-3">
                <p className="text-sm text-gray-700 whitespace-pre-line">{data.introduction}</p>
              </div>
            </div>

            {/* Materials and Methods */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-5 pb-3 bg-blue-50">
                <h2 className="text-lg font-bold text-gray-800">
                  <FontAwesomeIcon icon={faFlask} className="mr-2 text-blue-500" />
                  Materials and Methods
                </h2>
              </div>
              <div className="px-5 py-3">
                <p className="text-sm text-gray-700 whitespace-pre-line">{data.materials_and_methods}</p>
              </div>
            </div>

            {/* Results */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-5 pb-3 bg-blue-50">
                <h2 className="text-lg font-bold text-gray-800">
                  <FontAwesomeIcon icon={faChartBar} className="mr-2 text-blue-500" />
                  Results
                </h2>
              </div>
              <div className="px-5 py-3">
                <p className="text-sm text-gray-700 whitespace-pre-line">{data.results}</p>
              </div>
            </div>

            {/* Discussion */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-5 pb-3 bg-blue-50">
                <h2 className="text-lg font-bold text-gray-800">
                  <FontAwesomeIcon icon={faComments} className="mr-2 text-blue-500" />
                  Discussion
                </h2>
              </div>
              <div className="px-5 py-3">
                <p className="text-sm text-gray-700 whitespace-pre-line">{data.discussion}</p>
              </div>
            </div>

            {/* Conclusion */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-5 pb-3 bg-blue-50">
                <h2 className="text-lg font-bold text-gray-800">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-blue-500" />
                  Conclusion
                </h2>
              </div>
              <div className="px-5 py-3">
                <p className="text-sm text-gray-700 whitespace-pre-line">{data.conclusion}</p>
              </div>
            </div>
          </div>


        </div>
      </div>
      {/* Review Form */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-5 pb-3 bg-blue-50">
          <h2 className="text-lg font-bold text-gray-800">
            <FontAwesomeIcon icon={faEdit} className="mr-2 text-blue-500" />
            Submit Your Review
          </h2>
        </div>
        <form onSubmit={handleSubmitReview} className="px-5 py-3">
          <div className="mb-6">
            <label htmlFor="decision" className="block text-sm font-medium text-gray-700 mb-1">
              Recommendation
            </label>
            <select
              id="decision"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              required
            >
              <option value="">Select your recommendation</option>
              <option value="accept">Accept</option>
              <option value="minor">Minor Revisions</option>
              <option value="major">Major Revisions</option>
              <option value="reject">Reject</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faCheckSquare} className="mr-1 text-blue-500" />
              Manuscript Evaluation Checklist
            </label>
            <div className="space-y-2">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id={`check-${item.id}`}
                      checked={item.checked}
                      onChange={() => handleCheckboxChange(item.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <label htmlFor={`check-${item.id}`} className="ml-2 text-sm text-gray-700">
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-1">
              Comments for Author
            </label>
            <textarea
              id="reviewText"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Provide constructive feedback for the author..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confidentialComments" className="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon={faLock} className="mr-1 text-blue-500" />
              Confidential Comments to Editor
            </label>
            <textarea
              id="confidentialComments"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Provide any confidential comments for the editor only..."
              value={confidentialComments}
              onChange={(e) => setConfidentialComments(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              <FontAwesomeIcon icon={faUserShield} className="mr-1" />
              These comments will only be visible to the editor
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="reviewFile" className="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon={faPaperclip} className="mr-1 text-blue-500" />
              Upload Review Document (Optional)
            </label>
            <input
              type="file"
              id="reviewFile"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
            />
            {reviewFile && (
              <p className="text-sm text-gray-600 mt-1">
                Selected file: {reviewFile.name}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6 pb-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !decision}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting || !decision ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewerManuscriptView;