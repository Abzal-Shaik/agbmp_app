import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, AlertTriangle, KeyRound } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Local Pre-Configured Users Database
  const validUsers = [
    {
      username: 'lenderadmin',
      email: 'BEHokanson@merchantsbank.com',
      password: 'password123',
      name: 'Brian Hokanson',
      role: 'LenderAdmin',
      org: 'Merchants Bank - Cannon Falls'
    },
    {
      username: 'mdaadmin',
      email: 'mdauserad@yopmail.com',
      password: 'password123',
      name: 'MDA Administrator',
      role: 'MDAAdmin',
      org: 'Ramsey County (MDA Admin)'
    },
    {
      username: 'cashier',
      email: 'cashier.sso@mn.gov',
      password: 'password123',
      name: 'State Cashier',
      role: 'Cashier',
      org: 'State Cashier Office'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUser = username.trim().toLowerCase();

    // Authenticate credentials against valid local users
    const matchedUser = validUsers.find(
      u => (u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanUser) && u.password === password
    );

    if (matchedUser) {
      onLoginSuccess(matchedUser);
    } else {
      setErrorMessage('Invalid username or password. Please check your credentials and try again.');
    }
  };

  const handleQuickDemoLogin = (demoUser) => {
    setUsername(demoUser.username);
    setPassword(demoUser.password);
    setErrorMessage('');
    onLoginSuccess(demoUser);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100vw', 
      backgroundColor: '#002747', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Open Sans', sans-serif"
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '440px', 
        backgroundColor: '#ffffff', 
        borderRadius: '12px', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden'
      }}>
        
        {/* Top Branding Banner */}
        <div style={{ 
          backgroundColor: '#003865', 
          color: '#ffffff', 
          padding: '28px 24px', 
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '36px', fontWeight: 900, lineHeight: 1, letterSpacing: '-1px' }}>
              m<span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#78be20', borderRadius: '50%', marginLeft: '2px' }}></span>
            </span>
            <span style={{ fontSize: '12px', letterSpacing: '1.5px', fontWeight: 700, color: '#cbd5e1' }}>
              MINNESOTA
            </span>
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '4px 0 0 0' }}>
            AgBMP Loan Management System
          </h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
            Department of Agriculture Secure Portal
          </p>
        </div>

        {/* Login Form Body */}
        <div style={{ padding: '28px 24px' }}>
          
          {/* Error Alert Box */}
          {errorMessage && (
            <div style={{ 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fca5a5', 
              color: '#991b1b', 
              padding: '12px 14px', 
              borderRadius: '6px', 
              marginBottom: '20px', 
              fontSize: '13px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px' 
            }}>
              <AlertTriangle size={18} flexShrink={0} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username Input */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Username or Email Address *
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', color: '#64748b' }} />
                <input 
                  type="text" 
                  required
                  placeholder="e.g. lenderadmin" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Password *
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', color: '#64748b' }} />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 40px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Sign In Button */}
            <button 
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#003865',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <ShieldCheck size={18} /> Sign In to Portal
            </button>
          </form>

          {/* Quick Demo Login Credentials Box */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <KeyRound size={14} color="#003865" /> Quick Demo Credentials (Click to Sign In):
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {validUsers.map((user, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickDemoLogin(user)}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6eff7'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                >
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#003865', display: 'block' }}>
                      {user.role} ({user.username})
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      Password: <code>{user.password}</code>
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>
                    Login ➔
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Copyright */}
        <div style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '12px', textAlign: 'center', fontSize: '11px', color: '#64748b' }}>
          Copyright © 2026 Minnesota Department of Agriculture. All rights reserved.
        </div>

      </div>
    </div>
  );
}
