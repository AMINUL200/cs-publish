import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AdminDashboard = () => {
    const navigate = useNavigate();

    // Custom hook for counting animation
    const useCountUp = (end, duration = 2) => {
        const [count, setCount] = React.useState(0);
        const [ref, inView] = useInView({ triggerOnce: true });

        React.useEffect(() => {
            if (!inView) return;

            let start = 0;
            const increment = end / (duration * 60); // 60fps

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.ceil(start));
                }
            }, 1000 / 60); // 60fps

            return () => clearInterval(timer);
        }, [end, inView, duration]);

        return [count, ref];
    };

    // Dashboard data with corresponding paths
    const stats = [
        { title: "Total Subscribers", value: 4, icon: "👥", color: "bg-blue-100 text-blue-800", path: "/subscribers" },
        { title: "Total Users", value: 13, icon: "👤", color: "bg-green-100 text-green-800", path: "/users" },
        { title: "Total Authors", value: 6, icon: "✍️", color: "bg-purple-100 text-purple-800", path: "/authors" },
        { title: "Total Reviewers", value: 3, icon: "🔍", color: "bg-yellow-100 text-yellow-800", path: "/reviewers" },
        { title: "Total Payments", value: 0, icon: "💰", color: "bg-red-100 text-red-800", path: "/payments" },
        { title: "Publishing Payment", value: 0, icon: "📚", color: "bg-indigo-100 text-indigo-800", path: "/publishing-payments" },
        { title: "Subscriber Payment", value: 0, icon: "💳", color: "bg-pink-100 text-pink-800", path: "/subscriber-payments" },
        { title: "Processing Payment", value: 0, icon: "⏳", color: "bg-gray-100 text-gray-800", path: "/processing-payments" },
        { title: "Total Journal", value: 4, icon: "📖", color: "bg-teal-100 text-teal-800", path: "/journals" },
        { title: "Total Article", value: 1, icon: "📝", color: "bg-orange-100 text-orange-800", path: "/articles" },
        { title: "Total Manuscript", value: 3, icon: "📜", color: "bg-cyan-100 text-cyan-800", path: "/manuscripts" },
    ];

    const handleCardClick = (path) => {
        navigate(path);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Quick Status</h2>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    {stats.map((stat, index) => {
                        const [count, ref] = useCountUp(stat.value);

                        return (
                            <motion.div
                                key={index}
                                ref={ref}
                                variants={itemVariants}
                                onClick={() => handleCardClick(stat.path)}
                                className={`p-6 rounded-lg shadow-md ${stat.color} flex flex-col items-center cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <motion.span
                                    className="text-3xl mb-2"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {stat.icon}
                                </motion.span>
                                <motion.span
                                    className="text-4xl font-bold"
                                    key={count}
                                    initial={{ scale: 0.5 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                >
                                    {count}
                                </motion.span>
                                <span className="text-lg mt-2 text-center">{stat.title}</span>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

           
        </div>
    )
}

export default AdminDashboard
