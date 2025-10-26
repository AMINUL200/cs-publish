import React, { useState } from 'react';
import { Download, Share2, Maximize, MessageCircle } from 'lucide-react';

const ArticleFrontView = () => {
  const [view, setView] = useState('full');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">ACS</span>
            </div>
            <span className="font-semibold text-gray-900">ACS Omega</span>
          </div>
          <div className="flex gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Download size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Share2 size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Article Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Manuscript Display Area */}
          <div className="grid grid-cols-3 gap-8 p-12 bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Left Column - Thumbnail */}
            <div className="col-span-1">
              <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition">
                <div className="aspect-[8.5/11] bg-gradient-to-b from-gray-100 to-gray-200 rounded flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-white">
                    {/* Simulated manuscript cover */}
                    <div className="p-4 h-full flex flex-col text-center text-sm">
                      <div className="mb-8">
                        <p className="text-xs text-gray-400 mb-2">ACS Omega</p>
                        <h3 className="font-bold text-gray-800 text-sm leading-tight mb-4">
                          Novel Synthesis and Characterization of Advanced Materials
                        </h3>
                      </div>
                      <div className="flex-1 flex flex-col justify-center gap-2 text-xs text-gray-600">
                        <p>J. Smith</p>
                        <p>A. Johnson</p>
                        <p>M. Williams</p>
                      </div>
                      <div className="text-xs text-gray-400 mt-auto">
                        <p>2022</p>
                        <p>Vol. 7, No. 50</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Article Info */}
            <div className="col-span-2 space-y-6">
              {/* Title and Authors */}
              <div>
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">
                  Research Article
                </p>
                <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  Novel Synthesis and Characterization of Advanced Materials for High-Performance Applications
                </h1>
                <div className="space-y-2">
                  <p className="text-base text-gray-700">
                    <span className="font-semibold">James Smith</span>,* <span className="font-semibold">Alice Johnson</span>, and <span className="font-semibold">Michael Williams</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Department of Chemistry, University of Science and Technology, Cambridge, MA 02139, United States
                  </p>
                </div>
              </div>

              {/* Publication Info */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Journal</p>
                    <p className="text-sm text-gray-900">ACS Omega</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Publication Date</p>
                    <p className="text-sm text-gray-900">December 21, 2022</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Volume/Issue</p>
                    <p className="text-sm text-gray-900">7, No. 50</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">DOI</p>
                    <p className="text-sm text-blue-600 hover:underline cursor-pointer">10.1021/acsomega.2c05292</p>
                  </div>
                </div>
              </div>

              {/* Abstract Preview */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-2">Abstract</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  This work presents a comprehensive study on the synthesis and characterization of advanced materials exhibiting remarkable properties for technological applications. Through systematic investigation utilizing state-of-the-art analytical techniques including X-ray diffraction, transmission electron microscopy, and spectroscopic analysis, we demonstrate enhanced performance metrics across multiple parameters...
                </p>
              </div>

              {/* Keywords */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {['Materials Science', 'Synthesis', 'Characterization', 'Nanotechnology', 'Performance'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-white border-t border-gray-200 px-12 py-6 flex justify-between items-center">
            <div className="flex gap-6">
              <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition font-medium text-sm">
                <Download size={18} />
                Download PDF
              </button>
              <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition font-medium text-sm">
                <Share2 size={18} />
                Share
              </button>
              <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition font-medium text-sm">
                <MessageCircle size={18} />
                Comments
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
              <Maximize size={18} />
              Full View
            </button>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Article Metrics</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Views</span>
                <span className="font-semibold text-gray-900">2,845</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Citations</span>
                <span className="font-semibold text-gray-900">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Altmetric Score</span>
                <span className="font-semibold text-orange-600">18</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Related Articles</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-blue-600 hover:underline cursor-pointer">Advanced Synthesis Techniques in Nanotechnology</li>
              <li className="text-blue-600 hover:underline cursor-pointer">Characterization Methods for Novel Materials</li>
              <li className="text-blue-600 hover:underline cursor-pointer">Performance Analysis of Composite Systems</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArticleFrontView;