import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
    faList,
    faDownload
} from '@fortawesome/free-solid-svg-icons';
import {
    faFacebook,
    faTwitter,
    faLinkedin,
    faGithub
} from '@fortawesome/free-brands-svg-icons';
import Loader from '../../../components/common/Loader';
import { Link } from 'react-router-dom';
import MediaRenderer from '../../../components/common/MediaRenderer';
import axios from 'axios';

const MentorHubDetails = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [eventDetails, setEventDetails] = useState(null);
    const [popularMentors, setPopularMentors] = useState([]);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;
    const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

    // Fetch event details and popular mentors
    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}api/events/detail/${id}`);
                
                if (response.data.status) {
                    // console.log("Fetched event details:", response.data);
                    setEventDetails(response.data.event_details);
                    setPopularMentors(response.data.most_view || []);
                } else {
                    throw new Error('Failed to fetch event details');
                }
            } catch (error) {
                console.error('Error fetching event details:', error);
                setError(error.response?.data?.message || 'Failed to load event details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEventDetails();
            window.scrollTo(0, 0);
        }
    }, [id]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const createMarkup = (htmlContent) => {
        return { __html: htmlContent };
    };

    // Function to determine media type based on URL
    const getMediaType = (url) => {
        if (!url) return 'image'; // Default to image if no URL
        
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return 'youtube';
        } else if (url.includes('.mp4') || url.includes('.webm') || url.includes('.ogg')) {
            return 'video';
        } else {
            return 'image';
        }
    };

    // Transform popular mentors data
    const transformedPopularMentors = popularMentors.map(mentor => ({
        id: mentor.id,
        id: mentor.id,
        title: mentor.title,
        slug: mentor.slug,
        media: {
            type: getMediaType(mentor.image_video),
            url: `${STORAGE_URL}${mentor.image_video}`
        },
        category: mentor.catagory,
        views: mentor.view_count,
        created_at: mentor.created_at
    }));

    if (loading) return <Loader />;

    if (error) {
        return (
            <>
                <Breadcrumb
                    items={[
                        { label: 'Home', path: '/', icon: 'home' },
                        { label: 'Mentors Hub', path: '/mentors', icon: 'folder' },
                        { label: 'Event Details' }
                    ]}
                    pageTitle="Event Details"
                />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-600 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Event</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </>
        );
    }

    if (!eventDetails) {
        return (
            <>
                <Breadcrumb
                    items={[
                        { label: 'Home', path: '/', icon: 'home' },
                        { label: 'Mentors Hub', path: '/mentors', icon: 'folder' },
                        { label: 'Event Not Found' }
                    ]}
                    pageTitle="Event Not Found"
                />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-gray-400 text-6xl mb-4">📄</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
                        <p className="text-gray-600">The requested event could not be found.</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Breadcrumb
                items={[
                    { label: 'Home', path: '/', icon: 'home' },
                    { label: 'Mentors Hub', path: '/mentors', icon: 'folder' },
                    { label: eventDetails.title }
                ]}
                pageTitle={eventDetails.title}
            />

            <div className="container mx-auto px-4 py-8 md:px-10">
                <div className="flex flex-col lg:flex-row gap-8 mt-6">

                    {/* Main Content */}
                    <div className="w-full lg:w-8/12">
                        <article className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-6">
                                <h1 className="text-3xl text-center font-bold text-gray-800 mb-4">
                                    {eventDetails.title}
                                </h1>

                                <div className="flex flex-wrap items-center justify-around text-gray-600 mb-6 gap-4">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                                        <span>{formatDate(eventDetails.created_at)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faList} className="mr-2" />
                                        <span>{eventDetails.catagory}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faEye} className="mr-2" />
                                        <span>{eventDetails.view_count} Views</span>
                                    </div>
                                    {eventDetails.is_upcomming === "1" && (
                                        <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                            Upcoming Event
                                        </div>
                                    )}
                                </div>

                                {eventDetails.description && (
                                    <p className="text-lg text-gray-700 mb-6 text-center">
                                        {eventDetails.description}
                                    </p>
                                )}
                            </div>

                            {/* Featured Media */}
                            {eventDetails.image_video && (
                                <div className="w-full p-4">
                                    <MediaRenderer 
                                        media={{
                                            type: getMediaType(eventDetails.image_video),
                                            url: `${STORAGE_URL}${eventDetails.image_video}`
                                        }} 
                                    />
                                </div>
                            )}

                            {/* Event Description */}
                            {eventDetails.event_desc && (
                                <div className="p-6 border-t border-gray-200">
                                    <h2 className="text-2xl font-bold mb-4">Event Description</h2>
                                    <p className="text-gray-700 leading-relaxed">
                                        {eventDetails.event_desc}
                                    </p>
                                </div>
                            )}

                            {/* Long Description */}
                            {eventDetails.long_description && (
                                <div className="p-6 border-t border-gray-200">
                                    <h2 className="text-2xl font-bold mb-4">Detailed Information</h2>
                                    <div
                                        className="prose max-w-none text-gray-700 leading-relaxed"
                                        dangerouslySetInnerHTML={createMarkup(eventDetails.long_description)}
                                    />
                                </div>
                            )}

                            {/* File Downloads */}
                            {(eventDetails.pdf || eventDetails.ppt) && (
                                <div className="p-6 border-t border-gray-200">
                                    <h2 className="text-2xl font-bold mb-4">Resources</h2>
                                    <div className="flex flex-wrap gap-4">
                                        {eventDetails.pdf && (
                                            <a
                                                href={`${STORAGE_URL}${eventDetails.pdf}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                            >
                                                <FontAwesomeIcon icon={faDownload} />
                                                <span>Download PDF</span>
                                            </a>
                                        )}
                                        {eventDetails.ppt && (
                                            <a
                                                href={`${STORAGE_URL}${eventDetails.ppt}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                                            >
                                                <FontAwesomeIcon icon={faDownload} />
                                                <span>Download PPT</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Event Information */}
                            <div className="p-6 border-t border-gray-200 bg-gray-50">
                                <h2 className="text-2xl font-bold mb-4">Event Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-2">Event Name</h3>
                                        <p className="text-gray-600">{eventDetails.event_name}</p>
                                    </div>
                                    {eventDetails.event_email && (
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-2">Contact Email</h3>
                                            <a 
                                                href={`mailto:${eventDetails.event_email}`}
                                                className="text-yellow-600 hover:text-yellow-700 flex items-center gap-2"
                                            >
                                                <FontAwesomeIcon icon={faEnvelope} />
                                                {eventDetails.event_email}
                                            </a>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-2">Category</h3>
                                        <p className="text-gray-600">{eventDetails.catagory}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-2">Status</h3>
                                        <p className="text-gray-600">
                                            {eventDetails.is_upcomming === "1" ? "Upcoming" : "Past Event"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Share Links */}
                            {eventDetails.share_links && (
                                <div className="p-6 border-t border-gray-200">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                                        <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
                                        Share this Event
                                    </h3>
                                    <div className="flex space-x-4">
                                        {typeof eventDetails.share_links === 'object' ? (
                                            // Handle object format
                                            Object.entries(eventDetails.share_links).map(([platform, url]) => (
                                                <a 
                                                    key={platform}
                                                    href={url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-gray-600 hover:text-yellow-600 transition-colors"
                                                    title={platform}
                                                >
                                                    {platform === 'facebook' || platform === 'fb' ? (
                                                        <FontAwesomeIcon icon={faFacebook} size="lg" />
                                                    ) : platform === 'twitter' ? (
                                                        <FontAwesomeIcon icon={faTwitter} size="lg" />
                                                    ) : platform === 'linkedin' ? (
                                                        <FontAwesomeIcon icon={faLinkedin} size="lg" />
                                                    ) : (
                                                        <FontAwesomeIcon icon={faShareAlt} size="lg" />
                                                    )}
                                                </a>
                                            ))
                                        ) : Array.isArray(eventDetails.share_links) ? (
                                            // Handle array format
                                            eventDetails.share_links.map((url, index) => (
                                                <a 
                                                    key={index}
                                                    href={url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-gray-600 hover:text-yellow-600 transition-colors"
                                                >
                                                    <FontAwesomeIcon icon={faShareAlt} size="lg" />
                                                </a>
                                            ))
                                        ) : null}
                                        
                                        {/* Default social share buttons */}
                                        <a 
                                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-blue-600 hover:text-blue-800 transition"
                                        >
                                            <FontAwesomeIcon icon={faFacebook} size="lg" />
                                        </a>
                                        <a 
                                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(eventDetails.title)}&url=${encodeURIComponent(window.location.href)}`} 
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
                            )}
                        </article>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-4/12">
                        {/* Popular Mentors */}
                        {transformedPopularMentors.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                                <h2 className="text-xl font-bold mb-6 border-b pb-2">Popular Events</h2>
                                <div className="space-y-6">
                                    {transformedPopularMentors.map((item) => (
                                        <div key={item.id} className="flex items-start hover:bg-gray-50 p-2 rounded-md transition-colors">
                                            <div className="flex-shrink-0 mr-4 w-28">
                                                <MediaRenderer media={item.media} className="h-20 rounded" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800 hover:text-yellow-600 transition-colors text-sm leading-tight">
                                                    <Link to={`/mentors/${item.slug}`}>{item.title}</Link>
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                    <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
                                                    <span>{item.views} views</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Event Social Links */}
                        {eventDetails.event_social_links && (
                            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                                <h2 className="text-xl font-bold mb-4">Event Social Links</h2>
                                <div className="flex flex-wrap gap-3">
                                    {typeof eventDetails.event_social_links === 'object' ? (
                                        Object.entries(eventDetails.event_social_links).map(([platform, url]) => (
                                            <a 
                                                key={platform}
                                                href={url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-yellow-100 text-gray-700 rounded-lg transition-colors"
                                            >
                                                {platform === 'facebook' || platform === 'fb' ? (
                                                    <FontAwesomeIcon icon={faFacebook} />
                                                ) : platform === 'twitter' ? (
                                                    <FontAwesomeIcon icon={faTwitter} />
                                                ) : platform === 'linkedin' ? (
                                                    <FontAwesomeIcon icon={faLinkedin} />
                                                ) : platform === 'instagram' ? (
                                                    <FontAwesomeIcon icon={faGithub} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faShareAlt} />
                                                )}
                                                <span className="text-sm capitalize">{platform}</span>
                                            </a>
                                        ))
                                    ) : Array.isArray(eventDetails.event_social_links) ? (
                                        eventDetails.event_social_links.map((url, index) => (
                                            <a 
                                                key={index}
                                                href={url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-yellow-100 text-gray-700 rounded-lg transition-colors"
                                            >
                                                <FontAwesomeIcon icon={faShareAlt} />
                                                <span className="text-sm">Link {index + 1}</span>
                                            </a>
                                        ))
                                    ) : null}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MentorHubDetails;