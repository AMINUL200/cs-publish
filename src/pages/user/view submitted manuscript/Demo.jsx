import React, { useState } from 'react';
import { Clock, User, FileText, CheckCircle, XCircle, AlertCircle, Eye, DollarSign, Calendar, Mail, ArrowRight, RefreshCw, BookOpen } from 'lucide-react';

const Demo = () => {
  const [selectedStage, setSelectedStage] = useState(null);

  // Dummy manuscript data
  const manuscript = {
    id: "MS-2024-0156",
    title: "Novel Approaches to Machine Learning in Healthcare: A Comprehensive Analysis",
    author: "Dr. Sarah Johnson",
    submissionDate: "2024-01-15",
    currentStage: "under-review",
    currentRound: 2,
    editor: {
      name: "Prof. Michael Chen",
      email: "m.chen@journal.edu",
      assignedDate: "2024-01-16"
    },
    reviewers: [
      {
        id: "R1",
        name: "Reviewer 1",
        expertise: "Machine Learning",
        status: "completed",
        decision: "accept-minor-revisions",
        submittedDate: "2024-02-10"
      },
      {
        id: "R2", 
        name: "Reviewer 2",
        expertise: "Healthcare Analytics",
        status: "completed",
        decision: "accept-major-revisions", 
        submittedDate: "2024-02-12"
      },
      {
        id: "R3",
        name: "Reviewer 3", 
        expertise: "Data Science",
        status: "in-progress",
        decision: null,
        dueDate: "2024-02-20"
      }
    ],
    timeline: [
      {
        stage: "submitted",
        date: "2024-01-15",
        status: "completed",
        description: "Manuscript submitted by author"
      },
      {
        stage: "editor-assigned",
        date: "2024-01-16", 
        status: "completed",
        description: "Editor Prof. Michael Chen assigned"
      },
      {
        stage: "reviewers-assigned",
        date: "2024-01-18",
        status: "completed", 
        description: "3 reviewers assigned for peer review"
      },
      {
        stage: "under-review",
        date: "2024-01-20",
        status: "current",
        description: "Manuscript under peer review (Round 2)"
      },
      {
        stage: "revision-required",
        date: null,
        status: "pending",
        description: "Awaiting reviewer decisions"
      },
      {
        stage: "resubmission",
        date: null,
        status: "pending", 
        description: "Author revision and resubmission"
      },
      {
        stage: "final-decision",
        date: null,
        status: "pending",
        description: "Editor final decision"
      },
      {
        stage: "accepted",
        date: null,
        status: "pending",
        description: "Manuscript accepted for publication"
      },
      {
        stage: "payment",
        date: null,
        status: "pending",
        description: "Publication fee payment"
      },
      {
        stage: "published",
        date: null,
        status: "pending", 
        description: "Manuscript published"
      }
    ],
    revisionHistory: [
      {
        round: 1,
        submissionDate: "2024-01-15",
        reviewCompletedDate: "2024-01-28",
        decision: "minor-revisions",
        reviewerDecisions: ["accept-minor-revisions", "accept-minor-revisions", "accept-major-revisions"]
      },
      {
        round: 2,
        submissionDate: "2024-02-01",
        reviewCompletedDate: null,
        decision: "pending",
        reviewerDecisions: ["accept-minor-revisions", "accept-major-revisions", "pending"]
      }
    ]
  };

  const getStageIcon = (stage) => {
    const iconMap = {
      submitted: FileText,
      "editor-assigned": User,
      "reviewers-assigned": User,
      "under-review": Eye,
      "revision-required": RefreshCw,
      resubmission: FileText,
      "final-decision": CheckCircle,
      accepted: CheckCircle,
      payment: DollarSign,
      published: BookOpen
    };
    return iconMap[stage] || AlertCircle;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'current': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-gray-500 bg-gray-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getReviewerStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getDecisionColor = (decision) => {
    switch (decision) {
      case 'accept': return 'text-green-600 bg-green-100';
      case 'accept-minor-revisions': return 'text-blue-600 bg-blue-100';
      case 'accept-major-revisions': return 'text-yellow-600 bg-yellow-100';
      case 'reject': return 'text-red-600 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Manuscript Tracking</h1>
                  <p className="text-gray-600">Monitor your submission progress</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{manuscript.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Manuscript ID:</span>
                    <span className="text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded">{manuscript.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Submitted: {manuscript.submissionDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Round: {manuscript.currentRound}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="ml-8">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold">Round {manuscript.currentRound}</div>
                  <div className="text-blue-100 text-sm">Current Review</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Submission Timeline</h3>
              
              <div className="space-y-6">
                {manuscript.timeline.map((item, index) => {
                  const Icon = getStageIcon(item.stage);
                  const isLast = index === manuscript.timeline.length - 1;
                  
                  return (
                    <div key={item.stage} className="relative">
                      {!isLast && (
                        <div className={`absolute left-6 top-12 w-0.5 h-16 ${
                          item.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                        }`} />
                      )}
                      
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${
                          item.status === 'completed' 
                            ? 'bg-green-100 border-green-300 text-green-600' 
                            : item.status === 'current'
                            ? 'bg-blue-100 border-blue-300 text-blue-600 animate-pulse'
                            : 'bg-gray-100 border-gray-300 text-gray-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900 capitalize">
                              {item.stage.replace('-', ' ')}
                            </h4>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {item.status}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                          {item.date && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              {item.date}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-8">
            {/* Editor Assignment */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Assigned Editor</h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900">{manuscript.editor.name}</h4>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Mail className="w-3 h-3" />
                      {manuscript.editor.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Assigned: {manuscript.editor.assignedDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviewers */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Peer Reviewers</h3>
              <div className="space-y-3">
                {manuscript.reviewers.map((reviewer) => (
                  <div key={reviewer.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{reviewer.name}</h4>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getReviewerStatusColor(reviewer.status)}`}>
                        {reviewer.status}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{reviewer.expertise}</p>
                    
                    {reviewer.decision && (
                      <div className={`px-2 py-1 rounded-lg text-xs font-medium inline-block ${getDecisionColor(reviewer.decision)}`}>
                        {reviewer.decision.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    )}
                    
                    {reviewer.submittedDate && (
                      <p className="text-xs text-gray-500 mt-2">
                        Completed: {reviewer.submittedDate}
                      </p>
                    )}
                    
                    {reviewer.dueDate && !reviewer.submittedDate && (
                      <p className="text-xs text-gray-500 mt-2">
                        Due: {reviewer.dueDate}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Revision History */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Revision History</h3>
              <div className="space-y-4">
                {manuscript.revisionHistory.map((revision) => (
                  <div key={revision.round} className="border-l-4 border-blue-200 pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Round {revision.round}</h4>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        revision.decision === 'pending' ? 'text-yellow-600 bg-yellow-100' : 'text-green-600 bg-green-100'
                      }`}>
                        {revision.decision.replace('-', ' ')}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Submitted: {revision.submissionDate}
                    </p>
                    {revision.reviewCompletedDate && (
                      <p className="text-sm text-gray-600">
                        Review completed: {revision.reviewCompletedDate}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h3 className="text-xl font-bold">What's Next?</h3>
          </div>
          <p className="text-blue-100 mb-4">
            Your manuscript is currently under peer review (Round {manuscript.currentRound}). 
            We're waiting for the remaining reviewer decisions before proceeding to the next stage.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>Expected decision: Within 2-3 weeks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;