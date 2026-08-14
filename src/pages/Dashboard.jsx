import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { LogOut, Plus, Download, Trash2, FileText, Building2, Package, Bell, ShoppingCart, Eye, EyeOff } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatabaseService } from '../services/db';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || sessionStorage.getItem('role');

  // Protect route
  if (!role) {
    return <Navigate to="/" replace />;
  }

  const [companyName, setCompanyName] = useState('Asian Paints');
  const [items, setItems] = useState([]);
  const [sessionItems, setSessionItems] = useState([]); // Tracks items added in the current session/voucher
  
  const [activeTab, setActiveTab] = useState('entry'); // 'entry', 'book', 'create'
  const [expandedDates, setExpandedDates] = useState({});

  const toggleDate = (dateStr) => {
    setExpandedDates(prev => ({ ...prev, [dateStr]: !prev[dateStr] }));
  };

  // Form State for worker
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

  const handleLogout = () => {
    sessionStorage.removeItem('role');
    navigate('/login');
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!itemName.trim() || !quantity) return;

    const newItem = {
      id: Date.now(),
      name: itemName,
      size: size,
      quantity: quantity
    };

    // Add ONLY to temporary session list (not DB yet)
    setSessionItems([...sessionItems, newItem]);

    setItemName('');
    setQuantity('');
    document.getElementById('itemNameInput')?.focus();
  };

  const removeItem = async (id) => {
    // Only remove from temporary session list
    const updatedSession = sessionItems.filter(item => item.id !== id);
    setSessionItems(updatedSession);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('KPN TRADERS - STOCK SUMMARY', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Brand: ${companyName || 'Not Specified'}`, 14, 35);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 35);

    const targetItems = role === 'worker' ? sessionItems : items;

    const tableData = targetItems.map((item, index) => [
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

  const handleConfirm = async () => {
    if (sessionItems.length === 0) return;
    
    // Save session items to main database stock
    const newItems = [...items, ...sessionItems];
    setItems(newItems);
    await DatabaseService.saveStockItems(newItems);

    setSessionItems([]);
    setCompanyName('Asian Paints');
    setItemName('');
    setQuantity('');
    alert("Stock document confirmed and saved to database successfully!");
  };

  const handleOrder = (item) => {
    alert(`Order placed successfully for: ${item}`);
  };

  const downloadDocumentPDF = (dateStr, dateItems) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('KPN TRADERS - STOCK DOCUMENT', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Date: ${dateStr}`, 14, 35);
    doc.text(`Total Items: ${dateItems.length}`, 150, 35);

    const tableData = dateItems.map((item, index) => [
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

    const safeDate = dateStr.replace(/\//g, '-');
    doc.save(`KPN_Traders_Doc_${safeDate}.pdf`);
  };

  const renderAccountBook = () => {
    // Group by month
    const groupedByMonth = items.reduce((acc, item) => {
      const dateObj = item.updatedAt ? new Date(item.updatedAt) : new Date(Number(item.id));
      const monthKey = dateObj.toLocaleString('en-IN', { month: 'long', year: 'numeric' }); // e.g. "August 2026"
      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(item);
      return acc;
    }, {});

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {Object.keys(groupedByMonth).length > 0 ? (
          Object.entries(groupedByMonth).map(([monthStr, monthItems]) => {
            // Group by date within the month
            const groupedByDate = monthItems.reduce((acc, item) => {
              const dateObj = item.updatedAt ? new Date(item.updatedAt) : new Date(Number(item.id));
              const dateKey = dateObj.toLocaleDateString('en-IN');
              if (!acc[dateKey]) acc[dateKey] = [];
              acc[dateKey].push(item);
              return acc;
            }, {});

            return (
              <div key={monthStr} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ background: '#2c3e50', color: '#fff', padding: '12px 15px', fontWeight: 'bold', fontSize: '15px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{monthStr}</span>
                  <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px' }}>{monthItems.length} Total Entries</span>
                </div>
                <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {Object.entries(groupedByDate).map(([dateStr, dateItems]) => (
                    <div key={dateStr} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                      <div style={{ background: '#4C1D95', color: '#fff', padding: '8px 12px', fontSize: '13px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span>Purchase Date: {dateStr}</span>
                          <span style={{ fontSize: '11px', opacity: 0.8 }}>{dateItems.length} Items</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => toggleDate(dateStr)}
                            style={{ background: '#fff', color: '#4C1D95', border: 'none', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                          >
                            {expandedDates[dateStr] ? <><EyeOff size={14} /> Hide</> : <><Eye size={14} /> View</>}
                          </button>
                          <button 
                            onClick={() => downloadDocumentPDF(dateStr, dateItems)}
                            style={{ background: '#fff', color: '#4C1D95', border: 'none', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                          >
                            <Download size={14} /> PDF
                          </button>
                        </div>
                      </div>
                      
                      {expandedDates[dateStr] && (
                        <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#f9fafb' }}>
                          {dateItems.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: '#fff', borderRadius: '6px', border: '1px solid #f3f4f6' }}>
                              <div>
                                <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '14px' }}>{item.name}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>Variant: {item.size}</div>
                              </div>
                              <div style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px' }}>
                                Qty: {item.quantity}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ color: '#666', fontSize: '14px', textAlign: 'center', padding: '20px', background: '#fff', borderRadius: '12px' }}>
            No purchase entries found in Account Book.
          </div>
        )}
      </div>
    );
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
          
          {/* Tabs Navigation */}
          <div style={{ display: 'flex', background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
            <button 
              onClick={() => setActiveTab('entry')} 
              style={{ flex: 1, padding: '12px 5px', fontSize: '13px', fontWeight: 'bold', border: 'none', cursor: 'pointer', background: activeTab === 'entry' ? '#4C1D95' : 'transparent', color: activeTab === 'entry' ? '#fff' : '#666', transition: '0.2s' }}
            >
              Stock Entry
            </button>
            <button 
              onClick={() => setActiveTab('book')} 
              style={{ flex: 1, padding: '12px 5px', fontSize: '13px', fontWeight: 'bold', border: 'none', cursor: 'pointer', background: activeTab === 'book' ? '#4C1D95' : 'transparent', color: activeTab === 'book' ? '#fff' : '#666', transition: '0.2s' }}
            >
              Account Book
            </button>
            <button 
              onClick={() => setActiveTab('create')} 
              style={{ flex: 1, padding: '12px 5px', fontSize: '13px', fontWeight: 'bold', border: 'none', cursor: 'pointer', background: activeTab === 'create' ? '#4C1D95' : 'transparent', color: activeTab === 'create' ? '#fff' : '#666', transition: '0.2s' }}
            >
              Create Item
            </button>
          </div>

          {activeTab === 'entry' && (
            <div className="animate-fade-in">
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
                        onClick={() => setActiveTab('create')} 
                        style={{ background: 'transparent', border: 'none', color: '#2980b9', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                      >
                        <Plus size={14} /> Add Master
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
                    <Plus size={20} style={{ marginRight: '8px' }} /> Add to Current Entry
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
          )}

          {activeTab === 'book' && (
            <div className="animate-fade-in">
              <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#333' }}>Account Book (Purchases)</h3>
              {renderAccountBook()}
            </div>
          )}

          {activeTab === 'create' && (
            <div className="animate-fade-in" style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#333' }}>Create New Product Name</h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', lineHeight: '1.5' }}>Add a new product to your master list. Once added, it will be available to select during Stock Entry.</p>
              <form onSubmit={(e) => {
                handleAddMasterItem(e);
                alert('Product added successfully!');
                setActiveTab('entry');
              }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: 'bold' }}>New Product Name</label>
                  <input 
                    type="text" 
                    value={newMasterItemName}
                    onChange={(e) => setNewMasterItemName(e.target.value)}
                    placeholder="e.g. Asian Paints Royale" 
                    style={{ width: '100%', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px', outline: 'none', background: '#f9f9f9' }} 
                    required
                  />
                </div>
                <button type="submit" style={{ width: '100%', padding: '15px', background: '#2980b9', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>Save Product</button>
              </form>
            </div>
          )}

        </div>

        {/* Fixed Bottom Action Bar for Active Session */}
        {activeTab === 'entry' && sessionItems.length > 0 && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'white', padding: '15px', boxShadow: '0 -4px 10px rgba(0,0,0,0.05)', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
            <button onClick={downloadPDF} style={{ flex: 1, background: '#2980b9', color: '#fff', border: 'none', borderRadius: '8px', padding: '15px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Download size={20} /> Download PDF
            </button>
            <button onClick={handleConfirm} style={{ flex: 1, background: '#27ae60', color: '#fff', border: 'none', borderRadius: '8px', padding: '15px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <FileText size={20} /> Confirm
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
