import React from 'react';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, UserCheck, Shield, Wrench, User } from 'lucide-react';

export default function DemoBar() {
  const { user, quickDemoLogin, logout } = useAuth();
  const navigate = useNavigate();

  const handleQuickSwitch = async (demoKey) => {
    try {
      const loggedUser = await quickDemoLogin(demoKey);
      if (loggedUser.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else if (loggedUser.role === 'ROLE_OFFICER') {
        navigate('/officer');
      } else {
        navigate('/citizen');
      }
    } catch (err) {
      alert('Quick login failed: ' + err.message);
    }
  };

  const getRoleIcon = (role) => {
    if (role === 'ROLE_ADMIN') return <Shield size={13} color="#ef4444" />;
    if (role === 'ROLE_OFFICER') return <Wrench size={13} color="#3b82f6" />;
    return <User size={13} color="#0ea5e9" />;
  };

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #090d16 0%, #172554 50%, #064e3b 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '0.4rem 1.25rem',
        fontSize: '0.78rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#93c5fd', fontWeight: 600 }}>
        <Sparkles size={14} color="#38bdf8" />
        <span>One-Click Role Evaluator:</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        {DEMO_USERS.map((demo) => {
          const isActive = user?.email === demo.email;
          return (
            <button
              key={demo.key}
              type="button"
              onClick={() => handleQuickSwitch(demo.key)}
              style={{
                background: isActive ? demo.badgeColor : 'rgba(15, 23, 42, 0.7)',
                color: isActive ? '#ffffff' : '#e2e8f0',
                border: `1px solid ${isActive ? 'transparent' : 'rgba(255,255,255,0.15)'}`,
                borderRadius: '6px',
                padding: '0.2rem 0.6rem',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease',
              }}
            >
              {getRoleIcon(demo.role)}
              {demo.label.split(' (')[0]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
