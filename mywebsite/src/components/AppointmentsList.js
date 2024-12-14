import React, { useState, useEffect, useCallback } from 'react';
import './AppointmentsList.css';

const AppointmentsList = () => {
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState('upcoming'); 
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchAppointments = useCallback(async () => {
        try {
            setIsLoading(true);
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
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch appointments');
            }

            console.log('Fetched appointments:', data);
            
            // Filter appointments based on the current filter
            const today = new Date().toISOString().split('T')[0];
            const filteredAppointments = (data.appointments || []).filter(appointment => {
                const appointmentDate = appointment.date;
                if (filter === 'upcoming') {
                    return appointmentDate >= today && appointment.status !== 'cancelled';
                } else {
                    return appointmentDate < today || appointment.status === 'cancelled';
                }
            });

            setAppointments(filteredAppointments);
            setError('');
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError(err.message || 'Failed to load appointments');
            setAppointments([]);
        } finally {
            setIsLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleCancelAppointment = async (appointmentId) => {
        try {
            const response = await fetch(`http://localhost:8888/appointments/${appointmentId}/cancel`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to cancel appointment');
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Failed to cancel appointment');
            }

            await fetchAppointments();
        } catch (err) {
            console.error('Error cancelling appointment:', err);
            setError(err.message || 'Failed to cancel appointment');
        }
    };

    if (isLoading) {
        return <div className="loading">Loading appointments...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (appointments.length === 0) {
        return (
            <div className="appointments-container">
                <div className="filter-buttons">
                    <button 
                        className={filter === 'upcoming' ? 'active' : ''} 
                        onClick={() => setFilter('upcoming')}
                    >
                        Upcoming
                    </button>
                    <button 
                        className={filter === 'past' ? 'active' : ''} 
                        onClick={() => setFilter('past')}
                    >
                        Past
                    </button>
                </div>
                <div className="no-appointments">
                    {filter === 'upcoming' 
                        ? 'No upcoming appointments' 
                        : 'No past appointments'}
                </div>
            </div>
        );
    }

    return (
        <div className="appointments-container">
            <div className="filter-buttons">
                <button 
                    className={filter === 'upcoming' ? 'active' : ''} 
                    onClick={() => setFilter('upcoming')}
                >
                    Upcoming
                </button>
                <button 
                    className={filter === 'past' ? 'active' : ''} 
                    onClick={() => setFilter('past')}
                >
                    Past
                </button>
            </div>
            <div className="appointments-list">
                {appointments.map(appointment => (
                    <div key={appointment.id} className="appointment-card">
                        <div className="appointment-header">
                            <h3>{appointment.vet.name}</h3>
                            <span className={`status ${appointment.status}`}>
                                {appointment.status}
                            </span>
                        </div>
                        <div className="appointment-details">
                            <p><strong>Date:</strong> {appointment.date}</p>
                            <p><strong>Time:</strong> {appointment.time}</p>
                            <p><strong>Specialisation:</strong> {appointment.vet.specialisation}</p>
                            <p><strong>Location:</strong> {appointment.vet.location}</p>
                            <p><strong>Contact:</strong> {appointment.vet.contact}</p>
                        </div>
                        {filter === 'upcoming' && appointment.status !== 'cancelled' && (
                            <button 
                                className="cancel-button"
                                onClick={() => handleCancelAppointment(appointment.id)}
                            >
                                Cancel Appointment
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AppointmentsList;
