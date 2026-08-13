import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Package, Bell } from 'lucide-react';
import { DatabaseService } from '../services/db';
import './Dashboard.css';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Load database data on mount
    const loadDbData = async () => {
      const loadedStock = await DatabaseService.getStockItems();
      setItems(loadedStock);
    };
    loadDbData();
  }, []);

  const handleLogout = () => navigate('/login');

  const handleOrder = (item) => {
    alert(`Order placed successfully for: ${item}`);
  };

  return (
    <div className="dashboard-page" style={{ background: '#e0e5ec', minHeight: '100vh', display: 'flex', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      {/* Mobile App Container */}
      <div style={{ width: '100%', maxWidth: '480px', background: '#f5f7fa', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 0 20px rgba(0,0,0,0.1)', minHeight: '100vh' }}>
        
        {/* App Header */}
        <div style={{ background: '#1c4a7e', color: 'white', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 10 }}>
          <h2 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
            KPN TRADERS
          </h2>
          <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <LogOut size={22} />
          </button>
        </div>

        <div style={{ padding: '15px', paddingBottom: '100px', flex: 1, overflowY: 'auto' }}>
          
          {/* Welcome Banner */}
          <div style={{ marginBottom: '15px', padding: '10px 5px' }}>
            <h3 style={{ margin: 0, color: '#333', fontSize: '16px' }}>Welcome, Owner</h3>
          </div>

          {/* Stats Card */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1, background: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center', borderLeft: '4px solid #10B981' }}>
              <Package size={24} color="#10B981" style={{ margin: '0 auto 5px' }} />
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                {items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Total Stock Items</div>
            </div>
            <div style={{ flex: 1, background: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center', borderLeft: '4px solid #EF4444' }}>
              <Bell size={24} color="#EF4444" style={{ margin: '0 auto 5px' }} />
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                {items.filter(item => Number(item.quantity) <= 5).length}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Low Stock Alerts</div>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: '15px' }}>
            <div style={{ background: '#FEF2F2', padding: '12px 15px', borderBottom: '1px solid #FEE2E2', color: '#B91C1C', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} /> Low Stock Alerts (Action Required)
            </div>
            <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {items.filter(item => Number(item.quantity) <= 5).length > 0 ? (
                items.filter(item => Number(item.quantity) <= 5).map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#fff5f5', borderRadius: '8px', borderLeft: '4px solid #EF4444' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#333', fontSize: '14px' }}>{item.name} ({item.size})</div>
                      <div style={{ fontSize: '12px', color: '#dc2626' }}>Remaining Qty: {item.quantity}</div>
                    </div>
                    <button 
                      onClick={() => handleOrder(item.name)} 
                      style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Reorder
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ color: '#666', fontSize: '14px', textAlign: 'center' }}>
                  No low stock items currently. All inventory levels healthy!
                </div>
              )}
            </div>
          </div>

          {/* General Stock List */}
          <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div style={{ background: '#F3F4F6', padding: '12px 15px', borderBottom: '1px solid #E5E7EB', color: '#374151', fontWeight: 'bold' }}>
              Current Database Stock ({items.length} Unique Items)
            </div>
            <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {items.length > 0 ? (
                items.map((item, idx) => (
                  <div key={item.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '14px' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Variant: {item.size}</div>
                    </div>
                    <div style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px' }}>
                      Qty: {item.quantity}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#666', fontSize: '14px', textAlign: 'center' }}>
                  No items in database yet. Staff will add items to populate stock.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
