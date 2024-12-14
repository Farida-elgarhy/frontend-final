import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        userType: 'user' // default to regular user
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'age' ? (value === '' ? '' : parseInt(value)) : value
        }));
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all required fields.');
            return false;
        }
        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address.');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return false;
        }
        if (formData.age && (formData.age < 0 || formData.age > 120)) {
            setError('Please enter a valid age between 0 and 120.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8888/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/login');
            } else {
                setError(data.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError('Failed to connect to the server. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} className="register-form">
                <h2>Register</h2>
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="age">Age (optional):</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min="0"
                        max="120"
                        placeholder="Enter your age"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="userType">Register as:</label>
                    <select
                        id="userType"
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                    >
                        <option value="user">Pet Owner</option>
                        <option value="vet">Veterinarian</option>
                        <option value="shop">Shop Owner</option>
                    </select>
                </div>

                <button 
                    type="submit" 
                    className="register-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register;
