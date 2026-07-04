import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BookOpen, ArrowLeft, Calendar, User, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'

const JournalEditorialDetails = () => {
  const { slug } = useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Dummy data for editorial member details
  const [editorialMember, setEditorialMember] = useState({
    id: 1,
    name: 'Dr. Sarah Johnson',
    position: 'Editor-in-Chief',
    category: 'Editorial Board',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    short_description: 'Leading expert in biomedical sciences with over 20 years of experience in academic publishing.',
    long_description: `<p>Dr. Sarah Johnson is a distinguished professor and researcher with over two decades of experience in biomedical sciences. She completed her Ph.D. in Molecular Biology at Stanford University and has published over 150 peer-reviewed articles in top-tier journals.</p>
      
<p>Her research focuses on cancer biology, particularly the molecular mechanisms of tumor progression and metastasis. Dr. Johnson has received numerous awards for her contributions to the field, including the prestigious National Science Foundation Career Award and the American Cancer Society Research Scholar Award.</p>

<p>As Editor-in-Chief, Dr. Johnson oversees the editorial strategy, ensures the quality and integrity of published research, and guides the journal's vision for advancing scientific knowledge.</p>

<p>She is also actively involved in mentoring young scientists and promoting diversity in STEM fields. Dr. Johnson serves on several advisory boards for international research organizations and is a frequent keynote speaker at scientific conferences worldwide.</p>`,
    facebook_link: 'https://facebook.com',
    twitter_link: 'https://twitter.com',
    linkedin_link: 'https://linkedin.com',
    instagram_link: null,
    status: 1,
    type: 'editorial',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-06-20T14:45:00Z',
    email: 'sarah.johnson@journal.com'
  })

  // Dummy data for different editorial members based on slug
  const editorialMembersData = {
    'sarah-johnson': {
      id: 1,
      name: 'Dr. Sarah Johnson',
      position: 'Editor-in-Chief',
      category: 'Editorial Board',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      short_description: 'Leading expert in biomedical sciences with over 20 years of experience in academic publishing.',
      long_description: `<p>Dr. Sarah Johnson is a distinguished professor and researcher with over two decades of experience in biomedical sciences. She completed her Ph.D. in Molecular Biology at Stanford University and has published over 150 peer-reviewed articles in top-tier journals.</p>
        
<p>Her research focuses on cancer biology, particularly the molecular mechanisms of tumor progression and metastasis. Dr. Johnson has received numerous awards for her contributions to the field, including the prestigious National Science Foundation Career Award and the American Cancer Society Research Scholar Award.</p>

<p>As Editor-in-Chief, Dr. Johnson oversees the editorial strategy, ensures the quality and integrity of published research, and guides the journal's vision for advancing scientific knowledge.</p>

<p>She is also actively involved in mentoring young scientists and promoting diversity in STEM fields. Dr. Johnson serves on several advisory boards for international research organizations and is a frequent keynote speaker at scientific conferences worldwide.</p>`,
      facebook_link: 'https://facebook.com',
      twitter_link: 'https://twitter.com',
      linkedin_link: 'https://linkedin.com',
      instagram_link: null,
      status: 1,
      type: 'editorial',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-06-20T14:45:00Z',
      email: 'sarah.johnson@journal.com'
    },
    'michael-chen': {
      id: 2,
      name: 'Dr. Michael Chen',
      position: 'Managing Editor',
      category: 'Editorial Board',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      short_description: 'Specializes in scientific communication and research integrity with a focus on peer review excellence.',
      long_description: `<p>Dr. Michael Chen is a seasoned academic editor with expertise in scientific communication and research integrity. He holds a Ph.D. in Biochemistry from MIT and has served as a managing editor for multiple high-impact journals.</p>

<p>His work focuses on ensuring the highest standards of peer review, implementing efficient editorial workflows, and maintaining the journal's reputation for publishing groundbreaking research.</p>

<p>Dr. Chen is passionate about open access publishing and has been instrumental in developing the journal's policies to promote transparency and accessibility in scientific research.</p>`,
      facebook_link: null,
      twitter_link: 'https://twitter.com',
      linkedin_link: 'https://linkedin.com',
      instagram_link: null,
      status: 1,
      type: 'editorial',
      created_at: '2024-02-10T09:15:00Z',
      updated_at: '2024-06-18T11:30:00Z',
      email: 'michael.chen@journal.com'
    },
    'emily-williams': {
      id: 3,
      name: 'Prof. Emily Williams',
      position: 'Associate Editor',
      category: 'Editorial Board',
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
      short_description: 'Professor of Chemistry with expertise in materials science and nanotechnology research.',
      long_description: `<p>Professor Emily Williams is a renowned chemist and materials scientist. She earned her Ph.D. in Chemistry from the University of Cambridge and leads a research group focused on nanomaterials and their applications in energy storage and conversion.</p>

<p>With over 200 publications in top-tier journals, Prof. Williams is recognized globally for her contributions to the field of nanotechnology. She has received numerous awards including the Royal Society of Chemistry's Materials Chemistry Award.</p>

<p>As an Associate Editor, she handles manuscripts in materials science and nanotechnology, ensuring rigorous peer review and upholding the journal's high standards of quality.</p>`,
      facebook_link: 'https://facebook.com',
      twitter_link: null,
      linkedin_link: 'https://linkedin.com',
      instagram_link: 'https://instagram.com',
      status: 1,
      type: 'editorial',
      created_at: '2024-03-05T16:20:00Z',
      updated_at: '2024-06-22T09:00:00Z',
      email: 'emily.williams@journal.com'
    },
    'james-rodriguez': {
      id: 4,
      name: 'Dr. James Rodriguez',
      position: 'Section Editor - Physics',
      category: 'Section Editors',
      image: 'https://randomuser.me/api/portraits/men/4.jpg',
      short_description: 'Physicist specializing in quantum mechanics and condensed matter physics.',
      long_description: `<p>Dr. James Rodriguez is a theoretical physicist with expertise in quantum mechanics and condensed matter physics. He obtained his Ph.D. in Physics from the California Institute of Technology and has worked at leading research institutions worldwide.</p>

<p>His research explores quantum phenomena in solid-state systems, including superconductivity, quantum computing, and topological materials. Dr. Rodriguez has published extensively in prestigious physics journals and has been awarded multiple grants from the Department of Energy.</p>

<p>As Section Editor for Physics, he manages the review process for physics manuscripts and ensures the publication of high-quality research in this rapidly advancing field.</p>`,
      facebook_link: null,
      twitter_link: 'https://twitter.com',
      linkedin_link: null,
      instagram_link: null,
      status: 1,
      type: 'editorial',
      created_at: '2024-04-12T13:45:00Z',
      updated_at: '2024-06-19T15:20:00Z',
      email: 'james.rodriguez@journal.com'
    }
  }

  // Get member data based on slug
  useEffect(() => {
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const memberData = editorialMembersData[slug] || editorialMembersData['sarah-johnson']
      setEditorialMember(memberData)
      setLoading(false)
    }, 500)
  }, [slug])

  // Get type-specific styling
  const getTypeConfig = () => {
    return {
      icon: '📝',
      color: 'yellow',
      gradient: 'from-yellow-50 to-yellow-50',
      badgeColor: 'bg-yellow-100 text-yellow-800'
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading editorial member details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Editorial Member Not Found
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/editorial-board"
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Editorial Board
          </Link>
        </div>
      </div>
    )
  }

  if (!editorialMember) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            No Editorial Member Found
          </h1>
          <p className="text-gray-600">
            The requested editorial member could not be loaded.
          </p>
          <Link
            to="/editorial-board"
            className="mt-4 inline-block bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Back to Editorial Board
          </Link>
        </div>
      </div>
    )
  }

  const typeConfig = getTypeConfig()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-30">
      {/* Back Button */}
      <div className="container mx-auto px-4 mb-6">
        <Link
          to="/editorial-board"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Editorial Board</span>
        </Link>
      </div>

      {/* Hero Section */}
      <div className={`bg-gradient-to-br ${typeConfig.gradient} pt-8 pb-16`}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Image */}
              <div className="lg:w-2/5">
                <div className="relative group">
                  {editorialMember.image ? (
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                      <img
                        src={editorialMember.image}
                        alt={editorialMember.name}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-square bg-gray-100 rounded-2xl shadow-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-2">👤</div>
                        <p className="text-gray-400">No Image Available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="lg:w-3/5 text-center lg:text-left">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${typeConfig.badgeColor}`}
                  >
                    {editorialMember.category || 'Editorial'}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      editorialMember.status == 1
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {editorialMember.status == 1 ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-3">
                  {editorialMember.name}
                </h1>
                <p className="text-xl lg:text-2xl text-yellow-600 font-semibold mb-4">
                  {editorialMember.position}
                </p>

                {editorialMember.email && (
                  <p className="text-gray-600 mb-4 flex items-center justify-center lg:justify-start gap-2">
                    <span className="text-gray-400">📧</span>
                    <a 
                      href={`mailto:${editorialMember.email}`}
                      className="hover:text-yellow-600 transition-colors"
                    >
                      {editorialMember.email}
                    </a>
                  </p>
                )}

                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {editorialMember.short_description}
                </p>

                {/* Social Links */}
                {(editorialMember.facebook_link ||
                  editorialMember.twitter_link ||
                  editorialMember.linkedin_link ||
                  editorialMember.instagram_link) && (
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                    {editorialMember.facebook_link && (
                      <a
                        href={editorialMember.facebook_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                    )}
                    {editorialMember.twitter_link && (
                      <a
                        href={editorialMember.twitter_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-sky-500 text-white p-3 rounded-full hover:bg-sky-600 transition-colors shadow-lg"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </a>
                    )}
                    {editorialMember.linkedin_link && (
                      <a
                        href={editorialMember.linkedin_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-800 text-white p-3 rounded-full hover:bg-blue-900 transition-colors shadow-lg"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}
                    {editorialMember.instagram_link && (
                      <a
                        href={editorialMember.instagram_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-colors shadow-lg"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.22 14.815 3.73 13.664 3.73 12.367s.49-2.448 1.396-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.906.875 1.396 2.026 1.396 3.323s-.49 2.448-1.396 3.323c-.875.807-2.026 1.297-3.323 1.297z" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Long Description Section */}
      {editorialMember.long_description && (
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-amber-50 rounded-xl p-6 border-l-4 border-yellow-500">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-yellow-500 p-3 rounded-lg">
                    <BookOpen className="h-6 w-6 text-black" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Biography
                  </h3>
                  <div
                    className="text-gray-700 leading-relaxed whitespace-pre-line blog-rich-text"
                    dangerouslySetInnerHTML={{
                      __html: editorialMember.long_description
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Metadata Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Member Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <User className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="font-medium text-gray-900">
                    {editorialMember.position}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Tag className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium text-gray-900">
                    {editorialMember.category}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(editorialMember.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Editorial Board Button */}
      <div className="container mx-auto px-4 py-8 text-center">
        <Link
          to="/editorial-board"
          className="inline-flex items-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Editorial Board</span>
        </Link>
      </div>
    </div>
  )
}

export default JournalEditorialDetails