import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePetProfile.css';

const CreatePetProfile = () => {
    const navigate = useNavigate();
    const [petData, setPetData] = useState({
        name: '',
        age: '',
        breed: '',
        vaccinationdates: '',
        healthnotes: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        // Validate required fields
        if (!petData.name || !petData.age || !petData.breed) {
            setError('Name, age, and breed are required');
            setIsSubmitting(false);
            return;
        }

        const formData = {
            ...petData,
            age: parseInt(petData.age, 10)
        };

        try {
            const response = await fetch('http://localhost:8888/user/pets/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Pet profile created successfully!');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                throw new Error(data.message || 'Failed to create pet profile');
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || 'Failed to create pet profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPetData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="create-pet-container">
            <form onSubmit={handleSubmit} className="create-pet-form">
                <h2>Create Pet Profile</h2>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="form-group">
                    <label htmlFor="name">Pet Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={petData.name}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="age">Age:</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={petData.age}
                        onChange={handleChange}
                        required
                        min="0"
                        disabled={isSubmitting}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="breed">Breed:</label>
                    <input
                        type="text"
                        id="breed"
                        name="breed"
                        value={petData.breed}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="vaccinationdates">Vaccination Dates:</label>
                    <input
                        type="text"
                        id="vaccinationdates"
                        name="vaccinationdates"
                        value={petData.vaccinationdates}
                        onChange={handleChange}
                        placeholder="Optional"
                        disabled={isSubmitting}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="healthnotes">Health Notes:</label>
                    <textarea
                        id="healthnotes"
                        name="healthnotes"
                        value={petData.healthnotes}
                        onChange={handleChange}
                        placeholder="Optional"
                        disabled={isSubmitting}
                    />
                </div>

                <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Pet Profile'}
                </button>
            </form>
        </div>
    );
};

export default CreatePetProfile;
