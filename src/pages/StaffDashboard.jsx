import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Download, Trash2, FileText, Building2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatabaseService } from '../services/db';
import './Dashboard.css';

const StaffDashboard = () => {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('Asian Paints');
  const [items, setItems] = useState([]);
  const [sessionItems, setSessionItems] = useState([]); // Tracks items added in the current session/voucher

  // Form State for staff
  const [itemName, setItemName] = useState('');
  const [size, setSize] = useState('1 Liter');
  const [quantity, setQuantity] = useState('');

  const sizes = ['1 Liter', '4 Liter', '10 Liter', '20 Liter', '50 kg', '8mm', '10mm', '12mm', 'Custom'];

  const [masterItems, setMasterItems] = useState([]);
  const [showAddMasterModal, setShowAddMasterModal] = useState(false);
  const [newMasterItemName, setNewMasterItemName] = useState('');

  useEffect(() => {
    // Load database data on mount
    const loadDbData = async () => {
      const loadedMaster = await DatabaseService.getMasterItems();
      setMasterItems(loadedMaster);

      const loadedStock = await DatabaseService.getStockItems();
      setItems(loadedStock);
    };
    loadDbData();
  }, []);

  const handleAddMasterItem = async (e) => {
    e.preventDefault();
    if (newMasterItemName.trim() && !masterItems.includes(newMasterItemName.trim())) {
      const updated = await DatabaseService.addMasterItem(newMasterItemName.trim());
      setMasterItems(updated);
      setItemName(newMasterItemName.trim());
      setNewMasterItemName('');
      setShowAddMasterModal(false);
    }
  };

  const handleLogout = () => navigate('/login');

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!itemName.trim() || !quantity) return;

    const newItem = {
      id: Date.now(),
      name: itemName,
      size: size,
      quantity: quantity
    };

    const newItems = [...items, newItem];
    setItems(newItems);
    await DatabaseService.saveStockItems(newItems);
    setSessionItems([...sessionItems, newItem]);

    setItemName('');
    setQuantity('');
    document.getElementById('itemNameInput')?.focus();
  };

  const removeItem = async (id) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    await DatabaseService.saveStockItems(updated);
    setSessionItems(sessionItems.filter(item => item.id !== id));
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('KPN TRADERS - STOCK SUMMARY', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Brand: ${companyName || 'Not Specified'}`, 14, 35);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 35);

    const tableData = sessionItems.map((item, index) => [
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

  const completeDocument = () => {
    downloadPDF();
    setSessionItems([]);
    setCompanyName('Asian Paints');
    setItemName('');
    setQuantity('');
    alert("Document completed and downloaded successfully! You can now start adding new stock.");
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
            <h3 style={{ margin: 0, color: '#333', fontSize: '16px' }}>Welcome, Staff</h3>
          </div>

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <label style={{ fontSize: '13px', color: '#666', fontWeight: 'bold' }}>Item Name / Description</label>
                  <button 
                    type="button" 
                    onClick={() => setShowAddMasterModal(true)} 
                    style={{ background: 'transparent', border: 'none', color: '#2980b9', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    <Plus size={14} /> Add New
                  </button>
                </div>
                <input
                  id="itemNameInput"
                  type="text"
                  list="master-items"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Type to search or select..."
                  style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '15px', outline: 'none' }}
                  autoComplete="off"
                />
                <datalist id="master-items">
                  {masterItems.map(item => <option key={item} value={item} />)}
                </datalist>
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
          {sessionItems.length > 0 && (
            <div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#666', paddingLeft: '5px' }}>Added Items ({sessionItems.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {sessionItems.map((item, index) => (
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

        {/* Fixed Bottom Action Bar for Staff */}
        {sessionItems.length > 0 && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'white', padding: '15px', boxShadow: '0 -4px 10px rgba(0,0,0,0.05)', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
            <button onClick={downloadPDF} style={{ flex: 1, background: '#2980b9', color: '#fff', border: 'none', borderRadius: '8px', padding: '15px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Download size={20} /> Download PDF
            </button>
            <button onClick={completeDocument} style={{ flex: 1, background: '#27ae60', color: '#fff', border: 'none', borderRadius: '8px', padding: '15px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <FileText size={20} /> Complete
            </button>
          </div>
        )}
      </div>

      {/* Add Master Item Modal */}
      {showAddMasterModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#333' }}>Add New Stock Item</h3>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>Add a new item to your master list so you can select it anytime.</p>
            <form onSubmit={handleAddMasterItem}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '5px', fontWeight: 'bold' }}>Item Name</label>
                <input 
                  type="text" 
                  value={newMasterItemName}
                  onChange={(e) => setNewMasterItemName(e.target.value)}
                  placeholder="e.g. Asian Paints Royale" 
                  style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '15px', outline: 'none' }} 
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowAddMasterModal(false)} style={{ flex: 1, padding: '12px', background: '#eee', color: '#333', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#2980b9', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
