import {
    faArrowRight,
    faEye,
    faCalendar,
    faUser,
    faHeart,
    faCoffee,
    faLightbulb,
    faPenNib,
    faMicrophone,
    faBrain
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../../../components/common/Loader';
import InnovationTestimonial from '../../../components/common/InnovationTestimonial';
import Breadcrumb from '../../../components/common/Breadcrumb';
// import { ArrowRight, Eye, Calendar, User, Heart, Coffee, Lightbulb, PenTool, Mic, Brain } from 'lucide-react';

const UserBlogPage = () => {
    // Blog Categories Data
    const blogCategories = [
        {
            id: 1,
            title: "Author Stories",
            description: "Personal journeys and experiences from writers around the world",
            icon: <FontAwesomeIcon icon={faUser} className="w-8 h-8" />,
            color: "from-purple-500 to-pink-500",
            posts: 45
        },
        {
            id: 2,
            title: "How to Write Better",
            description: "Tips, techniques and strategies to improve your writing skills",
            icon: <FontAwesomeIcon icon={faPenNib} className="w-8 h-8" />,
            color: "from-blue-500 to-cyan-500",
            posts: 32
        },
        {
            id: 3,
            title: "Publishing Made Simple",
            description: "Navigate the publishing world with confidence and ease",
            icon: <FontAwesomeIcon icon={faCoffee} className="w-8 h-8" />,
            color: "from-green-500 to-teal-500",
            posts: 28
        },
        {
            id: 4,
            title: "Hidden Voices",
            description: "Amplifying underrepresented stories and perspectives",
            icon: <FontAwesomeIcon icon={faMicrophone} className="w-8 h-8" />,
            color: "from-orange-500 to-red-500",
            posts: 19
        },
        {
            id: 5,
            title: "Creative Sparks",
            description: "Inspiration and ideas to fuel your creative writing journey",
            icon: <FontAwesomeIcon icon={faLightbulb} className="w-8 h-8" />,
            color: "from-yellow-500 to-orange-500",
            posts: 36
        },
        {
            id: 6,
            title: "Mind & Motivation",
            description: "Mental wellness and motivation for writers and creators",
            icon: <FontAwesomeIcon icon={faBrain} className="w-8 h-8" />,
            color: "from-indigo-500 to-purple-500",
            posts: 24
        }
    ];

    // Recent Blogs Data
    const recentBlogs = [
        {
            id: 1,
            title: "The Art of Storytelling in the Digital Age",
            image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=250&fit=crop",
            excerpt: "Discover how modern writers are adapting traditional storytelling techniques for digital platforms...",
            author: "Sarah Johnson",
            date: "2025-08-25",
            category: "Author Stories",
            readTime: "5 min read"
        },
        {
            id: 2,
            title: "10 Writing Habits That Changed My Life",
            image: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=400&h=250&fit=crop",
            excerpt: "Transform your writing routine with these powerful habits that successful authors swear by...",
            author: "Michael Chen",
            date: "2025-08-23",
            category: "How to Write Better",
            readTime: "7 min read"
        },
        {
            id: 3,
            title: "Self-Publishing Success: A Complete Guide",
            image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
            excerpt: "Everything you need to know about self-publishing your first book and building your author brand...",
            author: "Emma Davis",
            date: "2025-08-20",
            category: "Publishing Made Simple",
            readTime: "12 min read"
        },
        // {
        //     id: 4,
        //     title: "Finding Your Unique Voice as a Writer",
        //     image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop",
        //     excerpt: "Learn how to develop and refine your authentic writing voice that resonates with readers...",
        //     author: "Alex Rodriguez",
        //     date: "2025-08-18",
        //     category: "Creative Sparks",
        //     readTime: "6 min read"
        // }
    ];

    // Most Viewed Blogs Data
    const mostViewedBlogs = [
        {
            id: 1,
            title: "Why Every Writer Needs a Morning Routine",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
            views: 15420,
            author: "Jennifer Lopez",
            date: "2025-07-15",
            category: "Mind & Motivation",
            readTime: "8 min read"
        },
        {
            id: 2,
            title: "The Psychology Behind Compelling Characters",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
            views: 12830,
            author: "David Kim",
            date: "2025-07-10",
            category: "How to Write Better",
            readTime: "10 min read"
        },
        {
            id: 3,
            title: "From Manuscript to Bestseller: A Journey",
            image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=250&fit=crop",
            views: 11250,
            author: "Rachel Green",
            date: "2025-06-28",
            category: "Author Stories",
            readTime: "15 min read"
        },
        // {
        //     id: 4,
        //     title: "Breaking Writer's Block: 7 Proven Methods",
        //     image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
        //     views: 9640,
        //     author: "Tom Wilson",
        //     date: "2025-06-20",
        //     category: "Creative Sparks",
        //     readTime: "9 min read"
        // }
    ];

    // Team Members Data
    const teamMembers = [
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

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)

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
                { label: 'Blog' }
            ]}
             pageTitle="Blog "
              />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ">


                {/* Blog Categories Section */}
                <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Categories</span>
                        </h2>
                        <h5 className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Dive into topics that inspire, educate, and elevate your writing journey
                        </h5>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogCategories.map((category) => (
                            <Link
                                key={category.id}
                                to='#'
                                className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                <div className="relative p-8">
                                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${category.color} text-white mb-6 shadow-lg`}>
                                        {category.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                                        {category.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 leading-relaxed">
                                        {category.description}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-500">
                                            {category.posts} posts
                                        </span>
                                        <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Recent Blogs Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Stories</span>
                            </h2>
                            <h5 className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Fresh insights and inspiring content from our community of writers
                            </h5>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {recentBlogs.map((blog) => (
                                <article
                                    key={blog.id}
                                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                                                {blog.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                                            {blog.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                                            {blog.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-2">
                                                <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">{blog.author}</span>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
                                                    <span>{new Date(blog.date).toLocaleDateString()}</span>
                                                </div>
                                                <span>{blog.readTime}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`${blog.id}`)}
                                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
                                            Read More
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Most Viewed Blogs Section */}
                <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Most <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">Popular</span>
                            </h2>
                            <h5 className="text-lg text-gray-600 max-w-2xl mx-auto">
                                The articles our community loves most - don't miss these trending reads
                            </h5>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {mostViewedBlogs.map((blog) => (
                                <article
                                    key={blog.id}
                                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                                                <FontAwesomeIcon icon={faHeart} className="w-3 h-3" />
                                                <span>Popular</span>
                                            </span>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center space-x-1">
                                                <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
                                                <span>{blog.views.toLocaleString()}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300 line-clamp-2">
                                            {blog.title}
                                        </h3>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-2">
                                                <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">{blog.author}</span>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
                                                    <span>{new Date(blog.date).toLocaleDateString()}</span>
                                                </div>
                                                <span>{blog.readTime}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`${blog.id}`)}
                                            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
                                            Read More
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-20 bg-white innovation-section">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Team</span>
                            </h2>
                            <h5 className="text-lg text-gray-600 max-w-2xl mx-auto text-center">
                                The passionate writers and editors behind our content
                            </h5>
                        </div>
                        <InnovationTestimonial innovatorVoices={teamMembers} />


                    </div>
                </section>




            </div>
        </>

    );
};

export default UserBlogPage;