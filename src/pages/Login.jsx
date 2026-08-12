import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Mail, Lock, ArrowRight } from 'lucide-react';
import ScannerModal from '../components/ScannerModal';
import './Login.css';

const Login = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [role, setRole] = useState('worker');
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

  return (
    <div className="login-page animate-fade-in">
      <div className="login-hero">
        <div className="logo-circle">
          <QrCode size={40} color="white" />
        </div>
        <h1>Smart Inventory</h1>
        <p>Manage your stock seamlessly.</p>
      </div>

      <div className="login-content">
        <div className="role-selection" style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
          <button 
            type="button" 
            className={`btn ${role === 'worker' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ padding: '8px 16px', borderRadius: '20px' }}
            onClick={() => setRole('worker')}
          >
            Worker
          </button>
          <button 
            type="button" 
            className={`btn ${role === 'owner' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ padding: '8px 16px', borderRadius: '20px' }}
            onClick={() => setRole('owner')}
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

        <form className="login-form" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard', { state: { role } }); }}>
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input type="email" placeholder="Email Address" className="input-field with-icon" required />
          </div>
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input type="password" placeholder="Password" className="input-field with-icon" required />
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
