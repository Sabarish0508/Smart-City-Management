import React, { useState } from 'react';
import { Activity, X, Check, Loader2, Upload, CheckCircle2 } from 'lucide-react';
import { complaintsAPI, uploadAPI } from '../../services/api';

export default function StatusUpdateModal({ complaint, isOpen, onClose, onStatusUpdated }) {
  const [status, setStatus] = useState(complaint?.status || 'IN_PROGRESS');
  const [remarks, setRemarks] = useState('');
  const [proofImageFile, setProofImageFile] = useState(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !complaint) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofImageFile(file);
      setProofPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      let finalProofUrl = null;
      if (proofImageFile) {
        setUploadingImage(true);
        const uploadRes = await uploadAPI.uploadImage(proofImageFile);
        finalProofUrl = uploadRes.url;
        setUploadingImage(false);
      }

      await complaintsAPI.updateStatus(complaint.id, {
        status,
        remarks: remarks || `Status transitioned to ${status}`,
        proofImageUrl: finalProofUrl,
      });

      if (onStatusUpdated) {
        onStatusUpdated();
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update status.');
    } finally {
      setSubmitting(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity color="#38bdf8" size={24} /> Update Official Status
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

          <div className="form-group">
            <label className="form-label">New Status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="UNDER_REVIEW">UNDER REVIEW (Initial assessment)</option>
              <option value="ASSIGNED">ASSIGNED (Field personnel dispatched)</option>
              <option value="IN_PROGRESS">IN PROGRESS (Work on-site actively underway)</option>
              <option value="ON_HOLD">ON HOLD (Awaiting materials/permissions)</option>
              <option value="RESOLVED">RESOLVED (Repairs completed, ready for verification)</option>
              <option value="CLOSED">CLOSED (Formally audited and finalized)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Official Progress Remarks / Resolution Notes
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Describe actions taken by field engineers, machinery used, materials deployed..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              required
            />
          </div>

          {/* Proof of Resolution Upload (Especially for RESOLVED) */}
          <div className="form-group">
            <label className="form-label">
              Resolution Proof / Site Photo {status === 'RESOLVED' && <span style={{ color: '#10b981' }}>(Recommended)</span>}
            </label>
            <div
              style={{
                border: '2px dashed rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.4)',
                cursor: 'pointer',
              }}
              onClick={() => document.getElementById('proof-photo-input').click()}
            >
              <input
                type="file"
                id="proof-photo-input"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <Upload size={24} color="#94a3b8" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                {proofImageFile ? proofImageFile.name : 'Click to select repair proof photo'}
              </div>
            </div>

            {proofPreviewUrl && (
              <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                <img
                  src={proofPreviewUrl}
                  alt="Proof Preview"
                  style={{ maxHeight: '140px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}
                />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={status === 'RESOLVED' ? 'btn btn-emerald' : 'btn btn-primary'}
              disabled={submitting || uploadingImage}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="spin-animation" /> Updating Status...
                </>
              ) : (
                <>
                  <Check size={16} /> Update to {status}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
