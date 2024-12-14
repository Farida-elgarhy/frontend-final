import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import VetsList from './components/VetsList';
import ShopsList from './components/ShopsList';
import Feedback from './components/Feedback';
import PrivateRoute from './components/PrivateRoute';
import Landing from './components/Landing';
import AppointmentsList from './components/AppointmentsList';
import VetFeedback from './components/VetFeedback';
import UserDashboard from './components/UserDashboard';
import VetDashboard from './components/VetDashboard';
import ShopDashboard from './components/ShopDashboard';
import ShopOwnerDashboard from './components/ShopOwnerDashboard';
import PetsList from './components/PetsList';
import CreatePetProfile from './components/CreatePetProfile';
import EditProfile from './components/EditProfile';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [userType, setUserType] = useState('');

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch('http://localhost:8888/user/check-auth', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setIsAuthenticated(true);
                    setUserData(data.user);
                    setUserType(data.user.type || '');
                } else {
                    throw new Error(data.message || 'Authentication failed');
                }
            } else {
                throw new Error('Not authenticated');
            }
        } catch (error) {
            console.error('Auth verification failed:', error);
            setIsAuthenticated(false);
            setUserData(null);
            setUserType('');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (user) => {
        setIsAuthenticated(true);
        setUserData(user);
        setUserType(user.type || '');
        checkAuthStatus(); // Refresh auth status after login
    };

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:8888/user/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
        setIsAuthenticated(false);
        setUserData(null);
        setUserType('');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <div className="App">
                <NavBar 
                    isAuthenticated={isAuthenticated} 
                    onLogout={handleLogout}
                    userData={userData}
                    userType={userType}
                />
                <div className="content">
                    <Routes>
                        <Route path="/" element={!isAuthenticated ? <Landing /> : <Home />} />
                        <Route
                            path="/login"
                            element={
                                !isAuthenticated ? (
                                    <Login onLogin={handleLogin} />
                                ) : (
                                    <Navigate to="/" />
                                )
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                !isAuthenticated ? (
                                    <Register onRegister={handleLogin} />
                                ) : (
                                    <Navigate to="/" />
                                )
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
                                    {userType === 'vet' ? <VetDashboard userData={userData} /> :
                                     userType === 'shop' ? <ShopDashboard userData={userData} /> :
                                     userType === 'shopowner' ? <ShopOwnerDashboard userData={userData} /> :
                                     <UserDashboard userData={userData} />}
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/pets"
                            element={
                                <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
                                    <PetsList userData={userData} />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/pets/create"
                            element={
                                <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
                                    <CreatePetProfile userData={userData} />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/edit-profile"
                            element={
                                <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
                                    <EditProfile userData={userData} />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/vets"
                            element={
                                <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
                                    <VetsList />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/shops"
                            element={
                                <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
                                    <ShopsList />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/feedback"
                            element={
                                <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
                                    <Feedback />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/appointments"
                            element={
                                <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
                                    <AppointmentsList />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/vet-feedback/:vetId"
                            element={
                                <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
                                    <VetFeedback />
                                </PrivateRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
