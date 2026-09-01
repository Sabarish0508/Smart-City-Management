import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  MapPin, 
  Clock, 
  Calendar, 
  Building2, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  ImageIcon,
  Lock,
  ShieldAlert,
  ArrowRight,
  Filter,
  Eye,
  HeartHandshake,
  Star,
  PlusCircle,
  FileCheck,
  ChevronRight,
  Activity,
  Layers,
  ShieldCheck,
  Check
} from 'lucide-react';
import { complaintsAPI } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import TimelineView from '../components/common/TimelineView';
import FeedbackModal from '../components/common/FeedbackModal';

export default function PublicTrackPage() {
  const { complaintNumber: paramNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isCitizen } = useAuth();

  const [searchNumber, setSearchNumber] = useState(paramNumber || '');
  const [searchedComplaint, setSearchedComplaint] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [myComplaintsList, setMyComplaintsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTimeline, setLoadingTimeline] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedForFeedback, setSelectedForFeedback] = useState(null);
  const [error, setError] = useState('');
  const [unauthSearchedNumber, setUnauthSearchedNumber] = useState('');

  // 1. If authenticated, fetch the user's complaints directory
  const loadMyComplaints = async () => {
    if (!isAuthenticated) return;
    try {
      let list;
      if (isCitizen) {
        list = await complaintsAPI.getMyComplaints({
          status: statusFilter || undefined,
        });
      } else {
        list = await complaintsAPI.getAll({
          status: statusFilter || undefined,
        });
      }
      setMyComplaintsList(list || []);
    } catch (e) {
      console.error('Failed to load complaints directory', e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadMyComplaints();
    }
  }, [isAuthenticated, statusFilter]);

  // 2. Perform Complaint Lookup
  const performSearch = async (numToSearch) => {
    const term = (numToSearch || searchNumber || '').trim();
    if (!term) return;
    setError('');

    if (!isAuthenticated) {
      // Unauthenticated search: store the searched number and display the secure auth prompt
      setUnauthSearchedNumber(term);
      setSearchedComplaint(null);
      return;
    }

    setLoading(true);
    try {
      const data = await complaintsAPI.track(term);
      if (!data) {
        setError(`No complaint found with Case Reference Number: "${term}". Please check the number and try again.`);
        setSearchedComplaint(null);
        setTimeline([]);
      } else {
        setSearchedComplaint(data);
        fetchTimeline(data.id);
      }
    } catch (err) {
      setError(err.message || `Unable to locate complaint "${term}".`);
      setSearchedComplaint(null);
      setTimeline([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async (complaintId) => {
    setLoadingTimeline(true);
    try {
      const tl = await complaintsAPI.getTimeline(complaintId);
      setTimeline(tl || []);
    } catch (e) {
      console.error('Failed to load timeline', e);
    } finally {
      setLoadingTimeline(false);
    }
  };

  useEffect(() => {
    if (paramNumber) {
      setSearchNumber(paramNumber);
      performSearch(paramNumber);
    }
  }, [paramNumber, isAuthenticated]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchNumber.trim()) return;
    performSearch(searchNumber);
  };

  const handleSelectFromList = (complaint) => {
    setSearchNumber(complaint.complaintNumber);
    setSearchedComplaint(complaint);
    fetchTimeline(complaint.id);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '1280px' }}>
      {/* 1. DEDICATED TRACK ISSUE HERO BANNER */}
      <div
        className="glass-card"
        style={{
          padding: '2.5rem 2rem',
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
          borderLeft: '4px solid #38bdf8',
          marginBottom: '2rem',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Real-Time Incident Tracking
        </span>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#f8fafc', margin: '6px 0 10px' }}>
          Track Civic Complaint Status
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.98rem', maxWidth: '720px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
          Enter your official Grievance Reference Number to inspect real-time progress, assigned municipal department, SLA deadlines, field engineer notes, and verified resolution evidence.
        </p>

        {/* Search Bar Form */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            maxWidth: '620px',
            margin: '0 auto',
            display: 'flex',
            gap: '8px',
            background: 'rgba(15, 23, 42, 0.85)',
            padding: '6px',
            borderRadius: '12px',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '12px', color: '#38bdf8' }}>
            <Search size={20} />
          </div>
          <input
            type="text"
            className="form-input"
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '1rem',
              color: '#f8fafc',
              padding: '0.6rem 0.5rem',
            }}
            placeholder="Enter Case # (e.g. CMP-2026-000101)..."
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              padding: '0.65rem 1.5rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              flexShrink: 0,
            }}
            disabled={loading}
          >
            {loading ? <Loader2 size={18} className="spin-animation" /> : 'Track Status'}
          </button>
        </form>
      </div>

      {/* 2. ERROR NOTIFICATION */}
      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '2rem',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <AlertCircle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* 3. UNAUTHENTICATED SEARCH RESULT CARD (Privacy Protection) */}
      {!isAuthenticated && unauthSearchedNumber && (
        <div
          className="glass-card"
          style={{
            padding: '2.5rem',
            textAlign: 'center',
            maxWidth: '680px',
            margin: '0 auto 2.5rem',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            boxShadow: '0 12px 32px -4px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid #38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Lock size={26} color="#38bdf8" />
          </div>

          <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
            Case Found in Municipal Register
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px', marginBottom: '8px' }}>
            Grievance Reference: <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{unauthSearchedNumber}</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            To protect citizen privacy, confidential grievance details, location maps, field officer notes, and resolution proof are accessible to authorized registered citizens and municipal personnel.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to={`/login?redirect=/track/${encodeURIComponent(unauthSearchedNumber)}`}
              className="btn btn-primary btn-lg"
              style={{ padding: '0.8rem 1.75rem', fontWeight: 700, background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' }}
            >
              <Lock size={16} /> Sign In to View Full Case Dossier
            </Link>

            <Link to="/register" className="btn btn-secondary btn-lg" style={{ padding: '0.8rem 1.5rem' }}>
              Create Citizen Account
            </Link>
          </div>
        </div>
      )}

      {/* 4. AUTHENTICATED SEARCHED COMPLAINT DOSSIER */}
      {isAuthenticated && searchedComplaint && (
        <div
          className="glass-card"
          style={{
            padding: '2.5rem',
            marginBottom: '2.5rem',
            borderTop: '4px solid #38bdf8',
          }}
        >
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1rem', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 800 }}>
                  {searchedComplaint.complaintNumber}
                </span>
                <PriorityBadge priority={searchedComplaint.priority} />
                <StatusBadge status={searchedComplaint.status} />

                {searchedComplaint.status === 'RESOLVED' && !searchedComplaint.feedback && isCitizen && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', color: '#fde68a', padding: '2px 8px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <HeartHandshake size={12} /> Feedback Pending
                  </span>
                )}

                {searchedComplaint.feedback && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#6ee7b7', padding: '2px 8px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={12} fill="#10b981" /> {searchedComplaint.feedback.rating}/5 Rated
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f8fafc' }}>
                {searchedComplaint.title}
              </h2>
            </div>

            {isCitizen && searchedComplaint.status === 'RESOLVED' && !searchedComplaint.feedback && (
              <button
                type="button"
                className="btn btn-warning btn-lg"
                style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#ffffff', fontWeight: 700 }}
                onClick={() => setSelectedForFeedback(searchedComplaint)}
              >
                <HeartHandshake size={16} /> Provide Citizen Feedback
              </button>
            )}
          </div>

          {/* Citizen Description */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
              Citizen Incident Description
            </div>
            <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.65 }}>
              {searchedComplaint.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
              padding: '1.25rem',
              background: 'rgba(15, 23, 42, 0.65)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              marginBottom: '1.75rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Responsible Department</div>
              <div style={{ fontSize: '0.95rem', color: '#38bdf8', fontWeight: 700, marginTop: '2px' }}>
                {searchedComplaint.assignedDepartment?.name || 'Under Automated Triage'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Assigned Field Engineer</div>
              <div style={{ fontSize: '0.95rem', color: '#f8fafc', fontWeight: 600, marginTop: '2px' }}>
                {searchedComplaint.assignedOfficer?.fullName || 'Pending Technical Assignment'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>SLA Target Resolution</div>
              <div style={{ fontSize: '0.95rem', color: '#fbbf24', fontWeight: 700, marginTop: '2px' }}>
                {searchedComplaint.slaDeadline ? new Date(searchedComplaint.slaDeadline).toLocaleString() : 'Standard 48h SLA'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Reported Date</div>
              <div style={{ fontSize: '0.95rem', color: '#f8fafc', marginTop: '2px' }}>
                {new Date(searchedComplaint.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '1.75rem', padding: '1rem', background: 'rgba(15, 23, 42, 0.45)', borderRadius: '10px' }}>
            <MapPin size={20} color="#38bdf8" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 600 }}>
                {searchedComplaint.address}
              </div>
              {searchedComplaint.landmark && (
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                  Landmark: {searchedComplaint.landmark}
                </div>
              )}
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                {searchedComplaint.municipality}, {searchedComplaint.city} {searchedComplaint.pincode ? `- ${searchedComplaint.pincode}` : ''}
              </div>
            </div>
          </div>

          {/* Resolution Evidence Box (when resolved) */}
          {(searchedComplaint.status === 'RESOLVED' || searchedComplaint.status === 'CLOSED') && (
            <div
              style={{
                padding: '1.5rem',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '12px',
                marginBottom: '1.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                <CheckCircle2 size={18} /> Official Field Resolution & Closure Proof
              </div>

              {searchedComplaint.resolutionNotes && (
                <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.6, marginBottom: '1rem' }}>
                  <strong>Field Notes:</strong> {searchedComplaint.resolutionNotes}
                </p>
              )}

              {searchedComplaint.resolutionImageUrl && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#6ee7b7', fontWeight: 700, marginBottom: '6px' }}>
                    Photo Proof Uploaded by Field Engineer:
                  </div>
                  <img
                    src={searchedComplaint.resolutionImageUrl}
                    alt="Resolution Evidence"
                    style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', borderRadius: '10px' }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Citizen Feedback Rating Card */}
          {searchedComplaint.feedback && (
            <div style={{ padding: '1.25rem', background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: '#fbbf24', fontWeight: 700 }}>
                  <Star size={15} fill="#fbbf24" />
                  <span>Citizen Satisfaction Rating: {searchedComplaint.feedback.rating}/5 Stars</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Submitted on {new Date(searchedComplaint.feedback.createdAt).toLocaleDateString()}
                </span>
              </div>
              {searchedComplaint.feedback.comments && (
                <p style={{ fontSize: '0.88rem', color: '#cbd5e1', fontStyle: 'italic', margin: 0 }}>
                  "{searchedComplaint.feedback.comments}"
                </p>
              )}
            </div>
          )}

          {/* Milestone Audit Timeline */}
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#38bdf8" /> Official Case Audit Trail & Milestones
            </h3>

            {loadingTimeline ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#38bdf8' }}>
                <Loader2 size={24} className="spin-animation" style={{ margin: '0 auto 8px' }} />
                Loading audit trail...
              </div>
            ) : (
              <TimelineView timeline={timeline} currentStatus={searchedComplaint.status} />
            )}
          </div>
        </div>
      )}

      {/* 5. AUTHENTICATED USER'S COMPLAINTS DIRECTORY */}
      {isAuthenticated && (
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>
                {isCitizen ? 'My Reported Grievances' : 'Authorized Grievances Directory'}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '2px' }}>
                Click any case to inspect full resolution details, field assignments, and timeline.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn btn-sm ${statusFilter === '' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter('')}
              >
                All ({myComplaintsList.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${statusFilter === 'IN_PROGRESS' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter('IN_PROGRESS')}
              >
                In Progress
              </button>
              <button
                type="button"
                className={`btn btn-sm ${statusFilter === 'RESOLVED' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter('RESOLVED')}
              >
                Resolved
              </button>
            </div>
          </div>

          {myComplaintsList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <p>No complaints found matching this filter.</p>
              {isCitizen && (
                <Link to="/report" className="btn btn-emerald btn-sm" style={{ marginTop: '1rem' }}>
                  <PlusCircle size={14} /> Report a Civic Issue
                </Link>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {myComplaintsList.map((c) => {
                const isSelected = searchedComplaint?.id === c.id;
                return (
                  <div
                    key={c.id}
                    className="glass-card glass-card-interactive"
                    onClick={() => handleSelectFromList(c)}
                    style={{
                      padding: '1.25rem',
                      cursor: 'pointer',
                      borderLeft: isSelected ? '4px solid #38bdf8' : '4px solid transparent',
                      background: isSelected ? 'rgba(56, 189, 248, 0.08)' : undefined,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700 }}>
                        {c.complaintNumber}
                      </span>
                      <StatusBadge status={c.status} />
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
                      {c.title}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {c.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <span>Dept: {c.assignedDepartment?.name || 'Triage'}</span>
                      <span style={{ color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                        Track <ChevronRight size={13} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Citizen Feedback Modal */}
      <FeedbackModal
        complaint={selectedForFeedback}
        isOpen={!!selectedForFeedback}
        onClose={() => setSelectedForFeedback(null)}
        onFeedbackSubmitted={() => {
          if (searchedComplaint) {
            performSearch(searchedComplaint.complaintNumber);
          }
          loadMyComplaints();
        }}
      />
    </div>
  );
}
