import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaDog } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <Link to="/">
                        <FaDog className="footer-icon" />
                        <span>PetVerse</span>
                    </Link>
                </div>
                <div className="footer-links">
                    <div className="footer-section">
                        <h3>Navigation</h3>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/vets">Vets</Link></li>
                            <li><Link to="/shops">Shops</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Profile</h3>
                        <ul>
                            <li><Link to="/dashboard">Pet Profile</Link></li>
                            <li><Link to="/dashboard?tab=appointments">Appointments</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Support</h3>
                        <ul>
                            <li><span className="disabled-link">FAQ</span></li>
                            <li><span className="disabled-link">Contact Us</span></li>
                            <li><Link to="/feedback">Feedback</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} PetVerse. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
