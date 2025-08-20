import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { landingLog } from '../../assets';
import { useSelector } from 'react-redux';

const LandingHeader = ({ toggleMenu }) => {
    const [scrolled, setScrolled] = useState(false);
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About' },
        { id: 'jurnals', label: 'Jurnals' },
        { id: 'post', label: 'Post' },
        { id: 'research', label: 'Research' },
        { id: 'services', label: 'Services' },
    ];
    
    return (
        <header
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-sm py-4'
                }`}
        >
            <div className="px-8 flex justify-between items-center"
                style={{ margin: '0 auto' }}
            >

                {/* Logo */}
                <div className="flex items-center">
                    <ScrollLink to='home'
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500}
                        className="text-2xl font-bold text-indigo-600 flex items-center"
                    >
                        <img
                            src={landingLog}
                            alt="log"
                            height={20}
                        />
                    </ScrollLink>
                </div>

                {/* Desktop Navigation - Side by Side Links */}
                <nav className="hidden md:flex items-center space-x-6">
                    {navLinks.map((link) => (
                        <ScrollLink
                            key={link.id}
                            activeClass="text-[#ffba00] font-medium"
                            to={link.id}
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={500}
                            className="text-gray-700 font-semibold hover:text-[#ffba00] cursor-pointer transition-colors px-2 py-1"
                        >
                            {link.label}
                        </ScrollLink>
                    ))}
                    
                    {/* Conditional rendering based on authentication status */}
                    {isAuthenticated ? (
                        <RouterLink
                            to='/dashboard'
                            className="ml-4 bg-[#ffba00] text-white px-4 py-2 rounded-md hover:bg-black transition-all duration-300"
                        >
                            Dashboard
                        </RouterLink>
                    ) : (
                        <RouterLink
                            to='/signin'
                            className="ml-4 bg-[#ffba00] text-white px-4 py-2 rounded-md hover:bg-black transition-all duration-300"
                        >
                            Login
                        </RouterLink>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center space-x-4">
                    {/* Conditional rendering for mobile view */}
                    {isAuthenticated ? (
                        <RouterLink
                            to='/dashboard'
                            className="bg-[#ffba00] text-white px-3 py-1 rounded-md text-sm"
                        >
                            Dashboard
                        </RouterLink>
                    ) : (
                        <RouterLink
                            to='/signin'
                            className="bg-[#ffba00] text-white px-3 py-1 rounded-md text-sm"
                        >
                            Login
                        </RouterLink>
                    )}
                    <button
                        onClick={toggleMenu}
                        className="text-gray-700 focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        <FontAwesomeIcon className="w-6 h-6" icon={faBars} />
                    </button>
                </div>
            </div>
        </header>
    )
}

export default LandingHeader;