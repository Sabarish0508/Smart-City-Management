import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  PlusCircle, 
  MapPin, 
  Camera, 
  Sparkles, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  Upload, 
  Info,
  CopyCheck,
  Copy,
  ArrowRight,
  Home,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { complaintsAPI, categoriesAPI, aiAPI, uploadAPI } from '../services/api';
import CivicMap from '../components/common/CivicMap';
import PriorityBadge from '../components/common/PriorityBadge';
import { 
  STATES_LIST, 
  getCitiesForState, 
  getMunicipalitiesForCity, 
  getWardsForMunicipality,
  getCoordinatesForLocation
} from '../data/locations';

export default function ReportIssuePage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const defaultState = user?.state || 'Karnataka';
  const initialCities = getCitiesForState(defaultState);
  const defaultCity = user?.city && initialCities.includes(user.city) ? user.city : (initialCities[0] || 'Bengaluru');
  const initialMunis = getMunicipalitiesForCity(defaultState, defaultCity);
  const defaultMun = user?.municipality && initialMunis.includes(user.municipality) ? user.municipality : (initialMunis[0] || '');
  const initialWards = getWardsForMunicipality(defaultState, defaultCity, defaultMun);
  const defaultWard = user?.ward && initialWards.includes(user.ward) ? user.ward : (initialWards[0] || '');
  const defaultCoords = getCoordinatesForLocation(defaultState, defaultCity, defaultMun, defaultWard);

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: initialCategory,
    address: user?.address || '',
    state: defaultState,
    city: defaultCity,
    municipality: defaultMun,
    ward: defaultWard,
    landmark: '',
    pincode: '',
    latitude: defaultCoords.lat,
    longitude: defaultCoords.lng,
    imageUrl: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  
  // Submission Success State
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  const debounceTimer = useRef(null);

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '3.5rem 1.5rem', maxWidth: '820px' }}>
        <div
          className="glass-card"
          style={{
            padding: '3rem 2.5rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.85) 100%)',
            borderTop: '4px solid #10b981',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <PlusCircle size={28} color="#10b981" />
            </div>

            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Municipal Grievance Dispatch
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', margin: '6px 0 10px' }}>
              Report a Civic Hazard or Issue
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
              Submit road hazards, streetlighting defects, garbage overflows, or drainage blockages directly to authorized municipal engineering teams for SLA-tracked resolution.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              padding: '1.25rem',
              background: 'rgba(15, 23, 42, 0.65)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              marginBottom: '2.25rem',
            }}
          >
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '3px' }}>1. AI-Powered Triage</strong>
              Instant severity classification and department recommendation.
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              <strong style={{ color: '#10b981', display: 'block', marginBottom: '3px' }}>2. Direct Work Orders</strong>
              Dispatched straight to field engineers with GPS coordinates.
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '3px' }}>3. Verified Proof & SLA</strong>
              Photo evidence on resolution with citizen rating audit.
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Citizen authentication is required to file a report, receive live status notifications, and verify on-site closure.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to={`/login?redirect=/report`}
                className="btn btn-emerald btn-lg"
                style={{ padding: '0.85rem 2rem', fontWeight: 700 }}
              >
                <Lock size={16} /> Sign In to Report Issue
              </Link>

              <Link
                to="/register"
                className="btn btn-secondary btn-lg"
                style={{ padding: '0.85rem 1.75rem', fontWeight: 700 }}
              >
                Create Citizen Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    categoriesAPI
      .getAll()
      .then((cats) => {
        setCategories(cats);
        if (!formData.categoryId && cats.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: cats[0].id }));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Live AI Triage Debounce on Typing
  useEffect(() => {
    if (formData.title.length > 5 || formData.description.length > 10) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(async () => {
        setAiLoading(true);
        try {
          const res = await aiAPI.analyzeIssue({
            title: formData.title,
            description: formData.description,
            categoryId: formData.categoryId ? Number(formData.categoryId) : null,
            latitude: formData.latitude,
            longitude: formData.longitude,
          });
          setAiAnalysis(res);

          // Auto-select category if not manually selected
          if (!formData.categoryId && res.predictedCategoryId) {
            setFormData((prev) => ({ ...prev, categoryId: res.predictedCategoryId }));
          }
        } catch (e) {
          console.error('AI preview failed', e);
        } finally {
          setAiLoading(false);
        }
      }, 600);
    }
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [formData.title, formData.description, formData.categoryId, formData.latitude, formData.longitude]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    const cities = getCitiesForState(newState);
    const defaultCity = cities.length > 0 ? cities[0] : '';
    const munis = getMunicipalitiesForCity(newState, defaultCity);
    const defaultMun = munis.length > 0 ? munis[0] : '';
    const wards = getWardsForMunicipality(newState, defaultCity, defaultMun);
    const defaultWard = wards.length > 0 ? wards[0] : '';
    const coords = getCoordinatesForLocation(newState, defaultCity, defaultMun, defaultWard);

    setFormData((prev) => ({
      ...prev,
      state: newState,
      city: defaultCity,
      municipality: defaultMun,
      ward: defaultWard,
      latitude: coords.lat,
      longitude: coords.lng,
    }));
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    const munis = getMunicipalitiesForCity(formData.state, newCity);
    const defaultMun = munis.length > 0 ? munis[0] : '';
    const wards = getWardsForMunicipality(formData.state, newCity, defaultMun);
    const defaultWard = wards.length > 0 ? wards[0] : '';
    const coords = getCoordinatesForLocation(formData.state, newCity, defaultMun, defaultWard);

    setFormData((prev) => ({
      ...prev,
      city: newCity,
      municipality: defaultMun,
      ward: defaultWard,
      latitude: coords.lat,
      longitude: coords.lng,
    }));
  };

  const handleMunicipalityChange = (e) => {
    const newMun = e.target.value;
    const wards = getWardsForMunicipality(formData.state, formData.city, newMun);
    const defaultWard = wards.length > 0 ? wards[0] : '';
    const coords = getCoordinatesForLocation(formData.state, formData.city, newMun, defaultWard);

    setFormData((prev) => ({
      ...prev,
      municipality: newMun,
      ward: defaultWard,
      latitude: coords.lat,
      longitude: coords.lng,
    }));
  };

  const handleWardChange = (e) => {
    const newWard = e.target.value;
    const coords = getCoordinatesForLocation(formData.state, formData.city, formData.municipality, newWard);

    setFormData((prev) => ({
      ...prev,
      ward: newWard,
      latitude: coords.lat,
      longitude: coords.lng,
    }));
  };

  const handleLocationSelect = (lat, lng) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please provide an issue title and description.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      let finalImageUrl = formData.imageUrl;
      if (imageFile) {
        setUploadingImage(true);
        const uploadRes = await uploadAPI.uploadImage(imageFile);
        finalImageUrl = uploadRes.url;
        setUploadingImage(false);
      }

      const fullMunicipality = formData.ward 
        ? `${formData.municipality} (${formData.ward})`
        : formData.municipality;

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        categoryId: Number(formData.categoryId),
        address: formData.address.trim(),
        municipality: fullMunicipality,
        city: formData.city,
        state: formData.state,
        landmark: formData.landmark ? formData.landmark.trim() : null,
        pincode: formData.pincode ? formData.pincode.trim() : null,
        latitude: formData.latitude,
        longitude: formData.longitude,
        imageUrl: finalImageUrl || null,
      };

      const createdComplaint = await complaintsAPI.create(payload);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.5 },
      });

      // Show immediate Success Screen with Complaint ID
      setSubmissionSuccess(createdComplaint);
    } catch (err) {
      setError(err.message || 'Failed to file complaint. Please try again.');
    } finally {
      setSubmitting(false);
      setUploadingImage(false);
    }
  };

  const copyComplaintId = () => {
    if (submissionSuccess?.complaintNumber) {
      navigator.clipboard.writeText(submissionSuccess.complaintNumber);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  const availableCities = getCitiesForState(formData.state);
  const availableMunicipalities = getMunicipalitiesForCity(formData.state, formData.city);
  const availableWards = getWardsForMunicipality(formData.state, formData.city, formData.municipality);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '1080px' }}>
      {/* Immediate Success Modal Overlay */}
      {submissionSuccess && (
        <div className="modal-overlay" style={{ backdropFilter: 'blur(12px)', zIndex: 9999 }}>
          <div
            className="modal-content"
            style={{
              maxWidth: '540px',
              textAlign: 'center',
              padding: '2.5rem 2rem',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              background: 'linear-gradient(180deg, #091e17 0%, #0b1329 100%)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.7), 0 0 30px rgba(16, 185, 129, 0.2)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
              }}
            >
              <CheckCircle2 size={36} color="white" />
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
              Complaint Submitted Successfully!
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Your issue has been logged into the municipal dispatch system and assigned to the response team.
            </p>

            {/* Prominent Generated Complaint ID Box */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                Official Complaint Tracking ID
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                <span
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    fontFamily: 'monospace',
                    color: '#38bdf8',
                    letterSpacing: '1px',
                  }}
                >
                  {submissionSuccess.complaintNumber}
                </span>
                <button
                  type="button"
                  onClick={copyComplaintId}
                  title="Copy Complaint ID"
                  style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    color: '#38bdf8',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.78rem',
                  }}
                >
                  {copiedId ? <CheckCircle2 size={14} color="#10b981" /> : <Copy size={14} />}
                  {copiedId ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '10px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <span>Status: <strong style={{ color: '#fbbf24' }}>{submissionSuccess.status || 'SUBMITTED'}</strong></span>
                &bull;
                <span>Dept: <strong style={{ color: '#60a5fa' }}>{submissionSuccess.departmentName || 'Municipal Response Unit'}</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.5rem', fontWeight: 700 }}
                onClick={() => navigate(`/track/${submissionSuccess.complaintNumber}`)}
              >
                Track Complaint Now <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.75rem 1.25rem' }}
                onClick={() => navigate('/citizen')}
              >
                <Home size={16} /> Citizen Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PlusCircle size={28} color="#0ea5e9" /> Report a Civic Infrastructure Issue
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.925rem', marginTop: '4px' }}>
          Our AI engine automatically classifies the problem, identifies hazards, prevents duplicate reports, and assigns it to the municipal response department.
        </p>
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            padding: '0.9rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertTriangle size={18} color="#ef4444" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Left Column: Form Details */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.25rem' }}>
              Issue Information
            </h3>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Complaint Category</label>
              <select
                name="categoryId"
                className="form-select"
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="form-group">
              <label className="form-label">Issue Summary / Title</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. Dangerous crater pothole on Avinashi Road"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Detailed Description of Problem</label>
              <textarea
                name="description"
                className="form-textarea"
                rows={4}
                placeholder="Describe size, depth, waterlogging, obstruction, or risks to vehicles and pedestrians..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Location Hierarchy: State & City */}
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

              <div className="form-group">
                <label className="form-label">Ward / Zone</label>
                <select
                  name="ward"
                  className="form-select"
                  value={formData.ward}
                  onChange={handleWardChange}
                >
                  <option value="">-- Select Ward --</option>
                  {availableWards.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Street Address & Landmark */}
            <div className="form-group">
              <label className="form-label">Street Address / Locality</label>
              <input
                type="text"
                name="address"
                className="form-input"
                placeholder="e.g. 100ft Main Road, Near Central Bus Stand"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Nearest Landmark</label>
                <input
                  type="text"
                  name="landmark"
                  className="form-input"
                  placeholder="e.g. Opp Railway Gate"
                  value={formData.landmark}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Postal Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  className="form-input"
                  placeholder="e.g. 641601"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Photo Attachment */}
            <div className="form-group">
              <label className="form-label">
                <span>Attach Defect Photo</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>JPG / PNG max 15MB</span>
              </label>
              <div
                style={{
                  border: '2px dashed rgba(255,255,255,0.15)',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  textAlign: 'center',
                  background: 'rgba(15, 23, 42, 0.4)',
                  cursor: 'pointer',
                }}
                onClick={() => document.getElementById('issue-photo-file').click()}
              >
                <input
                  type="file"
                  id="issue-photo-file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  style={{ display: 'none' }}
                />
                <Camera size={26} color="#38bdf8" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  {imageFile ? imageFile.name : 'Click to snap or upload issue photo'}
                </div>
              </div>

              {imagePreview && (
                <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxHeight: '160px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: AI Triage Assistant & GPS Map */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Live AI Civic Assistant Card */}
            <div
              className="glass-card"
              style={{
                padding: '1.5rem',
                border: aiAnalysis?.isPotentialHazard
                  ? '1px solid #ef4444'
                  : '1px solid rgba(56, 189, 248, 0.3)',
                background: aiAnalysis?.isPotentialHazard
                  ? 'rgba(239, 68, 68, 0.08)'
                  : 'rgba(15, 23, 42, 0.75)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#38bdf8" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                    AI Civic Engine Assessment
                  </h3>
                </div>
                {aiLoading && <Loader2 size={16} className="spin-animation" color="#38bdf8" />}
              </div>

              {aiAnalysis ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Predicted Urgency:</span>
                    <PriorityBadge priority={aiAnalysis.priority} />
                    <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                      ({Math.round(aiAnalysis.confidenceScore * 100)}% confidence)
                    </span>
                  </div>

                  {aiAnalysis.isPotentialHazard && (
                    <div
                      style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid #ef4444',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        color: '#fca5a5',
                        fontSize: '0.8rem',
                        marginBottom: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <ShieldAlert size={16} color="#ef4444" />
                      <strong>CRITICAL SAFETY HAZARD DETECTED: Auto-routed for emergency dispatch!</strong>
                    </div>
                  )}

                  {aiAnalysis.isDuplicateDetected && (
                    <div
                      style={{
                        background: 'rgba(245, 158, 11, 0.2)',
                        border: '1px solid #f59e0b',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        color: '#fde68a',
                        fontSize: '0.8rem',
                        marginBottom: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <CopyCheck size={16} color="#f59e0b" />
                      <span>Nearby complaint active ({aiAnalysis.duplicateComplaintNumber}). Your report links as corroborating evidence.</span>
                    </div>
                  )}

                  <p style={{ fontSize: '0.825rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                    {aiAnalysis.reasoning}
                  </p>

                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.5rem' }}>
                    Target Department: <strong style={{ color: '#38bdf8' }}>{aiAnalysis.predictedDepartmentName}</strong>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '0.825rem', color: '#64748b', fontStyle: 'italic' }}>
                  Start typing the title and description to see live AI priority classification, risk scoring, and duplicate detection.
                </p>
              )}
            </div>

            {/* GPS Location Leaflet Map Picker */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} color="#38bdf8" /> Pin Incident GPS Location
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Click map to adjust pin</span>
              </div>

              <CivicMap
                height="240px"
                isPicker={true}
                selectedLocation={{ lat: formData.latitude, lng: formData.longitude }}
                onLocationSelect={handleLocationSelect}
              />

              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.5rem', fontFamily: 'monospace' }}>
                Lat: {formData.latitude.toFixed(5)}, Lng: {formData.longitude.toFixed(5)}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-emerald btn-lg"
              style={{ width: '100%', padding: '0.9rem' }}
              disabled={submitting || uploadingImage}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="spin-animation" /> Submitting & Routing Issue...
                </>
              ) : (
                <>
                  <PlusCircle size={18} /> Submit Civic Complaint
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
