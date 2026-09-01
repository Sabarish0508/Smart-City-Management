import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  User, 
  Loader2, 
  AlertCircle,
  Briefcase,
  Shield,
  ArrowRight
} from 'lucide-react';

export default function LoginPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'citizen';

  // 4 Distinct Login Authorization Types: 'citizen' | 'official' | 'head' | 'admin'
  const [activeTab, setActiveTab] = useState(['citizen', 'official', 'head', 'admin'].includes(initialTab) ? initialTab : 'citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { loginCitizen, loginOfficial } = useAuth();
  const navigate = useNavigate();

  // Get return/redirect destination if user was redirected from protected route
  const returnUrl = location.state?.from || searchParams.get('redirect') || null;

  const validateRoleEmail = (role, emailStr) => {
    const clean = emailStr.trim().toLowerCase();
    if (role === 'official') {
      if (!clean.endsWith('@municipality.gov.in')) {
        return 'Municipal Official email must use the official domain (@municipality.gov.in).';
      }
    } else if (role === 'head') {
      if (!clean.endsWith('@gov.in') || !clean.includes('.')) {
        return 'Department Head email must follow username.departmentname@gov.in.';
      }
    } else if (role === 'admin') {
      if (!clean.endsWith('@central.gov.in')) {
        return 'Central Administration email must use the official domain (@central.gov.in).';
      }
    } else if (role === 'citizen') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
        return 'Please enter a valid citizen email address.';
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Role-specific client-side email format validation
    const validationError = validateRoleEmail(activeTab, email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      let res;
      if (activeTab === 'citizen') {
        res = await loginCitizen(email, password);
        if (returnUrl) {
          navigate(returnUrl);
        } else {
          navigate('/citizen');
        }
      } else {
        const expectedRole = 
          activeTab === 'admin' ? 'ROLE_ADMIN' : 
          activeTab === 'head' ? 'ROLE_HEAD' : 
          'ROLE_OFFICER';

        // Municipal Official, Department Head, and Central Administration authenticate through official authority with role verification
        res = await loginOfficial(email, password, expectedRole);
        
        if (returnUrl) {
          navigate(returnUrl);
        } else if (res.role === 'ROLE_ADMIN') {
          navigate('/admin');
        } else if (res.role === 'ROLE_HEAD') {
          navigate('/dept-head');
        } else {
          navigate('/officer');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleTheme = () => {
    switch (activeTab) {
      case 'citizen':
        return {
          color: '#0ea5e9',
          gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          badgeBg: 'rgba(14, 165, 233, 0.12)',
          badgeBorder: 'rgba(14, 165, 233, 0.3)',
          badgeColor: '#7dd3fc',
          name: 'Citizen Portal',
          desc: 'Citizen access for reporting grievances, tracking progress, and providing resolution feedback.',
          emailPlaceholder: 'user@gmail.com',
          icon: <User size={26} color="white" />,
        };
      case 'official':
        return {
          color: '#10b981',
          gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          badgeBg: 'rgba(16, 185, 129, 0.12)',
          badgeBorder: 'rgba(16, 185, 129, 0.3)',
          badgeColor: '#6ee7b7',
          name: 'Municipal Official Portal',
          desc: 'Authorized municipal personnel access for operational triage, field inspections, and multi-department task execution.',
          emailPlaceholder: 'rajkumar@municipality.gov.in',
          icon: <ShieldCheck size={26} color="white" />,
        };
      case 'head':
        return {
          color: '#f59e0b',
          gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          badgeBg: 'rgba(245, 158, 11, 0.12)',
          badgeBorder: 'rgba(245, 158, 11, 0.3)',
          badgeColor: '#fde68a',
          name: 'Department Head Command',
          desc: 'Department Head executive authority for grievance triage, resource allocation, and department SLA compliance.',
          emailPlaceholder: 'rajkumar.roads@gov.in',
          icon: <Briefcase size={26} color="white" />,
        };
      case 'admin':
        return {
          color: '#8b5cf6',
          gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
          badgeBg: 'rgba(139, 92, 246, 0.12)',
          badgeBorder: 'rgba(139, 92, 246, 0.3)',
          badgeColor: '#c4b5fd',
          name: 'Central Administration',
          desc: 'Executive municipal authority for municipality-wide oversight, cross-department analytics, and central governance.',
          emailPlaceholder: 'commissioner@central.gov.in',
          icon: <Building2 size={26} color="white" />,
        };
      default:
        return {
          color: '#0ea5e9',
          gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          badgeBg: 'rgba(14, 165, 233, 0.12)',
          badgeBorder: 'rgba(14, 165, 233, 0.3)',
          badgeColor: '#7dd3fc',
          name: 'Citizen Portal',
          desc: 'Citizen access for reporting grievances and tracking progress.',
          emailPlaceholder: 'citizen@example.com',
          icon: <User size={26} color="white" />,
        };
    }
  };

  const theme = getRoleTheme();

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem', maxWidth: '640px' }}>
      <div className="glass-card" style={{ padding: '2.5rem', borderTop: `4px solid ${theme.color}` }}>
        {/* Portal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: theme.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: `0 8px 20px -4px ${theme.color}55`,
              transition: 'all 0.3s ease',
            }}
          >
            {theme.icon}
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }}>
            Secure Portal Authentication
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
            Smart Civic — Centralized Municipal Grievance & Response System
          </p>
        </div>

        {/* 4 Distinct Role Selection Options with Unique Accents */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
            Select Authorization Account Role
          </label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              background: 'rgba(15, 23, 42, 0.9)',
              padding: '5px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              gap: '6px',
            }}
          >
            {/* 1. Citizen - Blue */}
            <button
              type="button"
              id="tab-citizen-login-btn"
              onClick={() => {
                setActiveTab('citizen');
                setError('');
              }}
              style={{
                padding: '0.7rem 0.5rem',
                borderRadius: '8px',
                border: activeTab === 'citizen' ? '1px solid #0ea5e9' : '1px solid transparent',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: activeTab === 'citizen' ? 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' : 'transparent',
                color: activeTab === 'citizen' ? '#ffffff' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <User size={15} /> Citizen
            </button>

            {/* 2. Municipal Official - Green */}
            <button
              type="button"
              id="tab-official-login-btn"
              onClick={() => {
                setActiveTab('official');
                setError('');
              }}
              style={{
                padding: '0.7rem 0.5rem',
                borderRadius: '8px',
                border: activeTab === 'official' ? '1px solid #10b981' : '1px solid transparent',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: activeTab === 'official' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
                color: activeTab === 'official' ? '#ffffff' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <ShieldCheck size={15} /> Municipal Official
            </button>

            {/* 3. Department Head - Amber/Gold */}
            <button
              type="button"
              id="tab-head-login-btn"
              onClick={() => {
                setActiveTab('head');
                setError('');
              }}
              style={{
                padding: '0.7rem 0.5rem',
                borderRadius: '8px',
                border: activeTab === 'head' ? '1px solid #f59e0b' : '1px solid transparent',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: activeTab === 'head' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
                color: activeTab === 'head' ? '#ffffff' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <Briefcase size={15} /> Department Head
            </button>

            {/* 4. Central Administration - Purple/Indigo */}
            <button
              type="button"
              id="tab-admin-login-btn"
              onClick={() => {
                setActiveTab('admin');
                setError('');
              }}
              style={{
                padding: '0.7rem 0.5rem',
                borderRadius: '8px',
                border: activeTab === 'admin' ? '1px solid #8b5cf6' : '1px solid transparent',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: activeTab === 'admin' ? 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' : 'transparent',
                color: activeTab === 'admin' ? '#ffffff' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <Building2 size={15} /> Central Administration
            </button>
          </div>
        </div>

        {/* Informative Guidance Banner based on active user type */}
        <div
          style={{
            background: theme.badgeBg,
            border: `1px solid ${theme.badgeBorder}`,
            borderRadius: '8px',
            padding: '0.75rem 0.95rem',
            fontSize: '0.8rem',
            color: theme.badgeColor,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {React.cloneElement(theme.icon, { size: 16, color: theme.color, style: { flexShrink: 0 } })}
          <span>{theme.desc}</span>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label">
              <span>
                {activeTab === 'citizen' 
                  ? 'Citizen Email Address' 
                  : activeTab === 'head' 
                  ? 'Department Head Official Email' 
                  : activeTab === 'admin'
                  ? 'Central Administration Email'
                  : 'Municipal Official Email'}
              </span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                placeholder={theme.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail
                size={16}
                color="#64748b"
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          {/* Password with Eye Show/Hide */}
          <div className="form-group">
            <label className="form-label">
              <span>Password</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '2px',
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              marginTop: '0.75rem',
              padding: '0.85rem',
              fontWeight: 700,
              background: theme.gradient,
              border: 'none',
              boxShadow: `0 4px 15px -2px ${theme.color}44`,
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spin-animation" /> Authenticating...
              </>
            ) : (
              `Sign In to ${theme.name}`
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
          Need to register an account?{' '}
          <Link to={`/register?tab=${activeTab}`} style={{ color: theme.color, fontWeight: 600, textDecoration: 'none' }}>
            Go to Registration
          </Link>
        </div>
      </div>
    </div>
  );
}
