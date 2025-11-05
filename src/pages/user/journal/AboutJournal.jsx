import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  BookOpen,
  Users,
  FileText,
  Award,
  Globe,
  Calendar,
  CheckCircle,
  Eye,
  Download,
  Share2,
} from "lucide-react";
import Loader from "../../../components/common/Loader";
import { ArrowLeft } from "lucide-react";
import { ArrowRight } from "lucide-react";
// import Loader from "../../components/common/Loader";

const AboutJournal = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}api/about_the_journal/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch journal information"
      );
      console.error("Error fetching journal details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button
            onClick={fetchData}
            className="bg-brown-red text-white px-6 py-2 rounded-lg hover:bg-brown-red-dark transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="text-center text-gray-600">
          Journal information not available
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-25 ">
      {/* Half Header Section with Background Image */}
      <section
        className="relative h-96 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(139, 69, 19, 0.7)), url(${data.image})`,
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="absolute inset-0 bg-black/40 bg-opacity-40 backdrop-blur-sm"></div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-full flex flex-col justify-center text-white">
            {/* Journal Title and Basic Info */}
            <div className="mb-6">
              <span className="inline-block bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold mb-4">
                {data.j_categories}
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {data.j_title}
              </h1>
              <p className="text-yellow-200 text-lg max-w-2xl">
                {data.j_description}
              </p>
            </div>

            {/* Journal Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {/* Editor */}
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-500 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-black" />
                </div>
                <div>
                  <p className="text-yellow-300 text-sm">Editor</p>
                  <p className="font-semibold">{data.editor}</p>
                </div>
              </div>

              {/* ISSN Numbers */}
              <div className="flex items-center space-x-3">
                <div className="bg-brown-red p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-yellow-300 text-sm">ISSN</p>
                  <p className="font-semibold">
                    Print: {data.issn_print_no} | Online: {data.issn_online_no}
                  </p>
                </div>
              </div>

              {/* UGC Approval */}
              {data.ugc_approved && (
                <div className="flex items-center space-x-3">
                  <div className="bg-green-600 p-2 rounded-lg">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-yellow-300 text-sm">UGC Approved</p>
                    <p className="font-semibold">{data.ugc_no}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to='/signin' className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors flex items-center">
                Submit Manuscript
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-brown-red to-black"></div>
      </section>

      {/* About Journal Content Section */}
      <section className="py-10 bg-white">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1  gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-black to-yellow-300 text-white p-6">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-8 w-8 text-yellow-300" />
                    <div>
                      <h2 className="text-2xl font-bold">About the Journal</h2>
                      {/* <p className="text-yellow-200 text-sm">
                        Comprehensive overview and scope of {data.j_title}
                      </p> */}
                    </div>
                  </div>
                </div>

                {/* About Content */}
                <div className="p-8">
                  <div
                    className="blog-rich-text max-w-none"
                   
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data.about_the_journal,
                      }}
                      className="text-gray-700 leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutJournal;
