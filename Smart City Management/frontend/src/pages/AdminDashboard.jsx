import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Search, 
  Filter, 
  MapPin, 
  UserCheck, 
  Activity, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  Users, 
  Loader2, 
  RefreshCw, 
  Star, 
  Eye, 
  Briefcase, 
  Layers, 
  ArrowRight, 
  TrendingUp, 
  ShieldAlert, 
  BarChart3, 
  Phone, 
  Mail, 
  X, 
  FileCheck,
  HeartHandshake
} from 'lucide-react';
import { complaintsAPI, departmentsAPI, analyticsAPI, officersAPI } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import CivicMap from '../components/common/CivicMap';
import AssignOfficerModal from '../components/common/AssignOfficerModal';
import StatusUpdateModal from '../components/common/StatusUpdateModal';
import TimelineView from '../components/common/TimelineView';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentStatsList, setDepartmentStatsList] = useState([]);
  const [selectedDeptDetail, setSelectedDeptDetail] = useState(null);
  const [selectedDeptOfficers, setSelectedDeptOfficers] = useState([]);
  const [allOfficials, setAllOfficials] = useState([]);
  const [officerWorkloads, setOfficerWorkloads] = useState([]);
  const [loadingDeptDetail, setLoadingDeptDetail] = useState(false);
  const [loading, setLoading] = useState(true);

  // Active Main View: 'overview' | 'operations' | 'departments' | 'dept-heads' | 'officers-directory' | 'general' | 'feedback' | 'map'
  const [activeMainTab, setActiveMainTab] = useState('overview');

  // Filters
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterOverdueOnly, setFilterOverdueOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [assignModalComplaint, setAssignModalComplaint] = useState(null);
  const [statusModalComplaint, setStatusModalComplaint] = useState(null);
  const [timelineModalComplaint, setTimelineModalComplaint] = useState(null);
  const [timelineData, setTimelineData] = useState([]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    try {
      const [dashStats, compList, deptList, deptStats, officialsList, workloadsList] = await Promise.all([
        analyticsAPI.getDashboardStats().catch(() => null),
        complaintsAPI.getAll().catch(() => []),
        departmentsAPI.getAll().catch(() => []),
        departmentsAPI.getStats().catch(() => []),
        officersAPI.getAllOfficials().catch(() => []),
        officersAPI.getWorkload().catch(() => []),
      ]);

      if (dashStats) setStats(dashStats);
      if (Array.isArray(compList)) setComplaints(compList);
      if (Array.isArray(deptList)) setDepartments(deptList);
      if (Array.isArray(deptStats)) setDepartmentStatsList(deptStats);
      if (Array.isArray(officialsList)) setAllOfficials(officialsList);
      if (Array.isArray(workloadsList)) setOfficerWorkloads(workloadsList);
    } catch (err) {
      console.error('Failed to load Central Administration data', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData(false);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleSelectDepartment = async (dept) => {
    setSelectedDeptDetail(dept);
    setLoadingDeptDetail(true);
    try {
      const offs = await officersAPI.getAll(dept.id);
      setSelectedDeptOfficers(offs || []);
    } catch (err) {
      console.error('Failed to fetch department officers', err);
      setSelectedDeptOfficers([]);
    } finally {
      setLoadingDeptDetail(false);
    }
  };

  const openTimeline = async (c) => {
    setTimelineModalComplaint(c);
    try {
      const tl = await complaintsAPI.getTimeline(c.id);
      setTimelineData(tl || []);
    } catch (e) {
      console.error(e);
    }
  };

  // Clickable KPI Handlers for Drill-Down
  const handleKpiClick = (type) => {
    setActiveMainTab('overview');
    setSelectedDeptDetail(null);
    if (type === 'TOTAL') {
      setFilterStatus('');
      setFilterPriority('');
      setFilterDept('');
      setFilterOverdueOnly(false);
    } else if (type === 'CRITICAL') {
      setFilterStatus('');
      setFilterPriority('CRITICAL');
      setFilterDept('');
      setFilterOverdueOnly(false);
    } else if (type === 'ACTIVE' || type === 'IN_PROGRESS') {
      setFilterStatus('ACTIVE');
      setFilterPriority('');
      setFilterDept('');
      setFilterOverdueOnly(false);
    } else if (type === 'RESOLVED') {
      setFilterStatus('RESOLVED');
      setFilterPriority('');
      setFilterDept('');
      setFilterOverdueOnly(false);
    } else if (type === 'OVERDUE') {
      setFilterStatus('');
      setFilterPriority('');
      setFilterDept('');
      setFilterOverdueOnly(true);
    } else if (type === 'FEEDBACK') {
      setActiveMainTab('feedback');
    }
  };

  // Filtering
  const filteredComplaints = complaints.filter((c) => {
    if (filterOverdueOnly) {
      if (c.status === 'RESOLVED' || c.status === 'CLOSED') return false;
      if (!c.slaDeadline || new Date(c.slaDeadline) >= new Date()) return false;
    }
    if (filterStatus) {
      if (filterStatus === 'ACTIVE') {
        if (c.status === 'RESOLVED' || c.status === 'CLOSED') return false;
      } else if (c.status !== filterStatus) {
        return false;
      }
    }
    if (filterPriority && c.priority !== filterPriority) return false;
    if (filterDept && c.assignedDepartment?.id !== Number(filterDept)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const numMatch = c.complaintNumber?.toLowerCase().includes(q);
      const titleMatch = c.title?.toLowerCase().includes(q);
      const addrMatch = c.address?.toLowerCase().includes(q);
      const citizenMatch = c.citizen?.fullName?.toLowerCase().includes(q);
      if (!numMatch && !titleMatch && !addrMatch && !citizenMatch) return false;
    }
    return true;
  });

  const generalCivicComplaints = complaints.filter(c => !c.assignedDepartment);
  const currentDeptComplaints = selectedDeptDetail 
    ? complaints.filter(c => c.assignedDepartment?.id === selectedDeptDetail.id)
    : [];
  
  const allFeedbackComplaints = complaints.filter(c => !!c.feedback);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '1440px' }}>
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(15, 23, 42, 0.85) 100%)',
          borderLeft: '4px solid #8b5cf6',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.8rem', color: '#c4b5fd', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Building2 size={14} /> Central Administration Command
            </span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid #8b5cf6', color: '#c4b5fd', padding: '2px 8px', borderRadius: '9999px' }}>
              Municipality-Wide Executive Oversight
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#f8fafc' }}>
            Central Administration Dashboard
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '2px' }}>
            Executive Authority: <strong style={{ color: '#f8fafc' }}>{user?.fullName}</strong> &bull; {user?.designation || 'Chief Municipal Commissioner'} &bull; {user?.municipality || 'Central City Municipal Corporation'}
          </p>
        </div>

        {/* Action & Tab Toggles */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={loadData} title="Refresh Live Municipal Data">
            <RefreshCw size={14} /> Refresh
          </button>

          <div style={{ display: 'flex', gap: '4px', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn btn-sm ${activeMainTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setActiveMainTab('overview');
                setSelectedDeptDetail(null);
              }}
            >
              Overview & Cases ({complaints.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeMainTab === 'operations' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveMainTab('operations')}
            >
              <AlertOctagon size={13} color="#ef4444" /> Executive Operations
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeMainTab === 'departments' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveMainTab('departments')}
            >
              Departments ({departments.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeMainTab === 'dept-heads' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveMainTab('dept-heads')}
            >
              <Briefcase size={13} color="#f59e0b" /> Department Heads ({allOfficials.filter(u => u.role === 'ROLE_HEAD').length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeMainTab === 'officers-directory' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveMainTab('officers-directory')}
            >
              <Users size={13} color="#38bdf8" /> Municipal Officers ({allOfficials.filter(u => u.role === 'ROLE_OFFICER').length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeMainTab === 'general' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setActiveMainTab('general');
                setSelectedDeptDetail(null);
              }}
            >
              General Civic ({generalCivicComplaints.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeMainTab === 'feedback' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveMainTab('feedback')}
            >
              <Star size={13} fill="#fbbf24" color="#fbbf24" /> Feedback ({allFeedbackComplaints.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeMainTab === 'map' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveMainTab('map')}
            >
              Geospatial Map
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid - CLICKABLE FOR DRILL-DOWN */}
      {stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          {/* Total Cases */}
          <div 
            className="glass-card glass-card-interactive" 
            style={{ padding: '1.25rem', cursor: 'pointer', borderTop: '3px solid #38bdf8' }}
            onClick={() => handleKpiClick('TOTAL')}
            title="Click to view all municipal cases"
          >
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Total Registered Cases</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
              {stats.totalComplaints}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Click to view all</div>
          </div>

          {/* Critical Hazards */}
          <div 
            className="glass-card glass-card-interactive" 
            style={{ padding: '1.25rem', cursor: 'pointer', borderTop: '3px solid #ef4444' }}
            onClick={() => handleKpiClick('CRITICAL')}
            title="Click to filter Critical Priority complaints"
          >
            <div style={{ fontSize: '0.78rem', color: '#fca5a5', fontWeight: 600 }}>Critical Hazards</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444', marginTop: '4px' }}>
              {stats.criticalComplaints}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Click to filter critical</div>
          </div>

          {/* Active Field Operations / Total Active */}
          <div 
            className="glass-card glass-card-interactive" 
            style={{ padding: '1.25rem', cursor: 'pointer', borderTop: '3px solid #fbbf24' }}
            onClick={() => handleKpiClick('ACTIVE')}
            title="Click to view all active municipal operations"
          >
            <div style={{ fontSize: '0.78rem', color: '#fde68a', fontWeight: 600 }}>Active Field Operations</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
              {stats?.inProgressComplaints ?? complaints.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Click to view active operations</div>
          </div>

          {/* SLA Overdue */}
          <div 
            className="glass-card glass-card-interactive" 
            style={{ padding: '1.25rem', cursor: 'pointer', borderTop: '3px solid #f43f5e' }}
            onClick={() => handleKpiClick('OVERDUE')}
            title="Click to filter SLA Overdue complaints"
          >
            <div style={{ fontSize: '0.78rem', color: '#fca5a5', fontWeight: 600 }}>SLA Overdue Alerts</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: stats.overdueComplaints > 0 ? '#ef4444' : '#94a3b8', marginTop: '4px' }}>
              {stats.overdueComplaints}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Click to filter overdue</div>
          </div>

          {/* Resolved */}
          <div 
            className="glass-card glass-card-interactive" 
            style={{ padding: '1.25rem', cursor: 'pointer', borderTop: '3px solid #10b981' }}
            onClick={() => handleKpiClick('RESOLVED')}
            title="Click to filter Resolved complaints"
          >
            <div style={{ fontSize: '0.78rem', color: '#86efac', fontWeight: 600 }}>Resolved & Audited</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
              {stats.resolvedComplaints}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Click to filter resolved</div>
          </div>

          {/* Citizen Feedback KPI */}
          <div 
            className="glass-card glass-card-interactive" 
            style={{ padding: '1.25rem', cursor: 'pointer', borderTop: '3px solid #eab308' }}
            onClick={() => handleKpiClick('FEEDBACK')}
            title="Click to view Citizen Feedback Reviews"
          >
            <div style={{ fontSize: '0.78rem', color: '#fde68a', fontWeight: 600 }}>Citizen Satisfaction</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#eab308', marginTop: '4px' }}>
              {allFeedbackComplaints.length} Rated
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Click to view reviews</div>
          </div>
        </div>
      )}

      {/* Main Tab 1: Overview & All Complaints Table */}
      {activeMainTab === 'overview' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          {/* Filtering Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <Filter size={16} color="#38bdf8" />
              <select
                className="form-select"
                style={{ width: '180px', padding: '0.45rem 0.6rem', fontSize: '0.825rem' }}
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setFilterOverdueOnly(false);
                }}
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">All Active Operations</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>

              <select
                className="form-select"
                style={{ width: '150px', padding: '0.45rem 0.6rem', fontSize: '0.825rem' }}
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>

              <select
                className="form-select"
                style={{ width: '200px', padding: '0.45rem 0.6rem', fontSize: '0.825rem' }}
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
            </div>

            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                className="form-input"
                style={{ width: '240px', padding: '0.45rem 0.75rem', fontSize: '0.825rem' }}
                placeholder="Search case / address / citizen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary btn-sm">
                <Search size={14} />
              </button>
            </form>
          </div>

          {/* Complaints Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#38bdf8' }}>
              <Loader2 size={32} className="spin-animation" style={{ margin: '0 auto 8px' }} />
              <p>Fetching municipal grievance records...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              No complaints match the selected criteria.
            </div>
          ) : (
            <div className="table-container">
              <table className="civic-table">
                <thead>
                  <tr>
                    <th>Case Ref</th>
                    <th>Issue Summary</th>
                    <th>Citizen Details</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned Dept / Officer</th>
                    <th>Feedback</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#38bdf8' }}>
                        {c.complaintNumber}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#f8fafc', maxWidth: '280px' }}>
                          {c.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                          {c.address}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>
                          {c.citizen?.fullName || 'Resident Citizen'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {c.citizen?.phoneNumber}
                        </div>
                      </td>
                      <td>
                        <PriorityBadge priority={c.priority} />
                      </td>
                      <td>
                        <StatusBadge status={c.status} />
                      </td>
                      <td>
                        <div style={{ fontSize: '0.825rem', color: '#38bdf8', fontWeight: 600 }}>
                          {c.assignedDepartment?.name || <span style={{ color: '#f59e0b' }}>General / Unassigned</span>}
                        </div>
                        {c.assignedOfficer && (
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            {c.assignedOfficer.fullName}
                          </div>
                        )}
                      </td>
                      <td>
                        {c.feedback ? (
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                            <Star size={11} fill="#fbbf24" /> {c.feedback.rating}/5
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>-</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => setAssignModalComplaint(c)}
                            title="Assign Department or Officer"
                          >
                            <UserCheck size={12} /> Assign
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => setStatusModalComplaint(c)}
                            title="Update Status"
                          >
                            <Activity size={12} /> Status
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => openTimeline(c)}
                            title="View Audit Trail"
                          >
                            <Clock size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Main Tab 2: Departments Overview with Drilldown */}
      {activeMainTab === 'departments' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          {selectedDeptDetail ? (
            /* Selected Department Detailed View */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                      Department Deep-Dive
                    </span>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', color: '#7dd3fc', padding: '2px 8px', borderRadius: '9999px' }}>
                      SLA: {selectedDeptDetail.slaHours || 48}h Target
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f8fafc' }}>
                    {selectedDeptDetail.name}
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>{selectedDeptDetail.description}</p>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedDeptDetail(null)}
                >
                  <X size={15} /> Back to All Departments
                </button>
              </div>

              {/* Department Contact & Stats Bar */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  padding: '1.25rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  marginBottom: '1.5rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Department Head</div>
                  <div style={{ fontSize: '0.92rem', color: '#f8fafc', fontWeight: 600, marginTop: '2px' }}>
                    {selectedDeptDetail.headOfficerName || 'Assigned Department Head'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Contact Email</div>
                  <div style={{ fontSize: '0.92rem', color: '#38bdf8', fontFamily: 'monospace', marginTop: '2px' }}>
                    {selectedDeptDetail.contactEmail || 'dept@municipality.gov.in'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Direct Line</div>
                  <div style={{ fontSize: '0.92rem', color: '#f8fafc', marginTop: '2px' }}>
                    {selectedDeptDetail.contactPhone || '080-22661001'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total Department Cases</div>
                  <div style={{ fontSize: '1.25rem', color: '#38bdf8', fontWeight: 800, marginTop: '2px' }}>
                    {currentDeptComplaints.length}
                  </div>
                </div>
              </div>

              {/* Department Assigned Field Engineers Roster */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="#38bdf8" /> Assigned Field Engineers ({selectedDeptOfficers.length})
                </h3>

                {loadingDeptDetail ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: '#38bdf8' }}>
                    <Loader2 size={24} className="spin-animation" style={{ margin: '0 auto 8px' }} />
                    Loading department engineers...
                  </div>
                ) : selectedDeptOfficers.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>No field officers registered under this department yet.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {selectedDeptOfficers.map((off) => (
                      <div key={off.id} className="glass-card" style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.7)' }}>
                        <div style={{ fontWeight: 700, color: '#f8fafc' }}>{off.fullName}</div>
                        <div style={{ fontSize: '0.78rem', color: '#38bdf8' }}>{off.designation || 'Field Engineer'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', fontFamily: 'monospace' }}>{off.email}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{off.phoneNumber}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Department Grievance Queue */}
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase size={18} color="#f59e0b" /> Department Incident Queue ({currentDeptComplaints.length})
                </h3>

                {currentDeptComplaints.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>No active grievances logged for this department.</p>
                ) : (
                  <div className="table-container">
                    <table className="civic-table">
                      <thead>
                        <tr>
                          <th>Case Ref</th>
                          <th>Issue Summary</th>
                          <th>Citizen</th>
                          <th>Priority</th>
                          <th>Status</th>
                          <th>Officer</th>
                          <th>Feedback</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentDeptComplaints.map((c) => (
                          <tr key={c.id}>
                            <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#38bdf8' }}>{c.complaintNumber}</td>
                            <td>
                              <div style={{ fontWeight: 600, color: '#f8fafc' }}>{c.title}</div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{c.address}</div>
                            </td>
                            <td style={{ fontSize: '0.85rem' }}>{c.citizen?.fullName}</td>
                            <td><PriorityBadge priority={c.priority} /></td>
                            <td><StatusBadge status={c.status} /></td>
                            <td style={{ fontSize: '0.82rem', color: '#38bdf8' }}>{c.assignedOfficer?.fullName || 'Pending'}</td>
                            <td>
                              {c.feedback ? (
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                  <Star size={11} fill="#fbbf24" /> {c.feedback.rating}/5
                                </span>
                              ) : (
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>-</span>
                              )}
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm"
                                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                                  onClick={() => setAssignModalComplaint(c)}
                                  title="Assign Officer"
                                >
                                  Assign
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                                  onClick={() => setStatusModalComplaint(c)}
                                  title="Update Status"
                                >
                                  Status
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline btn-sm"
                                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                                  onClick={() => openTimeline(c)}
                                  title="View Full Audit History"
                                >
                                  <Clock size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Selectable Department Cards Grid */
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                  Municipal Department Overview & Performance
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                  Select any department to inspect dedicated workload, SLA metrics, field engineers, and complaint records.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {departments.map((dept) => {
                  const stat = departmentStatsList.find((s) => s.id === dept.id) || {
                    totalComplaints: complaints.filter(c => c.assignedDepartment?.id === dept.id).length,
                    activeComplaints: complaints.filter(c => c.assignedDepartment?.id === dept.id && c.status !== 'RESOLVED' && c.status !== 'CLOSED').length,
                    resolvedComplaints: complaints.filter(c => c.assignedDepartment?.id === dept.id && (c.status === 'RESOLVED' || c.status === 'CLOSED')).length,
                  };

                  const deptCount = stat.totalComplaints ?? complaints.filter(c => c.assignedDepartment?.id === dept.id).length;
                  const activeDept = stat.activeComplaints ?? complaints.filter(c => c.assignedDepartment?.id === dept.id && c.status !== 'RESOLVED' && c.status !== 'CLOSED').length;
                  const resolvedDept = stat.resolvedComplaints ?? complaints.filter(c => c.assignedDepartment?.id === dept.id && (c.status === 'RESOLVED' || c.status === 'CLOSED')).length;

                  return (
                    <div
                      key={dept.id}
                      className="glass-card glass-card-interactive"
                      style={{
                        padding: '1.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderTop: '3px solid #38bdf8',
                      }}
                      onClick={() => handleSelectDepartment(dept)}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                            SLA: {dept.slaHours || 48}h Target
                          </span>
                          <span style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px' }}>
                            {dept.code}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
                          {dept.name}
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                          {dept.description}
                        </p>
                      </div>

                      <div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '0.5rem',
                            padding: '0.75rem',
                            background: 'rgba(15, 23, 42, 0.6)',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            textAlign: 'center',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Total</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>{deptCount}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Active</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24' }}>{activeDept}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Resolved</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>{resolvedDept}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: '#38bdf8', fontWeight: 600 }}>
                          <span>Inspect Department</span>
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Tab: Executive Priority & Operations (Highest Priority Command Section) */}
      {activeMainTab === 'operations' && (
        <div className="glass-card" style={{ padding: '1.75rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <AlertOctagon size={15} /> Executive Priority & Operations
                </span>
                <span style={{ fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                  Highest Visual Priority
                </span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
                Municipality Command Overview
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                Triage command for critical hazards, SLA breaches, high-risk operational bottlenecks, and department leadership accountability.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={loadData}
            >
              <RefreshCw size={13} /> Refresh Operations
            </button>
          </div>

          {/* 4 Operations Alert Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#fca5a5', fontWeight: 700, textTransform: 'uppercase' }}>Critical Emergency Cases</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ef4444', marginTop: '4px' }}>
                {complaints.filter(c => c.priority === 'CRITICAL' && c.status !== 'RESOLVED' && c.status !== 'CLOSED').length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#fca5a5', marginTop: '4px' }}>Require immediate field intervention</div>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#fde68a', fontWeight: 700, textTransform: 'uppercase' }}>SLA Overdue Escalations</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
                {complaints.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED' && c.slaDeadline && new Date(c.slaDeadline) < new Date()).length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#fde68a', marginTop: '4px' }}>Exceeded target response resolution window</div>
            </div>

            <div style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#7dd3fc', fontWeight: 700, textTransform: 'uppercase' }}>Department Heads on Duty</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                {allOfficials.filter(u => u.role === 'ROLE_HEAD').length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#7dd3fc', marginTop: '4px' }}>Assigned across municipal divisions</div>
            </div>

            <div style={{ background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.35)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#c4b5fd', fontWeight: 700, textTransform: 'uppercase' }}>Field Officers Deployed</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#8b5cf6', marginTop: '4px' }}>
                {allOfficials.filter(u => u.role === 'ROLE_OFFICER').length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#c4b5fd', marginTop: '4px' }}>Handling active work orders</div>
            </div>
          </div>

          {/* Urgent Priority Cases Table */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={18} color="#ef4444" /> Urgent Incident Queue (Critical & SLA Overdue)
            </h4>
            {complaints.filter(c => (c.priority === 'CRITICAL' || (c.slaDeadline && new Date(c.slaDeadline) < new Date())) && c.status !== 'RESOLVED' && c.status !== 'CLOSED').length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px' }}>
                <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 8px' }} />
                <p>No critical emergencies or overdue SLA complaints pending in the municipality.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="civic-table">
                  <thead>
                    <tr>
                      <th>Case Ref</th>
                      <th>Issue & Location</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Department</th>
                      <th>Assigned Officer</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints
                      .filter(c => (c.priority === 'CRITICAL' || (c.slaDeadline && new Date(c.slaDeadline) < new Date())) && c.status !== 'RESOLVED' && c.status !== 'CLOSED')
                      .map(c => (
                        <tr key={c.id}>
                          <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#ef4444' }}>{c.complaintNumber}</td>
                          <td>
                            <div style={{ fontWeight: 600, color: '#f8fafc' }}>{c.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{c.address}</div>
                          </td>
                          <td><PriorityBadge priority={c.priority} /></td>
                          <td><StatusBadge status={c.status} /></td>
                          <td style={{ fontSize: '0.82rem', color: '#38bdf8' }}>{c.assignedDepartment?.name || 'Unassigned'}</td>
                          <td style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>{c.assignedOfficer?.fullName || 'Not Assigned'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                                onClick={() => setAssignModalComplaint(c)}
                              >
                                Dispatch
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                                onClick={() => setStatusModalComplaint(c)}
                              >
                                Status
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Tab: Department Heads Directory */}
      {activeMainTab === 'dept-heads' && (
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Municipal Executive Leadership
                </span>
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
                Department Head Directory & Governance
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                Executive overview of department heads, assigned municipal jurisdictions, active caseloads, and SLA compliance status.
              </p>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700 }}>
              {allOfficials.filter(u => u.role === 'ROLE_HEAD').length} Department Heads Registered
            </span>
          </div>

          <div className="table-container">
            <table className="civic-table">
              <thead>
                <tr>
                  <th>Department Head Name</th>
                  <th>Department</th>
                  <th>Assigned Municipality / Area</th>
                  <th>Active Complaints</th>
                  <th>Pending Complaints</th>
                  <th>Resolved Complaints</th>
                  <th>SLA Status</th>
                </tr>
              </thead>
              <tbody>
                {allOfficials.filter(u => u.role === 'ROLE_HEAD').map(head => {
                  const deptId = head.department?.id;
                  const deptComplaints = complaints.filter(c => c.assignedDepartment?.id === deptId);
                  const activeCount = deptComplaints.filter(c => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length;
                  const pendingCount = deptComplaints.filter(c => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW').length;
                  const resolvedCount = deptComplaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
                  const overdueCount = deptComplaints.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED' && c.slaDeadline && new Date(c.slaDeadline) < new Date()).length;
                  const slaStatus = overdueCount > 0 ? `${overdueCount} Overdue` : 'On Track';

                  return (
                    <tr key={head.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#f8fafc' }}>{head.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>{head.email}</div>
                      </td>
                      <td>
                        <span style={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.88rem' }}>
                          {head.department?.name || 'General Municipal'}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{head.municipality || 'Central City'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{head.ward || 'All Sectors'}</div>
                      </td>
                      <td>
                        <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.9rem' }}>{activeCount}</span>
                      </td>
                      <td>
                        <span style={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.9rem' }}>{pendingCount}</span>
                      </td>
                      <td>
                        <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>{resolvedCount}</span>
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: overdueCount > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                          color: overdueCount > 0 ? '#ef4444' : '#10b981',
                          border: overdueCount > 0 ? '1px solid #ef4444' : '1px solid #10b981',
                        }}>
                          {slaStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Tab: Municipal Officers Directory */}
      {activeMainTab === 'officers-directory' && (
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Field Operations Personnel
                </span>
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
                Municipal Officers List & Workload Distribution
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                Structured roster of field engineers, assigned operational zones, active workload, and deployment status.
              </p>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 700 }}>
              {allOfficials.filter(u => u.role === 'ROLE_OFFICER').length} Field Officers Active
            </span>
          </div>

          <div className="table-container">
            <table className="civic-table">
              <thead>
                <tr>
                  <th>Officer Name</th>
                  <th>Assigned Area</th>
                  <th>Department</th>
                  <th>Current Workload</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allOfficials.filter(u => u.role === 'ROLE_OFFICER').map(officer => {
                  const wl = officerWorkloads.find(w => w.id === officer.id || w.officerId === officer.id) || {
                    activeTasks: complaints.filter(c => c.assignedOfficer?.id === officer.id && c.status !== 'RESOLVED' && c.status !== 'CLOSED').length,
                    resolved: complaints.filter(c => c.assignedOfficer?.id === officer.id && (c.status === 'RESOLVED' || c.status === 'CLOSED')).length,
                  };
                  const activeWorkload = wl.activeTasks ?? 0;

                  return (
                    <tr key={officer.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#f8fafc' }}>{officer.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>{officer.designation || 'Municipal Field Officer'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>{officer.email}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{officer.municipality || 'Central City'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{officer.ward ? `Ward: ${officer.ward}` : 'City Wide'}</div>
                      </td>
                      <td>
                        <span style={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.85rem' }}>
                          {officer.department?.name || 'Municipal Operations'}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: activeWorkload > 3 ? '#ef4444' : activeWorkload > 0 ? '#fbbf24' : '#10b981',
                        }}>
                          {activeWorkload} Active
                        </span>
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          background: officer.active !== false ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: officer.active !== false ? '#10b981' : '#ef4444',
                          border: officer.active !== false ? '1px solid #10b981' : '1px solid #ef4444',
                        }}>
                          {officer.active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Tab 3: General Civic Issues (Unassigned Category) */}
      {activeMainTab === 'general' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase' }}>
                Central Triage Queue
              </span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
              General & Unassigned Civic Issues
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
              Civic grievances that require Central Administration triage or routing to a specialized department.
            </p>
          </div>

          {generalCivicComplaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem', color: '#94a3b8' }}>
              <CheckCircle2 size={40} color="#10b981" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '4px' }}>All Issues Triaged</h4>
              <p style={{ fontSize: '0.85rem' }}>There are no unassigned or general-category complaints currently pending triage.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="civic-table">
                <thead>
                  <tr>
                    <th>Case Ref</th>
                    <th>Issue Summary</th>
                    <th>Citizen Details</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {generalCivicComplaints.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#38bdf8' }}>
                        {c.complaintNumber}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#f8fafc' }}>{c.title}</div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{c.address}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>{c.citizen?.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.citizen?.phoneNumber}</div>
                      </td>
                      <td><PriorityBadge priority={c.priority} /></td>
                      <td><StatusBadge status={c.status} /></td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}
                          onClick={() => setAssignModalComplaint(c)}
                        >
                          <UserCheck size={13} /> Route Department
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Main Tab 4: Citizen Feedback Oversight */}
      {activeMainTab === 'feedback' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase' }}>
                  Public Governance Accountability
                </span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                Citizen Satisfaction & Verified Feedback Ratings
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                Central municipal audit of citizen feedback submitted upon on-site grievance resolution.
              </p>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 700 }}>
              {allFeedbackComplaints.length} Total Verified Reviews
            </span>
          </div>

          {allFeedbackComplaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem', color: '#94a3b8' }}>
              <HeartHandshake size={40} color="#64748b" style={{ margin: '0 auto 10px' }} />
              <p>No citizen satisfaction feedback records have been logged in the system yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {allFeedbackComplaints.map(c => (
                <div
                  key={c.id}
                  className="glass-card glass-card-interactive"
                  onClick={() => openTimeline(c)}
                  style={{
                    padding: '1.25rem',
                    background: 'rgba(15, 23, 42, 0.7)',
                    cursor: 'pointer',
                    borderLeft: '4px solid #fbbf24',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700 }}>
                      {c.complaintNumber}
                    </span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < c.feedback.rating ? '#f59e0b' : 'none'} color="#f59e0b" />
                      ))}
                    </div>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
                    {c.title}
                  </h4>

                  {c.feedback.comments ? (
                    <p style={{ fontSize: '0.88rem', color: '#cbd5e1', fontStyle: 'italic', marginBottom: '0.75rem' }}>
                      "{c.feedback.comments}"
                    </p>
                  ) : (
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                      No remarks entered.
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span>Dept: {c.assignedDepartment?.name || 'Central Municipal'}</span>
                    <span style={{ color: '#38bdf8', fontWeight: 600 }}>Inspect Case &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Tab 5: Geospatial Field Map */}
      {activeMainTab === 'map' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#38bdf8" /> Municipality Incident Geospatial Map
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {complaints.filter(c => c.latitude && c.longitude).length} mapped incidents across all municipal wards
            </span>
          </div>
          <CivicMap
            height="580px"
            zoom={12}
            markers={complaints}
          />
        </div>
      )}

      {/* Modals */}
      <AssignOfficerModal
        complaint={assignModalComplaint}
        officers={[]}
        isOpen={!!assignModalComplaint}
        onClose={() => setAssignModalComplaint(null)}
        onAssigned={loadData}
      />

      <StatusUpdateModal
        complaint={statusModalComplaint}
        isOpen={!!statusModalComplaint}
        onClose={() => setStatusModalComplaint(null)}
        onStatusUpdated={loadData}
      />

      {timelineModalComplaint && (
        <div className="modal-overlay" onClick={() => setTimelineModalComplaint(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                  Audit History: {timelineModalComplaint.complaintNumber}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{timelineModalComplaint.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setTimelineModalComplaint(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>
            <TimelineView timeline={timelineData} currentStatus={timelineModalComplaint.status} />
          </div>
        </div>
      )}
    </div>
  );
}
