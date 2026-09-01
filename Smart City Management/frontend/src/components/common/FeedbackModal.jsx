import React, { useState } from 'react';
import { Star, X, Check, HeartHandshake, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { feedbackAPI } from '../../services/api';

export default function FeedbackModal({ complaint, isOpen, onClose, onFeedbackSubmitted }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');
  const [isSatisfied, setIsSatisfied] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !complaint) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await feedbackAPI.submit(complaint.id, {
        rating,
        comments,
        isSatisfied,
      });

      // Fire confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HeartHandshake color="#10b981" size={24} /> Citizen Satisfaction Rating
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#94a3b8', marginTop: '2px' }}>
              Case: <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{complaint.complaintNumber}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.75rem' }}>
              How satisfied are you with the municipal response & resolution quality?
            </label>
            
            {/* Interactive Stars */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transform: (hoverRating || rating) >= star ? 'scale(1.15)' : 'scale(1)',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  <Star
                    size={36}
                    fill={(hoverRating || rating) >= star ? '#fbbf24' : 'none'}
                    color={(hoverRating || rating) >= star ? '#fbbf24' : '#475569'}
                  />
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 600, marginTop: '6px' }}>
              {rating === 5 && 'Outstanding Resolution'}
              {rating === 4 && 'Very Satisfactory'}
              {rating === 3 && 'Acceptable'}
              {rating === 2 && 'Needs Improvement'}
              {rating === 1 && 'Unsatisfactory'}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isSatisfied}
                onChange={(e) => setIsSatisfied(e.target.checked)}
                style={{ marginRight: '8px', accentColor: '#10b981', width: '16px', height: '16px' }}
              />
              The issue has been completely fixed to my satisfaction.
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">
              Detailed Citizen Feedback / Comments
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Share your appreciation or suggestions for the municipal field engineering team..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-emerald" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={16} className="spin-animation" /> Submitting...
                </>
              ) : (
                <>
                  <Check size={16} /> Submit Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
