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
import { Link } from 'react-router-dom';
import MediaRenderer from '../../../components/common/MediaRenderer';

const MentorHubDetails = () => {
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({ name: "", email: "", message: "" });

    // Dummy Mentor Data
    const dummyMentorData = {
        id: 1,
        name: "John Smith",
        title: "Mastering Leadership in the Digital Age",
        date: "2025-08-25",
        views: "2.1K",
        commentsCount: "120", // Changed from 'comments' to 'commentsCount'
        excerpt: "Explore how modern leaders adapt to technological and organizational change in today's fast-paced environment.",
        media: {
            type: "image", // "image" | "youtube" | "video"
            url: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=800&h=450&fit=crop"
        },
        content: `
      <h2>Leadership in the Digital Era</h2>
      <p>The modern workplace demands leaders who are adaptable, tech-savvy, and empathetic. Digital transformation is redefining traditional leadership roles.</p>
      <h2>Key Insights</h2>
      <ul>
        <li>Embracing remote collaboration tools</li>
        <li>Focusing on employee well-being</li>
        <li>Driving innovation through inclusive culture</li>
        <li>Continuous learning and upskilling</li>
      </ul>
      <blockquote>"Great leaders inspire action and foster growth at every level."</blockquote>
    `,
        commentsList: [ // Changed from 'comments' to 'commentsList'
            { id: 1, name: "Alex Carter", avatar: "https://i.pravatar.cc/100?img=12", date: "2023-10-18", message: "Great insights on hybrid models!" },
            { id: 2, name: "Priya Singh", avatar: "https://i.pravatar.cc/100?img=32", date: "2023-10-19", message: "Loved the emphasis on results over hours." },
            { id: 3, name: "Michael Chen", avatar: "https://i.pravatar.cc/100?img=45", date: "2023-10-19", message: "This was exactly what our team needed to hear." },
        ],
        mentor_info: {
            name: "John Smith",
            avatar: "https://i.pravatar.cc/100?img=12",
            bio: "Leadership coach and organizational strategist.",
            social: {
                facebook: "https://facebook.com",
                twitter: "https://twitter.com",
                linkedin: "https://linkedin.com",
                github: "https://github.com"
            }
        },
        popular_mentors: [
            {
                id: 2,
                title: "Empowering Teams in Hybrid Workplaces",
                media: { type: "youtube", url: "https://www.youtube.com/embed/tgbNymZ7vqY" }
            },
            {
                id: 3,
                title: "Effective Decision-Making Under Pressure",
                media: { type: "image", url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40" }
            },
            {
                id: 4,
                title: "Building Resilient Organizations",
                media: { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
            }
        ]
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const createMarkup = (htmlContent) => {
        return { __html: htmlContent };
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const timer = setTimeout(() => {
            setLoading(false);
            setComments(dummyMentorData.commentsList || []);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmitComment = (e) => {
        e.preventDefault();
        if (!newComment.name.trim() || !newComment.email.trim() || !newComment.message.trim()) return;

        const created = {
            id: Date.now(),
            name: newComment.name,
            avatar: `https://i.pravatar.cc/100?u=${encodeURIComponent(newComment.email)}`,
            date: new Date().toISOString().slice(0, 10),
            message: newComment.message
        };

        setComments((prev) => [created, ...prev]);
        setNewComment({ name: "", email: "", message: "" });
    };

    if (loading) return <Loader />;

    return (
        <>
            <Breadcrumb
                items={[
                    { label: 'Home', path: '/', icon: 'home' },
                    { label: 'Mentors Hub', path: '/mentors', icon: 'folder' },
                    { label: 'Mentor Details' }
                ]}
                pageTitle="Mentor Details"
            />

            <div className="container mx-auto px-4 py-8 md:px-10">
                <div className="flex flex-col lg:flex-row gap-8 mt-6">

                    {/* Main Content */}
                    <div className="w-full lg:w-8/12">
                        <article className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-6">
                                <h1 className="text-3xl text-center font-bold text-gray-800 mb-4">
                                    {dummyMentorData.title}
                                </h1>

                                <div className="flex flex-wrap items-center justify-around text-gray-600 mb-6 gap-4">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                                        <span>{formatDate(dummyMentorData.date)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faList} className="mr-2" />
                                        <span>List</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faMessage} className="mr-2" />
                                        <span>Comments ({dummyMentorData.commentsCount})</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faEye} className="mr-2" />
                                        <span>{dummyMentorData.views} Views</span>
                                    </div>
                                </div>

                                <p className="text-lg text-gray-700 mb-6">{dummyMentorData.excerpt}</p>
                            </div>

                            {/* Featured Media */}
                            <div className="w-full p-4">
                                <MediaRenderer media={dummyMentorData.media} />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={createMarkup(dummyMentorData.content)}
                                />

                                {/* Share Buttons */}
                                <div className="flex flex-wrap justify-between items-center mt-8 pt-6 border-t border-gray-200 gap-6">
                                    <div className="w-full md:w-auto">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                                            <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
                                            Share this mentor
                                        </h3>
                                        <div className="flex space-x-4">
                                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition">
                                                <FontAwesomeIcon icon={faFacebook} size="lg" />
                                            </a>
                                            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(dummyMentorData.title)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 transition">
                                                <FontAwesomeIcon icon={faTwitter} size="lg" />
                                            </a>
                                            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 transition">
                                                <FontAwesomeIcon icon={faLinkedin} size="lg" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* Mentor Info */}
                        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                            <h2 className="text-2xl font-bold mb-6">About the Mentor</h2>

                            <div className="flex flex-col sm:flex-row items-start">
                                <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                                    <img src={dummyMentorData.mentor_info.avatar} alt={dummyMentorData.mentor_info.name} className="w-24 h-24 rounded-full object-cover" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-xl font-semibold">{dummyMentorData.mentor_info.name}</h3>
                                    <p className="text-gray-600 mt-2">{dummyMentorData.mentor_info.bio}</p>

                                    <div className="flex mt-4 space-x-4">
                                        <a href={dummyMentorData.mentor_info.social.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                                            <FontAwesomeIcon icon={faFacebook} size="lg" />
                                        </a>
                                        <a href={dummyMentorData.mentor_info.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-400">
                                            <FontAwesomeIcon icon={faTwitter} size="lg" />
                                        </a>
                                        <a href={dummyMentorData.mentor_info.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-700">
                                            <FontAwesomeIcon icon={faLinkedin} size="lg" />
                                        </a>
                                        <a href={dummyMentorData.mentor_info.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                                            <FontAwesomeIcon icon={faGithub} size="lg" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Comments Section */}
                        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                            <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>
                            <div className="space-y-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {comments.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment.</p>
                                ) : (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="flex items-start border-b border-gray-100 pb-4">
                                            <img 
                                                src={comment.avatar} 
                                                alt={comment.name} 
                                                className="w-10 h-10 rounded-full object-cover mr-4 flex-shrink-0" 
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-semibold text-gray-800">{comment.name}</h4>
                                                    <span className="text-sm text-gray-500">{formatDate(comment.date)}</span>
                                                </div>
                                                <p className="text-gray-700">{comment.message}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        
                        {/* Comment Form */}
                        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                            <h2 className="text-2xl font-bold mb-6">Leave a Comment</h2>
                            <form onSubmit={handleSubmitComment} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Your name"
                                            value={newComment.name}
                                            onChange={(e) => setNewComment({...newComment, name: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="your.email@example.com"
                                            value={newComment.email}
                                            onChange={(e) => setNewComment({...newComment, email: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Write your comment here..."
                                        value={newComment.message}
                                        onChange={(e) => setNewComment({...newComment, message: e.target.value})}
                                        required
                                    ></textarea>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 custom-btn  font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Post Comment
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-4/12">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-6 border-b pb-2">Popular Mentors</h2>
                            <div className="space-y-6">
                                {dummyMentorData.popular_mentors.map((item) => (
                                    <div key={item.id} className="flex items-start hover:bg-gray-50 p-2 rounded-md transition-colors">
                                        <div className="flex-shrink-0 mr-4 w-28">
                                            <MediaRenderer media={item.media} className="h-20" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 hover:text-yellow-600 transition-colors">
                                                <Link to={`/mentors/${item.id}`}>{item.title}</Link>
                                            </h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MentorHubDetails;