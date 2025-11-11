import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { faFlask } from "@fortawesome/free-solid-svg-icons";
import { faChartBar } from "@fortawesome/free-solid-svg-icons";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../../components/common/Loader";
import { Download } from "lucide-react";
import { View } from "lucide-react";
import { FileText } from "lucide-react";

const ReviewerManuscriptView = () => {
  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [decision, setDecision] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [confidentialComments, setConfidentialComments] = useState("");
  const [reviewFile, setReviewFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manuscriptDetails, setManuscriptDetails] = useState(null);

  // Checklist state initialized with empty array
  const [checklist, setChecklist] = useState([]);

  const getManuscriptDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}api/review/manuscript-dtl/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.flag === 1) {
        console.log("Manuscript details response:", res.data.data);
        setManuscriptDetails(res.data.data);
        // Transform questions into checklist format
        if (res.data.data.questions && res.data.data.questions.length > 0) {
          setChecklist(
            res.data.data.questions.map((question, index) => ({
              id: question.id,
              question: question.name,
              answer: 0,
            }))
          );
        }
      } else {
        toast.error(res.data.message || "Failed to fetch manuscript details");
        throw new Error("Failed to fetch manuscript details");
      }
    } catch (error) {
      console.error("Error fetching manuscript details:", error);
      toast.error(error.message || "Failed to fetch manuscript details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getManuscriptDetails();
  }, [token, id]);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = {
        manuscript_id: manuscript.id,
        message_to_author: reviewText,
        message_to_editor: confidentialComments,
        recommendation: decision,
        image: reviewFile ? reviewFile : null, // If file is selected, include it
        checklist: checklist.filter((item) => item.answer === 1), // Only include checked items
      };
      console.log("Submitting review data:", formData);

      // Submit the review data to the API
      axios
        .post(`${API_URL}api/review/msg-editor-othor`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.flag === 1) {
            toast.success("Review submitted successfully");
            navigate(-1);
          } else {
            toast.error(response.data.message || "Failed to submit review");
          }
        })
        .catch((error) => {
          console.error("Error submitting review:", error);
          toast.error(
            error.response?.data?.message || "Failed to submit review"
          );
        });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckboxChange = (id) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, answer: item.answer === 1 ? 0 : 1 } : item
      )
    );
  };

  const handleFileChange = (e) => {
    setReviewFile(e.target.files[0]);
  };
  const downloadImage = async (imagePath, fileName) => {
    try {
      const imageUrl = `${STORAGE_URL}${imagePath}`;

      // Fetch file as blob
      const response = await fetch(imageUrl, { mode: "cors" });
      const blob = await response.blob();

      // Create temporary URL for the blob
      const blobUrl = URL.createObjectURL(blob);

      // Create a hidden link element
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || imagePath.split("/").pop();

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      URL.revokeObjectURL(blobUrl);

      toast.success(`Downloading ${fileName || "image"}...`);
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image. Please try again.");
    }
  };
  const downloadFile = (filePath) => {
    if (!filePath) return;

    // Extract filename from path
    const filename = filePath.split("/").pop();

    // In a real app, this would trigger a file download from the server
    console.log(`Downloading ${filename}`);

    // Example of how you might implement the actual download:
    // window.open(`${API_URL}${filePath}`, '_blank');
  };

  if (loading) {
    return <Loader />;
  }

  if (!manuscriptDetails) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        No manuscript details found
      </div>
    );
  } else {
    console.log("Manuscript Details::::", manuscriptDetails.manuscript.author);
  }

  const { manuscript } = manuscriptDetails;

  // Helper function to render HTML content safely
  const renderHTML = (htmlString) => {
    return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
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
          Review Manuscript:&nbsp;
          <span
            className="inline-block "
            dangerouslySetInnerHTML={{ __html: manuscript?.title }}
          />
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-10">
        {/* Files Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-18">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-5">
              <div className="p-5 pb-3 bg-blue-50">
                <h2 className="text-lg font-bold text-gray-800">
                  <FontAwesomeIcon
                    icon={faFilePdf}
                    className="mr-2 text-blue-500"
                  />
                  Manuscript Files
                </h2>
              </div>
              <div className="px-5 py-3 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Manuscript</span>
                  <a
                    href={`${STORAGE_URL}${manuscript?.manuscript_file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faDownload} className="mr-1" />
                    Download
                  </a>
                </div>
                {manuscript?.copyright_form && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Copyright Form</span>
                    <a
                      href={`${STORAGE_URL}${manuscript?.copyright_form}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faDownload} className="mr-1" />
                      Download
                    </a>
                  </div>
                )}
                {manuscript?.supplementary_files ? (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Supplementary Files
                    </span>
                    <a
                      href={`${STORAGE_URL}${manuscript?.supplementary_files}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faDownload} className="mr-1" />
                      Download
                    </a>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    No supplementary files
                  </div>
                )}
              </div>
            </div>

            {/* Authors Card */}
            {/* <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-5 pb-3 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <FontAwesomeIcon icon={faUserShield} className="mr-2 text-indigo-500" />
                  Authors
                  <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                    {manuscriptDetails.manuscript.author?.length || 0}
                  </span>
                </h2>
              </div>

              {manuscriptDetails.manuscript.author && manuscriptDetails.manuscript.author.length > 0 ? (
                <div className="p-4 space-y-4">
                  {manuscriptDetails.manuscript.author.map((author, index) => (
                    <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                          {author.name ? author.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-md font-semibold text-gray-800 truncate">
                          {author.name || "Unnamed Author"}
                          {index === 0 && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Corresponding</span>}
                        </h3>

                        <div className="mt-2 space-y-1">
                          {author.email && (
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                              </svg>
                              <span className='font-semibold mr-2'>Email: </span>
                              <a href={`mailto:${author.email}`} className="truncate hover:text-blue-600">{author.email}</a>
                            </div>
                          )}

                          {author.university && (
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                              </svg>
                              <span className='font-semibold mr-2'>University: </span>
                              <span className="truncate">{author.university}</span>
                            </div>
                          )}

                          {author.affiliation && (
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              </svg>
                              <span className='font-semibold mr-2'>Affiliation: </span>
                              <span className="truncate">{author.affiliation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">No authors listed</p>
                </div>
              )}
            </div> */}
          </div>
        </div>

        {/* Manuscript Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Abstract */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-5 pb-3 bg-blue-50">
              <h2 className="text-lg font-bold text-gray-800">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="mr-2 text-blue-500"
                />
                Abstract
              </h2>
            </div>
            <div className="px-5 py-3">
              <p
                className="text-sm text-gray-700 whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: manuscript?.abstract }}
              />
            </div>
          </div>

          {/* Keywords */}
          {manuscript?.keywords && manuscript?.keywords.length > 0 && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-5 pb-3 bg-blue-50">
                <h2 className="text-lg font-bold text-gray-800">Keywords</h2>
              </div>
              <div className="px-5 py-3">
                <div className="flex flex-wrap gap-2">
                  {manuscript?.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
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
                  <FontAwesomeIcon
                    icon={faLightbulb}
                    className="mr-2 text-blue-500"
                  />
                  Introduction
                </h2>
              </div>
              <div className="px-5 py-3">
                <p
                  className="text-sm text-gray-700 whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: manuscript?.introduction }}
                />
              </div>
            </div>

            {/* Materials and Methods */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-5 pb-3 bg-blue-50">
                <h2 className="text-lg font-bold text-gray-800">
                  <FontAwesomeIcon
                    icon={faFlask}
                    className="mr-2 text-blue-500"
                  />
                  Materials and Methods
                </h2>
              </div>
              <div className="px-5 py-3">
                <p
                  className="text-sm text-gray-700 whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: manuscript?.materials_and_methods,
                  }}
                />
              </div>
            </div>

            {/* Results */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-5 pb-3 bg-blue-50">
                <h2 className="text-lg font-bold text-gray-800">
                  <FontAwesomeIcon
                    icon={faChartBar}
                    className="mr-2 text-blue-500"
                  />
                  Results
                </h2>
              </div>
              <div className="px-5 py-3">
                <p
                  className="text-sm text-gray-700 whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: manuscript?.results }}
                />
              </div>
            </div>

            {/* Discussion */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-5 pb-3 bg-blue-50">
                <h2 className="text-lg font-bold text-gray-800">
                  <FontAwesomeIcon
                    icon={faComments}
                    className="mr-2 text-blue-500"
                  />
                  Discussion
                </h2>
              </div>
              <div className="px-5 py-3">
                <p
                  className="text-sm text-gray-700 whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: manuscript?.discussion }}
                />
              </div>
            </div>

            {/* Conclusion */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-5 pb-3 bg-blue-50">
                <h2 className="text-lg font-bold text-gray-800">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="mr-2 text-blue-500"
                  />
                  Conclusion
                </h2>
              </div>
              <div className="px-5 py-3">
                <p
                  className="text-sm text-gray-700 whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: manuscript?.conclusion }}
                />
              </div>
            </div>

            {/* Author Contributions */}
            {manuscript?.author_contributions && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="p-5 pb-3 bg-blue-50">
                  <h2 className="text-lg font-bold text-gray-800">
                    Author Contributions
                  </h2>
                </div>
                <div className="px-5 py-3 text-sm text-gray-700">
                  {renderHTML(manuscript?.author_contributions)}
                </div>
              </div>
            )}

            {/* Conflict of Interest */}
            {manuscript?.conflict_of_interest_statement && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="p-5 pb-3 bg-blue-50">
                  <h2 className="text-lg font-bold text-gray-800">
                    Conflict of Interest Statement
                  </h2>
                </div>
                <div className="px-5 py-3 text-sm text-gray-700">
                  {renderHTML(manuscript?.conflict_of_interest_statement)}
                </div>
              </div>
            )}

            {/* References */}
            {manuscript?.references && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="p-5 pb-3 bg-blue-50">
                  <h2 className="text-lg font-bold text-gray-800">
                    References
                  </h2>
                </div>
                <div className="px-5 py-3 text-sm text-gray-700">
                  {renderHTML(manuscript?.references)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Figures */}
      {manuscript?.figures && manuscript?.figures.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-6 pb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Figures ({manuscript?.figures.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {manuscript?.figures.map((figurePath, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <img
                    src={`${STORAGE_URL}${figurePath}`}
                    alt={`Figure ${index + 1}`}
                    className="w-full h-full object-contain max-h-64"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="hidden flex-col items-center justify-center text-gray-500 p-4">
                    <FileText className="h-8 w-8 mb-2" />
                    <span className="text-sm text-center">
                      Image not available
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Figure {index + 1}
                    </span>
                    <div className="flex items-center space-x-2">
                      <a
                        href={`${STORAGE_URL}${figurePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <View className="h-3 w-3 mr-1" />
                        View
                      </a>

                      <button
                        onClick={() =>
                          downloadImage(
                            figurePath,
                            `Figure_${index + 1}.${figurePath?.split(".").pop()}`
                          )
                        }
                        className="text-green-600 hover:text-green-800 text-sm flex items-center px-2 py-1 rounded hover:bg-green-50 transition-colors"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 truncate">
                    {figurePath?.split("/").pop()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
            <label
              htmlFor="decision"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
              <option value="minor_revisions">Minor Revisions</option>
              <option value="major_revisions">Major Revisions</option>
              <option value="rejected">Reject</option>
            </select>
          </div>

          {checklist.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon
                  icon={faCheckSquare}
                  className="mr-1 text-blue-500"
                />
                Manuscript Evaluation Checklist
              </label>
              <div className="space-y-2">
                {checklist.map((item) => (
                  <div key={item.id} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        id={`check-${item.id}`}
                        checked={item.answer === 1}
                        onChange={() => handleCheckboxChange(item.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <label
                      htmlFor={`check-${item.id}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {item.question}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="reviewText"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
            <label
              htmlFor="confidentialComments"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
            <label
              htmlFor="reviewFile"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <FontAwesomeIcon
                icon={faPaperclip}
                className="mr-1 text-blue-500"
              />
              Upload Review Document (Optional)
            </label>
            <input
              type="file"
              id="reviewFile"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              onChange={handleFileChange}
              accept="jpeg,  jpg,  pdf, doc, docx, excel, ppt, pptx"
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
              disabled={isSubmitting}
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !decision}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting || !decision ? "opacity-70 cursor-not-allowed" : ""
              }`}
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
