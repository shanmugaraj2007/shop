import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase } from 'lucide-react';
import './Login.css';

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="login-page animate-fade-in">
      <div className="login-hero" style={{ paddingBottom: '30px', paddingTop: '60px' }}>
        <h1>KPN TRADERS</h1>
        <p>Select your role to continue</p>
      </div>
      <div className="login-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '40px 20px', marginTop: '20px' }}>
        <button 
          className="btn btn-primary" 
          style={{ padding: '20px', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', borderRadius: '12px' }}
          onClick={() => navigate('/login', { state: { role: 'worker' } })}
        >
          <User size={24} /> Staff
        </button>
        <button 
          className="btn btn-secondary" 
          style={{ padding: '20px', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', borderRadius: '12px', background: '#34495e' }}
          onClick={() => navigate('/login', { state: { role: 'owner' } })}
        >
          <Briefcase size={24} /> Owner
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
