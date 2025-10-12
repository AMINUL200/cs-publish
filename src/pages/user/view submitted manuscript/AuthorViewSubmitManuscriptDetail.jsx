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

  const fetchManuscriptDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}api/manuscript/journal-history/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if(response.data.flag === 1){
        setManuscript(response.data.data);
        console.log(response.data.data);
        
      }else{
        toast.error(response.data.message || "Failed to fetch manuscript details");
      }
      
    } catch (error) {
      console.error("Error fetching manuscript details:", error);
      toast.error(error?.message || "Failed to fetch manuscript details");
    }finally{
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchManuscriptDetails();
  }, [id]);

  // Dummy data for the manuscript
  const manuscriptData = {
    title:
      "Machine Learning Applications in Healthcare: A Comprehensive Review",
    journal: "Journal of Medical Technology & Innovation",
    status: "Under Review",
    currentStep: 5,
    totalSteps: 12,
    progressPercentage: 41.67,
    currentStage: "Under Review",
    assignedTo: "Reviewer 1 (REV5144)",
    daysSinceSubmission: 15,
    lastActivity: "Aug 26, 2024",
    timeline: [
      {
        step: 1,
        event: "Manuscript Submitted",
        description: "Your manuscript was submitted for review",
        date: "Aug 15, 2024 at 10:30 AM",
      },
      {
        step: 2,
        event: "Step 2 - Assigned to Editor",
        description: "Manuscript assigned to Editor 1",
        date: "Aug 16, 2024 at 9:00 AM",
      },
      {
        step: 3,
        event: "Step 3 - Editor Response",
        description: "Assignment accepted",
        date: "Aug 16, 2024 at 2:30 PM",
      },
      {
        step: 4,
        event: "Step 4 - Assigned to Reviewer",
        description: "Manuscript assigned to Reviewer 1",
        date: "Aug 17, 2024 at 10:00 AM",
      },
      {
        step: 5,
        event: "Step 5 - Reviewer Response",
        description: "Review completed - Decision: Major revisions",
        date: "Aug 20, 2024 at 3:00 PM",
      },
      {
        step: 6,
        event: "Step 6 - Assigned to Reviewer",
        description: "Manuscript assigned to Reviewer 2",
        date: "Aug 21, 2024 at 11:00 AM",
      },
    ],
    assignments: {
      editor: [
        {
          name: "Editor 1",
          status: "Accepted",
          assignedBy: "System",
          date: "Aug 16, 2024",
        },
      ],
      reviewers: [
        {
          name: "Reviewer 1",
          status: "Accepted",
          assignedBy: "Editor 1",
          date: "Aug 17, 2024",
        },
        {
          name: "Reviewer 2",
          status: "Pending",
          assignedBy: "Editor 1",
          date: "Aug 21, 2024",
        },
        {
          name: "Reviewer 3",
          status: "Pending",
          assignedBy: "Editor 1",
          date: "Aug 21, 2024",
        },
      ],
    },
    nextSteps: {
      action: "Review in Progress",
      description:
        "Reviewer is evaluating your manuscript and will provide feedback",
      estimatedTime: "7-14 business days",
    },
  };

  // Helper function to get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case "Accepted":
        return "status-accepted";
      case "Pending":
        return "status-pending";
      case "Rejected":
        return "status-rejected";
      default:
        return "";
    }
  };

  if (loading) {
    return <Loader/>
  }

  return (
    <div className="container">
      {/* Manuscript Header */}
      <div className="manuscript-header">
        <div className="manuscript-title">"{manuscriptData.title}"</div>
        <div className="journal-name">{manuscriptData.journal}</div>
        <div className="status-badge">
          {manuscriptData.status} - Step {manuscriptData.currentStep} of{" "}
          {manuscriptData.totalSteps}
        </div>
        <div className="progress-container">
          <div className="progress-info">
            <span>Workflow Progress</span>
            <span>{manuscriptData.progressPercentage}% Complete</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${manuscriptData.progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Current Status Card */}
      <div className="current-status-card">
        <div className="card-title">Current Status</div>
        <div className="status-grid">
          <div className="status-item">
            <div className="status-label">Current Stage</div>
            <div className="status-value">{manuscriptData.currentStage}</div>
          </div>
          <div className="status-item">
            <div className="status-label">Assigned To</div>
            <div className="status-value">{manuscriptData.assignedTo}</div>
          </div>
          <div className="status-item">
            <div className="status-label">Workflow Step</div>
            <div className="status-value">
              Step {manuscriptData.currentStep} of {manuscriptData.totalSteps}
            </div>
          </div>
          <div className="status-item">
            <div className="status-label">Status</div>
            <div className="status-value">Accepted</div>
          </div>
          <div className="status-item">
            <div className="status-label">Days Since Submission</div>
            <div className="status-value">
              {manuscriptData.daysSinceSubmission} days
            </div>
          </div>
          <div className="status-item">
            <div className="status-label">Last Activity</div>
            <div className="status-value">{manuscriptData.lastActivity}</div>
          </div>
        </div>
      </div>

      {/* Workflow Timeline */}
      <div className="workflow-timeline">
        <div className="timeline-title">Manuscript Journey Timeline</div>
        <div className="timeline">
          {manuscriptData.timeline.map((item, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker">{item.step}</div>
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
          <div className="assignment-card">
            <h4>Editor</h4>
            {manuscriptData.assignments.editor.map((editor, index) => (
              <div key={index} className="assignment-item">
                <div className="assignee-info">
                  <span className="assignee-name">{editor.name}</span>
                  <span
                    className={`status-badge-small ${getStatusClass(
                      editor.status
                    )}`}
                  >
                    {editor.status}
                  </span>
                </div>
                <div className="assignment-details">
                  <span>Assigned by: {editor.assignedBy}</span>
                  <span>{editor.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Reviewer Assignments */}
          <div className="assignment-card">
            <h4>Reviewers</h4>
            {manuscriptData.assignments.reviewers.map((reviewer, index) => (
              <div key={index} className="assignment-item">
                <div className="assignee-info">
                  <span className="assignee-name">{reviewer.name}</span>
                  <span
                    className={`status-badge-small ${getStatusClass(
                      reviewer.status
                    )}`}
                  >
                    {reviewer.status}
                  </span>
                </div>
                <div className="assignment-details">
                  <span>Assigned by: {reviewer.assignedBy}</span>
                  <span>{reviewer.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="next-steps">
        <h3>What Happens Next?</h3>
        <div className="next-steps-content">
          <div className="next-steps-action">
            {manuscriptData.nextSteps.action}
          </div>
          <div className="next-steps-description">
            {manuscriptData.nextSteps.description}
          </div>
          <div className="next-steps-time">
            Estimated time: {manuscriptData.nextSteps.estimatedTime}
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

          .timeline {
            padding-left: 30px;
          }

          .timeline-marker {
            width: 30px;
            height: 30px;
            left: -20px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthorViewSubmitManuscriptDetail;
