import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Info } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  if (['/', '/login', '/signup'].includes(location.pathname)) {
    return null;
  }

  const getStyle = (path) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: location.pathname === path ? '#4C1D95' : '#6B7280',
    textDecoration: 'none',
    padding: '10px 0',
    borderBottom: location.pathname === path ? '3px solid #4C1D95' : '3px solid transparent',
    fontWeight: location.pathname === path ? 'bold' : 'normal',
    transition: 'all 0.2s ease',
    backgroundColor: '#ffffff'
  });

  return (
    <div style={{ display: 'flex', width: '100%', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', zIndex: 100 }}>
      <Link to="/home" style={getStyle('/home')}>
        <Home size={22} style={{ marginBottom: '4px' }} />
        <span style={{ fontSize: '12px' }}>Home</span>
      </Link>
      <Link to="/home" style={getStyle('/home')}>
        <Package size={22} style={{ marginBottom: '4px' }} />
        <span style={{ fontSize: '12px' }}>Stock</span>
      </Link>
      <Link to="/about" style={getStyle('/about')}>
        <Info size={22} style={{ marginBottom: '4px' }} />
        <span style={{ fontSize: '12px' }}>About</span>
      </Link>
    </div>
  );
};

export default Navbar;
