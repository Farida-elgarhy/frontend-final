import { useState, useEffect } from 'react';
import './UserDashboard.css';

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('pets');
    const [pets, setPets] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [newPet, setNewPet] = useState({
        name: '',
        age: '',
        breed: '',
        vaccinationDates: '',
        healthNotes: ''
    });
    const [editingPet, setEditingPet] = useState(null);
    const [error, setError] = useState('');
    const [isAddingPet, setIsAddingPet] = useState(false);

    useEffect(() => {
        fetchPets();
        fetchAppointments();
    }, []);

    const fetchPets = async () => {
        try {
            const response = await fetch('http://localhost:8888/petprofiles', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch pets');
            const data = await response.json();
            setPets(data);
        } catch (err) {
            setError('Failed to load pets');
        }
    };

    const fetchAppointments = async () => {
        try {
            console.log('Fetching appointments...');
            const response = await fetch('http://localhost:8888/user/appointments', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to fetch appointments');
            }

            const data = await response.json();
            console.log('Raw appointments data:', data);
            
            // Filter to show only upcoming appointments
            const now = new Date();
            console.log('Current date for filtering:', now);
            
            const upcomingAppointments = Array.isArray(data) ? data.filter(apt => {
                const appointmentDate = new Date(apt.appointmentdate);
                console.log('Appointment date:', appointmentDate, 'for appointment:', apt);
                return appointmentDate >= now;
            }).sort((a, b) => {
                return new Date(a.appointmentdate) - new Date(b.appointmentdate);
            }) : [];
            
            console.log('Filtered upcoming appointments:', upcomingAppointments);
            setAppointments(upcomingAppointments);
            setError('');
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError(err.message || 'Failed to load appointments');
            setAppointments([]);
        }
    };

    const handleAddPet = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8888/user/pets/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPet),
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to add pet');
            
            fetchPets();
            setIsAddingPet(false);
            setNewPet({
                name: '',
                age: '',
                breed: '',
                vaccinationDates: '',
                healthNotes: ''
            });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditPet = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8888/user/pets/edit/${editingPet.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingPet),
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to update pet');
            
            fetchPets();
            setEditingPet(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeletePet = async (petId) => {
        if (!window.confirm('Are you sure you want to delete this pet?')) return;
        
        try {
            const response = await fetch(`http://localhost:8888/user/pets/delete/${petId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to delete pet');
            
            fetchPets();
        } catch (err) {
            setError(err.message);
        }
    };

    const formatAppointmentTime = (date, time) => {
        const appointmentDate = new Date(date);
        const formattedDate = appointmentDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        return `${formattedDate} at ${time}`;
    };

    const handleCancelAppointment = async (appointmentId) => {
        try {
            const response = await fetch(`http://localhost:8888/appointments/${appointmentId}/cancel`, {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to cancel appointment: ${response.status} ${errorText}`);
            }

            // Refresh appointments after cancellation
            await fetchAppointments();
            setError('');  // Clear any previous errors
        } catch (err) {
            console.error('Error canceling appointment:', err);
            setError(`Failed to cancel appointment: ${err.message}`);
        }
    };

    const renderPetForm = (pet, onSubmit) => (
        <form className="pet-form" onSubmit={onSubmit}>
            <input
                type="text"
                placeholder="Pet Name"
                value={pet.name}
                onChange={e => pet === newPet ? 
                    setNewPet({...newPet, name: e.target.value}) :
                    setEditingPet({...editingPet, name: e.target.value})}
                required
            />
            <input
                type="number"
                placeholder="Age"
                value={pet.age}
                onChange={e => pet === newPet ?
                    setNewPet({...newPet, age: e.target.value}) :
                    setEditingPet({...editingPet, age: e.target.value})}
                required
            />
            <input
                type="text"
                placeholder="Breed"
                value={pet.breed}
                onChange={e => pet === newPet ?
                    setNewPet({...newPet, breed: e.target.value}) :
                    setEditingPet({...editingPet, breed: e.target.value})}
                required
            />
            <input
                type="text"
                placeholder="Vaccination Dates"
                value={pet.vaccinationDates}
                onChange={e => pet === newPet ?
                    setNewPet({...newPet, vaccinationDates: e.target.value}) :
                    setEditingPet({...editingPet, vaccinationDates: e.target.value})}
            />
            <textarea
                placeholder="Health Notes"
                value={pet.healthNotes}
                onChange={e => pet === newPet ?
                    setNewPet({...newPet, healthNotes: e.target.value}) :
                    setEditingPet({...editingPet, healthNotes: e.target.value})}
            />
            <div className="form-actions">
                <button type="submit" className="primary-button">
                    {pet === newPet ? 'Add Pet' : 'Save Changes'}
                </button>
                <button 
                    type="button" 
                    className="secondary-button"
                    onClick={() => pet === newPet ? setIsAddingPet(false) : setEditingPet(null)}
                >
                    Cancel
                </button>
            </div>
        </form>
    );

    const renderAppointments = () => {
        console.log('Rendering appointments:', appointments);
        
        if (error) {
            console.log('Rendering error:', error);
            return <div className="error-message">{error}</div>;
        }

        if (!appointments.length) {
            console.log('No appointments to display');
            return (
                <div className="no-appointments">
                    <h4>No Upcoming Appointments</h4>
                    <p>You don't have any upcoming appointments scheduled.</p>
                </div>
            );
        }

        return appointments.map((appointment) => {
            console.log('Rendering appointment:', appointment);
            return (
                <div key={appointment.id} className="appointment-card">
                    <div className="appointment-header">
                        <h3>Appointment with Dr. {appointment.vet_name || appointment.vetName}</h3>
                        <span className={`status ${(appointment.status || 'scheduled').toLowerCase()}`}>
                            {appointment.status || 'Scheduled'}
                        </span>
                    </div>
                    <div className="appointment-details">
                        <p><strong>Date & Time:</strong> {formatAppointmentTime(appointment.appointmentdate, appointment.appointmenttime)}</p>
                        <p><strong>Location:</strong> {appointment.vet_location || appointment.location || 'Location not specified'}</p>
                        {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
                    </div>
                    {(!appointment.status || appointment.status !== 'CANCELLED') && (
                        <button 
                            className="cancel-button"
                            onClick={() => handleCancelAppointment(appointment.id)}
                        >
                            Cancel Appointment
                        </button>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="dashboard-container">
            <h2>My Dashboard</h2>
            {error && <div className="error-message">{error}</div>}

            <div className="dashboard-tabs">
                <button 
                    className={activeTab === 'pets' ? 'active' : ''}
                    onClick={() => setActiveTab('pets')}
                >
                    My Pets
                </button>
                <button 
                    className={activeTab === 'appointments' ? 'active' : ''}
                    onClick={() => setActiveTab('appointments')}
                >
                    Appointments
                </button>
            </div>

            {activeTab === 'pets' && (
                <div className="pets-section">
                    <div className="section-header">
                        <h3>My Pets</h3>
                        <button 
                            className="add-button"
                            onClick={() => setIsAddingPet(!isAddingPet)}
                        >
                            {isAddingPet ? 'Cancel' : 'Add Pet'}
                        </button>
                    </div>

                    {isAddingPet && renderPetForm(newPet, handleAddPet)}
                    
                    {editingPet && renderPetForm(editingPet, handleEditPet)}

                    <div className="pets-grid">
                        {pets.length === 0 ? (
                            <div className="no-pets-message">
                                <h4>No Pets Added Yet</h4>
                                <p>Add your pets to manage their health records and appointments.</p>
                            </div>
                        ) : (
                            pets.map(pet => (
                                <div key={pet.id} className="pet-card">
                                    <h4>{pet.name}</h4>
                                    <p><strong>Age:</strong> {pet.age} years</p>
                                    <p><strong>Breed:</strong> {pet.breed}</p>
                                    {pet.vaccinationDates && (
                                        <p><strong>Vaccination Dates:</strong> {pet.vaccinationDates}</p>
                                    )}
                                    {pet.healthNotes && (
                                        <p><strong>Health Notes:</strong> {pet.healthNotes}</p>
                                    )}
                                    <div className="card-actions">
                                        <button 
                                            className="edit-button"
                                            onClick={() => setEditingPet(pet)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="delete-button"
                                            onClick={() => handleDeletePet(pet.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'appointments' && (
                <div className="appointments-section">
                    <div className="section-header">
                        <h3>Upcoming Appointments</h3>
                    </div>
                    <div className="appointments-grid">
                        {renderAppointments()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
