import React, { useEffect, useState } from "react";
import {
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Tag,
  Download,
  Eye,
  Clock,
  Users,
  Building,
  Globe,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../components/common/Loader";
import { View } from "lucide-react";

const PublisherViewManuscript = () => {
  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [manuscriptData, setManuscriptData] = useState(null);

  const fetchManuscriptDetails = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/publisher/show-manuscript/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.flag === 1) {
        // Handle the manuscript data
        console.log("Manuscript Data:", response.data.data[0]);
        setManuscriptData(response.data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching manuscript details:", error);
      toast.error(
        error.message || "An error occurred while fetching manuscript details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManuscriptDetails();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "approved":
        return "text-green-600 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      case "published":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const stripHtmlTags = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  if (loading) {
    return <Loader />;
  }

  if (!manuscriptData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-lg font-medium text-gray-900">
            Manuscript not found
          </h2>
          <p className="text-gray-500">
            The requested manuscript could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  const { manuscript_data: manuscript, editor } = manuscriptData;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {stripHtmlTags(manuscript.title)}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  Manuscript ID: {manuscript.id}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created: {formatDate(manuscript.created_at)}
                </div>
              </div>
            </div>
            {/* <div
              className={`px-4 py-2 rounded-full border text-sm font-medium ${getStatusColor(
                manuscriptData.status
              )}`}
            >
              <Clock className="inline-block h-4 w-4 mr-1" />
              {manuscriptData.status || "Unknown"}
            </div> */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Abstract */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Abstract
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {manuscript.abstract}
              </p>
            </div>

            {/* Keywords */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Keywords
              </h2>
              <div className="flex flex-wrap gap-2">
                {manuscript.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"
                  >
                    <Tag className="inline-block h-3 w-3 mr-1" />
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Manuscript Sections */}
            <div className="space-y-6">
              {[
                { title: "Introduction", content: manuscript.introduction },
                {
                  title: "Materials and Methods",
                  content: manuscript.materials_and_methods,
                },
                { title: "Results", content: manuscript.results },
                { title: "Discussion", content: manuscript.discussion },
                { title: "Conclusion", content: manuscript.conclusion },
                {
                  title: "Author Contributions",
                  content: manuscript.author_contributions,
                },
                {
                  title: "References",
                  content: stripHtmlTags(manuscript.references),
                },
              ].map((section, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                  <p
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  >
                    {/* {section.content} */}
                  </p>
                </div>
              ))}
            </div>

            {/* Conflict of Interest */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Conflict of Interest Statement
              </h2>
              <p className="text-gray-700">
                {stripHtmlTags(manuscript.conflict_of_interest_statement)}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignment Info */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Assignment Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">Assigned by:</span>
                  <span className="ml-2 font-medium">
                    {manuscriptData.assigned_by}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">Assigned to:</span>
                  <span className="ml-2 font-medium">
                    {manuscriptData.assigned_to}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <FileCheck className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">Stage:</span>
                  <span className="ml-2 font-medium">
                    {manuscript.manuscript_stage}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-gray-600">Email:</div>
                    <div className="font-medium">{manuscript.email}</div>
                  </div>
                </div>
                <div className="flex items-start text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-gray-600">Phone:</div>
                    <div className="font-medium">
                      {manuscript.contact_number}
                    </div>
                  </div>
                </div>
                <div className="flex items-start text-sm">
                  <Building className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-gray-600">Affiliation:</div>
                    <div className="font-medium">{manuscript.affiliation}</div>
                  </div>
                </div>
                <div className="flex items-start text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-gray-600">Address:</div>
                    <div className="font-medium">{manuscript.address}</div>
                  </div>
                </div>
                <div className="flex items-start text-sm">
                  <Globe className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-gray-600">Country:</div>
                    <div className="font-medium">{manuscript.country}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Authors */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Authors
              </h3>
              <div className="space-y-4">
                {manuscript.author.map((author, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-blue-500 pl-4 py-2"
                  >
                    <div className="font-medium text-gray-900">
                      {author.name}
                    </div>
                    <div className="text-sm text-gray-600">{author.email}</div>
                    <div className="text-sm text-gray-500">
                      {author.university} • {author.affiliation}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Order: {author.order}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editor Information */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Editor
              </h3>
              <div className="space-y-2">
                <div className="font-medium text-gray-900">{editor.name}</div>
                <div className="text-sm text-gray-600">
                  {editor.registration.email}
                </div>
                <div className="text-xs text-gray-400">
                  ID: {editor.user_id}
                </div>
              </div>
            </div>

            {/* Files */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Files
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-red-500 mr-3" />
                    <div>
                      <div className="text-sm font-medium">Manuscript</div>
                      <div className="text-xs text-gray-500">PDF Document</div>
                    </div>
                  </div>
                  <a
                    href={`${STORAGE_URL}${manuscriptData?.manuscript_data?.manuscript_file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center cursor-pointer"
                  >
                    <View className="h-4 w-4 mr-1" />
                    <span className="text-sm">View</span>
                  </a>
                </div>

                {manuscriptData?.manuscript_data?.copyright_form && (
                  <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div className="flex items-center">
                      <FileCheck className="h-5 w-5 text-green-500 mr-3" />
                      <div>
                        <div className="text-sm font-medium">
                          Copyright Form
                        </div>
                        <div className="text-xs text-gray-500">
                          PDF Document
                        </div>
                      </div>
                    </div>
                    <a
                      href={`${STORAGE_URL}${manuscriptData?.manuscript_data?.copyright_form}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center cursor-pointer"
                    >
                      <View className="h-4 w-4 mr-1" />
                      <span className="text-sm">View</span>
                    </a>
                  </div>
                )}
                {manuscriptData?.manuscript_data?.supplementary_files && (
                  <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div className="flex items-center">
                      <FileCheck className="h-5 w-5 text-green-500 mr-3" />
                      <div>
                        <div className="text-sm font-medium">
                          Supplementary Files
                        </div>
                       
                      </div>
                    </div>
                    <a
                      href={`${STORAGE_URL}${manuscriptData?.manuscript_data?.supplementary_files}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center cursor-pointer"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      <span className="text-sm">Download</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <div>
                    <div className="text-gray-600">Created:</div>
                    <div className="font-medium">
                      {formatDate(manuscript.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <div>
                    <div className="text-gray-600">Last Updated:</div>
                    <div className="font-medium">
                      {formatDate(manuscript.updated_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <Eye className="h-4 w-4 mr-2 text-gray-400" />
                  <div>
                    <div className="text-gray-600">Assigned:</div>
                    <div className="font-medium">
                      {formatDate(manuscriptData.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublisherViewManuscript;
