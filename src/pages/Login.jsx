import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Mail, Lock, ArrowRight } from 'lucide-react';
import ScannerModal from '../components/ScannerModal';
import './Login.css';

const Login = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [role, setRole] = useState('worker');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleScanSuccess = (decodedText) => {
    // In a real app, this would be an API call to verify the token
    console.log(`Scan result: ${decodedText}`);
    setShowScanner(false);
    // Simulate successful login
    setTimeout(() => {
      navigate('/dashboard', { state: { role } });
    }, 500);
  };

  const handleManualLogin = (e) => {
    e.preventDefault();
    setError('');

    // Basic hardcoded validation for demonstration
    if (role === 'worker') {
      if (email === 'worker@kpntraders.com' && password === 'worker123') {
        navigate('/dashboard', { state: { role } });
      } else {
        setError('Invalid Worker Email or Password! (Hint: worker@kpntraders.com / worker123)');
      }
    } else if (role === 'owner') {
      if (email === 'owner@kpntraders.com' && password === 'owner123') {
        navigate('/dashboard', { state: { role } });
      } else {
        setError('Invalid Owner Email or Password! (Hint: owner@kpntraders.com / owner123)');
      }
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
        <div className="role-selection" style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
          <button 
            type="button" 
            className={`btn ${role === 'worker' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ padding: '8px 16px', borderRadius: '20px' }}
            onClick={() => { setRole('worker'); setError(''); }}
          >
            Worker
          </button>
          <button 
            type="button" 
            className={`btn ${role === 'owner' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ padding: '8px 16px', borderRadius: '20px' }}
            onClick={() => { setRole('owner'); setError(''); }}
          >
            Owner
          </button>
        </div>

        <button 
          className="btn btn-primary qr-login-btn"
          onClick={() => setShowScanner(true)}
        >
          <QrCode size={20} style={{ marginRight: '8px' }} />
          Scan QR to Login as {role === 'worker' ? 'Worker' : 'Owner'}
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <form className="login-form" onSubmit={handleManualLogin}>
          {error && <div style={{ color: '#e74c3c', fontSize: '13px', textAlign: 'center', marginBottom: '10px', fontWeight: 'bold' }}>{error}</div>}
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
              placeholder="Password" 
              className="input-field with-icon" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-secondary login-btn">
            Login Manually
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
