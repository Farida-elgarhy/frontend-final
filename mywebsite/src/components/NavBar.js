import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaDog } from 'react-icons/fa';
import './NavBar.css';

const NavBar = ({ isAuthenticated, onLogout, userData, userType }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLogout = () => {
        onLogout();
        setIsProfileOpen(false);
        navigate('/');
    };

    const handleDeleteAccount = () => {
        // Add confirmation dialog and delete account logic here
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            // Call API to delete account
            console.log('Delete account');
        }
    };

    return (
        <nav>
            <Link to="/" className="brand">
                <FaDog className="brand-icon" />
                <span className="brand-name">PetVerse</span>
            </Link>
            <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                <ul>
                    {!isAuthenticated ? (
                        <>
                            <li>
                                <Link to="/login" className={isActive('/login') ? 'active' : ''}>
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className={isActive('/register') ? 'active' : ''}>
                                    Register
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/" className={isActive('/') ? 'active' : ''}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/vets" className={isActive('/vets') ? 'active' : ''}>
                                    Find Vets
                                </Link>
                            </li>
                            <li>
                                <Link to="/shops" className={isActive('/shops') ? 'active' : ''}>
                                    Pet Shops
                                </Link>
                            </li>
                            <li>
                                <Link to="/feedback" className={isActive('/feedback') ? 'active' : ''}>
                                    Feedback
                                </Link>
                            </li>
                            <li className="profile-dropdown" ref={profileRef}>
                                <button onClick={toggleProfile} className="profile-button">
                                    Profile ▼
                                </button>
                                {isProfileOpen && (
                                    <ul className="dropdown-menu">
                                        <li>
                                            <Link to="/profile/edit" onClick={() => setIsProfileOpen(false)}>
                                                Edit Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <button onClick={handleDeleteAccount} className="delete-account">
                                                Delete Account
                                            </button>
                                        </li>
                                        <li>
                                            <button onClick={handleLogout} className="logout">
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        </>
                    )}
                </ul>
            </div>
            <button 
                className="hamburger"
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
        </nav>
    );
};

export default NavBar;
