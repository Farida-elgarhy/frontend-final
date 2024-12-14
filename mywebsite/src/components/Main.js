import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './Home';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import UserDashboard from './UserDashboard';
import VetsList from './VetsList';
import ShopsList from './ShopsList';
import CreatePetProfile from './CreatePetProfile';
import './Main.css';

const Main = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    // Check authentication status when component mounts
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:8888/user/check-auth', {
                    credentials: 'include'
                });
                const data = await response.json();
                
                if (response.ok && data.isAuthenticated) {
                    setIsAuthenticated(true);
                    setUserData(data);
                } else {
                    setIsAuthenticated(false);
                    setUserData(null);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsAuthenticated(false);
                setUserData(null);
            }
        };

        checkAuth();
    }, []);

    const handleLoginSuccess = (data) => {
        setIsAuthenticated(true);
        setUserData(data);
        navigate('/dashboard');
    };

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:8888/user/logout', {
                method: 'POST',
                credentials: 'include'
            });
            setIsAuthenticated(false);
            setUserData(null);
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Protected Route component
    const ProtectedRoute = ({ children }) => {
        if (!isAuthenticated) {
            return <Navigate to="/login" />;
        }
        return children;
    };

    return (
        <div className="main-content">
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={
                        isAuthenticated ? 
                        <Navigate to="/dashboard" /> : 
                        <LoginForm onSuccess={handleLoginSuccess} />
                    } />
                    <Route path="/register" element={
                        isAuthenticated ? 
                        <Navigate to="/dashboard" /> : 
                        <RegistrationForm onSuccess={() => navigate('/login')} />
                    } />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <UserDashboard userData={userData} />
                        </ProtectedRoute>
                    } />
                    <Route path="/create-pet" element={
                        <ProtectedRoute>
                            <CreatePetProfile />
                        </ProtectedRoute>
                    } />
                    <Route path="/vets" element={
                        <ProtectedRoute>
                            <VetsList />
                        </ProtectedRoute>
                    } />
                    <Route path="/shops" element={
                        <ProtectedRoute>
                            <ShopsList />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
            <div className="welcome-section">
                <h1>Welcome to PetVerse</h1>
                <div className="features-grid">
                    <div className="feature-card">
                        <h2>Pet Management</h2>
                        <p>Keep track of your pets' health records, vaccination dates, and more</p>
                    </div>
                    <div className="feature-card">
                        <h2>Find Veterinarians</h2>
                        <p>Connect with qualified vets and book appointments</p>
                    </div>
                    <div className="feature-card">
                        <h2>Pet Shops</h2>
                        <p>Discover pet shops and products near you</p>
                    </div>
                    <div className="feature-card">
                        <h2>Appointments</h2>
                        <p>Manage your vet appointments and shop visits</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
