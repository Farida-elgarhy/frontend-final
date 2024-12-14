import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div className="home">
            <h1>Welcome to PetVerse</h1>
            <div className="features">
                <div className="feature-card" onClick={() => handleNavigate('/dashboard')}>
                    <h2>Pet Management</h2>
                    <p>Keep track of your pets' health records, vaccination dates, and more</p>
                </div>
                <div className="feature-card" onClick={() => handleNavigate('/vets')}>
                    <h2>Find Veterinarians</h2>
                    <p>Connect with qualified vets and book appointments</p>
                </div>
                <div className="feature-card" onClick={() => handleNavigate('/shops')}>
                    <h2>Pet Shops</h2>
                    <p>Discover pet shops and products near you</p>
                </div>
                <div className="feature-card" onClick={() => handleNavigate('/dashboard?tab=appointments')}>
                    <h2>Appointments</h2>
                    <p>Manage your vet appointments and shop visits</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
