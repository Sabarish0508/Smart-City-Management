import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Wrench, 
  Briefcase, 
  Edit3, 
  Check, 
  X, 
  Loader2, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  STATES_LIST, 
  getCitiesForState, 
  getMunicipalitiesForCity, 
  getWardsForMunicipality 
} from '../../data/locations';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateProfile, isAdmin, isOfficer, isCitizen } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    state: '',
    city: '',
    municipality: '',
    ward: '',
    designation: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user && isOpen) {
      const userState = user.state || 'Tamil Nadu';
      const userCity = user.city || 'Tiruppur';
      const userMun = user.municipality || 'Tiruppur City Municipal Corporation';

      setFormData({
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        state: userState,
        city: userCity,
        municipality: userMun,
        ward: '',
        designation: user.designation || '',
      });
      setIsEditing(false);
      setError('');
      setSuccess('');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    const cities = getCitiesForState(newState);
    const defaultCity = cities.length > 0 ? cities[0] : '';
    const munis = getMunicipalitiesForCity(newState, defaultCity);
    const defaultMun = munis.length > 0 ? munis[0] : '';

    setFormData({
      ...formData,
      state: newState,
      city: defaultCity,
      municipality: defaultMun,
      ward: '',
    });
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    const munis = getMunicipalitiesForCity(formData.state, newCity);
    const defaultMun = munis.length > 0 ? munis[0] : '';

    setFormData({
      ...formData,
      city: newCity,
      municipality: defaultMun,
      ward: '',
    });
  };

  const handleMunicipalityChange = (e) => {
    setFormData({
      ...formData,
      municipality: e.target.value,
      ward: '',
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setError('Full name cannot be empty.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const fullMunicipality = formData.ward 
        ? `${formData.municipality} (${formData.ward})`
        : formData.municipality;

      const payload = {
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        address: formData.address.trim(),
        state: formData.state,
        city: formData.city,
        municipality: fullMunicipality,
        designation: formData.designation,
      };

      await updateProfile(payload);
      setSuccess('Profile details updated successfully in database!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const roleBadgeColor = isAdmin ? '#ef4444' : isOfficer ? '#3b82f6' : '#0ea5e9';
  const roleLabel = isAdmin ? 'Municipal Administrator' : isOfficer ? 'Municipal Field Officer' : 'Verified Resident Citizen';

  const availableCities = getCitiesForState(formData.state);
  const availableMunicipalities = getMunicipalitiesForCity(formData.state, formData.city);
  const availableWards = getWardsForMunicipality(formData.state, formData.city, formData.municipality);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${roleBadgeColor} 0%, rgba(15,23,42,0.9) 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 12px ${roleBadgeColor}66`,
              }}
            >
              {isAdmin ? <ShieldCheck size={22} color="white" /> : isOfficer ? <Wrench size={22} color="white" /> : <User size={22} color="white" />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                {user.fullName}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: `${roleBadgeColor}22`,
                    color: roleBadgeColor,
                    border: `1px solid ${roleBadgeColor}`,
                  }}
                >
                  {roleLabel}
                </span>
                {user.departmentName && (
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    &bull; {user.departmentName}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem' }}>
          {success && (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                color: '#6ee7b7',
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle2 size={16} color="#10b981" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444',
                color: '#fca5a5',
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={16} color="#ef4444" />
              <span>{error}</span>
            </div>
          )}

          {!isEditing ? (
            /* View Profile Mode */
            <div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  background: 'rgba(15, 23, 42, 0.5)',
                  padding: '1.25rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  marginBottom: '1.5rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                    Account Email (Read-Only)
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 600, marginTop: '2px', fontFamily: 'monospace' }}>
                    {user.email}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                    Contact Phone
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#38bdf8', fontWeight: 600, marginTop: '2px' }}>
                    {user.phoneNumber || 'Not provided'}
                  </div>
                </div>

                {(user.designation || isOfficer || isAdmin) && (
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Official Designation
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 600, marginTop: '2px' }}>
                      {user.designation || (isAdmin ? 'Municipal Administrator' : 'Field Engineer')}
                    </div>
                  </div>
                )}

                {user.departmentName && (
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Department Unit
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#60a5fa', fontWeight: 600, marginTop: '2px' }}>
                      {user.departmentName}
                    </div>
                  </div>
                )}

                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                    Jurisdiction & Location
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '2px' }}>
                    {user.address ? `${user.address}, ` : ''}{user.municipality || 'Tiruppur City Municipal Corporation'}, {user.city || 'Tiruppur'}, {user.state || 'Tamil Nadu'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>
                  <Edit3 size={15} /> Edit Profile Details
                </button>
              </div>
            </div>
          ) : (
            /* Edit Profile Mode Form */
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-input"
                    value={formData.fullName}
                    onChange={handleTextChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    className="form-input"
                    value={formData.phoneNumber}
                    onChange={handleTextChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Residential / Office Address</label>
                <input
                  type="text"
                  name="address"
                  className="form-input"
                  value={formData.address}
                  onChange={handleTextChange}
                  placeholder="Street / Flat / Zone..."
                />
              </div>

              {/* Hierarchical Dropdowns: State -> City */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <select
                    name="state"
                    className="form-select"
                    value={formData.state}
                    onChange={handleStateChange}
                    required
                  >
                    {STATES_LIST.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">City</label>
                  <select
                    name="city"
                    className="form-select"
                    value={formData.city}
                    onChange={handleCityChange}
                    required
                  >
                    {availableCities.map((ct) => (
                      <option key={ct} value={ct}>
                        {ct}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Municipality & Ward */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Municipality / Corporation</label>
                  <select
                    name="municipality"
                    className="form-select"
                    value={formData.municipality}
                    onChange={handleMunicipalityChange}
                    required
                  >
                    {availableMunicipalities.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {availableWards.length > 0 && (
                  <div className="form-group">
                    <label className="form-label">Ward / Zone</label>
                    <select
                      name="ward"
                      className="form-select"
                      value={formData.ward}
                      onChange={handleTextChange}
                    >
                      <option value="">-- Keep Current Ward --</option>
                      {availableWards.map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {(isAdmin || isOfficer) && (
                <div className="form-group">
                  <label className="form-label">Official Designation</label>
                  <input
                    type="text"
                    name="designation"
                    className="form-input"
                    value={formData.designation}
                    onChange={handleTextChange}
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setError('');
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-emerald" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 size={16} className="spin-animation" /> Saving...
                    </>
                  ) : (
                    <>
                      <Check size={16} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
