import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './Feedback.css';

const Feedback = () => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setMessage('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:8888/user/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    rating,
                    comment
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                setMessage('Thank you for your feedback!');
                setRating(0);
                setComment('');
            } else {
                setMessage(data.message || 'Failed to submit feedback. Please try again.');
            }
        } catch (error) {
            setMessage('Failed to submit feedback. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="feedback-container">
            <h2>Website Feedback</h2>
            {message && <div className={message.includes('Thank you') ? 'success-message' : 'error-message'}>{message}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="rating">
                    {[...Array(5)].map((star, index) => {
                        const ratingValue = index + 1;
                        return (
                            <label key={index}>
                                <input
                                    type="radio"
                                    name="rating"
                                    value={ratingValue}
                                    onClick={() => setRating(ratingValue)}
                                />
                                <FaStar
                                    className="star"
                                    color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                    size={40}
                                    onMouseEnter={() => setHover(ratingValue)}
                                    onMouseLeave={() => setHover(0)}
                                />
                            </label>
                        );
                    })}
                </div>

                <div className="form-group">
                    <label htmlFor="comment">Comments (Optional):</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us what you think..."
                    />
                </div>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>
        </div>
    );
};

export default Feedback;
