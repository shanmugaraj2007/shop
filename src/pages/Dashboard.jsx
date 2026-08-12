import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Download, Trash2, FileText, Building2, Package } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('Asian Paints');
  const [items, setItems] = useState([]);
  
  // Form State
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
    document.getElementById('itemNameInput').focus();
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('STOCK SUMMARY', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Company: ${companyName || 'Not Specified'}`, 14, 35);
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

    doc.save(`Stock_Report_${companyName || 'Shop'}.pdf`);
  };

  return (
    <div className="dashboard-page" style={{ background: '#e0e5ec', minHeight: '100vh', display: 'flex', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Mobile App Container */}
      <div style={{ width: '100%', maxWidth: '480px', background: '#f5f7fa', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 0 20px rgba(0,0,0,0.1)', minHeight: '100vh' }}>
        
        {/* App Header */}
        <div style={{ background: '#1c4a7e', color: 'white', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 10 }}>
          <h2 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} /> Stock Entry
          </h2>
          <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <LogOut size={22} />
          </button>
        </div>

        <div style={{ padding: '15px', paddingBottom: '100px', flex: 1, overflowY: 'auto' }}>
          
          {/* Company & Date Card */}
          <div style={{ background: '#fff', padding: '15px', borderRadius: '12px', borderTop: '4px solid #2980b9', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '15px' }}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '5px', fontWeight: 'bold' }}>Company Name</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '0 10px', background: '#f9f9f9' }}>
                <Building2 size={16} color="#888" />
                <input 
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Asian Paints" 
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
        </div>

        {/* Fixed Bottom Action Bar */}
        {items.length > 0 && (
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
