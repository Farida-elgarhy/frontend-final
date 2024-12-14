import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './VetDashboard.css';

const VetDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const initialTab = location.search.split('tab=')[1] || 'profile';
    const isEditMode = location.search.split('edit=')[1] === 'true';

    const [activeTab, setActiveTab] = useState(initialTab);
    const [profile, setProfile] = useState({
        name: '',
        specialisation: '',
        contact: '',
        location: '',
        email: '',
        phonenumber: ''
    });
    const [appointments, setAppointments] = useState([]);
    const [isEditing, setIsEditing] = useState(isEditMode);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchProfile();
        if (activeTab === 'appointments') {
            fetchAppointments();
        }
    }, [activeTab]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setIsEditing(params.get('edit') === 'true');
    }, [location.search]);

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:8888/vet/profile', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch profile');
            const data = await response.json();
            setProfile(data);
        } catch (err) {
            setError('Failed to load profile');
            console.error('Error:', err);
        }
    };

    const fetchAppointments = async () => {
        try {
            const response = await fetch('http://localhost:8888/vet/appointments', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch appointments');
            const data = await response.json();
            setAppointments(data);
        } catch (err) {
            setError('Failed to load appointments');
            console.error('Error:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch('http://localhost:8888/vet/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
                credentials: 'include'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update profile');
            }
            
            setSuccessMessage('Profile updated successfully!');
            setIsEditing(false);
            navigate('/dashboard?tab=profile');
        } catch (err) {
            setError(err.message);
            console.error('Error:', err);
        }
    };

    const handleDeleteProfile = async () => {
        if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
            try {
                const response = await fetch('http://localhost:8888/vet/profile/delete', {
                    method: 'DELETE',
                    credentials: 'include'
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Failed to delete profile');
                }
                
                setSuccessMessage('Profile deleted successfully!');
                navigate('/');
            } catch (err) {
                setError(err.message);
                console.error('Error:', err);
            }
        }
    };

    const handleAppointmentStatus = async (appointmentId, status) => {
        try {
            const response = await fetch(`http://localhost:8888/vet/appointments/${appointmentId}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
                credentials: 'include'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update appointment status');
            }
            
            setSuccessMessage('Appointment status updated successfully!');
            fetchAppointments();
        } catch (err) {
            setError(err.message);
            console.error('Error:', err);
        }
    };

    const renderProfile = () => (
        <div className="profile-section">
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            
            <form onSubmit={handleProfileUpdate}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="specialisation">Specialisation:</label>
                    <input
                        type="text"
                        id="specialisation"
                        name="specialisation"
                        value={profile.specialisation}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="contact">Contact Email:</label>
                    <input
                        type="email"
                        id="contact"
                        name="contact"
                        value={profile.contact}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="location">Location:</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={profile.location}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phonenumber">Phone Number:</label>
                    <input
                        type="tel"
                        id="phonenumber"
                        name="phonenumber"
                        value={profile.phonenumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                    />
                </div>

                <div className="button-group">
                    {isEditing ? (
                        <>
                            <button type="submit" className="save-button">Save Changes</button>
                            <button 
                                type="button" 
                                className="cancel-button"
                                onClick={() => {
                                    setIsEditing(false);
                                    navigate('/dashboard?tab=profile');
                                }}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                type="button" 
                                className="edit-button"
                                onClick={() => navigate('/dashboard?tab=profile&edit=true')}
                            >
                                Edit Profile
                            </button>
                            <button 
                                type="button" 
                                className="delete-button"
                                onClick={handleDeleteProfile}
                            >
                                Delete Profile
                            </button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );

    const renderAppointments = () => (
        <div className="appointments-section">
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            
            <h3>Your Appointments</h3>
            {appointments.length === 0 ? (
                <p>No appointments found.</p>
            ) : (
                <div className="appointments-list">
                    {appointments.map(appointment => (
                        <div key={appointment.id} className="appointment-card">
                            <div className="appointment-details">
                                <p><strong>Date:</strong> {appointment.appointmentdate}</p>
                                <p><strong>Time:</strong> {appointment.appointmenttime}</p>
                                <p><strong>Status:</strong> {appointment.status}</p>
                            </div>
                            <div className="appointment-actions">
                                <button 
                                    onClick={() => handleAppointmentStatus(appointment.id, 'accepted')}
                                    className="accept-button"
                                    disabled={appointment.status !== 'pending'}
                                >
                                    Accept
                                </button>
                                <button 
                                    onClick={() => handleAppointmentStatus(appointment.id, 'rejected')}
                                    className="reject-button"
                                    disabled={appointment.status !== 'pending'}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="dashboard-container">
            <div className="dashboard-tabs">
                <button 
                    className={activeTab === 'profile' ? 'active' : ''} 
                    onClick={() => {
                        setActiveTab('profile');
                        navigate('/dashboard?tab=profile');
                    }}
                >
                    Profile
                </button>
                <button 
                    className={activeTab === 'appointments' ? 'active' : ''} 
                    onClick={() => {
                        setActiveTab('appointments');
                        navigate('/dashboard?tab=appointments');
                    }}
                >
                    Appointments
                </button>
            </div>

            <div className="dashboard-content">
                {activeTab === 'profile' ? renderProfile() : renderAppointments()}
            </div>
        </div>
    );
};

export default VetDashboard;
