import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Mail, Lock, ArrowRight } from 'lucide-react';
import ScannerModal from '../components/ScannerModal';
import './Login.css';

import { DatabaseService } from '../services/db';

const Login = () => {
  const [authMode, setAuthMode] = useState('login'); // 'login', 'signup', 'forgot'
  const [showScanner, setShowScanner] = useState(false);
  const [role, setRole] = useState('worker');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleScanSuccess = (decodedText) => {
    console.log(`Scan result: ${decodedText}`);
    setShowScanner(false);
    setTimeout(() => {
      navigate('/dashboard', { state: { role } });
    }, 500);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const users = await DatabaseService.getUsers();

      if (authMode === 'login') {
        // Login logic
        const user = users[email];
        if (user && user.password === password && user.role === role) {
          navigate('/dashboard', { state: { role: user.role } });
        } else {
          setError('Invalid Email, Password or Role mismatch!');
        }
      } else if (authMode === 'signup') {
        // Sign Up logic
        if (users[email]) {
          setError('Email already registered. Please login.');
        } else {
          await DatabaseService.saveUser(email, { password, role });
          setSuccess('Account created successfully! You can now login.');
          setAuthMode('login');
          setPassword('');
        }
      } else if (authMode === 'forgot') {
        // Forgot Password logic
        if (!users[email]) {
          setError('Email not found. Please register first.');
        } else {
          // Update password keeping the same role
          const userRole = users[email].role;
          await DatabaseService.saveUser(email, { password, role: userRole });
          setSuccess('Password updated successfully! You can now login.');
          setAuthMode('login');
          setPassword('');
        }
      }
    } catch (err) {
      setError('Database error: Unable to authenticate.');
    }
  };

  return (
    <div className="login-page animate-fade-in">
      <div className="login-hero">
        <div className="logo-circle">
          <QrCode size={40} color="white" />
        </div>
        <h1>KPN TRADERS</h1>
        <p>Manage your stock seamlessly.</p>
      </div>

      <div className="login-content">
        <div className="auth-toggle" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: '10px' }}>
          <button 
            type="button" 
            className={`btn ${authMode === 'login' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ padding: '8px 16px', borderRadius: '20px' }}
            onClick={() => { setAuthMode('login'); setError(''); setSuccess(''); }}
          >
            Login
          </button>
          <button 
            type="button" 
            className={`btn ${authMode === 'signup' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ padding: '8px 16px', borderRadius: '20px' }}
            onClick={() => { setAuthMode('signup'); setError(''); setSuccess(''); }}
          >
            Sign Up
          </button>
        </div>

        <div className="role-selection" style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
          <button 
            type="button" 
            className={`btn ${role === 'worker' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ padding: '8px 16px', borderRadius: '20px', flex: 1 }}
            onClick={() => { setRole('worker'); setError(''); }}
          >
            Worker
          </button>
          <button 
            type="button" 
            className={`btn ${role === 'owner' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ padding: '8px 16px', borderRadius: '20px', flex: 1 }}
            onClick={() => { setRole('owner'); setError(''); }}
          >
            Owner
          </button>
        </div>

        {authMode === 'login' && (
          <button 
            className="btn btn-primary qr-login-btn"
            onClick={() => setShowScanner(true)}
            style={{ width: '100%', marginBottom: '20px' }}
          >
            <QrCode size={20} style={{ marginRight: '8px' }} />
            Scan QR to Login as {role === 'worker' ? 'Worker' : 'Owner'}
          </button>
        )}

        {authMode === 'login' && (
          <div className="divider">
            <span>OR</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleAuth}>
          {error && <div style={{ color: '#e74c3c', fontSize: '13px', textAlign: 'center', marginBottom: '10px', fontWeight: 'bold' }}>{error}</div>}
          {success && <div style={{ color: '#2ecc71', fontSize: '13px', textAlign: 'center', marginBottom: '10px', fontWeight: 'bold' }}>{success}</div>}
          
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="input-field with-icon" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input 
              type="password" 
              placeholder={authMode === 'forgot' ? "New Password" : "Password"} 
              className="input-field with-icon" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {authMode === 'login' && (
            <div style={{ textAlign: 'right', marginBottom: '15px' }}>
              <button 
                type="button" 
                onClick={() => { setAuthMode('forgot'); setError(''); setSuccess(''); }}
                style={{ background: 'none', border: 'none', color: '#3498db', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button type="submit" className="btn btn-secondary login-btn" style={{ width: '100%', marginTop: '10px' }}>
            {authMode === 'login' ? 'Login Manually' : authMode === 'signup' ? 'Create Account' : 'Reset Password'}
            <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </button>
        </form>
      </div>

      {showScanner && (
        <ScannerModal 
          onClose={() => setShowScanner(false)} 
          onSuccess={handleScanSuccess} 
        />
      )}
    </div>
  );
};

export default Login;
