import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebookF, 
  faTwitter, 
  faLinkedinIn, 
  faGithub 
} from '@fortawesome/free-brands-svg-icons';
import Loader from '../../components/common/Loader';

// Dummy data for blog details
const dummyBlogData = {
    id: 1,
    title: "The Future of Remote Work in 2023",
    date: "2023-10-15",
    category_name: "Technology",
    paragraph1: "Remote work has transformed how companies operate and how employees approach their careers. As we move further into 2023, new trends and technologies are shaping this landscape.",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
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
    author: {
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
    comments: [
        { id: 1, name: "Alex Carter", avatar: "https://i.pravatar.cc/100?img=12", date: "2023-10-18", message: "Great insights on hybrid models!" },
        { id: 2, name: "Priya Singh", avatar: "https://i.pravatar.cc/100?img=32", date: "2023-10-19", message: "Loved the emphasis on results over hours." },
        { id: 3, name: "Priya Singh", avatar: "https://i.pravatar.cc/100?img=32", date: "2023-10-19", message: "Loved the emphasis on results over hours." },
        { id: 4, name: "Priya Singh", avatar: "https://i.pravatar.cc/100?img=32", date: "2023-10-19", message: "Loved the emphasis on results over hours." },
        { id: 5, name: "Priya Singh", avatar: "https://i.pravatar.cc/100?img=32", date: "2023-10-19", message: "Loved the emphasis on results over hours." },
    ],
    recent_posts: [
        {
            id: 2,
            title: "How AI is Transforming Business Operations",
            image: "https://images.unsplash.com/photo-1677442135135-416f8aa26a5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1376&q=80"
        },
        {
            id: 3,
            title: "The Rise of Sustainable Business Practices",
            image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        },
        {
            id: 4,
            title: "Building Resilience in Times of Change",
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        }
    ]
};

// Dummy services data
const servicesData = [
    { name: "Author Stories", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" },
    { name: "How to Write Better", image: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" },
    { name: "Publishing Made Simple", image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80" },
    { name: "Hidden Voices", image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" },
];

const BlogDetails = () => {
    const { id } = useParams();
    const [blogDetailsData, setBlogDetailsData] = useState(null);
    const [recentPost, setRecentPost] = useState([]);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({ name: "", email: "", message: "" });

    // Format date function
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    useEffect(() => {
        // Simulate API call with setTimeout
        const timer = setTimeout(() => {
            setBlogDetailsData(dummyBlogData);
            setRecentPost(dummyBlogData.recent_posts);
            setComments(dummyBlogData.comments || []);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader/>
            </div>
        );
    }

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

    return (
        <>
            <div className="blog-details-section pt-32 pb-8 relative">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="blog-details-section-wrap">
                        <div className="blog-post-content-box">
                            <div className="meta-text-block flex flex-row justify-center items-center gap-2 pt-4 pb-2">
                                <motion.div
                                    initial={{ x: -80, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="blog-category bg-gray-100 text-gray-800 text-center border border-gray-100 h-6 px-4 flex items-center justify-center text-sm"
                                >
                                    {blogDetailsData?.category_name}
                                </motion.div>
                                <motion.div
                                    initial={{ x: 80, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="blog-date text-gray-600"
                                >
                                    {formatDate(blogDetailsData?.date)}
                                </motion.div>
                            </div>

                            <div className="blog-post-title-block text-center">
                                <motion.div
                                    initial={{ y: 80, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="blog-detail-title text-4xl md:text-5xl font-normal text-black mb-3"
                                >
                                    {blogDetailsData?.title}
                                </motion.div>
                            </div>

                            <div className="blog-details-desc-box text-center w-full md:w-3/5 mx-auto pb-5">
                                <motion.p
                                    initial={{ y: 80, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="blog-desc text-gray-700 mb-3"
                                >
                                    {blogDetailsData?.paragraph1}
                                </motion.p>
                            </div>

                            <div className="blog-details-thumbnail-box flex justify-center items-center w-full h-96 md:h-[450px] mb-10 mx-auto relative">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.7, delay: 0.5 }}
                                    className="blog-single-image-box w-full h-full relative"
                                >
                                    <img
                                        className="blog-single-image object-cover w-full h-full rounded-lg"
                                        src={blogDetailsData?.image}
                                        alt="Blog featured"
                                    />
                                </motion.div>
                            </div>
                        </div>

                        <div className="blog-content-wrap">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2">
                                    <div className="blog-detail-content-block">
                                        <div className="blog-rich-text-block-1">
                                            <div
                                                className="blog-rich-text prose max-w-none"
                                                dangerouslySetInnerHTML={{ __html: blogDetailsData?.content }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-1">
                                    <div className="blog-sidebar flex flex-col gap-6">
                                        <div className="blog-sidebar-content-block bg-gray-50 p-6 rounded-lg">
                                            <div className="blog-author-detail-box">
                                                <div className="blog-author-thumbnail mb-5">
                                                    <h2 className="title text-2xl font-medium text-left">Recent Posts</h2>
                                                </div>
                                                <div className="blog-author-box text-left">
                                                    {recentPost?.map((post, index) => (
                                                        <Link
                                                            key={index}
                                                            to={`/blog/${post.id}`}
                                                            className="flex items-center gap-3 py-3 border-b border-gray-200 text-gray-700 hover:text-[#ffba00] transition-colors"
                                                        >
                                                            <motion.div
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                                                className="flex items-center gap-3"
                                                            >
                                                                <img
                                                                    src={post.image}
                                                                    alt={post.title}
                                                                    className="w-12 h-12 rounded-full object-cover shadow-lg"
                                                                />
                                                                <p className="text-sm line-clamp-2">{post.title}</p>
                                                            </motion.div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="blog-sidebar-content-block our-service bg-gray-50 p-6 rounded-lg">
                                            <div className="blog-author-detail-box">
                                                <div className="blog-author-thumbnail mb-5">
                                                    <h2 className="title text-2xl font-medium text-left">CATEGORY</h2>
                                                </div>
                                                <div className="blog-author-box text-left">
                                                    {servicesData.map((service, index) => (
                                                        <Link
                                                            key={index}
                                                            to='#'
                                                            className="flex items-center gap-3 py-3 border-b border-gray-200 text-gray-700 hover:text-[#ffba00] transition-colors group"
                                                        >
                                                            <motion.div
                                                                initial={{ opacity: 0, x: 50 }}
                                                                whileInView={{ x: 0, opacity: 1 }}
                                                                transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.75, delay: index * 0.08 }}
                                                                viewport={{ once: true, amount: 0.25 }}
                                                                className="flex items-center gap-3 group-hover:gap-4 transition-all duration-300"
                                                            >
                                                                <img
                                                                    src={service.image}
                                                                    alt={service.name}
                                                                    className="w-12 h-12 rounded object-cover shadow-lg"
                                                                />
                                                                <p className="text-sm">{service.name}</p>
                                                            </motion.div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-10 lg:mt-14">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 flex flex-col gap-8">
                                    {/* Author Details Section */}
                                    <div className="author-box bg-gray-50 p-6 rounded-lg border border-gray-100">
                                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <img 
                                                    src={blogDetailsData?.author?.avatar} 
                                                    alt={blogDetailsData?.author?.name} 
                                                    className="w-16 h-16 rounded-full object-cover flex-shrink-0" 
                                                />
                                                <div>
                                                    <h3 className="text-lg font-semibold">{blogDetailsData?.author?.name}</h3>
                                                    <p className="text-sm text-gray-600 mt-1">{blogDetailsData?.author?.bio}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-500 mt-4 sm:mt-0">
                                                {blogDetailsData?.author?.social?.facebook && (
                                                    <a 
                                                        href={blogDetailsData.author.social.facebook} 
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-[#ffba00] hover:text-white transition-colors"
                                                    >
                                                        <FontAwesomeIcon icon={faFacebookF} size="sm" />
                                                    </a>
                                                )}
                                                {blogDetailsData?.author?.social?.twitter && (
                                                    <a 
                                                        href={blogDetailsData.author.social.twitter} 
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-[#ffba00] hover:text-white transition-colors"
                                                    >
                                                        <FontAwesomeIcon icon={faTwitter} size="sm" />
                                                    </a>
                                                )}
                                                {blogDetailsData?.author?.social?.linkedin && (
                                                    <a 
                                                        href={blogDetailsData.author.social.linkedin} 
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-[#ffba00] hover:text-white transition-colors"
                                                    >
                                                        <FontAwesomeIcon icon={faLinkedinIn} size="sm" />
                                                    </a>
                                                )}
                                                {blogDetailsData?.author?.social?.github && (
                                                    <a 
                                                        href={blogDetailsData.author.social.github} 
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-[#ffba00] hover:text-white transition-colors"
                                                    >
                                                        <FontAwesomeIcon icon={faGithub} size="sm" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Comments Section */}
                                    <div className="comments-box bg-white p-6 rounded-lg border border-gray-100">
                                        <h3 className="text-xl font-medium mb-4">Comments ({comments.length})</h3>
                                        <div className="flex flex-col divide-y divide-gray-100 overflow-auto max-h-96 custom-scrollbar">
                                            {comments.length === 0 && (
                                                <p className="text-sm text-gray-500 py-4">No comments yet. Be the first to comment.</p>
                                            )}
                                            {comments.map((c) => (
                                                <div key={c.id} className="py-4 flex items-start gap-3">
                                                    <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium">{c.name}</span>
                                                            <span className="text-xs text-gray-400">{new Date(c.date).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-700 mt-1">{c.message}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Comment Form */}
                                    <div className="comment-form bg-gray-50 p-6 rounded-lg border border-gray-100">
                                        <h3 className="text-xl font-medium mb-4">Leave a Comment</h3>
                                        <form onSubmit={handleSubmitComment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-1">
                                                <label className="block text-sm text-gray-600 mb-1">Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                    value={newComment.name}
                                                    onChange={(e) => setNewComment((p) => ({ ...p, name: e.target.value }))}
                                                    placeholder="Your name"
                                                    required
                                                />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-sm text-gray-600 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                    value={newComment.email}
                                                    onChange={(e) => setNewComment((p) => ({ ...p, email: e.target.value }))}
                                                    placeholder="you@example.com"
                                                    required
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm text-gray-600 mb-1">Message</label>
                                                <textarea
                                                    rows="4"
                                                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                    value={newComment.message}
                                                    onChange={(e) => setNewComment((p) => ({ ...p, message: e.target.value }))}
                                                    placeholder="Write your comment..."
                                                    required
                                                />
                                            </div>
                                            <div className="md:col-span-2 flex justify-end">
                                                <button 
                                                    type="submit" 
                                                    className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                                                >
                                                    Post Comment
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                <div className="lg:col-span-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogDetails;