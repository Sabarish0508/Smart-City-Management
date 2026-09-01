import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, ShieldAlert, ShieldCheck, Lock, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        background: '#090d16',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '3rem 0 1.5rem',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Col 1: System Branding */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.85rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Building2 size={18} color="white" />
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                Smart Civic Management
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1rem' }}>
              Government digital governance & incident response platform connecting citizens, department heads, and municipal field teams for transparent public grievance resolution.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#38bdf8' }}>
              <ShieldCheck size={14} /> Authorized Municipal Platform
            </div>
          </div>

          {/* Col 2: Important Navigation */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.84rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: 0, margin: 0 }}>
              <li>
                <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Home Portal
                </Link>
              </li>
              <li>
                <Link to="/report" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Report a Civic Issue
                </Link>
              </li>
              <li>
                <Link to="/track" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Track Grievance (Login Required)
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Citizen & Official Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Create Account / Official Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Civic Services */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Civic Services
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.84rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: 0, margin: 0 }}>
              <li>Roads & Asphalt Resurfacing</li>
              <li>Solid Waste Management & Sanitation</li>
              <li>Water Supply & Sewerage Network</li>
              <li>Electricity & Public Lighting</li>
              <li>Drainage & Stormwater Flood Control</li>
              <li>Traffic Infrastructure & Safety</li>
            </ul>
          </div>

          {/* Col 4: Emergency Helplines */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={16} color="#ef4444" /> Civic Emergency Lines
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.84rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.45rem', padding: 0, margin: 0 }}>
              <li><strong>Road Hazards:</strong> 080-22661001</li>
              <li><strong>Waste & Sanitation:</strong> 080-22661002</li>
              <li><strong>Water & Drainage:</strong> 080-22661003</li>
              <li><strong>Electrical Hazards:</strong> 080-22661004</li>
              <li style={{ marginTop: '4px', fontSize: '0.78rem', color: '#64748b' }}>
                Operational 24x7 for critical public hazards.
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.78rem',
            color: '#64748b',
          }}
        >
          <div>&copy; {new Date().getFullYear()} Smart Civic Management. Central City Municipal Corporation. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Lock size={12} color="#10b981" /> End-to-End Auditable Governance
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
