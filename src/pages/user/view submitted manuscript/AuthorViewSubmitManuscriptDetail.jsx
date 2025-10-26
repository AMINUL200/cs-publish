import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";

const AuthorViewSubmitManuscriptDetail = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;
  const [manuscript, setManuscript] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [featureOptions, setFeatureOptions] = React.useState([]);
  const [paymentDetails, setPaymentDetails] = React.useState(null);
  const [selectedFeatures, setSelectedFeatures] = React.useState([]);
  const [showFeatureModal, setShowFeatureModal] = React.useState(false);
  const [updatingFeatures, setUpdatingFeatures] = React.useState(false);

  const fetchManuscriptDetails = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/manuscript/journal-history/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.flag === 1) {
        setManuscript(response.data.data);
        console.log(response.data.data);
      } else {
        toast.error(
          response.data.message || "Failed to fetch manuscript details"
        );
      }
    } catch (error) {
      console.error("Error fetching manuscript details:", error);
      toast.error(error?.message || "Failed to fetch manuscript details");
    } finally {
      setLoading(false);
    }
  };

  // Fetch feature options
  const fetchFeatureOptions = async () => {
    try {
      const response = await axios.get(`${API_URL}api/author-feature-option`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        setFeatureOptions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching feature options:", error);
      toast.error("Failed to fetch feature options");
    }
  };
  // console.log("payemtne details:: ", paymentDetails);

  // Fetch payment details with selected features
  const fetchPaymentDetails = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/manuscript-payment/edit/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.flag === 1) {
        setPaymentDetails(response.data.data);
        // Set selected features from payment details
        if (response.data.data.selected_features) {
          setSelectedFeatures(
            response.data.data.selected_features.map((feature) => feature.id)
          );
        }
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
      // Don't show error toast as payment might not exist yet
    }
  };

  // Create new payment with selected features (first time)
  const createPaymentWithFeatures = async () => {
    setUpdatingFeatures(true);
    try {
      const response = await axios.post(
        `${API_URL}api/manuscript-payment/${id}`,
        {
          author_optional_features_id: selectedFeatures,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.flag === 1) {
        toast.success("Features added successfully!");
        setPaymentDetails(response.data.data);
        setShowFeatureModal(false);
        // Refresh payment details
        fetchPaymentDetails();
      } else {
        toast.error(response.data.message || "Failed to add features");
      }
    } catch (error) {
      console.error("Error creating payment with features:", error);
      toast.error(error?.response?.data?.message || "Failed to add features");
    } finally {
      setUpdatingFeatures(false);
    }
  };

  // Update selected features
  const updateSelectedFeatures = async () => {
    setUpdatingFeatures(true);
    try {
      const response = await axios.post(
        `${API_URL}api/manuscript-payment/update/${id}`,
        {
          author_optional_features_id: selectedFeatures,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.flag === 1) {
        toast.success("Features updated successfully!");
        setPaymentDetails(response.data.data);
        setShowFeatureModal(false);
      } else {
        toast.error(response.data.message || "Failed to update features");
      }
    } catch (error) {
      console.error("Error updating features:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update features"
      );
    } finally {
      setUpdatingFeatures(false);
    }
  };

  // Handle feature checkbox change
  const handleFeatureChange = (featureId) => {
    setSelectedFeatures((prev) => {
      if (prev.includes(featureId)) {
        return prev.filter((id) => id !== featureId);
      } else {
        return [...prev, featureId];
      }
    });
  };

  // Calculate total amount
  const calculateTotalAmount = () => {
    if (!paymentDetails) return 0;

    const journalAmount = parseFloat(
      paymentDetails.journal?.amount ||
        paymentDetails.payment?.journal_amount ||
        0
    );
    const selectedFeaturesAmount = selectedFeatures.reduce(
      (total, featureId) => {
        const feature = featureOptions.find((f) => f.id === featureId);
        return total + (feature ? parseFloat(feature.amount) : 0);
      },
      0
    );

    return journalAmount + selectedFeaturesAmount;
  };

  // Handle save features based on whether payment exists or not
  const handleSaveFeatures = () => {
    if (!paymentDetails) {
      // First time - create new payment
      createPaymentWithFeatures();
    } else {
      // Update existing payment
      updateSelectedFeatures();
    }
  };

  React.useEffect(() => {
    fetchManuscriptDetails();
    fetchFeatureOptions();
    fetchPaymentDetails();
  }, [id]);

  // Helper function to get status badge class
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "completed":
        return "status-accepted";
      case "pending":
        return "status-pending";
      case "rejected":
        return "status-rejected";
      default:
        return "";
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper function to strip HTML tags
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Build timeline from assignment history
  const buildTimeline = () => {
    if (!manuscript) return [];

    const timeline = [];

    // Add submission event
    timeline.push({
      step: 1,
      event: "Manuscript Submitted",
      description: "Your manuscript was submitted for review",
      date: formatDate(manuscript.manuscript.submitted_at),
    });

    // Add assignment history events
    manuscript.assignment_history.forEach((assignment, index) => {
      timeline.push({
        step: index + 2,
        event: `${assignment.role} Assignment - ${assignment.assigned_to} (${assignment.assigned_to_id})`,
        description: assignment.status_text,
        date: formatDate(assignment.assigned_at),
      });

      // If status changed, add update event
      if (assignment.updated_at !== assignment.assigned_at) {
        timeline.push({
          step: index + 2 + 0.5,
          event: `${assignment.role} Response`,
          description: assignment.status_text,
          date: formatDate(assignment.updated_at),
        });
      }
    });

    return timeline;
  };

  if (loading) {
    return <Loader />;
  }

  if (!manuscript) {
    return <div className="container">No manuscript data available</div>;
  }

  const {
    manuscript: manuscriptData,
    workflow_info,
    workflow,
    summary,
    next_steps,
    messages,
  } = manuscript;

  return (
    <div className="container">
      {/* Manuscript Header */}
      <div className="manuscript-header">
        <div className="manuscript-title">
          "{stripHtml(manuscriptData.title)}"
        </div>
        <div className="journal-name">{manuscriptData.journal_title}</div>
        <div className="status-badge">
          {manuscriptData.current_stage.stage} - Step{" "}
          {workflow_info.current_step} of{" "}
          {workflow_info.workflow_progress.max_steps}
        </div>
        <div className="progress-container">
          <div className="progress-info">
            <span>Workflow Progress</span>
            <span>
              {workflow_info.workflow_progress.percentage.toFixed(2)}% Complete
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress"
              style={{
                width: `${workflow_info.workflow_progress.percentage}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Payment & Features Section */}
      <div className="payment-features-section">
        <div className="section-header">
          <h3>Publication Features & Payment</h3>

          <button
            className="edit-features-btn"
            onClick={() => setShowFeatureModal(true)}
          >
            {paymentDetails ? "Edit Features" : "Add Features"}
          </button>
        </div>

        {paymentDetails && (
          <div className="payment-summary">
            <div className="payment-item">
              <span>Journal Publication Fee:</span>
              <span>
                $
                {paymentDetails?.journal?.amount ||
                  paymentDetails?.payment?.journal_amount ||
                  "0.00"}
              </span>
            </div>

            {paymentDetails?.selected_features &&
              paymentDetails.selected_features.length > 0 && (
                <div className="selected-features">
                  <h4>Selected Features:</h4>
                  {paymentDetails.selected_features.map((feature) => (
                    <div key={feature.id} className="feature-item">
                      <span>{feature.name}</span>
                      <span>+${feature.amount}</span>
                    </div>
                  ))}
                </div>
              )}

            <div className="payment-total">
              <span>Total Amount:</span>
              <span>${calculateTotalAmount().toFixed(2)}</span>
            </div>

            <div className="payment-status">
              <span>Payment Status:</span>
              <span
                className={`status-badge-small ${getStatusClass(
                  paymentDetails?.payment?.payment_status || "pending"
                )}`}
              >
                {paymentDetails?.payment?.payment_status || "Pending"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Feature Selection Modal */}
      {showFeatureModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Select Publication Features</h3>
              <button
                className="close-btn"
                onClick={() => setShowFeatureModal(false)}
              >
                ×
              </button>
            </div>

            <div className="feature-checklist">
              {featureOptions.map((feature) => (
                <div key={feature.id} className="feature-checkbox-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(feature.id)}
                      onChange={() => handleFeatureChange(feature.id)}
                    />
                    <span className="checkmark"></span>
                    <div className="feature-info">
                      <span className="feature-name">{feature.name}</span>
                      <span className="feature-amount">+${feature.amount}</span>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="modal-summary">
              <div className="summary-item">
                <span>Journal Fee:</span>
                <span>
                  $
                  {paymentDetails?.journal?.amount ||
                    paymentDetails?.payment?.journal_amount ||
                    "0.00"}
                </span>
              </div>
              <div className="summary-item">
                <span>Selected Features:</span>
                <span>
                  +$
                  {selectedFeatures
                    .reduce((total, featureId) => {
                      const feature = featureOptions.find(
                        (f) => f.id === featureId
                      );
                      return total + (feature ? parseFloat(feature.amount) : 0);
                    }, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="summary-total">
                <span>Total Amount:</span>
                <span>${calculateTotalAmount().toFixed(2)}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowFeatureModal(false)}
              >
                Cancel
              </button>

              {paymentDetails && (
                <button
                  className="save-btn"
                  onClick={updateSelectedFeatures}
                  disabled={updatingFeatures}
                >
                  {updatingFeatures ? "Updating..." : "Save Features"}
                </button>
              )}

              {!paymentDetails && (
                <button
                  className="save-btn"
                  onClick={createPaymentWithFeatures}
                  disabled={updatingFeatures}
                >
                  {updatingFeatures ? "Updating..." : "Add Features"}
                </button>
              )}

              
            </div>
          </div>
        </div>
      )}

      {/* Current Status Card */}
      <div className="current-status-card">
        <div className="card-title">Current Status</div>
        <div className="status-grid">
          <div className="status-item">
            <div className="status-label">Current Stage</div>
            <div className="status-value">
              {manuscriptData.current_stage.stage}
            </div>
          </div>
          <div className="status-item">
            <div className="status-label">Stage Description</div>
            <div className="status-value">
              {manuscriptData.current_stage.description}
            </div>
          </div>
          <div className="status-item">
            <div className="status-label">Workflow Step</div>
            <div className="status-value">
              Step {workflow_info.current_step} of{" "}
              {workflow_info.workflow_progress.max_steps}
            </div>
          </div>
          <div className="status-item">
            <div className="status-label">Status</div>
            <div className="status-value">{manuscriptData.status}</div>
          </div>
          <div className="status-item">
            <div className="status-label">Days Since Submission</div>
            <div className="status-value">
              {summary.days_since_submission} days
            </div>
          </div>
          <div className="status-item">
            <div className="status-label">Last Activity</div>
            <div className="status-value">
              {formatDate(summary.last_activity)}
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Timeline */}
      <div className="workflow-timeline">
        <div className="timeline-title">Manuscript Journey Timeline</div>
        <div className="timeline">
          {buildTimeline().map((item, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker">{Math.floor(item.step)}</div>
              <div className="timeline-content">
                <div className="timeline-event">{item.event}</div>
                <div className="timeline-description">{item.description}</div>
                <div className="timeline-date">{item.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assignment History */}
      <div className="assignment-history">
        <div className="assignment-title">Who's Handling Your Manuscript</div>
        <div className="assignment-cards">
          {/* Editor Assignments */}
          {workflow.editor_assignments.length > 0 && (
            <div className="assignment-card">
              <h4>Editors</h4>
              {workflow.editor_assignments.map((editor, index) => (
                <div key={index} className="assignment-item">
                  <div className="assignee-info">
                    <span className="assignee-name">
                      {editor.assigned_to} ({editor.assigned_to_id})
                    </span>
                    <span
                      className={`status-badge-small ${getStatusClass(
                        editor.status
                      )}`}
                    >
                      {editor.status}
                    </span>
                  </div>
                  <div className="assignment-details">
                    <span>
                      Assigned by: {editor.assigned_by} ({editor.assigned_by_id}
                      )
                    </span>
                    <span>{formatDate(editor.assigned_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reviewer Assignments */}
          {workflow.reviewer_assignments.length > 0 && (
            <div className="assignment-card">
              <h4>Reviewers</h4>
              {workflow.reviewer_assignments.map((reviewer, index) => (
                <div key={index} className="assignment-item">
                  <div className="assignee-info">
                    <span className="assignee-name">
                      {reviewer.assigned_to} ({reviewer.assigned_to_id})
                    </span>
                    <span
                      className={`status-badge-small ${getStatusClass(
                        reviewer.status
                      )}`}
                    >
                      {reviewer.status}
                    </span>
                  </div>
                  <div className="assignment-details">
                    <span>
                      Assigned by: {reviewer.assigned_by} (
                      {reviewer.assigned_by_id})
                    </span>
                    <span>{formatDate(reviewer.assigned_at)}</span>
                  </div>
                  {reviewer.reviewer_status && (
                    <div className="reviewer-decision">
                      Decision: {reviewer.reviewer_status.replace("_", " ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages Section */}
      {messages && messages.length > 0 && (
        <div className="messages-section">
          <div className="messages-title">Messages from Reviewers</div>
          {messages.map((message) => (
            <div key={message.id} className="message-card">
              <div className="message-text">{message.message_to_author}</div>
              <div className="message-date">
                {formatDate(message.created_at)}
              </div>
              {message.image && (
                <div className="message-image">
                  <img
                    src={`${API_URL}${message.image}`}
                    alt="Review attachment"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Statistics */}
      <div className="statistics-section">
        <div className="stat-card">
          <div className="stat-number">{summary.total_editors}</div>
          <div className="stat-label">Total Editors</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{summary.total_reviewers}</div>
          <div className="stat-label">Total Reviewers</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{summary.accepted_reviewers}</div>
          <div className="stat-label">Accepted Reviewers</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{summary.pending_reviewers}</div>
          <div className="stat-label">Pending Reviewers</div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="next-steps">
        <h3>What Happens Next?</h3>
        <div className="next-steps-content">
          <div className="next-steps-action">{next_steps.action}</div>
          <div className="next-steps-description">{next_steps.description}</div>
          <div className="next-steps-time">
            Estimated time: {next_steps.estimated_time}
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8f9fa;
          color: #333;
          line-height: 1.6;
        }

        /* Payment & Features Section Styles */
        .payment-features-section {
          background: white;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h3 {
          color: #007bff;
          margin: 0;
        }

        .edit-features-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.3s ease;
        }

        .edit-features-btn:hover {
          background: #0056b3;
        }

        .payment-summary {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }

        .payment-item,
        .feature-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }

        .selected-features {
          margin: 15px 0;
        }

        .selected-features h4 {
          color: #495057;
          margin-bottom: 10px;
        }

        .payment-total {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          font-weight: bold;
          font-size: 18px;
          border-top: 2px solid #007bff;
          margin-top: 10px;
        }

        .payment-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #dee2e6;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 0;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e9ecef;
        }

        .modal-header h3 {
          margin: 0;
          color: #007bff;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6c757d;
        }

        .feature-checklist {
          padding: 20px;
        }

        .feature-checkbox-item {
          margin-bottom: 15px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 12px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .checkbox-label:hover {
          border-color: #007bff;
        }

        .checkbox-label input {
          display: none;
        }

        .checkmark {
          width: 20px;
          height: 20px;
          border: 2px solid #6c757d;
          border-radius: 4px;
          margin-right: 15px;
          position: relative;
          transition: all 0.3s ease;
        }

        .checkbox-label input:checked + .checkmark {
          background: #007bff;
          border-color: #007bff;
        }

        .checkbox-label input:checked + .checkmark::after {
          content: "✓";
          position: absolute;
          color: white;
          font-size: 14px;
          font-weight: bold;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .feature-info {
          display: flex;
          justify-content: space-between;
          flex: 1;
          align-items: center;
        }

        .feature-name {
          font-weight: 500;
        }

        .feature-amount {
          color: #28a745;
          font-weight: bold;
        }

        .modal-summary {
          padding: 20px;
          background: #f8f9fa;
          border-top: 1px solid #e9ecef;
        }

        .summary-item,
        .summary-total {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }

        .summary-total {
          font-weight: bold;
          font-size: 18px;
          border-top: 2px solid #007bff;
          margin-top: 10px;
          padding-top: 12px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 20px;
          border-top: 1px solid #e9ecef;
        }

        .cancel-btn,
        .save-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .cancel-btn {
          background: #6c757d;
          color: white;
        }

        .cancel-btn:hover {
          background: #545b62;
        }

        .save-btn {
          background: #28a745;
          color: white;
        }

        .save-btn:hover:not(:disabled) {
          background: #218838;
        }

        .save-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        /* Your existing styles... */
        .manuscript-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .manuscript-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .journal-name {
          font-size: 16px;
          opacity: 0.9;
          margin-bottom: 20px;
        }

        .status-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 20px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .progress-container {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 15px;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .progress-bar {
          width: 100%;
          height: 12px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          overflow: hidden;
        }

        .progress {
          height: 100%;
          background: linear-gradient(90deg, #4caf50, #8bc34a);
          transition: width 0.3s ease;
          border-radius: 6px;
        }

        .current-status-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border-left: 5px solid #007bff;
        }

        .card-title {
          font-size: 20px;
          font-weight: bold;
          color: #007bff;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
        }

        .card-title::before {
          content: "📋";
          margin-right: 10px;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .status-item {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #28a745;
        }

        .status-label {
          font-size: 12px;
          color: #6c757d;
          text-transform: uppercase;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .status-value {
          font-size: 16px;
          font-weight: 500;
        }

        .workflow-timeline {
          background: white;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .timeline-title {
          font-size: 20px;
          font-weight: bold;
          color: #007bff;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
        }

        .timeline-title::before {
          content: "⏱️";
          margin-right: 10px;
        }

        .timeline {
          position: relative;
          padding-left: 40px;
        }

        .timeline::before {
          content: "";
          position: absolute;
          left: 20px;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #007bff, #28a745);
          border-radius: 2px;
        }

        .timeline-item {
          position: relative;
          margin-bottom: 30px;
          padding-left: 30px;
        }

        .timeline-marker {
          position: absolute;
          left: -38px;
          top: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
        }

        .timeline-content {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          border-left: 4px solid #007bff;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }

        .timeline-event {
          font-weight: bold;
          color: #007bff;
          font-size: 16px;
          margin-bottom: 8px;
        }

        .timeline-description {
          color: #6c757d;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .timeline-date {
          font-size: 12px;
          color: #adb5bd;
          font-weight: 500;
        }

        .assignment-history {
          background: white;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .assignment-title {
          font-size: 20px;
          font-weight: bold;
          color: #007bff;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
        }

        .assignment-title::before {
          content: "👥";
          margin-right: 10px;
        }

        .assignment-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .assignment-card {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 20px;
          border-left: 5px solid #28a745;
        }

        .assignment-card h4 {
          color: #007bff;
          margin-bottom: 15px;
          font-size: 18px;
          display: flex;
          align-items: center;
        }

        .assignment-card h4::before {
          content: "👤";
          margin-right: 8px;
        }

        .assignment-item {
          background: white;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
          border-left: 4px solid #28a745;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .assignee-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .assignee-name {
          font-weight: bold;
          font-size: 16px;
          color: #333;
        }

        .status-badge-small {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }

        .status-accepted {
          background: #d4edda;
          color: #155724;
        }

        .status-pending {
          background: #fff3cd;
          color: #856404;
        }

        .status-rejected {
          background: #f8d7da;
          color: #721c24;
        }

        .assignment-details {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #6c757d;
          margin-top: 8px;
        }

        .reviewer-decision {
          margin-top: 10px;
          padding: 8px;
          background: #e7f3ff;
          border-radius: 5px;
          font-size: 13px;
          font-weight: 500;
          color: #0066cc;
          text-transform: capitalize;
        }

        .messages-section {
          background: white;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .messages-title {
          font-size: 20px;
          font-weight: bold;
          color: #007bff;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
        }

        .messages-title::before {
          content: "💬";
          margin-right: 10px;
        }

        .message-card {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
          border-left: 4px solid #ffc107;
        }

        .message-text {
          color: #333;
          margin-bottom: 10px;
          line-height: 1.6;
        }

        .message-date {
          font-size: 12px;
          color: #6c757d;
        }

        .message-image {
          margin-top: 10px;
        }

        .message-image img {
          max-width: 100%;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .statistics-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border-top: 4px solid #007bff;
        }

        .stat-number {
          font-size: 36px;
          font-weight: bold;
          color: #007bff;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 14px;
          color: #6c757d;
          text-transform: uppercase;
        }

        .next-steps {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
          padding: 25px;
          margin-top: 30px;
        }

        .next-steps h3 {
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }

        .next-steps h3::before {
          content: "🚀";
          margin-right: 10px;
        }

        .next-steps-content {
          background: rgba(255, 255, 255, 0.1);
          padding: 15px;
          border-radius: 8px;
        }

        .next-steps-action {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .next-steps-description {
          opacity: 0.9;
          margin-bottom: 10px;
        }

        .next-steps-time {
          font-size: 12px;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .container {
            padding: 10px;
          }

          .status-grid {
            grid-template-columns: 1fr;
          }

          .assignment-cards {
            grid-template-columns: 1fr;
          }

          .statistics-section {
            grid-template-columns: repeat(2, 1fr);
          }

          .timeline {
            padding-left: 30px;
          }

          .timeline-marker {
            width: 30px;
            height: 30px;
            left: -20px;
            font-size: 12px;
          }

          .section-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .modal-content {
            width: 95%;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthorViewSubmitManuscriptDetail;
