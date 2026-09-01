import React, { useState, useEffect } from 'react';
import { UserCheck, X, Check, Loader2, AlertCircle } from 'lucide-react';
import { departmentsAPI, officersAPI, complaintsAPI } from '../../services/api';

export default function AssignOfficerModal({ complaint, isOpen, onClose, onAssigned }) {
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedOfficerId, setSelectedOfficerId] = useState('');
  const [priority, setPriority] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && complaint) {
      setFetchingData(true);
      setError('');
      setSelectedDeptId(complaint.assignedDepartment?.id || '');
      setSelectedOfficerId(complaint.assignedOfficer?.id || '');
      setPriority(complaint.priority || 'MEDIUM');
      setRemarks('');

      departmentsAPI
        .getAll()
        .then((deptList) => {
          setDepartments(deptList);
          if (complaint.assignedDepartment?.id) {
            return officersAPI.getAll(complaint.assignedDepartment.id);
          } else if (deptList.length > 0) {
            return officersAPI.getAll(deptList[0].id);
          }
          return [];
        })
        .then((officerList) => {
          setOfficers(officerList);
        })
        .catch((err) => {
          setError('Failed to load departments/officers.');
        })
        .finally(() => {
          setFetchingData(false);
        });
    }
  }, [isOpen, complaint]);

  const handleDeptChange = async (e) => {
    const deptId = e.target.value;
    setSelectedDeptId(deptId);
    setSelectedOfficerId('');
    if (deptId) {
      try {
        const officerList = await officersAPI.getAll(deptId);
        setOfficers(officerList);
      } catch (err) {
        setOfficers([]);
      }
    } else {
      setOfficers([]);
    }
  };

  if (!isOpen || !complaint) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await complaintsAPI.assignOfficer(complaint.id, {
        departmentId: selectedDeptId ? Number(selectedDeptId) : null,
        officerId: selectedOfficerId ? Number(selectedOfficerId) : null,
        priority: priority || null,
        remarks: remarks || null,
      });

      if (onAssigned) {
        onAssigned();
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to assign complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck color="#38bdf8" size={24} /> Assign Municipal Officer
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#94a3b8', marginTop: '2px' }}>
              Case ID: <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{complaint.complaintNumber}</span>
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

          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#e2e8f0', marginBottom: '4px' }}>{complaint.title}</h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{complaint.address}</p>
          </div>

          <div className="form-group">
            <label className="form-label">Responsible Department</label>
            <select className="form-select" value={selectedDeptId} onChange={handleDeptChange} required>
              <option value="">-- Select Department --</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code}) - SLA: {dept.slaHours}h
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Assign Field Engineer / Officer</label>
            <select
              className="form-select"
              value={selectedOfficerId}
              onChange={(e) => setSelectedOfficerId(e.target.value)}
              disabled={fetchingData || officers.length === 0}
            >
              <option value="">-- {officers.length === 0 ? 'No Officers in Department' : 'Select Designated Officer'} --</option>
              {officers.map((off) => (
                <option key={off.id} value={off.id}>
                  {off.fullName} ({off.designation || 'Officer'}) - {off.email}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Priority Escalation</label>
            <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="CRITICAL">CRITICAL (Emergency 6-hour SLA)</option>
              <option value="HIGH">HIGH (Urgent 24-hour SLA)</option>
              <option value="MEDIUM">MEDIUM (Standard SLA)</option>
              <option value="LOW">LOW (Routine)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Assignment Notes / Instructions</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Provide special instructions or field dispatch remarks..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="spin-animation" /> Assigning...
                </>
              ) : (
                <>
                  <Check size={16} /> Confirm Assignment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
