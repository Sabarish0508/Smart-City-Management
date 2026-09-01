import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  PlusCircle, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  HeartHandshake, 
  MapPin, 
  Loader2, 
  ArrowRight,
  Filter,
  Star,
  MessageSquare
} from 'lucide-react';
import { complaintsAPI } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import FeedbackModal from '../components/common/FeedbackModal';
import TimelineView from '../components/common/TimelineView';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [feedbackRequiredOnly, setFeedbackRequiredOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedForFeedback, setSelectedForFeedback] = useState(null);
  const [selectedForTimeline, setSelectedForTimeline] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  const [error, setError] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await complaintsAPI.getMyComplaints();
      setComplaints(data || []);
    } catch (err) {
      console.error('Failed to load citizen complaints', err);
      setError('Unable to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const openTimelineModal = async (complaint) => {
    setSelectedForTimeline(complaint);
    setLoadingTimeline(true);
    try {
      const timeline = await complaintsAPI.getTimeline(complaint.id);
      setTimelineData(timeline || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTimeline(false);
    }
  };

  // Clickable KPI Handlers for Drill-Down
  const handleKpiClick = (type) => {
    setFeedbackRequiredOnly(false);
    if (type === 'TOTAL') {
      setStatusFilter('');
    } else if (type === 'ACTIVE') {
      setStatusFilter('ACTIVE');
    } else if (type === 'RESOLVED') {
      setStatusFilter('RESOLVED');
    } else if (type === 'FEEDBACK_REQUIRED') {
      setStatusFilter('RESOLVED');
      setFeedbackRequiredOnly(true);
    }
  };

  const totalCount = complaints.length;
  const inProgressCount = complaints.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length;
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
  const feedbackNeededCount = complaints.filter((c) => (c.status === 'RESOLVED' || c.status === 'CLOSED') && !c.feedback).length;

  const displayComplaints = complaints.filter((c) => {
    if (feedbackRequiredOnly) {
      return (c.status === 'RESOLVED' || c.status === 'CLOSED') && !c.feedback;
    }
    if (statusFilter) {
      if (statusFilter === 'ACTIVE') {
        if (c.status === 'RESOLVED' || c.status === 'CLOSED') return false;
      } else if (statusFilter === 'RESOLVED') {
        if (c.status !== 'RESOLVED' && c.status !== 'CLOSED') return false;
      } else if (c.status !== statusFilter) {
        return false;
      }
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const numMatch = c.complaintNumber?.toLowerCase().includes(q);
      const titleMatch = c.title?.toLowerCase().includes(q);
      const addrMatch = c.address?.toLowerCase().includes(q);
      const descMatch = c.description?.toLowerCase().includes(q);
      if (!numMatch && !titleMatch && !addrMatch && !descMatch) return false;
    }
    return true;
  });

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '1240px' }}>
      {/* Welcome Banner */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(30, 41, 59, 0.7) 100%)',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Citizen Portal
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
            Welcome back, {user?.fullName || 'Citizen'}
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
            {user?.address ? `${user.address} | ` : ''}{user?.municipality || 'Central City Municipal Corporation'} &bull; {user?.ward ? `Ward: ${user.ward}` : ''}
          </p>
        </div>

        <Link to="/report" className="btn btn-emerald btn-lg">
          <PlusCircle size={18} /> Report a Civic Issue
        </Link>
      </div>

      {/* KPI Counters - CLICKABLE FOR DRILL-DOWN */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div 
          className="glass-card glass-card-interactive" 
          style={{ padding: '1.25rem', cursor: 'pointer', borderTop: '3px solid #38bdf8' }}
          onClick={() => handleKpiClick('TOTAL')}
          title="Click to view all your reported issues"
        >
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>My Reported Issues</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            {totalCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Click to view all</div>
        </div>

        <div 
          className="glass-card glass-card-interactive" 
          style={{ padding: '1.25rem', cursor: 'pointer', borderTop: '3px solid #fbbf24' }}
          onClick={() => handleKpiClick('ACTIVE')}
          title="Click to view issues in progress"
        >
          <div style={{ fontSize: '0.8rem', color: '#fde68a', fontWeight: 600 }}>In Active Resolution</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
            {inProgressCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Click to view active</div>
        </div>

        <div 
          className="glass-card glass-card-interactive" 
          style={{ padding: '1.25rem', cursor: 'pointer', borderTop: '3px solid #10b981' }}
          onClick={() => handleKpiClick('RESOLVED')}
          title="Click to view resolved cases"
        >
          <div style={{ fontSize: '0.8rem', color: '#86efac', fontWeight: 600 }}>Resolved & Audited</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {resolvedCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Click to view resolved</div>
        </div>

        <div 
          className="glass-card glass-card-interactive" 
          style={{ padding: '1.25rem', cursor: 'pointer', borderTop: '3px solid #f59e0b' }}
          onClick={() => handleKpiClick('FEEDBACK_REQUIRED')}
          title="Click to view resolved issues awaiting your rating"
        >
          <div style={{ fontSize: '0.8rem', color: '#fde68a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <HeartHandshake size={14} /> Feedback Required
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: feedbackNeededCount > 0 ? '#f59e0b' : '#94a3b8', marginTop: '4px' }}>
            {feedbackNeededCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Awaiting your rating</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn btn-sm ${statusFilter === '' && !feedbackRequiredOnly ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setStatusFilter('');
              setFeedbackRequiredOnly(false);
            }}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${statusFilter === 'SUBMITTED' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setStatusFilter('SUBMITTED');
              setFeedbackRequiredOnly(false);
            }}
          >
            Submitted
          </button>
          <button
            type="button"
            className={`btn btn-sm ${statusFilter === 'IN_PROGRESS' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setStatusFilter('IN_PROGRESS');
              setFeedbackRequiredOnly(false);
            }}
          >
            In Progress
          </button>
          <button
            type="button"
            className={`btn btn-sm ${statusFilter === 'RESOLVED' && !feedbackRequiredOnly ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setStatusFilter('RESOLVED');
              setFeedbackRequiredOnly(false);
            }}
          >
            Resolved ({resolvedCount})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${feedbackRequiredOnly ? 'btn-warning' : 'btn-secondary'}`}
            style={{ background: feedbackRequiredOnly ? '#f59e0b' : undefined, color: feedbackRequiredOnly ? '#ffffff' : undefined }}
            onClick={() => {
              setStatusFilter('RESOLVED');
              setFeedbackRequiredOnly(true);
            }}
          >
            Feedback Required ({feedbackNeededCount})
          </button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '6px' }}>
          <input
            type="text"
            className="form-input"
            style={{ width: '240px', padding: '0.45rem 0.8rem', fontSize: '0.85rem' }}
            placeholder="Search my issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary btn-sm">
            <Search size={14} />
          </button>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.5rem', border: '1px solid #ef4444' }}>
          <AlertCircle size={32} color="#ef4444" style={{ margin: '0 auto 8px' }} />
          <h3 style={{ color: '#fca5a5', fontSize: '1rem', marginBottom: '0.5rem' }}>{error}</h3>
          <button onClick={fetchComplaints} className="btn btn-secondary btn-sm">Try Again</button>
        </div>
      )}

      {/* Complaints List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#38bdf8' }}>
          <Loader2 size={32} className="spin-animation" style={{ margin: '0 auto 8px' }} />
          <p>Loading complaints...</p>
        </div>
      ) : displayComplaints.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <AlertCircle size={40} color="#64748b" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '0.4rem' }}>
            No complaints found
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            {feedbackRequiredOnly ? 'No resolved complaints currently awaiting feedback.' : statusFilter ? 'No issues matching this status filter.' : 'You have not reported any civic issues yet.'}
          </p>
          <Link to="/report" className="btn btn-primary btn-sm">
            <PlusCircle size={15} /> Report an Issue Now
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {displayComplaints.map((c) => {
            const isResolved = c.status === 'RESOLVED' || c.status === 'CLOSED';
            const hasFeedback = !!c.feedback;

            return (
              <div key={c.id} className="glass-card" style={{ padding: '1.5rem', borderLeft: isResolved && !hasFeedback ? '4px solid #f59e0b' : undefined }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700 }}>
                        {c.complaintNumber}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>•</span>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>

                      {/* Prominent Mandatory Feedback Status Badges */}
                      {isResolved && !hasFeedback && (
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', color: '#fde68a', padding: '2px 8px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <HeartHandshake size={12} /> Feedback Required
                        </span>
                      )}

                      {isResolved && hasFeedback && (
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#6ee7b7', padding: '2px 8px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Star size={11} fill="#10b981" /> Feedback Submitted ({c.feedback.rating}/5)
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                      {c.title}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <PriorityBadge priority={c.priority} />
                    <StatusBadge status={c.status} />
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {c.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
                  <MapPin size={14} color="#38bdf8" />
                  <span>{c.address}</span>
                  {c.landmark && <span>(Near {c.landmark})</span>}
                </div>

                {/* If citizen already provided feedback, show satisfaction card */}
                {hasFeedback && (
                  <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700, marginBottom: '2px' }}>
                      <span>Your Rating:</span>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} fill={i < c.feedback.rating ? '#fbbf24' : 'none'} color="#fbbf24" />
                      ))}
                      <span style={{ color: '#94a3b8', fontSize: '0.75rem', marginLeft: '4px' }}>({c.feedback.rating}/5)</span>
                    </div>
                    {c.feedback.comments && (
                      <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: 0 }}>"{c.feedback.comments}"</p>
                    )}
                  </div>
                )}

                {/* Bottom Action Row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Department: <strong style={{ color: '#e2e8f0' }}>{c.assignedDepartment?.name || 'Assigned by AI'}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {/* Audit Timeline Button */}
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => openTimelineModal(c)}
                    >
                      <Clock size={14} /> Audit Log
                    </button>

                    {/* Prominent Feedback Button if Resolved and feedback not yet submitted */}
                    {isResolved && !hasFeedback && (
                      <button
                        type="button"
                        className="btn btn-warning btn-sm"
                        style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#ffffff', fontWeight: 700 }}
                        onClick={() => setSelectedForFeedback(c)}
                      >
                        <HeartHandshake size={14} /> Provide Citizen Feedback
                      </button>
                    )}

                    {/* Track Issue Link */}
                    <Link to={`/track/${c.complaintNumber}`} className="btn btn-outline btn-sm">
                      <Eye size={14} /> Track Issue
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Citizen Feedback Modal */}
      <FeedbackModal
        complaint={selectedForFeedback}
        isOpen={!!selectedForFeedback}
        onClose={() => setSelectedForFeedback(null)}
        onFeedbackSubmitted={fetchComplaints}
      />

      {/* Timeline Modal */}
      {selectedForTimeline && (
        <div className="modal-overlay" onClick={() => setSelectedForTimeline(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                  Audit Trail: {selectedForTimeline.complaintNumber}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{selectedForTimeline.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedForTimeline(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            {loadingTimeline ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#38bdf8' }}>
                <Loader2 size={24} className="spin-animation" style={{ margin: '0 auto 8px' }} />
                Loading audit trail...
              </div>
            ) : (
              <TimelineView timeline={timelineData} currentStatus={selectedForTimeline.status} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
