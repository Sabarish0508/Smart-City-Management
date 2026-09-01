import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  MapPin, 
  UserCheck, 
  Activity, 
  Loader2, 
  RefreshCw, 
  Star, 
  Eye, 
  Briefcase, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Check, 
  TrendingUp, 
  AlertCircle,
  HeartHandshake
} from 'lucide-react';
import { complaintsAPI, officersAPI, departmentsAPI, analyticsAPI } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import CivicMap from '../components/common/CivicMap';
import AssignOfficerModal from '../components/common/AssignOfficerModal';
import StatusUpdateModal from '../components/common/StatusUpdateModal';
import TimelineView from '../components/common/TimelineView';

export default function DepartmentHeadDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [workloads, setWorkloads] = useState([]);
  const [departmentStats, setDepartmentStats] = useState(null);
  const [departmentInfo, setDepartmentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'officers' | 'feedback' | 'analytics' | 'map'

  // Filters
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterOfficer, setFilterOfficer] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOverdueOnly, setFilterOverdueOnly] = useState(false);

  // Modals
  const [assignModalComplaint, setAssignModalComplaint] = useState(null);
  const [statusModalComplaint, setStatusModalComplaint] = useState(null);
  const [timelineModalComplaint, setTimelineModalComplaint] = useState(null);
  const [timelineData, setTimelineData] = useState([]);

  const userDeptId = user?.departmentId;

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch department specific complaints, officers, workloads, and analytics
      const [deptComplaints, deptOfficers, deptWorkload, deptAnalytics, allDepts] = await Promise.all([
        userDeptId 
          ? complaintsAPI.getDepartmentComplaints(userDeptId)
          : complaintsAPI.getMyDepartmentComplaints().catch(() => complaintsAPI.getAll()),
        userDeptId
          ? officersAPI.getAll(userDeptId)
          : officersAPI.getAll(),
        userDeptId
          ? officersAPI.getWorkload(userDeptId)
          : officersAPI.getWorkload(),
        userDeptId
          ? analyticsAPI.getDepartmentStats(userDeptId).catch(() => null)
          : analyticsAPI.getMyDepartmentStats().catch(() => null),
        departmentsAPI.getStats().catch(() => [])
      ]);

      setComplaints(deptComplaints || []);
      setOfficers(deptOfficers || []);
      setWorkloads(deptWorkload || []);
      setDepartmentStats(deptAnalytics || null);

      if (userDeptId && allDepts) {
        const currentDept = allDepts.find(d => d.id === userDeptId);
        setDepartmentInfo(currentDept || null);
      }
    } catch (err) {
      console.error('Failed to load department head dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userDeptId]);

  const openTimeline = async (c) => {
    setTimelineModalComplaint(c);
    try {
      const tl = await complaintsAPI.getTimeline(c.id);
      setTimelineData(tl || []);
    } catch (e) {
      console.error(e);
    }
  };

  // KPI Calculations strictly scoped to this department's real dataset
  const totalDeptCases = complaints.length;
  const activeCases = complaints.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length;
  const criticalCases = complaints.filter(c => (c.priority === 'CRITICAL' || c.priority === 'HIGH') && c.status !== 'RESOLVED' && c.status !== 'CLOSED').length;
  
  const overdueComplaintsList = complaints.filter(c => {
    if (c.status === 'RESOLVED' || c.status === 'CLOSED') return false;
    if (!c.slaDeadline) return false;
    return new Date(c.slaDeadline) < new Date();
  });
  const overdueCases = overdueComplaintsList.length;

  const resolvedCases = complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
  const resolutionRate = totalDeptCases > 0 ? Math.round((resolvedCases / totalDeptCases) * 100) : 100;
  const feedbackComplaints = complaints.filter(c => !!c.feedback);

  // Clickable KPI Handlers for Drill-Down
  const handleKpiClick = (type) => {
    setActiveTab('queue');
    if (type === 'TOTAL') {
      setFilterStatus('');
      setFilterPriority('');
      setFilterOfficer('');
      setFilterOverdueOnly(false);
    } else if (type === 'ACTIVE') {
      setFilterStatus('ACTIVE');
      setFilterPriority('');
      setFilterOfficer('');
      setFilterOverdueOnly(false);
    } else if (type === 'CRITICAL') {
      setFilterStatus('');
      setFilterPriority('CRITICAL');
      setFilterOfficer('');
      setFilterOverdueOnly(false);
    } else if (type === 'OVERDUE') {
      setFilterStatus('');
      setFilterPriority('');
      setFilterOfficer('');
      setFilterOverdueOnly(true);
    } else if (type === 'RESOLVED') {
      setFilterStatus('RESOLVED');
      setFilterPriority('');
      setFilterOfficer('');
      setFilterOverdueOnly(false);
    } else if (type === 'FEEDBACK') {
      setActiveTab('feedback');
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(c => {
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
    if (filterOfficer) {
      if (filterOfficer === 'UNASSIGNED') {
        if (c.assignedOfficer) return false;
      } else {
        if (c.assignedOfficer?.id !== Number(filterOfficer)) return false;
      }
    }
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

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '1440px' }}>
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.85) 100%)',
          borderLeft: '4px solid #f59e0b',
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
            <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Briefcase size={14} /> Department Command Center
            </span>
            {departmentInfo?.slaHours && (
              <span style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', color: '#7dd3fc', padding: '2px 8px', borderRadius: '9999px' }}>
                Standard SLA: {departmentInfo.slaHours}h
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc' }}>
            {user?.departmentName || departmentInfo?.name || 'Department Command & Field Operations'}
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '2px' }}>
            Department Head: <strong style={{ color: '#f8fafc' }}>{user?.fullName}</strong> &bull; {user?.designation || 'Chief Department Head'} &bull; {user?.municipality || 'Central City Municipal Corporation'} &bull; {user?.city || 'Metro City'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={loadData} title="Refresh Department Queue">
            <RefreshCw size={14} /> Refresh Data
          </button>

          <div style={{ display: 'flex', gap: '4px', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'queue' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('queue')}
            >
              Grievance Queue ({totalDeptCases})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'officers' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('officers')}
            >
              Field Engineers ({officers.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'feedback' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('feedback')}
            >
              <Star size={13} fill="#fbbf24" color="#fbbf24" /> Citizen Feedback ({feedbackComplaints.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics & SLA
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'map' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('map')}
            >
              Geospatial Map
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid - CLICKABLE FOR DRILL-DOWN */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div 
          className="glass-card glass-card-interactive" 
          style={{ padding: '1.25rem', cursor: 'pointer', borderTop: '3px solid #38bdf8' }}
          onClick={() => handleKpiClick('TOTAL')}
          title="Click to view all department complaints"
        >
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Total Department Cases</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            {totalDeptCases}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Click to view all</div>
        </div>

        <div 
          className="glass-card glass-card-interactive" 
          style={{ padding: '1.25rem', cursor: 'pointer', borderTop: '3px solid #fbbf24' }}
          onClick={() => handleKpiClick('ACTIVE')}
          title="Click to filter Active In-Progress cases"
        >
          <div style={{ fontSize: '0.78rem', color: '#fde68a', fontWeight: 600 }}>In Active Field Work</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
            {activeCases}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Click to filter active</div>
        </div>

        <div 
          className="glass-card glass-card-interactive" 
          style={{ padding: '1.25rem', cursor: 'pointer', borderTop: '3px solid #ef4444' }}
          onClick={() => handleKpiClick('CRITICAL')}
          title="Click to filter Critical & High Priority cases"
        >
          <div style={{ fontSize: '0.78rem', color: '#fca5a5', fontWeight: 600 }}>Critical / High Priority</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444', marginTop: '4px' }}>
            {criticalCases}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Click to filter critical</div>
        </div>

        <div 
          className="glass-card glass-card-interactive" 
          style={{ padding: '1.25rem', cursor: 'pointer', borderTop: '3px solid #f43f5e' }}
          onClick={() => handleKpiClick('OVERDUE')}
          title="Click to filter SLA Overdue cases"
        >
          <div style={{ fontSize: '0.78rem', color: '#fca5a5', fontWeight: 600 }}>SLA Overdue Cases</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: overdueCases > 0 ? '#ef4444' : '#94a3b8', marginTop: '4px' }}>
            {overdueCases}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Click to filter overdue</div>
        </div>

        <div 
          className="glass-card glass-card-interactive" 
          style={{ padding: '1.25rem', cursor: 'pointer', borderTop: '3px solid #10b981' }}
          onClick={() => handleKpiClick('RESOLVED')}
          title="Click to filter Resolved cases"
        >
          <div style={{ fontSize: '0.78rem', color: '#86efac', fontWeight: 600 }}>Resolved & Audited</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {resolvedCases}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Click to filter resolved</div>
        </div>

        <div 
          className="glass-card glass-card-interactive" 
          style={{ padding: '1.25rem', cursor: 'pointer', borderTop: '3px solid #eab308' }}
          onClick={() => handleKpiClick('FEEDBACK')}
          title="Click to view Citizen Feedback Reviews"
        >
          <div style={{ fontSize: '0.78rem', color: '#fde68a', fontWeight: 600 }}>Citizen Satisfaction</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#eab308', marginTop: '4px' }}>
            {feedbackComplaints.length} Rated
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Click to view reviews</div>
        </div>
      </div>

      {/* Tab 1: Department Grievance Queue */}
      {activeTab === 'queue' && (
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
                onChange={(e) => { setFilterStatus(e.target.value); setFilterOverdueOnly(false); }}
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
                style={{ width: '140px', padding: '0.45rem 0.6rem', fontSize: '0.825rem' }}
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
                style={{ width: '180px', padding: '0.45rem 0.6rem', fontSize: '0.825rem' }}
                value={filterOfficer}
                onChange={(e) => setFilterOfficer(e.target.value)}
              >
                <option value="">All Engineers</option>
                <option value="UNASSIGNED">-- Unassigned Cases --</option>
                {officers.map(o => (
                  <option key={o.id} value={String(o.id)}>
                    {o.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                className="form-input"
                style={{ width: '260px', padding: '0.45rem 0.75rem', fontSize: '0.825rem' }}
                placeholder="Search case #, address, citizen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#38bdf8' }}>
              <Loader2 size={32} className="spin-animation" style={{ margin: '0 auto 8px' }} />
              <p>Fetching department incident records...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 10px' }} />
              <p>No department complaints found matching the selected filters.</p>
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
                    <th>Assigned Engineer</th>
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
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {c.citizen?.phoneNumber || c.citizen?.email || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <PriorityBadge priority={c.priority} />
                      </td>
                      <td>
                        <StatusBadge status={c.status} />
                      </td>
                      <td>
                        {c.assignedOfficer ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>
                            <ShieldCheck size={14} />
                            <span>{c.assignedOfficer.fullName}</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 600, background: 'rgba(239, 68, 68, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                            Unassigned
                          </span>
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
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                            onClick={() => setAssignModalComplaint(c)}
                            title="Assign Field Engineer"
                          >
                            <UserCheck size={12} /> Assign
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                            onClick={() => setStatusModalComplaint(c)}
                            title="Update Status"
                          >
                            <Activity size={12} /> Status
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
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

      {/* Tab 2: Department Field Engineers Roster & Workload */}
      {activeTab === 'officers' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} color="#38bdf8" /> {user?.departmentName || 'Department'} Team
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '2px' }}>
                Authorized roster of field engineers and inspectors assigned exclusively to this department.
              </p>
            </div>
            <span style={{ fontSize: '0.825rem', color: '#38bdf8', fontWeight: 700 }}>
              {officers.length} Registered Department Personnel
            </span>
          </div>

          {officers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              No field engineers are currently registered under this department.
            </div>
          ) : (
            <div className="table-container">
              <table className="civic-table">
                <thead>
                  <tr>
                    <th>Officer Name</th>
                    <th>Assigned Area</th>
                    <th>Active Cases</th>
                    <th>Pending Cases</th>
                    <th>Resolved Cases</th>
                    <th>Current Status</th>
                  </tr>
                </thead>
                <tbody>
                  {officers.map((off) => {
                    const wl = workloads.find(w => w.id === off.id || w.officerId === off.id) || {
                      activeTasks: complaints.filter(c => c.assignedOfficer?.id === off.id && (c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED')).length,
                      pendingTasks: complaints.filter(c => c.assignedOfficer?.id === off.id && (c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW')).length,
                      resolved: complaints.filter(c => c.assignedOfficer?.id === off.id && (c.status === 'RESOLVED' || c.status === 'CLOSED')).length,
                    };
                    const activeTasks = wl.activeTasks ?? 0;
                    const pendingTasks = wl.pendingTasks ?? complaints.filter(c => c.assignedOfficer?.id === off.id && (c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW')).length;
                    const resolvedTasks = wl.resolved ?? 0;

                    return (
                      <tr key={off.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: '#f8fafc' }}>{off.fullName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>{off.designation || 'Field Engineer'}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>{off.email}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{off.municipality || user?.municipality || 'Central City'}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{off.ward ? `Ward: ${off.ward}` : 'Department Zone'}</div>
                        </td>
                        <td>
                          <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.9rem' }}>{activeTasks}</span>
                        </td>
                        <td>
                          <span style={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.9rem' }}>{pendingTasks}</span>
                        </td>
                        <td>
                          <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>{resolvedTasks}</span>
                        </td>
                        <td>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            background: off.active !== false ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: off.active !== false ? '#10b981' : '#ef4444',
                            border: off.active !== false ? '1px solid #10b981' : '1px solid #ef4444',
                          }}>
                            {off.active !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Citizen Satisfaction Reviews */}
      {activeTab === 'feedback' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={18} fill="#f59e0b" color="#f59e0b" /> Department Citizen Feedback & Satisfaction Reviews
            </h3>
            <span style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
              {feedbackComplaints.length} ratings received in this department
            </span>
          </div>

          {feedbackComplaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem', color: '#94a3b8' }}>
              <HeartHandshake size={36} color="#64748b" style={{ margin: '0 auto 10px' }} />
              <p>No citizen satisfaction reviews have been submitted on resolved cases in this department yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {feedbackComplaints.map(c => (
                <div
                  key={c.id}
                  className="glass-card glass-card-interactive"
                  onClick={() => openTimeline(c)}
                  style={{
                    padding: '1.25rem',
                    background: 'rgba(15, 23, 42, 0.7)',
                    cursor: 'pointer',
                    borderLeft: '4px solid #f59e0b',
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
                      No textual remarks provided by citizen.
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span>Engineer: {c.assignedOfficer?.fullName || 'Department Team'}</span>
                    <span style={{ color: '#38bdf8', fontWeight: 600 }}>Inspect Case &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Analytics & SLA */}
      {activeTab === 'analytics' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={20} color="#38bdf8" /> Department Operational Analytics & SLA Compliance
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '1.25rem', background: 'rgba(15, 23, 42, 0.6)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.75rem' }}>
                Resolution Distribution
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Total Incidents Handled:</span>
                  <strong>{totalDeptCases}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Successfully Resolved:</span>
                  <strong style={{ color: '#10b981' }}>{resolvedCases}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>In Active Progress:</span>
                  <strong style={{ color: '#fbbf24' }}>{activeCases}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>SLA Breaches / Overdue:</span>
                  <strong style={{ color: '#ef4444' }}>{overdueCases}</strong>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem', background: 'rgba(15, 23, 42, 0.6)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.75rem' }}>
                Service Level Agreement (SLA)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Target Turnaround SLA:</span>
                  <strong style={{ color: '#38bdf8' }}>{departmentInfo?.slaHours || 48} Hours</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>On-Time Compliance:</span>
                  <strong style={{ color: '#10b981' }}>{resolutionRate}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Authorized Head:</span>
                  <span>{user?.fullName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Geospatial Map */}
      {activeTab === 'map' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#38bdf8" /> Department Incident Locations
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {complaints.filter(c => c.latitude && c.longitude).length} mapped department cases
            </span>
          </div>
          <CivicMap
            height="560px"
            zoom={13}
            markers={complaints}
          />
        </div>
      )}

      {/* Modals */}
      <AssignOfficerModal
        complaint={assignModalComplaint}
        officers={officers}
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
