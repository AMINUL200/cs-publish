import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faFileAlt,
  faUserEdit,
  faBook,
  faCalendarAlt,
  faDownload,
  faCheckCircle,
  faTimesCircle,
  faEdit
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../components/common/Loader";

const ReviewSubmission = () => {
  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [commentsForEditor, setCommentsForEditor] = useState("");
  const [commentsForAuthor, setCommentsForAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const manuscript = location.state?.manuscript || {
    id: 1,
    title: "Novel Approaches to Cancer Treatment",
    journal: "Journal of Medical Research",
    author: "Dr. Alice Zhang",
    assignedDate: "2023-05-20",
    deadline: "2023-06-20",
    wordCount: 8500,
    files: ["main.pdf", "figures.zip"],
    category: "Oncology",
    abstract: "This study explores innovative methods for treating advanced cancer cases..."
  };

  console.log(`token: ${token}`);
  
  console.log(`Fetching manuscript details for ID: ${id}`);




  const handleSubmitReview = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Review submitted:", {
        manuscriptId: manuscript.id,
        reviewText,
        recommendation,
        commentsForEditor,
        commentsForAuthor
      });
      setIsSubmitting(false);
      // navigate("/reviewer-dashboard", { state: { reviewSubmitted: true } });
    }, 1500);
  };

  if (loading) {
    return <Loader/>
  }

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
          Submit Review: {manuscript.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manuscript Details Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            {/* Card Header */}
            <div className="p-5 pb-3 bg-blue-50">
              <h2 className="text-lg font-bold text-gray-800">
                <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-blue-500" />
                Manuscript Details
              </h2>
            </div>

            {/* Card Body */}
            <div className="px-5 py-3">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <FontAwesomeIcon icon={faBook} className="mr-2 text-gray-400" />
                <span className="font-medium">Journal:</span>
                <span className="ml-2">{manuscript.journal}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600 mb-2">
                <FontAwesomeIcon icon={faUserEdit} className="mr-2 text-gray-400" />
                <span className="font-medium">Author:</span>
                <span className="ml-2">{manuscript.author}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600 mb-2">
                <FontAwesomeIcon icon={faTag} className="mr-2 text-gray-400" />
                <span className="font-medium">Category:</span>
                <span className="ml-2">{manuscript.category}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600 mb-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-gray-400" />
                <span>Due: {new Date(manuscript.deadline).toLocaleDateString()}</span>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Abstract</h3>
                <p className="text-sm text-gray-600">
                  {manuscript.abstract}
                </p>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Attachments</h3>
                <ul className="space-y-1">
                  {manuscript.files.map((file, index) => (
                    <li key={index} className="flex items-center">
                      <FontAwesomeIcon icon={faDownload} className="mr-2 text-gray-400" />
                      <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                        {file}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            {/* Form Header */}
            <div className="p-5 pb-3 bg-blue-50">
              <h2 className="text-lg font-bold text-gray-800">
                <FontAwesomeIcon icon={faEdit} className="mr-2 text-blue-500" />
                Review Form
              </h2>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmitReview} className="px-5 py-3">
              <div className="mb-6">
                <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Review
                </label>
                <textarea
                  id="reviewText"
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide your detailed review of the manuscript..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recommendation
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    type="button"
                    className={`flex items-center justify-center px-4 py-2 border rounded-md ${recommendation === "accept" ? "bg-green-100 border-green-500 text-green-800" : "border-gray-300 hover:bg-gray-50"}`}
                    onClick={() => setRecommendation("accept")}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                    Accept
                  </button>
                  <button
                    type="button"
                    className={`flex items-center justify-center px-4 py-2 border rounded-md ${recommendation === "minor" ? "bg-blue-100 border-blue-500 text-blue-800" : "border-gray-300 hover:bg-gray-50"}`}
                    onClick={() => setRecommendation("minor")}
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Minor Revisions
                  </button>
                  <button
                    type="button"
                    className={`flex items-center justify-center px-4 py-2 border rounded-md ${recommendation === "reject" ? "bg-red-100 border-red-500 text-red-800" : "border-gray-300 hover:bg-gray-50"}`}
                    onClick={() => setRecommendation("reject")}
                  >
                    <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                    Reject
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="editorComments" className="block text-sm font-medium text-gray-700 mb-1">
                  Confidential Comments to Editor
                </label>
                <textarea
                  id="editorComments"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any confidential comments for the editor..."
                  value={commentsForEditor}
                  onChange={(e) => setCommentsForEditor(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="authorComments" className="block text-sm font-medium text-gray-700 mb-1">
                  Comments to Author
                </label>
                <textarea
                  id="authorComments"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Constructive feedback for the author..."
                  value={commentsForAuthor}
                  onChange={(e) => setCommentsForAuthor(e.target.value)}
                  required
                />
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
                  disabled={isSubmitting}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmission;