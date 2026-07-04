import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Search, Users, X, ArrowLeft } from 'lucide-react'

const JournalEditorial = () => {
  const {id} = useParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [loading, setLoading] = useState(false)
  const [filteredMembers, setFilteredMembers] = useState([])

  // Dummy data for editorial board members
  const [editorialMembers] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      position: 'Editor-in-Chief',
      category: 'editorial',
      categoryName: 'Editorial Board',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      short_description: 'Leading expert in biomedical sciences with over 20 years of experience in academic publishing.',
      facebook_link: 'https://facebook.com',
      twitter_link: 'https://twitter.com',
      linkedin_link: 'https://linkedin.com',
      instagram_link: null,
      slug: 'sarah-johnson'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      position: 'Managing Editor',
      category: 'editorial',
      categoryName: 'Editorial Board',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      short_description: 'Specializes in scientific communication and research integrity with a focus on peer review excellence.',
      facebook_link: null,
      twitter_link: 'https://twitter.com',
      linkedin_link: 'https://linkedin.com',
      instagram_link: null,
      slug: 'michael-chen'
    },
    {
      id: 3,
      name: 'Prof. Emily Williams',
      position: 'Associate Editor',
      category: 'editorial',
      categoryName: 'Editorial Board',
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
      short_description: 'Professor of Chemistry with expertise in materials science and nanotechnology research.',
      facebook_link: 'https://facebook.com',
      twitter_link: null,
      linkedin_link: 'https://linkedin.com',
      instagram_link: 'https://instagram.com',
      slug: 'emily-williams'
    },
    {
      id: 4,
      name: 'Dr. James Rodriguez',
      position: 'Section Editor - Physics',
      category: 'section',
      categoryName: 'Section Editors',
      image: 'https://randomuser.me/api/portraits/men/4.jpg',
      short_description: 'Physicist specializing in quantum mechanics and condensed matter physics.',
      facebook_link: null,
      twitter_link: 'https://twitter.com',
      linkedin_link: null,
      instagram_link: null,
      slug: 'james-rodriguez'
    },
    {
      id: 5,
      name: 'Dr. Amara Singh',
      position: 'Section Editor - Biology',
      category: 'section',
      categoryName: 'Section Editors',
      image: 'https://randomuser.me/api/portraits/women/5.jpg',
      short_description: 'Molecular biologist with research interests in genetics and cellular biology.',
      facebook_link: 'https://facebook.com',
      twitter_link: 'https://twitter.com',
      linkedin_link: 'https://linkedin.com',
      instagram_link: 'https://instagram.com',
      slug: 'amara-singh'
    },
    {
      id: 6,
      name: 'Prof. David Kim',
      position: 'Statistical Editor',
      category: 'statistical',
      categoryName: 'Statistical Editors',
      image: 'https://randomuser.me/api/portraits/men/6.jpg',
      short_description: 'Biostatistician specializing in research methodology and data analysis for clinical trials.',
      facebook_link: null,
      twitter_link: null,
      linkedin_link: 'https://linkedin.com',
      instagram_link: null,
      slug: 'david-kim'
    },
    {
      id: 7,
      name: 'Dr. Maria Garcia',
      position: 'Language Editor',
      category: 'language',
      categoryName: 'Language Editors',
      image: 'https://randomuser.me/api/portraits/women/7.jpg',
      short_description: 'Expert in scientific writing and editing with a focus on clarity and precision in academic texts.',
      facebook_link: 'https://facebook.com',
      twitter_link: 'https://twitter.com',
      linkedin_link: 'https://linkedin.com',
      instagram_link: 'https://instagram.com',
      slug: 'maria-garcia'
    },
    {
      id: 8,
      name: 'Dr. Robert Taylor',
      position: 'Ethics Editor',
      category: 'ethics',
      categoryName: 'Ethics Editors',
      image: 'https://randomuser.me/api/portraits/men/8.jpg',
      short_description: 'Philosophy professor specializing in research ethics and publication integrity.',
      facebook_link: null,
      twitter_link: 'https://twitter.com',
      linkedin_link: null,
      instagram_link: null,
      slug: 'robert-taylor'
    },
    {
      id: 9,
      name: 'Dr. Lisa Park',
      position: 'Technical Editor',
      category: 'technical',
      categoryName: 'Technical Editors',
      image: 'https://randomuser.me/api/portraits/women/9.jpg',
      short_description: 'Computer scientist with expertise in scientific computing and software development for research.',
      facebook_link: 'https://facebook.com',
      twitter_link: null,
      linkedin_link: 'https://linkedin.com',
      instagram_link: 'https://instagram.com',
      slug: 'lisa-park'
    }
  ])

  // Define categories with order
  const categories = [
    { id: 'editorial', name: 'Editorial Board', order: 1 },
    { id: 'section', name: 'Section Editors', order: 2 },
    { id: 'statistical', name: 'Statistical Editors', order: 3 },
    { id: 'language', name: 'Language Editors', order: 4 },
    { id: 'ethics', name: 'Ethics Editors', order: 5 },
    { id: 'technical', name: 'Technical Editors', order: 6 }
  ]

  // Filter members based on search and category
  useEffect(() => {
    let filtered = [...editorialMembers]

    // Filter by category
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(
        (member) => member.category === selectedCategory
      )
    }

    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter((member) => {
        return (
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.short_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }

    setFilteredMembers(filtered)
  }, [searchTerm, selectedCategory, editorialMembers])

  // Get category count
  const getCategoryCount = (categoryId) => {
    return editorialMembers.filter(member => member.category === categoryId).length
  }

  // Get total members count
  const getTotalMembersCount = () => {
    return editorialMembers.length
  }

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : 'Unknown'
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
  }

  // Loading state (keep for consistency)
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16 pt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Editorial <span className="text-yellow-400">Board</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Loading our editorial team...
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="bg-gray-300 h-80 w-full"></div>
                <div className="p-6 text-center">
                  <div className="bg-gray-300 h-6 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded w-1/2 mx-auto mb-3"></div>
                  <div className="bg-gray-300 h-3 rounded w-full mx-auto mb-2"></div>
                  <div className="bg-gray-300 h-3 rounded w-5/6 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16 pt-40">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Editorial <span className="text-yellow-400">Board</span>
          </h1>
          <h5 className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Meet our distinguished editorial team committed to maintaining the highest standards of academic excellence
          </h5>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, position, category, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-lg"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filters - Ordered by is_order */}
        {categories.length > 0 && (
          <div className="max-w-5xl mx-auto mb-10">
            <div className="flex flex-wrap justify-center gap-3">
              {/* ALL Button */}
              <button
                onClick={() => handleCategoryChange('ALL')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === 'ALL'
                    ? 'bg-yellow-500 text-white shadow-lg ring-2 ring-yellow-300'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                ALL
                <span className="ml-2 text-sm">({getTotalMembersCount()})</span>
              </button>

              {/* Dynamic Category Buttons - Sorted by order */}
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'bg-yellow-500 text-white shadow-lg ring-2 ring-yellow-300'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                  }`}
                >
                  {category.name}
                  <span className="ml-2 text-sm">({getCategoryCount(category.id)})</span>
                </button>
              ))}
            </div>
            
            {/* Order indicator */}
            <div className="text-center mt-3">
              <p className="text-xs text-gray-500">
                Categories ordered by priority
              </p>
            </div>
          </div>
        )}

        {/* Search and Filter Stats */}
        {(searchTerm || selectedCategory !== 'ALL') && (
          <div className="max-w-5xl mx-auto mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="text-gray-600">
                Found{' '}
                <span className="font-semibold text-yellow-600">
                  {filteredMembers.length}
                </span>{' '}
                team member{filteredMembers.length !== 1 ? 's' : ''}
                {selectedCategory !== 'ALL' && (
                  <span className="ml-1">
                    in <span className="font-semibold">{getCategoryName(selectedCategory)}</span>{' '}
                    category
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                {selectedCategory !== 'ALL' && (
                  <button
                    onClick={() => handleCategoryChange('ALL')}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Clear Filter
                  </button>
                )}
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Team Members Grid */}
        {filteredMembers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 max-w-2xl mx-auto text-center">
            <Users className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No editorial members found
            </h3>
            <p className="text-gray-500 text-lg mb-6">
              {searchTerm || selectedCategory !== 'ALL'
                ? `No results match your ${
                    searchTerm ? `search "${searchTerm}"` : ''
                  } ${searchTerm && selectedCategory !== 'ALL' ? 'and ' : ''}
                  ${selectedCategory !== 'ALL' ? `${getCategoryName(selectedCategory)} category` : ''}. 
                  Try adjusting your filters.`
                : 'Editorial board members will appear here once added.'}
            </p>
            {(searchTerm || selectedCategory !== 'ALL') && (
              <div className="flex gap-3 justify-center">
                {selectedCategory !== 'ALL' && (
                  <button
                    onClick={() => handleCategoryChange('ALL')}
                    className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-semibold"
                  >
                    Clear Category Filter
                  </button>
                )}
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-8 text-right text-gray-600 max-w-5xl mx-auto">
              Showing{' '}
              <span className="font-semibold text-yellow-600">
                {filteredMembers.length}
              </span>{' '}
              of <span className="font-semibold">{editorialMembers.length}</span>{' '}
              editorial members
            </div>

            {/* Grid */}
            <div
              className="grid gap-8 mx-6 justify-center"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 320px))',
              }}
            >
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group w-full max-w-sm"
                >
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                      {member.categoryName}
                    </span>
                  </div>

                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=${encodeURIComponent(
                          member.name.charAt(0)
                        )}`
                      }}
                    />
                    {/* Overlay with social links */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-4">
                        {member.facebook_link && (
                          <a
                            href={member.facebook_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
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
                        {member.twitter_link && (
                          <a
                            href={member.twitter_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-sky-500 text-white p-3 rounded-full hover:bg-sky-600 transition-colors"
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
                        {member.linkedin_link && (
                          <a
                            href={member.linkedin_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-800 text-white p-3 rounded-full hover:bg-blue-900 transition-colors"
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
                        {member.instagram_link && (
                          <a
                            href={member.instagram_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-colors"
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
                        {!member.facebook_link &&
                          !member.twitter_link &&
                          !member.linkedin_link &&
                          !member.instagram_link && (
                            <span className="text-white text-sm bg-gray-600 px-3 py-2 rounded-full">
                              No Social Links
                            </span>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 text-center">
                    <Link
                      to={`/editorial-board/${id}/${member.slug}`}
                      className="text-xl font-bold text-gray-800 mb-2 hover:text-yellow-600 transition-colors block"
                    >
                      {member.name}
                    </Link>
                    <p className="text-yellow-600 font-semibold mb-3">
                      {member.position}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {member.short_description}
                    </p>

                    {/* Read More Link */}
                    <Link
                      to={`/editorial-board/${id}/${member.slug}`}
                      className="inline-block mt-4 text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Back to Home Link */}
        <div className="mt-16 text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-yellow-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default JournalEditorial