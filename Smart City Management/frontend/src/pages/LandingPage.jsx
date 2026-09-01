import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  ShieldCheck, 
  Cpu, 
  Clock, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  Trash2, 
  Droplets, 
  Zap, 
  Waves, 
  ShieldAlert,
  Users,
  Building2,
  FileCheck,
  HeartHandshake,
  Activity,
  Navigation,
  Lock,
  Layers,
  BarChart3,
  Phone,
  Briefcase,
  Shield,
  Compass,
  MessageSquare,
  HelpCircle,
  Mail,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { categoriesAPI } from '../services/api';

export default function LandingPage() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch complaint categories from backend
    categoriesAPI
      .getAll()
      .then((cats) => setCategories(cats || []))
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  const getCategoryIcon = (code) => {
    switch (code) {
      case 'ROADS':
        return <AlertTriangle size={24} color="#f59e0b" />;
      case 'SOLID_WASTE':
        return <Trash2 size={24} color="#10b981" />;
      case 'WATER_SUPPLY':
        return <Droplets size={24} color="#0ea5e9" />;
      case 'ELECTRICITY':
        return <Zap size={24} color="#eab308" />;
      case 'DRAINAGE':
        return <Waves size={24} color="#6366f1" />;
      case 'TRAFFIC_SAFETY':
        return <ShieldAlert size={24} color="#ef4444" />;
      default:
        return <Building2 size={24} color="#38bdf8" />;
    }
  };

  const workflowSteps = [
    {
      num: '01',
      title: 'Report',
      description: 'Citizen submits a civic issue with description, precise GPS location pin, and optional photo evidence.',
      icon: <PlusCircle size={22} color="#38bdf8" />,
    },
    {
      num: '02',
      title: 'AI Analysis',
      description: 'AI understands the description, identifies category and severity, detects duplicates, and recommends the department.',
      icon: <Cpu size={22} color="#a855f7" />,
    },
    {
      num: '03',
      title: 'Department Assignment',
      description: 'Complaint is routed to the responsible municipal department with clear SLA response deadlines.',
      icon: <Layers size={22} color="#3b82f6" />,
    },
    {
      num: '04',
      title: 'Field Response',
      description: 'Authorized field engineers and inspectors receive direct work orders and execute on-site remediation.',
      icon: <Navigation size={22} color="#10b981" />,
    },
    {
      num: '05',
      title: 'SLA Monitoring',
      description: 'The platform monitors response turnaround times with automated escalations for delayed cases.',
      icon: <Clock size={22} color="#f59e0b" />,
    },
    {
      num: '06',
      title: 'Resolution & Feedback',
      description: 'After the issue is resolved on-site with photographic proof, the citizen is required to provide rating and feedback.',
      icon: <HeartHandshake size={22} color="#06b6d4" />,
    },
  ];

  const aiCapabilities = [
    {
      title: 'Natural Language Understanding',
      desc: 'Parses complex citizen grievance descriptions to extract key incident context, landmarks, and urgency signals automatically.',
      icon: <MessageSquare size={22} color="#38bdf8" />,
    },
    {
      title: 'Multimodal Image Analysis',
      desc: 'Analyzes submitted hazard images to verify physical damage, evaluate severity, and correlate with reported complaint details.',
      icon: <Sparkles size={22} color="#a855f7" />,
    },
    {
      title: 'Automated Category & Priority Triage',
      desc: 'Evaluates public safety risks to classify complaints into Low, Medium, High, or Critical priority tiers instantaneously.',
      icon: <TrendingUp size={22} color="#f59e0b" />,
    },
    {
      title: 'Intelligent Department Routing',
      desc: 'Recommends and routes work orders to the exact responsible municipal department (Roads, Water, Waste, Electrical, Drainage).',
      icon: <Building2 size={22} color="#10b981" />,
    },
    {
      title: 'Duplicate Incident Detection',
      desc: 'Correlates geographic proximity and semantic similarity to prevent redundant dispatches and consolidate citizen reports.',
      icon: <Layers size={22} color="#6366f1" />,
    },
    {
      title: 'Contextual Civic Assistant',
      desc: 'Provides structured guidance on municipal bylaws, grievance filing procedures, and emergency contacts.',
      icon: <Cpu size={22} color="#06b6d4" />,
    },
  ];

  const platformFeatures = [
    {
      title: 'AI-Powered Complaint Triage',
      desc: 'Automated natural language analysis, severity classification, and urgency scoring upon issue submission.',
      icon: <Cpu size={20} color="#38bdf8" />,
    },
    {
      title: 'GIS & Location Intelligence',
      desc: 'Interactive Leaflet geospatial mapping plots incident coordinates and visualizes hazard clusters across municipal wards.',
      icon: <MapPin size={20} color="#10b981" />,
    },
    {
      title: 'Smart Department Assignment',
      desc: 'Automated and administrative routing to dedicated departments with SLA timeframes.',
      icon: <Building2 size={20} color="#3b82f6" />,
    },
    {
      title: 'Field Operations Management',
      desc: 'Direct work orders for municipal field engineers with on-site GPS navigation and proof-of-work uploads.',
      icon: <Navigation size={20} color="#f59e0b" />,
    },
    {
      title: 'SLA Monitoring & Alerts',
      desc: 'Rigorous service level agreement timers track turnaround times with automated escalation for delayed issues.',
      icon: <Clock size={20} color="#ef4444" />,
    },
    {
      title: 'Analytics & Executive Reports',
      desc: 'Real-time performance metrics, department efficiency scores, and cross-sector grievance distribution.',
      icon: <BarChart3 size={20} color="#a855f7" />,
    },
    {
      title: 'Real-Time Notifications',
      desc: 'Instant alerts keep citizens and municipal officials informed at every stage of grievance resolution.',
      icon: <Activity size={20} color="#06b6d4" />,
    },
    {
      title: 'Mandatory Citizen Feedback',
      desc: 'Citizen verification and 1-to-5 star satisfaction ratings ensure high public service quality and accountability.',
      icon: <HeartHandshake size={20} color="#ec4899" />,
    },
    {
      title: 'Secure Role-Based Access',
      desc: 'Strict role separation across Citizen, Municipal Official, Department Head, and Central Administration tiers.',
      icon: <Shield size={20} color="#8b5cf6" />,
    },
  ];

  const accessRoles = [
    {
      role: 'Citizen',
      tagline: 'Grievance Reporting & Verification',
      desc: 'Report municipal issues with GPS location & photos, track case progression in real time, and submit mandatory satisfaction ratings upon completion.',
      color: '#0ea5e9',
      border: '#0284c7',
      bgGradient: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
      btnGradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      icon: <Users size={24} color="#0ea5e9" />,
      link: '/login',
      cta: 'Access Citizen Portal',
    },
    {
      role: 'Municipal Official',
      tagline: 'Field Engineering & Incident Response',
      desc: 'Authorized field engineers and inspectors access direct work orders, navigate to incident coordinates, upload photo proof, and log technical notes.',
      color: '#10b981',
      border: '#059669',
      bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
      btnGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      icon: <ShieldCheck size={24} color="#10b981" />,
      link: '/login',
      cta: 'Official Field Access',
    },
    {
      role: 'Department Head',
      tagline: 'Department Command Center & SLA Governance',
      desc: 'Chief engineers and department heads manage department grievance queues, allocate field resources, oversee SLA adherence, and track analytics.',
      color: '#f59e0b',
      border: '#d97706',
      bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
      btnGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      icon: <Briefcase size={24} color="#f59e0b" />,
      link: '/login',
      cta: 'Department Head Command',
    },
    {
      role: 'Central Administration',
      tagline: 'Municipality-Wide Oversight & Executive Command',
      desc: 'Municipal Commissioner and central executive authorities monitor cross-department performance, general civic triage, city-wide maps, and SLA audit logs.',
      color: '#8b5cf6',
      border: '#6d28d9',
      bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
      btnGradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      icon: <Building2 size={24} color="#8b5cf6" />,
      link: '/login',
      cta: 'Central Admin Portal',
    },
  ];

  return (
    <div style={{ color: '#f8fafc' }}>
      {/* 1. HERO SECTION */}
      <section
        id="about"
        style={{
          position: 'relative',
          padding: '5.5rem 0 5rem',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(14, 165, 233, 0.22) 0%, rgba(15, 23, 42, 0.7) 70%)',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div className="container" style={{ maxWidth: '960px' }}>
          {/* Government Platform Tag */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.45rem 1.15rem',
              borderRadius: '9999px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#38bdf8',
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '1.75rem',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.15)',
            }}
          >
            <ShieldCheck size={16} /> Official Municipal Digital Governance & Response Platform
          </div>

          <h1
            style={{
              fontSize: '3.6rem',
              fontWeight: 900,
              lineHeight: 1.12,
              marginBottom: '1.25rem',
              letterSpacing: '-0.035em',
              background: 'linear-gradient(to bottom right, #ffffff 30%, #93c5fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            One Platform.<br />Better Civic Life.
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: '#94a3b8',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
              maxWidth: '840px',
              margin: '0 auto 2.5rem',
            }}
          >
            Smart Civic connects citizens, municipal officials, department teams and central administration through one intelligent platform for reporting, routing, monitoring and resolving civic issues.
          </p>

          {/* Working Professional CTA Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <Link to="/report" className="btn btn-emerald btn-lg" style={{ padding: '0.9rem 2rem', fontSize: '1rem', fontWeight: 700 }}>
              <PlusCircle size={20} /> Report a Civic Issue
            </Link>
            
            <a href="#how-it-works" className="btn btn-secondary btn-lg" style={{ padding: '0.9rem 1.85rem', fontSize: '1rem' }}>
              <Compass size={18} /> Explore Platform
            </a>

            <Link to="/login" className="btn btn-primary btn-lg" style={{ padding: '0.9rem 1.85rem', fontSize: '1rem', background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' }}>
              <Lock size={17} /> Access Secure Portal
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CIVIC SERVICES / CITY VISUAL SECTION */}
      <section id="civic-services" style={{ padding: '4.75rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Municipal Coverage
            </span>
            <h2 style={{ fontSize: '2.35rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px', marginBottom: '0.5rem' }}>
              Civic Infrastructure & Public Services
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '680px', margin: '0 auto' }}>
              Comprehensive municipal infrastructure sectors supported by dedicated engineering teams, automated triage, and SLA timelines.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="glass-card glass-card-interactive"
                style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                onClick={() => navigate('/report')}
              >
                <div>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                    }}
                  >
                    {getCategoryIcon(cat.code)}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                    {cat.name}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {cat.description}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600 }}>
                    Authority: {cat.defaultDepartment?.name || 'Municipal Response Desk'}
                  </span>
                  <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                    Report Issue <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW SMART CIVIC WORKS (6 Visual Process Steps) */}
      <section id="how-it-works" style={{ padding: '4.75rem 0', background: 'rgba(15, 23, 42, 0.45)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Accountable Lifecycle
            </span>
            <h2 style={{ fontSize: '2.35rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px', marginBottom: '0.5rem' }}>
              How Smart Civic Works
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '680px', margin: '0 auto' }}>
              A transparent, end-to-end municipal grievance resolution lifecycle guaranteeing swift action and verified citizen closure.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {workflowSteps.map((step) => (
              <div
                key={step.num}
                className="glass-card"
                style={{
                  padding: '1.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  borderTop: '3px solid #38bdf8',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {step.icon}
                    </div>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'monospace', color: '#64748b' }}>
                      {step.num}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                    {step.title}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.65 }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. AI CIVIC INTELLIGENCE SECTION */}
      <section id="ai-intelligence" style={{ padding: '4.75rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#a855f7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Advanced Municipal Intelligence
            </span>
            <h2 style={{ fontSize: '2.35rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px', marginBottom: '0.5rem' }}>
              AI-Powered Civic Intelligence
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '680px', margin: '0 auto' }}>
              Built-in intelligent services driving automated grievance parsing, computer vision validation, priority scoring, and department routing.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {aiCapabilities.map((cap, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '1.75rem',
                  borderLeft: '4px solid #a855f7',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: 'rgba(168, 85, 247, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  {cap.icon}
                </div>
                <h3 style={{ fontSize: '1.18rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.45rem' }}>
                  {cap.title}
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.6 }}>
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PLATFORM FEATURES / CAPABILITIES */}
      <section id="features" style={{ padding: '4.75rem 0', background: 'rgba(15, 23, 42, 0.45)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              SMART CIVIC PLATFORM
            </span>
            <h2 style={{ fontSize: '2.35rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px', marginBottom: '0.5rem' }}>
              Comprehensive Platform Capabilities
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '680px', margin: '0 auto' }}>
              Engineered for responsiveness, auditability, and seamless collaboration between citizens and municipal workforces.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {platformFeatures.map((feat, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '1.5rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.55 }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ACCESS LEVELS (4 Distinct Tiers & Colors) */}
      <section id="access-levels" style={{ padding: '4.75rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Role-Based Governance
            </span>
            <h2 style={{ fontSize: '2.35rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px', marginBottom: '0.5rem' }}>
              Four Authorization Access Levels
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '680px', margin: '0 auto' }}>
              Strict security isolation and purpose-built dashboards for citizens, field officers, department heads, and municipal executives.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {accessRoles.map((r, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '2rem 1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `4px solid ${r.color}`,
                }}
              >
                <div>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                    }}
                  >
                    {r.icon}
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.25rem' }}>
                    {r.role}
                  </h3>

                  <div style={{ fontSize: '0.78rem', color: r.color, fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.03em' }}>
                    {r.tagline}
                  </div>

                  <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                    {r.desc}
                  </p>
                </div>

                <Link
                  to={r.link}
                  className="btn btn-primary btn-sm"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    fontWeight: 700,
                    padding: '0.7rem',
                    background: r.btnGradient,
                    border: 'none',
                  }}
                >
                  <Lock size={13} /> {r.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. EMERGENCY / CIVIC HELPLINES */}
      <section id="emergency-helplines" style={{ padding: '4.75rem 0', background: 'rgba(15, 23, 42, 0.45)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div
            className="glass-card"
            style={{
              padding: '2.5rem',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(15, 23, 42, 0.85) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid #ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}
              >
                <ShieldAlert size={28} color="#ef4444" />
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                Municipal Civic Emergency Helplines
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.92rem' }}>
                24x7 Emergency dispatch lines for public safety hazards, electrical faults, and flood emergencies
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
              }}
            >
              <div style={{ background: 'rgba(15, 23, 42, 0.75)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase' }}>Road Hazards</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px', fontFamily: 'monospace' }}>080-22661001</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Crater potholes, caved-in roads</div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.75)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>Sanitation & Waste</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px', fontFamily: 'monospace' }}>080-22661002</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Garbage dumps, biological hazards</div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.75)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#0ea5e9', fontWeight: 700, textTransform: 'uppercase' }}>Water & Sewerage</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px', fontFamily: 'monospace' }}>080-22661003</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Pipeline bursts, sewage overflow</div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.75)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 700, textTransform: 'uppercase' }}>Electrical Hazards</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px', fontFamily: 'monospace' }}>080-22661004</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Fallen live wires, transformer sparking</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CONTACT & SUPPORT SECTION */}
      <section id="contact" style={{ padding: '4.75rem 0' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Municipal Grievance Cell
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px', marginBottom: '0.5rem' }}>
                Contact Municipal Administration
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                Reach out to the central city municipal helpdesk for general inquiries, escalation support, or institutional assistance.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.5rem',
              }}
            >
              <div style={{ padding: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 700, marginBottom: '0.5rem' }}>
                  <Building2 size={18} /> Central Municipal Headquarters
                </div>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                  Central City Municipal Corporation<br />
                  Civic Center, Main Administrative Complex<br />
                  Metro City, PIN: 560001
                </p>
              </div>

              <div style={{ padding: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 700, marginBottom: '0.5rem' }}>
                  <Mail size={18} /> Digital Grievance Cell
                </div>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                  Email: <code>support@municipality.gov.in</code><br />
                  Response SLA: Standard 24–48 Hours<br />
                  Working Hours: Mon–Sat, 09:00 AM – 06:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
