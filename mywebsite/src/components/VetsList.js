import { useState, useEffect, useCallback } from 'react';
import './VetsList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const VetsList = () => {
    const [vets, setVets] = useState([]);
    const [filteredVets, setFilteredVets] = useState([]);
    const [selectedVet, setSelectedVet] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState({ rating: 5, comment: '' });
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchVets();
    }, []);

    const filterVets = useCallback(() => {
        if (!searchTerm.trim()) {
            setFilteredVets(vets);
            return;
        }

        const term = searchTerm.toLowerCase();
        const filtered = vets.filter(vet => {
            return (
                vet.name.toLowerCase().includes(term) ||
                vet.specialisation.toLowerCase().includes(term) ||
                vet.location.toLowerCase().includes(term)
            );
        });
        setFilteredVets(filtered);
    }, [searchTerm, vets]);

    useEffect(() => {
        filterVets();
    }, [filterVets]);

    const fetchVets = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await fetch('http://localhost:8888/vets', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Please log in to view veterinarians');
                }
                throw new Error('Failed to fetch vets');
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch vets');
            }

            setVets(data.vets || []);
            setFilteredVets(data.vets || []);
        } catch (err) {
            console.error('Error fetching vets:', err);
            setError(err.message || 'Failed to load vets');
            setVets([]);
            setFilteredVets([]);
        } finally {
            setIsLoading(false);
        }
    };

    const getAvailableSlots = async (vetId, date) => {
        try {
            const dateParam = date ? `?date=${date}` : '';
            const response = await fetch(`http://localhost:8888/vets/${vetId}/available-slots${dateParam}`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Please log in to view available slots');
                }
                throw new Error('Failed to fetch available slots');
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Failed to get available slots');
            }
            
            setAvailableSlots(data.availableSlots || []);
        } catch (err) {
            setError(err.message);
            setAvailableSlots([]);
        }
    };

    const handleVetSelection = async (vet) => {
        try {
            setIsLoading(true);
            setError('');
            setSelectedVet(vet);
            
            // Get today's available slots by default
            await getAvailableSlots(vet.id);
            
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateChange = async (date) => {
        setSelectedDate(date);
        if (selectedVet) {
            await getAvailableSlots(selectedVet.id, date);
        }
    };

    const handleBookAppointment = async () => {
        if (!selectedSlot) {
            setError('Please select a time slot');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            
            const response = await fetch(`http://localhost:8888/vets/${selectedVet.id}/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    appointmentdate: selectedDate,
                    appointmenttime: selectedSlot
                }),
                credentials: 'include'
            });

            const data = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Booking failed');
            }

            alert('Appointment booked successfully!');
            
            // Refresh available slots and clear selection
            await getAvailableSlots(selectedVet.id, selectedDate);
            setSelectedSlot('');
            
            // Remove the booked slot from availableSlots
            setAvailableSlots(prevSlots => prevSlots.filter(slot => slot !== selectedSlot));
            
            // Clear the slot selection
            setSelectedSlot('');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFeedback = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await fetch(`http://localhost:8888/vets/${selectedVet.id}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feedback),
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Please log in to submit feedback');
                }
                throw new Error('Failed to submit feedback');
            }
            const data = await response.json();
            alert(data.message || 'Feedback submitted successfully!');
            setShowFeedbackForm(false);
            setFeedback({ rating: 5, comment: '' });
        } catch (err) {
            setError(err.message || 'Failed to submit feedback');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
    };

    return (
        <div className="vets-container">
            <h2>Find a Veterinarian</h2>
            
            <div className="search-section">
                <div className="search-container">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search veterinarians..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            
            {isLoading ? (
                <div className="loading">Loading veterinarians...</div>
            ) : (
                <div className="vets-list">
                    {filteredVets.length > 0 ? (
                        filteredVets.map(vet => (
                            <div key={vet.id} className="vet-card">
                                <h3>{vet.name}</h3>
                                <div className="vet-info">
                                    <p><strong>Specialization:</strong> {vet.specialisation}</p>
                                    <p><strong>Phone:</strong> {vet.phonenumber}</p>
                                    <p><strong>Email:</strong> {vet.email}</p>
                                    <p><strong>Location:</strong> {vet.location}</p>
                                    <p><strong>Rating:</strong> {vet.rating.toFixed(1)} </p>
                                </div>
                                <button 
                                    onClick={() => handleVetSelection(vet)}
                                    className="select-vet-btn"
                                >
                                    View Available Slots
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedVet(vet);
                                        setShowFeedbackForm(true);
                                    }}
                                    className="leave-feedback-btn"
                                >
                                    Leave Feedback
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            <h3>No veterinarians found</h3>
                            <p>Try adjusting your search</p>
                        </div>
                    )}
                </div>
            )}
            
            {selectedVet && (
                <div className="booking-section">
                    <h3>Book Appointment with {selectedVet.name}</h3>
                    <div className="date-picker">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                handleDateChange(e.target.value);
                            }}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    {availableSlots.length > 0 ? (
                        <div className="slots-grid">
                            {availableSlots.map((slot, index) => (
                                <button
                                    key={index}
                                    className="slot-button"
                                    onClick={() => handleSlotSelect(slot)}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="no-slots-message">No available slots for this date</p>
                    )}

                    {selectedSlot && (
                        <div className="booking-actions">
                            <button 
                                className="confirm-button" 
                                onClick={handleBookAppointment}
                            >
                                Confirm Booking
                            </button>
                            <button 
                                className="cancel-button"
                                onClick={() => setSelectedSlot(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            )}
            
            {showFeedbackForm && (
                <div className="feedback-modal">
                    <div className="feedback-content">
                        <h3>Leave Feedback for {selectedVet.name}</h3>
                        <div className="rating-select">
                            <select
                                value={feedback.rating}
                                onChange={(e) => setFeedback({...feedback, rating: Number(e.target.value)})}
                            >
                                {[5,4,3,2,1].map(num => (
                                    <option key={num} value={num}>{num} Stars</option>
                                ))}
                            </select>
                        </div>
                        <textarea
                            placeholder="Write your feedback here..."
                            value={feedback.comment}
                            onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
                        />
                        <div className="feedback-actions">
                            <button 
                                onClick={handleFeedback}
                                className="submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Submitting...' : 'Submit'}
                            </button>
                            <button 
                                onClick={() => {
                                    setShowFeedbackForm(false);
                                    setFeedback({ rating: 5, comment: '' });
                                }}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VetsList;
