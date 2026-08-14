import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, UserPlus } from 'lucide-react';
import { DatabaseService } from '../services/db';
import './Login.css';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState('worker');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const users = await DatabaseService.getUsers();
      if (users[email]) {
        setError('Email already registered. Please login.');
      } else {
        await DatabaseService.saveUser(email, { password, role });
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/login', { state: { role } });
        }, 1500);
      }
    } catch (err) {
      setError('Database error: Unable to create account.');
    }
  };

  return (
    <div className="login-page animate-fade-in">
      <div className="login-hero" style={{ paddingBottom: '20px', paddingTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="/kpn-logo.png" alt="KPN Traders Logo" style={{ width: '100px', height: '100px', objectFit: 'contain', marginBottom: '10px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }} />
        <h1 style={{ fontSize: '24px', margin: '0 0 5px 0', textShadow: '0 2px 4px rgba(0,0,0,0.5)', letterSpacing: '1px' }}>Create Account</h1>
        <p style={{ opacity: 0.9, fontSize: '14px' }}>Register for a new account</p>
      </div>

      <div className="login-content">
        <form className="login-form" onSubmit={handleSignup}>
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
              placeholder="Password" 
              className="input-field with-icon" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <div className="input-group" style={{ marginBottom: '15px' }}>
            <UserPlus className="input-icon" size={20} />
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-field with-icon"
              style={{ width: '100%', paddingLeft: '45px', border: 'none', background: 'transparent', outline: 'none' }}
            >
              <option value="worker">Staff</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary login-btn" style={{ width: '100%', marginTop: '10px' }}>
            Sign Up
            <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/login" state={{ role }} style={{ color: '#3498db', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold' }}>
              Already have an account? Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
