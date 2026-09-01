import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Wrench, 
  Clock, 
  MapPin, 
  Navigation, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  ExternalLink,
  ShieldAlert,
  Calendar,
  RefreshCw,
  Search,
  Filter,
  Layers,
  Check,
  Building2,
  AlertCircle,
  Star,
  HeartHandshake,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { complaintsAPI, departmentsAPI, categoriesAPI, feedbackAPI, analyticsAPI } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import StatusUpdateModal from '../components/common/StatusUpdateModal';
import TimelineView from '../components/common/TimelineView';
import CivicMap from '../components/common/CivicMap';

export default function OfficerDashboard() {
  const { user } = useAuth();
  const [allComplaints, setAllComplaints] = useState([]);
  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [dbStats, setDbStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Active Tab: 'all-cases' | 'my-tasks' | 'feedback' | 'map'
  const [activeTab, setActiveTab] = useState('all-cases');

  // Filters
  const [filterDept, setFilterDept] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterOverdueOnly, setFilterOverdueOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedForUpdate, setSelectedForUpdate] = useState(null);
  const [selectedForTimeline, setSelectedForTimeline] = useState(null);
  const [timelineData, setTimelineData] = useState([]);

  const fetchFieldData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    try {
      const [allComp, myAssigned, depts, cats, fb, statsRes] = await Promise.all([
        complaintsAPI.getAll().catch(() => []),
        complaintsAPI.getMyAssignedComplaints().catch(() => []),
        departmentsAPI.getAll().catch(() => []),
        categoriesAPI.getAll().catch(() => []),
        feedbackAPI.getAll().catch(() => []),
        analyticsAPI.getDashboardStats().catch(() => null),
      ]);

      if (Array.isArray(allComp)) {
        setAllComplaints(allComp);
      }
      if (Array.isArray(myAssigned)) {
        setAssignedComplaints(myAssigned);
      }
      if (Array.isArray(depts)) {
        setDepartments(depts);
      }
      if (Array.isArray(cats)) {
        setCategories(cats);
      }
      if (Array.isArray(fb)) {
        setFeedbackList(fb);
      }
      if (statsRes) {
        setDbStats(statsRes);
      }
    } catch (err) {
      console.error('Failed to load municipal official operational data', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFieldData();

    // Periodic sync so new citizen complaints update the dashboard count live
    const interval = setInterval(() => {
      fetchFieldData(false);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const openTimeline = async (c) => {
    setSelectedForTimeline(c);
    try {
      const tl = await complaintsAPI.getTimeline(c.id);
      setTimelineData(tl || []);
    } catch (e) {
      console.error('Failed to load complaint timeline', e);
    }
  };

  const getSlaStatus = (deadline) => {
    if (!deadline) return { text: 'No SLA Defined', color: '#94a3b8' };
    const diff = new Date(deadline) - new Date();
    const hours = Math.round(diff / (1000 * 60 * 60));
    if (hours < 0) return { text: `SLA Breached (${Math.abs(hours)}h overdue)`, color: '#ef4444' };
    if (hours < 24) return { text: `${hours}h Remaining`, color: '#f59e0b' };
    return { text: `${Math.round(hours / 24)} days left`, color: '#10b981' };
  };

  // Base list depending on active tab
  const currentBaseList = activeTab === 'my-tasks' ? assignedComplaints : allComplaints;

  // Filter complaints client-side to preserve KPI counters
  const filteredList = currentBaseList.filter((c) => {
    if (filterOverdueOnly) {
      if (c.status === 'RESOLVED' || c.status === 'CLOSED') return false;
      if (!c.slaDeadline || new Date(c.slaDeadline) >= new Date()) return false;
    }
    if (filterDept && c.assignedDepartment?.id !== Number(filterDept)) return false;
    if (filterCategory && c.category?.id !== Number(filterCategory)) return false;
    if (filterStatus) {
      if (filterStatus === 'ACTIVE') {
        if (c.status === 'RESOLVED' || c.status === 'CLOSED') return false;
      } else if (c.status !== filterStatus) {
        return false;
      }
    }
    if (filterPriority && c.priority !== filterPriority) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const numMatch = c.complaintNumber?.toLowerCase().includes(q);
      const titleMatch = c.title?.toLowerCase().includes(q);
      const addrMatch = c.address?.toLowerCase().includes(q);
      const citizenMatch = c.citizen?.fullName?.toLowerCase().includes(q);
      const deptMatch = c.assignedDepartment?.name?.toLowerCase().includes(q);
      if (!numMatch && !titleMatch && !addrMatch && !citizenMatch && !deptMatch) return false;
    }
    return true;
  }).sort((a, b) => {
    const priorityWeight = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
    const weightA = priorityWeight[a.priority] || 0;
    const weightB = priorityWeight[b.priority] || 0;
    if (weightB !== weightA) {
      return weightB - weightA; // Highest priority first
    }
    // If same priority, sort by SLA urgency or newest created
    if (a.slaDeadline && b.slaDeadline) {
      return new Date(a.slaDeadline) - new Date(b.slaDeadline);
    }
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  // KPI Calculations across complete authorized municipal database records
  const totalMunicipalCases = allComplaints.length;
  const activeCases = allComplaints.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length;
  const criticalCases = allComplaints.filter(c => (c.priority === 'CRITICAL' || c.priority === 'HIGH') && c.status !== 'RESOLVED' && c.status !== 'CLOSED').length;
  const overdueCasesList = allComplaints.filter(c => {
    if (c.status === 'RESOLVED' || c.status === 'CLOSED') return false;
    if (!c.slaDeadline) return false;
    return new Date(c.slaDeadline) < new Date();
  });
  const overdueCases = overdueCasesList.length;
  const resolvedCases = allComplaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;

  // Clickable KPI Handlers for Drill-Down
  const handleOfficerKpiClick = (type) => {
    setActiveTab('all-cases');
    if (type === 'TOTAL') {
      setFilterStatus('');
      setFilterPriority('');
      setFilterDept('');
      setFilterCategory('');
      setFilterOverdueOnly(false);
    } else if (type === 'ACTIVE') {
      setFilterStatus('ACTIVE');
      setFilterPriority('');
      setFilterDept('');
      setFilterCategory('');
      setFilterOverdueOnly(false);
    } else if (type === 'CRITICAL') {
      setFilterStatus('');
      setFilterPriority('CRITICAL');
      setFilterDept('');
      setFilterCategory('');
      setFilterOverdueOnly(false);
    } else if (type === 'OVERDUE') {
      setFilterStatus('');
      setFilterPriority('');
      setFilterDept('');
      setFilterCategory('');
      setFilterOverdueOnly(true);
    } else if (type === 'RESOLVED') {
      setFilterStatus('RESOLVED');
      setFilterPriority('');
      setFilterDept('');
      setFilterCategory('');
      setFilterOverdueOnly(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '1440px' }}>
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.85) 100%)',
          borderLeft: '4px solid #10b981',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.8rem', color: '#6ee7b7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} /> Municipal Operations Desk
            </span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#6ee7b7', padding: '2px 8px', borderRadius: '9999px' }}>
              Cross-Department Municipal Operations
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc' }}>
            Municipal Official: {user?.fullName}
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '2px' }}>
            {user?.designation || 'Municipal Operations Officer'} &bull; {user?.municipality || 'Central City Municipal Corporation'} &bull; {user?.city || 'Metro City'}
          </p>
        </div>

        {/* Action & View Toggles */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => fetchFieldData(true)} title="Refresh Live Municipal Queue">
            <RefreshCw size={14} className={isRefreshing ? 'spin-animation' : ''} /> {isRefreshing ? 'Syncing...' : 'Refresh Data'}
          </button>

          <div style={{ display: 'flex', gap: '4px', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'all-cases' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('all-cases')}
            >
              All Municipal Cases ({totalMunicipalCases})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'my-tasks' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('my-tasks')}
            >
              My Direct Tasks ({assignedComplaints.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'feedback' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('feedback')}
            >
              Citizen Feedback ({feedbackList.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'map' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('map')}
            >
              <MapPin size={14} /> GIS Heatmap
            </button>
          </div>
        </div>
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
          style={{ padding: '1.25rem', cursor: 'pointer', borderTop: '3px solid #10b981' }}
          onClick={() => handleOfficerKpiClick('TOTAL')}
          title="Click to view all municipal cases"
        >
          <div style={{ fontSize: '0.8rem', color: '#6ee7b7', fontWeight: 600 }}>Total Municipal Cases</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {loading && allComplaints.length === 0 ? <Loader2 size={24} className="spin-animation" /> : totalMunicipalCases}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>All departments active</div>
        </div>

        <div 
          className="glass-card glass-card-interactive" 
          style={{ padding: '1.25rem', cursor: 'pointer', borderTop: '3px solid #38bdf8' }}
          onClick={() => handleOfficerKpiClick('ACTIVE')}
          title="Click to filter active field operations"
        >
          <div style={{ fontSize: '0.8rem', color: '#7dd3fc', fontWeight: 600 }}>Active Field Work</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            {loading && allComplaints.length === 0 ? <Loader2 size={24} className="spin-animation" /> : activeCases}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Click to view active</div>
        </div>

        <div 
          className="glass-card glass-card-interactive" 
          style={{ padding: '1.25rem', cursor: 'pointer', borderTop: '3px solid #ef4444' }}
          onClick={() => handleOfficerKpiClick('CRITICAL')}
          title="Click to filter critical alerts"
        >
          <div style={{ fontSize: '0.8rem', color: '#fca5a5', fontWeight: 600 }}>Critical / Urgent Alerts</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444', marginTop: '4px' }}>
            {loading && allComplaints.length === 0 ? <Loader2 size={24} className="spin-animation" /> : criticalCases}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Click to filter critical</div>
        </div>

        <div 
          className="glass-card glass-card-interactive" 
          style={{ padding: '1.25rem', cursor: 'pointer', borderTop: '3px solid #f43f5e' }}
          onClick={() => handleOfficerKpiClick('OVERDUE')}
          title="Click to filter SLA overdue cases"
        >
          <div style={{ fontSize: '0.8rem', color: '#fca5a5', fontWeight: 600 }}>SLA Overdue Cases</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: overdueCases > 0 ? '#ef4444' : '#94a3b8', marginTop: '4px' }}>
            {loading && allComplaints.length === 0 ? <Loader2 size={24} className="spin-animation" /> : overdueCases}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Click to filter overdue</div>
        </div>

        <div 
          className="glass-card glass-card-interactive" 
          style={{ padding: '1.25rem', cursor: 'pointer', borderTop: '3px solid #059669' }}
          onClick={() => handleOfficerKpiClick('RESOLVED')}
          title="Click to filter resolved cases"
        >
          <div style={{ fontSize: '0.8rem', color: '#a7f3d0', fontWeight: 600 }}>Resolved & Audited</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
            {loading && allComplaints.length === 0 ? <Loader2 size={24} className="spin-animation" /> : resolvedCases}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Click to filter resolved</div>
        </div>
      </div>

      {/* Tabs 1 & 2: Cases & Tasks */}
      {(activeTab === 'all-cases' || activeTab === 'my-tasks') && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          {/* Multi-Department Filter Controls */}
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
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Department Filter (All Municipal Departments) */}
              <select
                className="form-select"
                style={{ width: '180px', padding: '0.45rem 0.6rem', fontSize: '0.825rem' }}
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                className="form-select"
                style={{ width: '170px', padding: '0.45rem 0.6rem', fontSize: '0.825rem' }}
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Priority Filter */}
              <select
                className="form-select"
                style={{ width: '140px', padding: '0.45rem 0.6rem', fontSize: '0.825rem' }}
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>

              {/* Status Filter */}
              <select
                className="form-select"
                style={{ width: '170px', padding: '0.45rem 0.6rem', fontSize: '0.825rem' }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">All Active Field Work</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            {/* Live Search */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                className="form-input"
                style={{ width: '280px', padding: '0.45rem 0.75rem', fontSize: '0.825rem' }}
                placeholder="Search case #, address, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary btn-sm">
                <Search size={14} />
              </button>
            </form>
          </div>

          {/* List of Tasks */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#10b981' }}>
              <Loader2 size={32} className="spin-animation" style={{ margin: '0 auto 8px' }} />
              <p>Fetching authorized municipal grievances...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <CheckCircle2 size={40} color="#10b981" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '4px' }}>
                No complaints matching filter criteria
              </h4>
              <p style={{ fontSize: '0.85rem' }}>
                {activeTab === 'my-tasks' 
                  ? 'You have completed all direct tasks in this queue.' 
                  : 'Adjust filters or search parameters to inspect other municipal records.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredList.map((c) => {
                const sla = getSlaStatus(c.slaDeadline);
                const isAssignedToMe = c.assignedOfficer?.id === user?.id;

                return (
                  <div
                    key={c.id}
                    className="glass-card"
                    style={{
                      padding: '1.5rem',
                      borderLeft: c.priority === 'CRITICAL' ? '4px solid #ef4444' : (c.priority === 'HIGH' ? '4px solid #f59e0b' : '4px solid #10b981'),
                      background: 'rgba(15, 23, 42, 0.65)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.825rem', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700 }}>
                            {c.complaintNumber}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>•</span>
                          <span style={{ fontSize: '0.78rem', color: sla.color, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} /> {sla.text}
                          </span>
                          {c.assignedDepartment && (
                            <>
                              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>•</span>
                              <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                                <Building2 size={11} style={{ display: 'inline', marginRight: '4px' }} />
                                {c.assignedDepartment.name}
                              </span>
                            </>
                          )}
                          {c.assignedOfficer && (
                            <>
                              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>•</span>
                              <span style={{ fontSize: '0.75rem', color: isAssignedToMe ? '#38bdf8' : '#94a3b8', fontWeight: isAssignedToMe ? 700 : 500 }}>
                                {isAssignedToMe ? 'Directly Assigned to You' : `Officer: ${c.assignedOfficer.fullName}`}
                              </span>
                            </>
                          )}
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
                          {c.title}
                        </h3>
                      </div>

                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <PriorityBadge priority={c.priority} />
                        <StatusBadge status={c.status} />
                      </div>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1rem' }}>
                      {c.description}
                    </p>

                    {/* Feedback Rating Banner if Citizen Rated */}
                    {c.feedback && (
                      <div
                        style={{
                          background: 'rgba(245, 158, 11, 0.1)',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          borderRadius: '8px',
                          padding: '0.75rem 1rem',
                          marginBottom: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Star size={15} fill="#f59e0b" color="#f59e0b" />
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fde68a' }}>
                            Citizen Rating: {c.feedback.rating}/5 Stars
                          </span>
                          {c.feedback.comments && (
                            <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                              — "{c.feedback.comments}"
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {new Date(c.feedback.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {/* Official Remarks / Resolution Notes if Any */}
                    {c.officialRemarks && (
                      <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1rem', fontSize: '0.85rem', color: '#93c5fd' }}>
                        <strong>Official Note:</strong> {c.officialRemarks}
                      </div>
                    )}

                    {/* Location, Contact & Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#94a3b8' }}>
                        <MapPin size={15} color="#10b981" />
                        <span>{c.address}</span>
                        {c.landmark && <span>(Near {c.landmark})</span>}
                        {c.citizen?.fullName && <span style={{ color: '#64748b' }}>&bull; Citizen: {c.citizen.fullName}</span>}
                      </div>

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {/* GPS Directions Link for field engineer */}
                        {c.latitude && c.longitude && (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${c.latitude},${c.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-secondary btn-sm"
                            title="Open Google Maps Directions"
                          >
                            <Navigation size={13} /> GPS Directions <ExternalLink size={11} />
                          </a>
                        )}

                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => openTimeline(c)}
                          title="View Case Timeline Audit"
                        >
                          <Clock size={13} /> Audit
                        </button>

                        {/* Status Update Button */}
                        <button
                          type="button"
                          className={c.status === 'RESOLVED' || c.status === 'CLOSED' ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm'}
                          onClick={() => setSelectedForUpdate(c)}
                        >
                          <Activity size={13} /> Update Status & Proof
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Dedicated Citizen Feedback & Reviews Tab */}
      {activeTab === 'feedback' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={18} fill="#f59e0b" color="#f59e0b" /> Municipal Citizen Feedback & Satisfaction Reviews
            </h3>
            <span style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
              {feedbackList.length} verified citizen feedback ratings across municipal operations
            </span>
          </div>

          {feedbackList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem', color: '#94a3b8' }}>
              <HeartHandshake size={36} color="#64748b" style={{ margin: '0 auto 10px' }} />
              <p>No citizen satisfaction reviews have been submitted yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {feedbackList.map((fb) => (
                <div
                  key={fb.id}
                  className="glass-card"
                  style={{
                    padding: '1.25rem',
                    background: 'rgba(15, 23, 42, 0.7)',
                    borderLeft: '4px solid #10b981',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700 }}>
                      {fb.complaint?.complaintNumber || `Review #${fb.id}`}
                    </span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < fb.rating ? '#f59e0b' : 'none'} color="#f59e0b" />
                      ))}
                    </div>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
                    {fb.complaint?.title || 'Resolved Grievance'}
                  </h4>

                  {fb.comments ? (
                    <p style={{ fontSize: '0.88rem', color: '#cbd5e1', fontStyle: 'italic', marginBottom: '0.75rem' }}>
                      "{fb.comments}"
                    </p>
                  ) : (
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                      No textual remarks provided by citizen.
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span>Citizen: {fb.citizen?.fullName || 'Resident'}</span>
                    <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Geospatial Map View */}
      {activeTab === 'map' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#10b981" /> Municipal Incidents Geospatial Map View
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {allComplaints.filter(c => c.latitude && c.longitude).length} mapped incidents across all municipal departments
            </span>
          </div>
          <CivicMap
            height="560px"
            zoom={13}
            markers={allComplaints}
          />
        </div>
      )}

      {/* Status Update Modal */}
      <StatusUpdateModal
        complaint={selectedForUpdate}
        isOpen={!!selectedForUpdate}
        onClose={() => setSelectedForUpdate(null)}
        onStatusUpdated={fetchFieldData}
      />

      {/* Timeline Modal */}
      {selectedForTimeline && (
        <div className="modal-overlay" onClick={() => setSelectedForTimeline(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                  Audit History: {selectedForTimeline.complaintNumber}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{selectedForTimeline.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedForTimeline(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                &times;
              </button>
            </div>
            <TimelineView timeline={timelineData} currentStatus={selectedForTimeline.status} />
          </div>
        </div>
      )}
    </div>
  );
}
