import React from 'react';
import { Link } from 'react-router-dom';
import { FaDog } from 'react-icons/fa';
import './Landing.css';

const Landing = () => {
    return (
        <div className="landing-container">
            <div className="landing-content">
                <div className="logo-section">
                    <FaDog className="landing-logo" />
                    <h1>PetVerse</h1>
                </div>
                <div className="auth-buttons">
                    <Link to="/register" className="auth-button register">
                        Register
                    </Link>
                    <Link to="/login" className="auth-button login">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Landing;
