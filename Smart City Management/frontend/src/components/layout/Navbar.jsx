import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  PlusCircle, 
  Search, 
  Bell, 
  LogOut, 
  Shield, 
  Wrench, 
  User, 
  BarChart3, 
  Users, 
  Briefcase,
  Menu,
  X,
  ShieldCheck,
  Zap,
  Lock,
  UserPlus
} from 'lucide-react';
import { notificationsAPI } from '../../services/api';
import NotificationDrawer from '../common/NotificationDrawer';
import ProfileModal from '../common/ProfileModal';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isDeptHead, isOfficer, isCitizen, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchUnread = async () => {
    if (isAuthenticated) {
      try {
        const res = await notificationsAPI.getUnreadCount();
        setUnreadCount(res.unreadCount || 0);
      } catch (err) {
        // silent fail
      }
    } else {
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnread();
      const timer = setInterval(fetchUnread, 30000);
      return () => clearInterval(timer);
    } else {
      setUnreadCount(0);
    }
  }, [isAuthenticated, location.pathname]);

  const handleLogout = () => {
    setUnreadCount(0);
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Role badge color helper
  const getAvatarBadgeColor = () => {
    if (isAdmin) return '#8b5cf6';
    if (isDeptHead) return '#f59e0b';
    if (isOfficer) return '#10b981';
    return '#0ea5e9';
  };

  const getRoleLabel = () => {
    if (isAdmin) return 'Central Administration';
    if (isDeptHead) return 'Department Head';
    if (isOfficer) return 'Municipal Official';
    return 'Citizen';
  };

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        style={{
          background: 'rgba(11, 15, 25, 0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 900,
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#f8fafc' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(2, 132, 199, 0.4)',
              }}
            >
              <Building2 size={22} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Smart Civic
              </div>
              <div style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Municipal Response Platform
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.15rem' }}>
            <Link
              to="/"
              style={{
                color: isActive('/') ? '#38bdf8' : '#cbd5e1',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              Home
            </Link>

            {/* Public Section Jump Links when on Landing */}
            <a
              href="#civic-services"
              onClick={(e) => { e.preventDefault(); scrollToSection('civic-services'); }}
              style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}
            >
              Services
            </a>

            <a
              href="#how-it-works"
              onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}
              style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}
            >
              How It Works
            </a>

            <a
              href="#ai-intelligence"
              onClick={(e) => { e.preventDefault(); scrollToSection('ai-intelligence'); }}
              style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}
            >
              AI Intelligence
            </a>

            <a
              href="#access-levels"
              onClick={(e) => { e.preventDefault(); scrollToSection('access-levels'); }}
              style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}
            >
              Access Portals
            </a>

            <a
              href="#emergency-helplines"
              onClick={(e) => { e.preventDefault(); scrollToSection('emergency-helplines'); }}
              style={{ color: '#f87171', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}
            >
              Helplines
            </a>

            <Link
              to="/track"
              style={{
                color: isActive('/track') ? '#38bdf8' : '#cbd5e1',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Search size={14} /> Track Issue
            </Link>

            {/* Citizen Links */}
            {isCitizen && (
              <>
                <Link
                  to="/citizen"
                  style={{
                    color: isActive('/citizen') ? '#38bdf8' : '#cbd5e1',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  My Complaints
                </Link>
              </>
            )}

            {/* Department Head Links */}
            {isDeptHead && (
              <Link
                to="/dept-head"
                style={{
                  color: isActive('/dept-head') ? '#fbbf24' : '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <Briefcase size={14} color="#fbbf24" /> Department Command
              </Link>
            )}

            {/* Field Officer Links */}
            {isOfficer && !isDeptHead && (
              <Link
                to="/officer"
                style={{
                  color: isActive('/officer') ? '#10b981' : '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <Wrench size={14} /> Field Tasks
              </Link>
            )}

            {/* Central Administration Links */}
            {isAdmin && (
              <Link
                to="/admin"
                style={{
                  color: isActive('/admin') ? '#c4b5fd' : '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <Shield size={14} color="#8b5cf6" /> Central Administration
              </Link>
            )}

            {/* CTAs & Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
              {isAuthenticated ? (
                <>
                  {/* Report Issue Button for Citizens */}
                  {isCitizen && (
                    <Link to="/report" className="btn btn-emerald btn-sm" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      <PlusCircle size={14} /> Report Issue
                    </Link>
                  )}

                  {/* Notification Bell */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsNotifOpen(true);
                      setUnreadCount(0);
                    }}
                    style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      width: '38px',
                      height: '38px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#cbd5e1',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    title="Notifications"
                  >
                    <Bell size={17} />
                    {unreadCount > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-3px',
                          right: '-3px',
                          background: '#ef4444',
                          color: '#ffffff',
                          borderRadius: '9999px',
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* User Profile Button */}
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(true)}
                    style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: `1px solid ${getAvatarBadgeColor()}`,
                      borderRadius: '10px',
                      padding: '0.35rem 0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      color: '#f8fafc',
                    }}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: getAvatarBadgeColor(),
                        color: 'white',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div style={{ textAlign: 'left', display: 'none', lg: 'block' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, lineHeight: 1.2 }}>
                        {user?.fullName?.split(' ')[0]}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: getAvatarBadgeColor() }}>
                        {getRoleLabel()}
                      </div>
                    </div>
                  </button>

                  {/* Logout Button */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      borderRadius: '10px',
                      width: '38px',
                      height: '38px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    title="Sign Out"
                  >
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/report" className="btn btn-secondary btn-sm" style={{ padding: '0.45rem 0.9rem', fontSize: '0.825rem' }}>
                    <PlusCircle size={14} /> Report Issue
                  </Link>

                  <Link 
                    to="/register" 
                    id="nav-register-btn"
                    className="btn btn-secondary btn-sm" 
                    style={{ 
                      padding: '0.45rem 0.9rem', 
                      fontSize: '0.825rem',
                      borderColor: 'rgba(56, 189, 248, 0.4)',
                      color: '#38bdf8'
                    }}
                  >
                    <UserPlus size={14} /> Register
                  </Link>

                  <Link to="/login" id="nav-login-btn" className="btn btn-primary btn-sm" style={{ padding: '0.45rem 1rem', fontSize: '0.825rem', background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' }}>
                    <Lock size={13} /> Secure Portal Login
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#cbd5e1',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            className="mobile-menu-dropdown"
            style={{
              background: 'rgba(11, 15, 25, 0.98)',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '1rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: isActive('/') ? '#38bdf8' : '#cbd5e1', textDecoration: 'none', fontWeight: 600 }}
            >
              Home
            </Link>
            <a
              href="#civic-services"
              onClick={(e) => { e.preventDefault(); scrollToSection('civic-services'); setMobileMenuOpen(false); }}
              style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 600 }}
            >
              Services
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); setMobileMenuOpen(false); }}
              style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 600 }}
            >
              How It Works
            </a>
            <a
              href="#ai-intelligence"
              onClick={(e) => { e.preventDefault(); scrollToSection('ai-intelligence'); setMobileMenuOpen(false); }}
              style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 600 }}
            >
              AI Intelligence
            </a>
            <a
              href="#access-levels"
              onClick={(e) => { e.preventDefault(); scrollToSection('access-levels'); setMobileMenuOpen(false); }}
              style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 600 }}
            >
              Access Portals
            </a>
            <a
              href="#emergency-helplines"
              onClick={(e) => { e.preventDefault(); scrollToSection('emergency-helplines'); setMobileMenuOpen(false); }}
              style={{ color: '#f87171', textDecoration: 'none', fontWeight: 600 }}
            >
              Helplines
            </a>
            <Link
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: isActive('/track') ? '#38bdf8' : '#cbd5e1', textDecoration: 'none', fontWeight: 600 }}
            >
              Track Issue
            </Link>
            <Link
              to="/report"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}
            >
              Report Issue
            </Link>
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <UserPlus size={16} /> Register Account
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ color: '#93c5fd', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Lock size={16} /> Secure Portal Login
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                style={{ background: 'transparent', border: 'none', color: '#f87171', textAlign: 'left', fontWeight: 600, padding: 0, cursor: 'pointer' }}
              >
                Sign Out
              </button>
            )}
          </div>
        )}
      </header>

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onUnreadChange={fetchUnread}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}
