import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loader from '../../components/common/Loader';

const PublisherViewDesignManuscript = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true);
  const [manuscriptData, setManuscriptData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}api/t-manuscript`);

      if(response.data.status === 200){
        setManuscriptData(response.data.data);
      }else{
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchData();
  },[])

  if(loading){
    return <Loader/>
  }

  if(!manuscriptData){
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Manuscript Found</h2>
          <p className="text-gray-500">Unable to load manuscript data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 view-manuscript">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Manuscript Preview
              </h1>
              <p className="text-gray-600">
                ID: {manuscriptData.id} | Created: {new Date(manuscriptData.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-blue-50 px-3 py-1 rounded-full">
              <span className="text-blue-700 text-sm font-medium">Draft</span>
            </div>
          </div>
        </div>

        {/* Manuscript Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Content Container */}
          <div className="p-8">
            <div 
              className="prose prose-lg max-w-none manuscript-content"
              dangerouslySetInnerHTML={{ __html: manuscriptData.name }}
            />
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Last updated: {new Date(manuscriptData.updated_at).toLocaleString()}</span>
              <span>Manuscript Viewer</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Download PDF
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Approve Manuscript
          </button>
        </div>
      </div>

      {/* Custom styles for manuscript content */}
      <style jsx>{`
        .manuscript-content {
          font-family: 'Times New Roman', serif;
          line-height: 1.8;
        }
        
        .manuscript-content h1,
        .manuscript-content h2,
        .manuscript-content h3 {
          color: #1f2937;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .manuscript-content p {
          margin-bottom: 1rem;
          text-align: justify;
        }
        
        .manuscript-content ol,
        .manuscript-content ul {
          margin-bottom: 1rem;
          padding-left: 2rem;
        }
        
        .manuscript-content li {
          margin-bottom: 0.5rem;
        }
        
        .manuscript-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          margin: 1rem ;
        }
        
        .manuscript-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .manuscript-content a:hover {
          color: #1d4ed8;
        }
        
        .manuscript-content sup {
          font-size: 0.75em;
          vertical-align: super;
        }
        
        .manuscript-content .MsoNormal {
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  )
}

export default PublisherViewDesignManuscript