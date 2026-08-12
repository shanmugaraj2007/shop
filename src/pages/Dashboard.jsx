import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Plus, Download, Trash2, FileText, Building2, Package, Bell, ShoppingCart } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || 'worker'; // get role from login

  const [companyName, setCompanyName] = useState('Asian Paints');
  const [items, setItems] = useState([]);
  
  // Form State for worker
  const [itemName, setItemName] = useState('');
  const [size, setSize] = useState('1 Liter');
  const [quantity, setQuantity] = useState('');

  const sizes = ['1 Liter', '4 Liter', '10 Liter', '20 Liter', '50 kg', '8mm', '10mm', '12mm', 'Custom'];

  const handleLogout = () => navigate('/login');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!itemName.trim() || !quantity) return;
    
    setItems([...items, { 
      id: Date.now(), 
      name: itemName, 
      size: size, 
      quantity: quantity 
    }]);
    
    setItemName('');
    setQuantity('');
    document.getElementById('itemNameInput')?.focus();
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('KPN TRADERS - STOCK SUMMARY', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Brand: ${companyName || 'Not Specified'}`, 14, 35);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 35);
    
    const tableData = items.map((item, index) => [
      index + 1,
      item.name,
      item.size,
      item.quantity
    ]);

    autoTable(doc, {
      head: [['S.No', 'Item Description', 'Size/Variant', 'Qty']],
      body: tableData,
      startY: 45,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 11 }
    });

    doc.save(`KPN_Traders_${companyName || 'Stock'}.pdf`);
  };

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
            <h3 style={{ margin: 0, color: '#333', fontSize: '16px' }}>Welcome, {role === 'owner' ? 'Owner' : 'Worker'}</h3>
          </div>

          {role === 'owner' ? (
            /* ==============================
               OWNER VIEW
               ============================== */
            <>
              {/* Stats Card */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1, background: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center', borderLeft: '4px solid #10B981' }}>
                  <Package size={24} color="#10B981" style={{ margin: '0 auto 5px' }} />
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>450</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Total Stock</div>
                </div>
                <div style={{ flex: 1, background: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center', borderLeft: '4px solid #EF4444' }}>
                  <Bell size={24} color="#EF4444" style={{ margin: '0 auto 5px' }} />
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>2</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Low Stock</div>
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: '15px' }}>
                <div style={{ background: '#FEF2F2', padding: '12px 15px', borderBottom: '1px solid #FEE2E2', color: '#B91C1C', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bell size={18} /> Low Stock Alerts (Action Required)
                </div>
                <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  
                  {/* Alert Item 1 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#333', fontSize: '15px' }}>Asian Paints Royale (20L)</div>
                      <div style={{ color: '#EF4444', fontSize: '13px', marginTop: '2px' }}>Only 5 buckets left in stock</div>
                    </div>
                    <button onClick={() => handleOrder('Asian Paints Royale (20L)')} style={{ background: '#4F46E5', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                      <ShoppingCart size={14} /> Order
                    </button>
                  </div>

                  {/* Alert Item 2 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#333', fontSize: '15px' }}>UltraTech Cement (50kg)</div>
                      <div style={{ color: '#EF4444', fontSize: '13px', marginTop: '2px' }}>Only 10 bags left in stock</div>
                    </div>
                    <button onClick={() => handleOrder('UltraTech Cement (50kg)')} style={{ background: '#4F46E5', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                      <ShoppingCart size={14} /> Order
                    </button>
                  </div>

                </div>
              </div>

              {/* General Stock List */}
              <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ background: '#F3F4F6', padding: '12px 15px', borderBottom: '1px solid #E5E7EB', color: '#374151', fontWeight: 'bold' }}>
                  Current Available Stock
                </div>
                <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
                    <span style={{ color: '#333', fontSize: '14px' }}>Tractor Emulsion (20L)</span>
                    <span style={{ color: '#10B981', fontWeight: 'bold', fontSize: '14px' }}>45 buckets</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
                    <span style={{ color: '#333', fontSize: '14px' }}>Tata Steel (12mm)</span>
                    <span style={{ color: '#10B981', fontWeight: 'bold', fontSize: '14px' }}>120 bundles</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#333', fontSize: '14px' }}>Ambuja Cement (50kg)</span>
                    <span style={{ color: '#10B981', fontWeight: 'bold', fontSize: '14px' }}>200 bags</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* ==============================
               WORKER VIEW
               ============================== */
            <>
              {/* Brand & Date Card */}
              <div style={{ background: '#fff', padding: '15px', borderRadius: '12px', borderTop: '4px solid #2980b9', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '15px' }}>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '5px', fontWeight: 'bold' }}>Brand Name</label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '0 10px', background: '#f9f9f9' }}>
                    <Building2 size={16} color="#888" />
                    <input 
                      type="text" 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Asian Paints, UltraTech" 
                      style={{ width: '100%', padding: '10px', border: 'none', background: 'transparent', fontSize: '15px', outline: 'none' }} 
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '5px', fontWeight: 'bold' }}>Date</label>
                  <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px', background: '#eef', fontWeight: 'bold', color: '#333', fontSize: '15px' }}>
                    {new Date().toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Add Item Form Card */}
              <div style={{ background: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '15px' }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Add New Item</h3>
                <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '5px' }}>Item Name / Description</label>
                    <input 
                      id="itemNameInput"
                      type="text" 
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="e.g. Royale Play" 
                      style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '15px', outline: 'none' }} 
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '5px' }}>Size / Variant</label>
                      <select 
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '15px', background: 'white', outline: 'none' }}
                      >
                        {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '5px' }}>Quantity</label>
                      <input 
                        type="number" 
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Qty" 
                        style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '15px', outline: 'none' }} 
                      />
                    </div>
                  </div>
                  <button type="submit" style={{ background: '#27ae60', color: '#fff', border: 'none', borderRadius: '8px', padding: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px', marginTop: '5px' }}>
                    <Plus size={20} style={{ marginRight: '8px' }} /> Add to List
                  </button>
                </form>
              </div>

              {/* Mobile List View (replaces table) */}
              {items.length > 0 && (
                <div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#666', paddingLeft: '5px' }}>Added Items ({items.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {items.map((item, index) => (
                      <div key={item.id} style={{ background: '#fff', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #2980b9' }}>
                        <div style={{ background: '#eef', color: '#2980b9', width: '24px', height: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', marginRight: '12px' }}>
                          {index + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#333' }}>{item.name}</div>
                          <div style={{ fontSize: '13px', color: '#777', display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <span style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>{item.size}</span>
                            <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <button onClick={() => removeItem(item.id)} style={{ background: '#fee', border: 'none', color: '#e74c3c', width: '36px', height: '36px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Fixed Bottom Action Bar for Worker */}
        {role === 'worker' && items.length > 0 && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'white', padding: '15px', boxShadow: '0 -4px 10px rgba(0,0,0,0.05)', borderTop: '1px solid #eee' }}>
            <button onClick={downloadPDF} style={{ width: '100%', background: '#2980b9', color: '#fff', border: 'none', borderRadius: '8px', padding: '15px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Download size={22} /> Download PDF Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
