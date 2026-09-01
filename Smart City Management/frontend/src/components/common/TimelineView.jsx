import React from 'react';
import { CheckCircle2, Clock, UserCheck, Activity, Image as ImageIcon, MessageSquare } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function TimelineView({ timeline = [], currentStatus }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8' }}>
        No timeline events recorded yet.
      </div>
    );
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={{ position: 'relative', paddingLeft: '1.75rem', marginTop: '1rem' }}>
      {/* Vertical timeline line */}
      <div
        style={{
          position: 'absolute',
          left: '7px',
          top: '8px',
          bottom: '8px',
          width: '2px',
          background: 'linear-gradient(to bottom, #0ea5e9, #334155)',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {timeline.map((item, index) => {
          const isLatest = index === timeline.length - 1;
          return (
            <div key={item.id || index} style={{ position: 'relative' }}>
              {/* Timeline Bullet Node */}
              <div
                style={{
                  position: 'absolute',
                  left: '-1.75rem',
                  top: '2px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: isLatest ? '#38bdf8' : '#1e293b',
                  border: `2px solid ${isLatest ? '#38bdf8' : '#64748b'}`,
                  boxShadow: isLatest ? '0 0 10px #38bdf8' : 'none',
                }}
              />

              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '0.85rem 1.1rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginBottom: '0.4rem',
                  }}
                >
                  <StatusBadge status={item.status} />
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {formatDateTime(item.createdAt)}
                  </span>
                </div>

                {item.remarks && (
                  <p style={{ fontSize: '0.88rem', color: '#e2e8f0', margin: '0.4rem 0', lineHeight: 1.5 }}>
                    {item.remarks}
                  </p>
                )}

                {item.updatedBy && (
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.35rem' }}>
                    Updated by: <strong style={{ color: '#94a3b8' }}>{item.updatedBy.fullName}</strong>
                    {item.updatedBy.designation && ` (${item.updatedBy.designation})`}
                  </div>
                )}

                {item.proofImageUrl && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <div style={{ fontSize: '0.78rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <ImageIcon size={13} /> Resolution Proof Photo:
                    </div>
                    <img
                      src={item.proofImageUrl}
                      alt="Work Proof"
                      style={{
                        maxWidth: '220px',
                        maxHeight: '140px',
                        borderRadius: '6px',
                        objectFit: 'cover',
                        border: '1px solid rgba(255,255,255,0.15)',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
