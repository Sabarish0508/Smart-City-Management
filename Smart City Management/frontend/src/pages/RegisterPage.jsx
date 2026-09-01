import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { departmentsAPI } from '../services/api';
import { 
  Building2, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Briefcase,
  Shield,
  ArrowRight,
  Info,
  Sparkles
} from 'lucide-react';
import { 
  STATES_LIST, 
  getCitiesForState, 
  getMunicipalitiesForCity, 
  getWardsForMunicipality 
} from '../data/locations';

const getInitialFormState = () => ({
  fullName: '',
  email: '',
  phoneNumber: '',
  address: '',
  state: 'Karnataka',
  city: 'Bengaluru',
  municipality: 'Bruhat Bengaluru Mahanagara Palike (BBMP) - South Zone',
  ward: 'Ward 174 - HSR Layout Sectors 1 through 7',
  departmentId: '',
  designation: '',
  password: '',
  confirmPassword: '',
});

export default function RegisterPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'citizen';

  // 4 Distinct Roles: 'citizen' | 'official' | 'head' | 'admin'
  const [activeTab, setActiveTab] = useState(['citizen', 'official', 'head', 'admin'].includes(initialTab) ? initialTab : 'citizen');

  // Form State
  const [formData, setFormData] = useState(getInitialFormState);
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  
  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation error states
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { registerCitizen, registerOfficial } = useAuth();
  const navigate = useNavigate();

  // Fetch active departments for Officer and Head registrations
  useEffect(() => {
    setLoadingDepartments(true);
    departmentsAPI
      .getPublic()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDepartments(data);
          // Set initial default department if none selected
          setFormData((prev) => ({
            ...prev,
            departmentId: prev.departmentId || String(data[0].id),
          }));
        }
      })
      .catch((err) => {
        console.error('Failed to load departments:', err);
      })
      .finally(() => {
        setLoadingDepartments(false);
      });
  }, []);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
    setFieldErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);

    // Provide default designations per role
    setFormData((prev) => ({
      ...prev,
      email: '',
      designation: 
        tab === 'official' ? 'Field Engineer' : 
        tab === 'head' ? 'Department Head / Chief Engineer' : 
        tab === 'admin' ? 'Municipal Administrator' : '',
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'state') {
        const cities = getCitiesForState(value);
        const defaultCity = cities[0] || '';
        const munis = getMunicipalitiesForCity(value, defaultCity);
        const defaultMun = munis[0] || '';
        const wards = getWardsForMunicipality(value, defaultCity, defaultMun);
        updated.city = defaultCity;
        updated.municipality = defaultMun;
        updated.ward = wards[0] || '';
      } else if (name === 'city') {
        const munis = getMunicipalitiesForCity(prev.state, value);
        const defaultMun = munis[0] || '';
        const wards = getWardsForMunicipality(prev.state, value, defaultMun);
        updated.municipality = defaultMun;
        updated.ward = wards[0] || '';
      } else if (name === 'municipality') {
        const wards = getWardsForMunicipality(prev.state, prev.city, value);
        updated.ward = wards[0] || '';
      }
      return updated;
    });

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Helper to get expected email domain or pattern based on role and selected department
  const getExpectedDomainHelper = () => {
    if (activeTab === 'official') {
      return {
        domain: '@municipality.gov.in',
        example: 'username@municipality.gov.in',
        desc: 'Official municipal accounts must use the official domain (@municipality.gov.in).',
      };
    }
    if (activeTab === 'head') {
      const selectedDept = departments.find((d) => String(d.id) === String(formData.departmentId));
      let deptKey = 'departmentname';
      if (selectedDept) {
        const name = (selectedDept.name || '').toLowerCase();
        if (name.includes('road')) deptKey = 'roads';
        else if (name.includes('waste') || name.includes('sanitat')) deptKey = 'waste';
        else if (name.includes('water')) deptKey = 'water';
        else if (name.includes('electr')) deptKey = 'electricity';
        else if (name.includes('drain')) deptKey = 'drainage';
        else if (name.includes('traffic')) deptKey = 'traffic';
        else deptKey = name.replace(/[^a-z0-9]/g, '');
      }
      return {
        domain: `.${deptKey}@gov.in`,
        example: `rajesh.${deptKey}@gov.in`,
        desc: `Department Head email must follow format: username.${deptKey}@gov.in (or official .gov.in domain).`,
      };
    }
    if (activeTab === 'admin') {
      return {
        domain: '@central.gov.in',
        example: 'commissioner@central.gov.in',
        desc: 'Central Administration accounts must use the executive domain (@central.gov.in).',
      };
    }
    return null;
  };

  const applyEmailDomainHelper = (suggestedDomain) => {
    const raw = formData.email.trim();
    let prefix = raw.includes('@') ? raw.split('@')[0] : raw;
    if (!prefix) prefix = (formData.fullName || 'official').toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (activeTab === 'head') {
      if (prefix.includes('.')) {
        prefix = prefix.split('.')[0];
      }
      setFormData((prev) => ({ ...prev, email: `${prefix}${suggestedDomain}` }));
    } else {
      setFormData((prev) => ({ ...prev, email: `${prefix}${suggestedDomain}` }));
    }
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const cleanEmail = formData.email.trim().toLowerCase();

    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';

    if (!cleanEmail) {
      errors.email = 'Official email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      errors.email = 'Please enter a valid email address';
    } else {
      // Role-specific domain checks
      if (activeTab === 'official' && !cleanEmail.endsWith('@municipality.gov.in')) {
        errors.email = 'Municipal Official email must end with @municipality.gov.in (e.g. rajesh@municipality.gov.in)';
      } else if (activeTab === 'head') {
        if (!cleanEmail.endsWith('@gov.in') || !cleanEmail.includes('.')) {
          errors.email = 'Department Head email must follow username.departmentname@gov.in (e.g. rajesh.roads@gov.in)';
        }
      } else if (activeTab === 'admin' && !cleanEmail.endsWith('@central.gov.in')) {
        errors.email = 'Central Administration email must end with @central.gov.in (e.g. commissioner@central.gov.in)';
      }
    }

    if (activeTab === 'citizen') {
      if (!formData.phoneNumber.trim()) {
        errors.phoneNumber = 'Mobile number is required';
      } else if (!/^\+?[0-9]{7,15}$/.test(formData.phoneNumber.replace(/[\s-]/g, ''))) {
        errors.phoneNumber = 'Enter a valid mobile phone number';
      }
      if (!formData.address.trim()) errors.address = 'Street address is required';
    }

    if (activeTab === 'head' && !formData.departmentId) {
      errors.departmentId = 'Department assignment is required for Department Head';
    }

    if (activeTab === 'official' && !formData.departmentId) {
      errors.departmentId = 'Department selection is recommended';
    }

    if (!formData.state) errors.state = 'Please select state';
    if (!formData.city) errors.city = 'Please select city';
    if (!formData.municipality) errors.municipality = 'Please select municipality/corporation';

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (activeTab === 'citizen') {
        await registerCitizen({
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phoneNumber: formData.phoneNumber.trim(),
          address: formData.address.trim(),
          state: formData.state,
          city: formData.city,
          municipality: formData.municipality,
          ward: formData.ward,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });

        setSuccess('Citizen account created successfully! Redirecting to Citizen Portal...');
        setTimeout(() => {
          navigate('/citizen');
        }, 1200);
      } else {
        const assignedRole = 
          activeTab === 'admin' ? 'ROLE_ADMIN' : 
          activeTab === 'head' ? 'ROLE_HEAD' : 
          'ROLE_OFFICER';

        const officialPayload = {
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phoneNumber: formData.phoneNumber ? formData.phoneNumber.trim() : null,
          role: assignedRole,
          departmentId: formData.departmentId ? Number(formData.departmentId) : null,
          designation: formData.designation ? formData.designation.trim() : null,
          municipality: formData.municipality ? formData.municipality.trim() : 'Central City Municipal Corporation',
          ward: formData.ward ? formData.ward.trim() : null,
          city: formData.city ? formData.city.trim() : 'Bengaluru',
          state: formData.state ? formData.state.trim() : 'Karnataka',
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        };

        await registerOfficial(officialPayload);

        const targetPortal = 
          activeTab === 'admin' ? { name: 'Central Administration', path: '/admin' } :
          activeTab === 'head' ? { name: 'Department Head Command', path: '/dept-head' } :
          { name: 'Municipal Official Portal', path: '/officer' };

        setSuccess(`Official account registered and authorized! Redirecting to ${targetPortal.name}...`);
        setTimeout(() => {
          navigate(targetPortal.path);
        }, 1200);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please review your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const availableCities = formData.state ? getCitiesForState(formData.state) : [];
  const availableMunicipalities = formData.city ? getMunicipalitiesForCity(formData.state, formData.city) : [];
  const availableWards = formData.municipality ? getWardsForMunicipality(formData.state, formData.city, formData.municipality) : [];

  const getTheme = () => {
    switch (activeTab) {
      case 'citizen':
        return {
          primary: '#0ea5e9',
          gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          title: 'Citizen Resident Registration',
          subtitle: 'Register for verified citizen access, file civic complaints, track resolutions, and rate municipal services.',
          badge: 'Public Citizen Access',
          submitText: 'Register Citizen Account',
          icon: <User size={28} color="white" />,
        };
      case 'official':
        return {
          primary: '#10b981',
          gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          title: 'Municipal Field Official Registration',
          subtitle: 'Register as an authorized field engineer or municipal officer to triage tasks, update statuses, and submit resolution proof.',
          badge: 'Municipal Operations',
          submitText: 'Register Municipal Official',
          icon: <ShieldCheck size={28} color="white" />,
        };
      case 'head':
        return {
          primary: '#f59e0b',
          gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          title: 'Department Head Executive Registration',
          subtitle: 'Register as a Department Head to oversee department grievance pipelines, assign field officers, and ensure SLA compliance.',
          badge: 'Department Executive Command',
          submitText: 'Register Department Head',
          icon: <Briefcase size={28} color="white" />,
        };
      case 'admin':
        return {
          primary: '#8b5cf6',
          gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
          title: 'Central Administration Registration',
          subtitle: 'Register as a Municipal Commissioner or System Administrator for city-wide governance and resource management.',
          badge: 'Central Municipal Governance',
          submitText: 'Register Central Administrator',
          icon: <Shield size={28} color="white" />,
        };
      default:
        return {
          primary: '#0ea5e9',
          gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          title: 'Citizen Resident Registration',
          subtitle: 'Register for verified citizen access and incident reporting.',
          badge: 'Public Citizen Access',
          submitText: 'Register Citizen Account',
          icon: <User size={28} color="white" />,
        };
    }
  };

  const theme = getTheme();
  const domainHelper = getExpectedDomainHelper();

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem', maxWidth: '840px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
        <div
          style={{
            width: '58px',
            height: '58px',
            borderRadius: '16px',
            background: theme.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: `0 8px 24px -4px ${theme.primary}66`,
            transition: 'all 0.3s ease',
          }}
        >
          {theme.icon}
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          Smart Civic Portal Registration
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto' }}>
          Choose your role to register your account for reporting, triage, field execution, or municipal administration.
        </p>
      </div>

      {/* Role Switcher Tabs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          background: 'rgba(15, 23, 42, 0.85)',
          padding: '6px',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '2rem',
        }}
      >
        {/* 1. Citizen */}
        <button
          type="button"
          id="tab-register-citizen-btn"
          onClick={() => switchTab('citizen')}
          style={{
            padding: '11px 8px',
            borderRadius: '10px',
            border: activeTab === 'citizen' ? '1px solid #0ea5e9' : '1px solid transparent',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            background: activeTab === 'citizen' ? 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' : 'transparent',
            color: activeTab === 'citizen' ? '#ffffff' : '#94a3b8',
            transition: 'all 0.2s',
          }}
        >
          <User size={15} /> Citizen
        </button>

        {/* 2. Municipal Official */}
        <button
          type="button"
          id="tab-register-official-btn"
          onClick={() => switchTab('official')}
          style={{
            padding: '11px 8px',
            borderRadius: '10px',
            border: activeTab === 'official' ? '1px solid #10b981' : '1px solid transparent',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            background: activeTab === 'official' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
            color: activeTab === 'official' ? '#ffffff' : '#94a3b8',
            transition: 'all 0.2s',
          }}
        >
          <ShieldCheck size={15} /> Municipal Official
        </button>

        {/* 3. Department Head */}
        <button
          type="button"
          id="tab-register-head-btn"
          onClick={() => switchTab('head')}
          style={{
            padding: '11px 8px',
            borderRadius: '10px',
            border: activeTab === 'head' ? '1px solid #f59e0b' : '1px solid transparent',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            background: activeTab === 'head' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
            color: activeTab === 'head' ? '#ffffff' : '#94a3b8',
            transition: 'all 0.2s',
          }}
        >
          <Briefcase size={15} /> Dept Head
        </button>

        {/* 4. Central Admin */}
        <button
          type="button"
          id="tab-register-admin-btn"
          onClick={() => switchTab('admin')}
          style={{
            padding: '11px 8px',
            borderRadius: '10px',
            border: activeTab === 'admin' ? '1px solid #8b5cf6' : '1px solid transparent',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            background: activeTab === 'admin' ? 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' : 'transparent',
            color: activeTab === 'admin' ? '#ffffff' : '#94a3b8',
            transition: 'all 0.2s',
          }}
        >
          <Shield size={15} /> Central Admin
        </button>
      </div>

      {/* DYNAMIC CARD */}
      <div className="glass-card" style={{ padding: '2.5rem', borderTop: `4px solid ${theme.primary}` }}>
        <div style={{ marginBottom: '1.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: theme.primary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {theme.badge}
          </span>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', margin: '6px 0 4px' }}>
            {theme.title}
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: '1.5' }}>
            {theme.subtitle}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              color: '#6ee7b7',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {/* Row 1: Full Name & Mobile */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} color={theme.primary} /> Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                className={`form-input ${fieldErrors.fullName ? 'border-red-500' : ''}`}
                placeholder="e.g. Rajesh Kumar"
                value={formData.fullName}
                onChange={handleChange}
              />
              {fieldErrors.fullName && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{fieldErrors.fullName}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={15} color={theme.primary} /> Contact Phone {activeTab === 'citizen' ? '*' : '(Optional)'}
              </label>
              <input
                type="tel"
                name="phoneNumber"
                className={`form-input ${fieldErrors.phoneNumber ? 'border-red-500' : ''}`}
                placeholder="e.g. +91 98765 43210"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              {fieldErrors.phoneNumber && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{fieldErrors.phoneNumber}</p>}
            </div>
          </div>

          {/* Department Selection (For Official & Dept Head) */}
          {(activeTab === 'official' || activeTab === 'head') && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={15} color={theme.primary} /> Assigned Department {activeTab === 'head' ? '*' : ''}
                </label>
                <select
                  name="departmentId"
                  className={`form-select ${fieldErrors.departmentId ? 'border-red-500' : ''}`}
                  value={formData.departmentId}
                  onChange={handleChange}
                  disabled={loadingDepartments}
                >
                  <option value="">Select Department...</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
                {fieldErrors.departmentId && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{fieldErrors.departmentId}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Briefcase size={15} color={theme.primary} /> Official Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  className="form-input"
                  placeholder={activeTab === 'head' ? 'e.g. Department Head / Chief Engineer' : 'e.g. Field Engineer, Junior Engineer'}
                  value={formData.designation}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* Designation for Central Admin */}
          {activeTab === 'admin' && (
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={15} color={theme.primary} /> Executive Designation
              </label>
              <input
                type="text"
                name="designation"
                className="form-input"
                placeholder="e.g. Municipal Commissioner, City IT Director, Executive Officer"
                value={formData.designation}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Row 2: Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={15} color={theme.primary} /> 
                  {activeTab === 'citizen' ? 'Citizen Email Address *' : 'Official Government Email Address *'}
                </span>
                {domainHelper && (
                  <button
                    type="button"
                    onClick={() => applyEmailDomainHelper(domainHelper.domain)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: `1px solid ${theme.primary}44`,
                      color: theme.primary,
                      borderRadius: '6px',
                      padding: '2px 8px',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                    title="Click to apply domain helper"
                  >
                    <Sparkles size={11} /> Format: {domainHelper.domain}
                  </button>
                )}
              </label>
              <input
                type="email"
                name="email"
                className={`form-input ${fieldErrors.email ? 'border-red-500' : ''}`}
                placeholder={
                  activeTab === 'citizen' ? 'citizen@example.com' :
                  activeTab === 'official' ? 'rajkumar@municipality.gov.in' :
                  activeTab === 'head' ? (domainHelper?.example || 'rajesh.roads@gov.in') :
                  'commissioner@central.gov.in'
                }
                value={formData.email}
                onChange={handleChange}
              />
              {domainHelper && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <Info size={13} color={theme.primary} />
                  <span>{domainHelper.desc} Example: <strong style={{ color: '#e2e8f0' }}>{domainHelper.example}</strong></span>
                </div>
              )}
              {fieldErrors.email && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{fieldErrors.email}</p>}
            </div>
          </div>

          {/* Citizen Street Address */}
          {activeTab === 'citizen' && (
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color={theme.primary} /> Street Address / Residence *
              </label>
              <input
                type="text"
                name="address"
                className={`form-input ${fieldErrors.address ? 'border-red-500' : ''}`}
                placeholder="e.g. Flat 302, Green Meadows Apartments, 14th Main Rd"
                value={formData.address}
                onChange={handleChange}
              />
              {fieldErrors.address && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{fieldErrors.address}</p>}
            </div>
          )}

          {/* Location Jurisdictions: State, City, Municipality, Ward */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            {/* State */}
            <div className="form-group">
              <label className="form-label">State *</label>
              <select
                name="state"
                className="form-select"
                value={formData.state}
                onChange={handleChange}
              >
                {STATES_LIST.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              {fieldErrors.state && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{fieldErrors.state}</p>}
            </div>

            {/* City */}
            <div className="form-group">
              <label className="form-label">City *</label>
              <select
                name="city"
                className="form-select"
                value={formData.city}
                onChange={handleChange}
                disabled={!formData.state}
              >
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {fieldErrors.city && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{fieldErrors.city}</p>}
            </div>

            {/* Municipality */}
            <div className="form-group">
              <label className="form-label">Municipality / Corporation *</label>
              <select
                name="municipality"
                className="form-select"
                value={formData.municipality}
                onChange={handleChange}
                disabled={!formData.city}
              >
                {availableMunicipalities.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              {fieldErrors.municipality && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{fieldErrors.municipality}</p>}
            </div>

            {/* Ward (For Citizen and Field Officer) */}
            {(activeTab === 'citizen' || activeTab === 'official') && (
              <div className="form-group">
                <label className="form-label">Assigned Ward</label>
                <select
                  name="ward"
                  className="form-select"
                  value={formData.ward}
                  onChange={handleChange}
                  disabled={!formData.municipality}
                >
                  <option value="">All Zones / Jurisdictions</option>
                  {availableWards.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Password & Confirm Password */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={15} color={theme.primary} /> Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`form-input ${fieldErrors.password ? 'border-red-500' : ''}`}
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{fieldErrors.password}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={15} color={theme.primary} /> Confirm Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className={`form-input ${fieldErrors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.confirmPassword && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{fieldErrors.confirmPassword}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="submit-register-btn"
            className="btn btn-lg w-full"
            disabled={loading}
            style={{
              background: theme.gradient,
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.9rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: `0 8px 24px -4px ${theme.primary}66`,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Authorizing Registration...
              </>
            ) : (
              <>
                {theme.submitText} <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
            Already have an authorized account?{' '}
            <Link to={`/login?tab=${activeTab}`} style={{ color: theme.primary, fontWeight: 600, textDecoration: 'none' }}>
              Sign In to {theme.title}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
