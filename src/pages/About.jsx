import React from 'react';

const About = () => {
  return (
    <div className="login-page animate-fade-in" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f5f7fa', minHeight: '100vh', color: '#333' }}>
      <img src="/kpn-logo.png" alt="KPN Traders Logo" style={{ width: '120px', height: '120px', objectFit: 'contain', margin: '40px 0 20px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }} />
      <h1 style={{ fontSize: '28px', margin: '0 0 10px 0', color: '#4C1D95' }}>KPN TRADERS</h1>
      <p style={{ textAlign: 'center', fontSize: '15px', color: '#666', marginBottom: '30px', maxWidth: '300px' }}>
        A premium and seamless stock management solution for modern hardware and paint shops.
      </p>

      <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', width: '100%' }}>
        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px', color: '#333' }}>Features</h3>
        <ul style={{ paddingLeft: '20px', color: '#555', fontSize: '14px', lineHeight: '1.8' }}>
          <li>Role-based access (Owner & Staff)</li>
          <li>Real-time database sync</li>
          <li>Instant PDF Document generation</li>
          <li>Smart OTP Email verification</li>
          <li>Low stock alerts and automatic tracking</li>
        </ul>
      </div>

      <p style={{ marginTop: 'auto', marginBottom: '20px', fontSize: '12px', color: '#aaa' }}>© {new Date().getFullYear()} KPN Traders. All rights reserved.</p>
    </div>
  );
};

export default About;
