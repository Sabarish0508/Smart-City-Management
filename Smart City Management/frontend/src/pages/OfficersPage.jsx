import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Wrench, 
  Mail, 
  Phone, 
  Building2, 
  Loader2, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  AlertCircle 
} from 'lucide-react';
import { officersAPI, departmentsAPI } from '../services/api';

export default function OfficersPage() {
  const [officials, setOfficials] = useState([]);
  const [workloads, setWorkloads] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'ROLE_OFFICER',
    departmentId: '',
    designation: '',
    municipality: 'Central City Municipal Corporation',
    city: 'Metro City',
    state: 'Karnataka',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [officialList, workloadList, deptList] = await Promise.all([
        officersAPI.getAllOfficials(),
        officersAPI.getWorkload(),
        departmentsAPI.getAll(),
      ]);

      setOfficials(officialList || []);
      setWorkloads(workloadList || []);
      setDepartments(deptList || []);
      if (deptList && deptList.length > 0 && !formData.departmentId) {
        setFormData((prev) => ({ ...prev, departmentId: deptList[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateOfficial = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        departmentId: formData.departmentId ? Number(formData.departmentId) : null,
      };
      await officersAPI.create(payload);
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to create official account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '1280px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={28} color="#38bdf8" /> Municipal Field Officers & Personnel
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage official field engineer accounts, department routing, and active workload distribution
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={16} /> Create Official Account
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#38bdf8' }}>
          <Loader2 size={32} className="spin-animation" style={{ margin: '0 auto 8px' }} />
          <p>Loading officer personnel rosters...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {officials.map((off) => {
            const workload = workloads.find((w) => w.id === off.id || w.officerId === off.id) || {
              inProgress: 0,
              resolved: 0,
              totalAssigned: 0,
            };

            const activeTasks = workload.inProgress ?? workload.activeTasks ?? 0;
            const resolvedTasks = workload.resolved ?? workload.resolvedTasks ?? 0;

            const isOfficerAdmin = off.role === 'ROLE_ADMIN';
            const isDeptHead = off.role === 'ROLE_HEAD';

            return (
              <div key={off.id} className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: isOfficerAdmin ? 'rgba(139, 92, 246, 0.2)' : isDeptHead ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        border: `1px solid ${isOfficerAdmin ? '#8b5cf6' : isDeptHead ? '#f59e0b' : '#10b981'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isOfficerAdmin ? <ShieldCheck size={22} color="#8b5cf6" /> : isDeptHead ? <Building2 size={22} color="#f59e0b" /> : <Wrench size={22} color="#10b981" />}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                        {off.fullName}
                      </h3>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        {off.designation || (isOfficerAdmin ? 'Municipal Administrator' : isDeptHead ? 'Department Head' : 'Field Engineer')}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      background: isOfficerAdmin ? 'rgba(139, 92, 246, 0.15)' : isDeptHead ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: isOfficerAdmin ? '#c4b5fd' : isDeptHead ? '#fde68a' : '#6ee7b7',
                      border: `1px solid ${isOfficerAdmin ? '#8b5cf6' : isDeptHead ? '#f59e0b' : '#10b981'}`,
                    }}
                  >
                    {isOfficerAdmin ? 'ADMIN' : isDeptHead ? 'DEPT HEAD' : 'OFFICER'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', color: '#cbd5e1', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building2 size={14} color="#38bdf8" />
                    <span>{off.department?.name || 'Central Administration'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} color="#94a3b8" />
                    <span style={{ fontFamily: 'monospace' }}>{off.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="#94a3b8" />
                    <span>{off.phoneNumber}</span>
                  </div>
                </div>

                {/* Workload Meter */}
                {!isOfficerAdmin && (
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      padding: '0.85rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                      <span>Active Workload Tasks:</span>
                      <strong style={{ color: activeTasks > 3 ? '#ef4444' : '#38bdf8' }}>
                        {activeTasks} Pending
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                      <span>Resolved Field Cases:</span>
                      <strong style={{ color: '#10b981' }}>{resolvedTasks} Complete</strong>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Official Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus color="#38bdf8" size={22} /> Provision Official Account
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateOfficial} style={{ padding: '1.5rem' }}>
              {error && (
                <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name & Title</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-input"
                    placeholder="e.g. Er. Karthik Raman"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Role Authority</label>
                  <select name="role" className="form-select" value={formData.role} onChange={handleChange} required>
                    <option value="ROLE_OFFICER">ROLE_OFFICER (Field Engineer)</option>
                    <option value="ROLE_HEAD">ROLE_HEAD (Department Head)</option>
                    <option value="ROLE_ADMIN">ROLE_ADMIN (Municipal Commissioner)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Government Official Email{' '}
                  <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
                    {formData.role === 'ROLE_ADMIN' ? '(@central.gov.in)' : formData.role === 'ROLE_HEAD' ? '(username.dept@gov.in)' : '(@municipality.gov.in)'}
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder={
                    formData.role === 'ROLE_ADMIN' 
                      ? 'e.g. commissioner@central.gov.in' 
                      : formData.role === 'ROLE_HEAD' 
                      ? 'e.g. rajkumar.roads@gov.in' 
                      : 'e.g. rajkumar@municipality.gov.in'
                  }
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="form-input"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    className="form-input"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Assigned Department</label>
                  <select
                    name="departmentId"
                    className="form-select"
                    value={formData.departmentId}
                    onChange={handleChange}
                  >
                    <option value="">-- No Department (Admin) --</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Designation / Title</label>
                  <input
                    type="text"
                    name="designation"
                    className="form-input"
                    placeholder="e.g. Executive Road Engineer"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? <Loader2 size={16} className="spin-animation" /> : <Check size={16} />} Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
