import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { QrCode, Mail, Lock, ArrowRight } from 'lucide-react';
import ScannerModal from '../components/ScannerModal';
import './Login.css';

import { DatabaseService } from '../services/db';

const Login = () => {
  const [authMode, setAuthMode] = useState('login'); // 'login', 'forgot'
  const [showScanner, setShowScanner] = useState(false);
  const location = useLocation();
  const role = location.state?.role || 'worker';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
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

      } else if (authMode === 'forgot') {
        if (forgotStep === 1) {
          if (!users[email]) {
            setError('Email not found. Please register first.');
          } else {
            const mockOtp = Math.floor(1000 + Math.random() * 9000).toString(); // generate 4-digit OTP
            setGeneratedOtp(mockOtp);
            // Simulate sending email:
            alert(`Simulation: OTP sent to ${email} is ${mockOtp}`);
            setSuccess(`OTP sent to ${email}. Please check your inbox.`);
            setForgotStep(2);
          }
          return;
        } else if (forgotStep === 2) {
          if (otp !== generatedOtp) {
            setError('Invalid OTP. Please try again.');
          } else {
            setSuccess('OTP verified successfully. Please enter a new password.');
            setForgotStep(3);
          }
          return;
        } else if (forgotStep === 3) {
          // Update password keeping the same role
          const userRole = users[email].role;
          await DatabaseService.saveUser(email, { password, role: userRole });
          setSuccess('Password updated successfully! You can now login.');
          setAuthMode('login');
          setForgotStep(1);
          setOtp('');
          setPassword('');
        }
      }
    } catch (err) {
      setError('Database error: Unable to authenticate.');
    }
  };

  return (
    <div className="login-page animate-fade-in">
      <div className="login-hero" style={{ paddingBottom: '20px', paddingTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="/kpn-logo.png" alt="KPN Traders Logo" style={{ width: '100px', height: '100px', objectFit: 'contain', marginBottom: '10px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }} />
        <h1 style={{ fontSize: '24px', margin: '0 0 5px 0', textShadow: '0 2px 4px rgba(0,0,0,0.5)', letterSpacing: '1px' }}>KPN TRADERS</h1>
        <p style={{ opacity: 0.9, fontSize: '14px' }}>Login to your {role === 'worker' ? 'Staff' : 'Owner'} account</p>
      </div>

      <div className="login-content">


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
              disabled={authMode === 'forgot' && forgotStep > 1}
              required 
            />
          </div>

          {authMode === 'forgot' && forgotStep === 2 && (
            <div className="input-group">
              <Lock className="input-icon" size={20} />
              <input 
                type="text" 
                placeholder="Enter 4-digit OTP" 
                className="input-field with-icon" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={4}
                required 
              />
            </div>
          )}

          {(!(authMode === 'forgot') || (authMode === 'forgot' && forgotStep === 3)) && (
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
          )}

          {authMode === 'login' && (
            <div style={{ textAlign: 'right', marginBottom: '15px' }}>
              <button 
                type="button" 
                onClick={() => { setAuthMode('forgot'); setError(''); setSuccess(''); setForgotStep(1); setOtp(''); }}
                style={{ background: 'none', border: 'none', color: '#3498db', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button type="submit" className="btn btn-secondary login-btn" style={{ width: '100%', marginTop: '10px' }}>
            {authMode === 'login' ? 'Login Manually' : (authMode === 'forgot' && forgotStep === 1) ? 'Send OTP' : (authMode === 'forgot' && forgotStep === 2) ? 'Verify OTP' : 'Change Password'}
            <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </button>

          {authMode === 'login' && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link to="/signup" state={{ role }} style={{ color: '#3498db', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold' }}>
                Don't have an account? Create one
              </Link>
            </div>
          )}
          {authMode === 'forgot' && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                type="button" 
                onClick={() => { setAuthMode('login'); setError(''); setSuccess(''); setOtp(''); }}
                style={{ background: 'none', border: 'none', color: '#3498db', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Back to Login
              </button>
            </div>
          )}
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
