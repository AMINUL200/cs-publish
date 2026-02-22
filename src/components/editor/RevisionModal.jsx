import { faTrash, faTimes, faUpload, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const recommendationMap = {
  minor_revisions: "Minor Revisions",
  major_revisions: "Major Revisions",
  accept: "Accept",
  reject: "Reject",
};

const RevisionModal = ({
  isOpen,
  onClose,
  manuscript,
  reviewer,
  selectedMessage,
  onSendRevision,
}) => {
  const [editorMessage, setEditorMessage] = useState("");
  const [editorRecommendation, setEditorRecommendation] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [includeReviewerMessage, setIncludeReviewerMessage] = useState(true);
  const [includeReviewerRecommendation, setIncludeReviewerRecommendation] =
    useState(true);
  const [includeReviewerFile, setIncludeReviewerFile] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  console.log("RevisionModal Props:", { selectedMessage });

  // Reset form when modal opens with new message
  useEffect(() => {
    if (isOpen) {
      setEditorMessage("");
      setEditorRecommendation("");
      setAttachedFile(null);
      setIncludeReviewerMessage(true);
      setIncludeReviewerRecommendation(true);
      setIncludeReviewerFile(true);
    }
  }, [isOpen, selectedMessage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setAttachedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate based on includeReviewerMessage checkbox
    if (!includeReviewerMessage && !editorMessage.trim()) {
      toast.error(
        "Please provide an editor message when not including the reviewer's message",
      );
      return;
    }

    setIsLoading(true);

    // Create request body according to API requirements
    const requestBody = {
      message_id: selectedMessage.id,
      is_editor_approved: includeReviewerMessage ? 0 : 1,
    };

    // Only include message_to_author when not including reviewer's message
    if (!includeReviewerMessage && editorMessage.trim()) {
      requestBody.message_to_author = editorMessage;
    }

    try {
      console.log("Request Body to be sent:", requestBody);
      await onSendRevision(requestBody);
      handleClose();
    } catch (error) {
      console.error("Error sending revision:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEditorMessage("");
    setEditorRecommendation("");
    setAttachedFile(null);
    setIncludeReviewerMessage(true);
    setIncludeReviewerRecommendation(true);
    setIncludeReviewerFile(true);
    onClose();
  };

  if (!isOpen) return null;

  // Use the selected message if provided, otherwise use the first message
  const reviewerMessage = selectedMessage || reviewer?.messages?.[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500/75"
          onClick={handleClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Send Revision to Author
                  {selectedMessage && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      (Message ID: {selectedMessage.id})
                    </span>
                  )}
                </h3>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Manuscript Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-2">
                    Manuscript
                  </h4>
                  <p
                    className="text-sm text-gray-700"
                    dangerouslySetInnerHTML={{ __html: manuscript?.title }}
                  />
                </div>

                {/* Reviewer Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-2">
                    Reviewer
                  </h4>
                  <p className="text-sm text-gray-700">
                    {reviewer.reviewer.name} ({reviewer.reviewer.email})
                  </p>
                </div>

                {/* Status Indicator */}
                <div className={`p-4 rounded-lg ${
                  includeReviewerMessage 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        includeReviewerMessage ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-900">
                        {includeReviewerMessage 
                          ? 'Approved: Using reviewer\'s message' 
                          : 'Not Approved: You need to provide a message'
                        }
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      is_editor_approved: {includeReviewerMessage ? '1' : '0'}
                    </span>
                  </div>
                </div>

                {/* Selected Reviewer's Message */}
                {reviewerMessage && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center justify-between">
                      <span>Reviewer's Response</span>
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                        Message from {new Date(reviewerMessage.created_at).toLocaleDateString()}
                      </span>
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={includeReviewerMessage}
                            onChange={(e) => {
                              setIncludeReviewerMessage(e.target.checked);
                              // Clear editor message when switching to approved
                              if (e.target.checked) {
                                setEditorMessage("");
                              }
                            }}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Include this message to author (is_editor_approved = 1)
                          </span>
                        </label>
                        {includeReviewerMessage && (
                          <div className="mt-2 p-3 bg-white rounded border">
                            <p className="text-sm font-medium text-gray-700 mb-1">Message to Author:</p>
                            <p className="text-sm text-gray-900">
                              {reviewerMessage.message_to_author}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={includeReviewerRecommendation}
                            onChange={(e) =>
                              setIncludeReviewerRecommendation(e.target.checked)
                            }
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Include recommendation
                          </span>
                        </label>
                        {includeReviewerRecommendation && (
                          <div className="mt-2 p-3 bg-white rounded border">
                            <p className="text-sm font-medium text-gray-700 mb-1">Recommendation:</p>
                            <p className="text-sm text-gray-900">
                              {recommendationMap[
                                reviewerMessage.recommendation
                              ] || reviewerMessage.recommendation}
                            </p>
                          </div>
                        )}
                      </div> */}

                      {/* {reviewerMessage.image && (
                        <div>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={includeReviewerFile}
                              onChange={(e) =>
                                setIncludeReviewerFile(e.target.checked)
                              }
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              Include attached file
                            </span>
                          </label>
                          {includeReviewerFile && (
                            <div className="mt-2 p-3 bg-white rounded border">
                              <p className="text-sm text-gray-900">
                                <a 
                                  href={`${import.meta.env.VITE_STORAGE_URL}${reviewerMessage.image}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  View attached file
                                </a>
                              </p>
                            </div>
                          )}
                        </div>
                      )} */}
                    </div>
                  </div>
                )}

                {/* Editor's Message - Only show when NOT including reviewer's message */}
                {!includeReviewerMessage && (
                  <div>
                    <label
                      htmlFor="editorMessage"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Editor's Message to Author <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="editorMessage"
                      rows={4}
                      value={editorMessage}
                      onChange={(e) => setEditorMessage(e.target.value)}
                      placeholder="Add your message to the author (required when not including reviewer's message)..."
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required={!includeReviewerMessage}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      This will be sent as message_to_author in the API
                    </p>
                  </div>
                )}

                {/* Editor's Recommendation */}
                {/* <div>
                  <label
                    htmlFor="editorRecommendation"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Editor's Recommendation
                  </label>
                  <select
                    id="editorRecommendation"
                    value={editorRecommendation}
                    onChange={(e) => setEditorRecommendation(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select recommendation...</option>
                    <option value="accept">Accept</option>
                    <option value="minor_revisions">Minor Revisions</option>
                    <option value="major_revisions">Major Revisions</option>
                    <option value="reject">Reject</option>
                  </select>
                </div> */}

                {/* File Upload */}
                {/* <div>
                  <label
                    htmlFor="editorFile"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Attach File (Optional)
                  </label>
                  <div className="flex items-center space-x-3">
                    <label className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                      <FontAwesomeIcon icon={faUpload} className="mr-2" />
                      Choose File
                      <input
                        id="editorFile"
                        type="file"
                        onChange={handleFileChange}
                        className="sr-only"
                        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                      />
                    </label>
                    {attachedFile && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {attachedFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setAttachedFile(null)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Supported formats: PDF, DOC, DOCX, TXT, PNG, JPG, JPEG (Max:
                    10MB)
                  </p>
                </div> */}
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                    {includeReviewerMessage ? 'Send Approved Review' : 'Send Custom Message'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>

            {/* Request Body Preview */}
            <div className="px-6 pb-4">
              <details className="text-xs">
                <summary className="text-gray-500 cursor-pointer hover:text-gray-700">
                  Preview API Request Body
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto">
                  {JSON.stringify({
                    message_id: selectedMessage?.id,
                    ...(!includeReviewerMessage && editorMessage.trim() && { message_to_author: editorMessage }),
                    is_editor_approved: includeReviewerMessage ? 1 : 0
                  }, null, 2)}
                </pre>
              </details>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RevisionModal;