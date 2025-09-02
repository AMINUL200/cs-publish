import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../../components/common/Breadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faUser,
  faQuoteLeft,
  faShareAlt,
  faEnvelope,
  faMessage,
  faEye,
  faList
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faTwitter,
  faLinkedin,
  faGithub
} from '@fortawesome/free-brands-svg-icons';
import Loader from '../../../components/common/Loader';
import InnovationTestimonial from '../../../components/common/InnovationTestimonial';
import MediaRenderer from '../../../components/common/MediaRenderer';
import { Link } from 'react-router-dom';

const InnoVationDetailsPage = () => {
  const [loading, setLoading] = useState(true)
  const dummyInnovationData = {
    id: 1,
    title: "The Future of Remote Work in 2023",
    date: "2023-10-15",
    views: "1.25K",
    comments: "500",
    paragraph1: "Remote work has transformed how companies operate and how employees approach their careers. As we move further into 2023, new trends and technologies are shaping this landscape.",
    media: {
      type: "youtube", // "image" | "youtube" | "video"
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    content: `
      <h2>The Evolution of Remote Work</h2>
      <p>The pandemic accelerated remote work adoption by years, if not decades. Companies that once resisted remote work have now embraced it, discovering benefits they hadn't anticipated.</p>
      
      <h2>Key Trends in 2023</h2>
      <p>Several trends are defining remote work in 2023:</p>
      <ul>
        <li>Hybrid models becoming the standard</li>
        <li>Focus on results rather than hours worked</li>
        <li>Increased investment in collaboration tools</li>
        <li>Greater emphasis on work-life balance</li>
      </ul>
      
      <blockquote>
        "The future of work is not a place, but an experience that can happen anywhere."
      </blockquote>
      
      <h2>Challenges and Solutions</h2>
      <p>While remote work offers many benefits, it also presents challenges such as maintaining company culture, ensuring effective communication, and preventing employee burnout.</p>
    `,
    innovator_info: {
      name: "Jane Doe",
      avatar: "https://i.pravatar.cc/100?img=5",
      bio: "Tech writer and remote work enthusiast.",
      social: {
        facebook: "https://facebook.com",
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
        github: "https://github.com"
      }
    },

    popular_Innovation: [
      {
        id: 2,
        title: "How AI is Transforming Business Operations",
        media: {
          type: "image",
          url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
        }
      },
      {
        id: 3,
        title: "The Rise of Sustainable Business Practices",
        media: {
          type: "youtube",
          url: "https://www.youtube.com/embed/tgbNymZ7vqY"
        }
      },
      {
        id: 4,
        title: "Building Resilience in Times of Change",
        media: {
          type: "video",
          url: "https://www.w3schools.com/html/mov_bbb.mp4"
        }
      }
    ]
  };

  // Team Members Data
  const innovatorVoices = [
    {
      id: 1,
      name: "Sarah Mitchell",
      role: "Editor-in-Chief",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
      bio: "Award-winning journalist with 15+ years in digital publishing",
      social: "@sarahmitchell"
    },
    {
      id: 2,
      name: "Marcus Johnson",
      role: "Senior Writer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
      bio: "Bestselling author and writing coach specializing in fiction",
      social: "@marcusjwrites"
    },
    {
      id: 3,
      name: "Lisa Chen",
      role: "Content Strategist",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
      bio: "Digital marketing expert helping authors build their online presence",
      social: "@lisachen_media"
    },
    {
      id: 4,
      name: "James Rivera",
      role: "Community Manager",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
      bio: "Passionate about connecting writers and fostering creative communities",
      social: "@jamesrivera"
    }
  ];

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to handle HTML content
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // Simulate API call with setTimeout
    const timer = setTimeout(() => {

      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <Breadcrumb items={[
        { label: 'Home', path: '/', icon: 'home' },
        { label: 'Innovation', path: '/innovation', icon: 'folder' },
        { label: 'Innovation Details' }
      ]}
        pageTitle="Innovation Details"
        // pageDescription="Discover your next great read from our curated collection"
      />
      <div className="container  mx-auto px-4 py-8 md:px-10">

        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          {/* Main Content */}
          <div className="w-full lg:w-8/12">
            <article className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Title and Metadata */}
              <div className="p-6">
                <h1 className="text-3xl text-center font-bold text-gray-800 mb-4">
                  {dummyInnovationData.title}
                </h1>

                <div className="flex flex-wrap items-center justify-around text-gray-600 mb-6 gap-4">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                    <span>{formatDate(dummyInnovationData.date)}</span>
                  </div>

                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faList} className="mr-2" />
                    <span>List</span>
                  </div>

                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faMessage} className="mr-2" />
                    <span>Comments ({dummyInnovationData.comments})</span>
                  </div>

                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                    <span>{dummyInnovationData.views} Views</span>
                  </div>
                </div>


                <p className="text-lg text-gray-700 mb-6">
                  {dummyInnovationData.paragraph1}
                </p>
              </div>

              {/* Featured Media */}
              <div className="w-full p-4">
                <MediaRenderer media={dummyInnovationData.media} />
              </div>

              {/* Content */}
              <div className="p-6">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={createMarkup(dummyInnovationData.content)}
                />

                {/* Share Buttons */}
                <div className="flex flex-wrap justify-between items-center mt-8 pt-6 border-t border-gray-200 gap-6">
                  {/* Share Section */}
                  <div className="w-full md:w-auto">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
                      Share this innovation
                    </h3>
                    <div className="flex space-x-4">
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <FontAwesomeIcon icon={faFacebook} size="lg" />
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(dummyInnovationData.title)}&url=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-600 transition"
                      >
                        <FontAwesomeIcon icon={faTwitter} size="lg" />
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-900 transition"
                      >
                        <FontAwesomeIcon icon={faLinkedin} size="lg" />
                      </a>
                    </div>
                  </div>

                  {/* Buttons Section */}
                  <div className="flex flex-wrap gap-4">
                    <button className="px-5 py-2 rounded-lg bg-red-500 text-white font-medium shadow-md hover:bg-red-600 transition cursor-pointer">
                      PDF Convert
                    </button>
                    <button className="px-5 py-2 rounded-lg bg-indigo-500 text-white font-medium shadow-md hover:bg-indigo-600 transition cursor-pointer">
                      PPT Convert
                    </button>
                  </div>
                </div>

              </div>
            </article>

            {/* Innovator Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h2 className="text-2xl font-bold mb-6">About the Innovator</h2>

              <div className="flex flex-col sm:flex-row items-start">
                <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                  <img
                    src={dummyInnovationData.innovator_info.avatar}
                    alt={dummyInnovationData.innovator_info.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>

                <div className="flex-grow">
                  <h3 className="text-xl font-semibold">
                    {dummyInnovationData.innovator_info.name}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {dummyInnovationData.innovator_info.bio}
                  </p>

                  <div className="flex mt-4 space-x-4">
                    <a
                      href={dummyInnovationData.innovator_info.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600"
                    >
                      <FontAwesomeIcon icon={faFacebook} size="lg" />
                    </a>
                    <a
                      href={dummyInnovationData.innovator_info.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-400"
                    >
                      <FontAwesomeIcon icon={faTwitter} size="lg" />
                    </a>
                    <a
                      href={dummyInnovationData.innovator_info.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={faLinkedin} size="lg" />
                    </a>
                    <a
                      href={dummyInnovationData.innovator_info.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <FontAwesomeIcon icon={faGithub} size="lg" />
                    </a>
                  </div>

                  <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    Contact Innovator
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-4/12">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 border-b pb-2">Popular Innovations</h2>

              <div className="space-y-6">
                {dummyInnovationData.popular_Innovation.map((item) => (
                  <div key={item.id} className="flex items-start hover:bg-gray-50 p-2 rounded-md transition-colors">
                    <div className="flex-shrink-0 mr-4 w-28">
                      <MediaRenderer media={item.media} className="h-20" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                        <Link to={`/innovation/${item.id}`}>{item.title}</Link>
                      </h3>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Innovators' Voices Section */}
      <section className="py-20 bg-white innovation-section ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Voice Of   <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Innovator</span>
            </h2>
            <h5 className="text-lg text-gray-600 max-w-2xl mx-auto text-center">
              The visionaries and pioneers driving technological advancement
            </h5>
          </div>

          <InnovationTestimonial innovatorVoices={innovatorVoices} />


        </div>
      </section>



    </>
  );
}

export default InnoVationDetailsPage;