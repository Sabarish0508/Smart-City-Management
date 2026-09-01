import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  PlusCircle, 
  Clock, 
  Mail, 
  Phone, 
  User, 
  Edit3, 
  Trash2, 
  Loader2, 
  Check, 
  X, 
  AlertCircle 
} from 'lucide-react';
import { departmentsAPI } from '../services/api';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    headOfficerName: '',
    slaHours: 24,
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const data = await departmentsAPI.getStats();
      setDepartments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openCreateModal = () => {
    setEditingDept(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      contactEmail: '',
      contactPhone: '',
      headOfficerName: '',
      slaHours: 24,
      isActive: true,
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name || '',
      code: dept.code || '',
      description: dept.description || '',
      contactEmail: dept.contactEmail || '',
      contactPhone: dept.contactPhone || '',
      headOfficerName: dept.headOfficerName || '',
      slaHours: dept.slaHours || 24,
      isActive: dept.isActive !== false,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingDept) {
        await departmentsAPI.update(editingDept.id, formData);
      } else {
        await departmentsAPI.create(formData);
      }
      setIsModalOpen(false);
      fetchDepartments();
    } catch (err) {
      setError(err.message || 'Failed to save department.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentsAPI.delete(id);
        fetchDepartments();
      } catch (err) {
        alert(err.message || 'Failed to delete department.');
      }
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '1280px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Briefcase size={28} color="#38bdf8" /> Municipal Departments & SLA Management
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
            Configure municipal infrastructure departments, SLA turnaround commitments, and head officers
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={openCreateModal}>
          <PlusCircle size={16} /> Add New Department
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#38bdf8' }}>
          <Loader2 size={32} className="spin-animation" style={{ margin: '0 auto 8px' }} />
          <p>Loading departments & workload stats...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {departments.map((d) => (
            <div key={d.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700 }}>
                      {d.code}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                      {d.name}
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      background: d.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: d.isActive ? '#34d399' : '#fca5a5',
                      border: `1px solid ${d.isActive ? '#10b981' : '#ef4444'}`,
                    }}
                  >
                    {d.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {d.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.825rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} color="#38bdf8" />
                    <span>Head: <strong style={{ color: '#e2e8f0' }}>{d.headOfficerName || 'Not Designated'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="#fbbf24" />
                    <span>SLA Turnaround: <strong style={{ color: '#fbbf24' }}>{d.slaHours} hours</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} color="#94a3b8" />
                    <span>{d.contactEmail}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="#94a3b8" />
                    <span>{d.contactPhone}</span>
                  </div>
                </div>

                {/* Workload Stats */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '0.5rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Total Cases</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>{d.totalComplaints || 0}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Active Open</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24' }}>{d.openComplaints || 0}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Resolved</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>{d.resolvedComplaints || 0}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => openEditModal(d)}>
                  <Edit3 size={13} /> Edit
                </button>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(d.id)}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
                {editingDept ? 'Edit Department' : 'Add New Municipal Department'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
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

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Department Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Roads & Infrastructure"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Code</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="DEPT_CODE"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Head Officer Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Er. Rajesh Verma"
                    value={formData.headOfficerName}
                    onChange={(e) => setFormData({ ...formData, headOfficerName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">SLA Turnaround (Hours)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.slaHours}
                    onChange={(e) => setFormData({ ...formData, slaHours: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Official Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? <Loader2 size={16} className="spin-animation" /> : <Check size={16} />} Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
