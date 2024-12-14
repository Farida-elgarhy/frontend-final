import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './VetFeedback.css';

const VetFeedback = () => {
    const { vetId } = useParams();
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState({
        rating: 5,
        comment: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleFeedback = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:8888/user/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    vetId,
                    ...feedback
                }),
            });

            const data = await response.json();
            
            if (response.ok && data.success) {
                alert('Feedback submitted successfully!');
                navigate('/vets');
            } else {
                throw new Error(data.message || 'Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert(error.message || 'Failed to submit feedback. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="feedback-container">
            <h2>Leave Feedback</h2>
            <div className="feedback-form">
                <div className="rating-select">
                    <label>Rating:</label>
                    <select
                        value={feedback.rating}
                        onChange={(e) => setFeedback({...feedback, rating: Number(e.target.value)})}
                    >
                        {[5,4,3,2,1].map(num => (
                            <option key={num} value={num}>{num} Stars</option>
                        ))}
                    </select>
                </div>
                <div className="comment-area">
                    <label>Comment:</label>
                    <textarea
                        placeholder="Write your feedback here..."
                        value={feedback.comment}
                        onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
                    />
                </div>
                <div className="feedback-buttons">
                    <button 
                        className="submit-btn"
                        onClick={handleFeedback}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                    <button 
                        className="cancel-btn"
                        onClick={() => navigate('/vets')}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VetFeedback;
