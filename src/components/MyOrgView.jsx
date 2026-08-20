import React, { useState, useEffect } from 'react';
import { Search, FileText, ChevronDown, Edit2, Save, X, UserPlus, MoreVertical, Plus } from 'lucide-react';

export default function MyOrgView({ onOpenStatementModal, selectedOrgHeader = 'Ramsey', currentUserRole = 'MDAAdmin' }) {
  // Region-mapped dataset matching the reference screenshot
  const regionProfiles = {
    'Ramsey': {
      name: 'Ramsey',
      orgName: 'AgBMP Loan Program - Minnesota Dept of Ag',
      address: '4th cross 625 N Robert St, 2nd line, Saint Paul, Minn',
      serviceArea: 'Ramsey',
      primaryContact: 'Yeswanth E',
      orgEmail: 'yeswanth,Test',
      authRepresentative: 'Please Select',
      employees: [
        { id: 1, username: 'yeswanth.emuri@epathusa.net', name: 'Yeswanth Emuri', phone: '(012) 345-6789', role: 'Admin. Admin', receiveNotice: 'true' },
        { id: 2, username: 'anil.kurakula@epathusa.net', name: 'Anil Kumar Kurakula', phone: '(012) 345-6789', role: 'Admin. Admin', receiveNotice: 'false' }
      ],
      lenderList: [
        { id: 'LND-001', lenderName: 'Merchants Bank - Cannon Falls', status: 'Active', totalLoans: 14, activeAmount: '$144,402.30' },
        { id: 'LND-002', lenderName: 'Agribank FCB', status: 'Active', totalLoans: 22, activeAmount: '$210,500.00' }
      ],
      remittances: [
        { id: 1, period: '04/01/2026 - 09/30/2026', repaymentAmount: '$144,402.30', status: 'Submitted' },
        { id: 2, period: '10/01/2025 - 03/31/2026', repaymentAmount: '$89,250.00', status: 'Pending' }
      ]
    },
    'Hennepin': {
      name: 'Hennepin',
      orgName: 'AgBMP Loan Program - Hennepin Region',
      address: 'A-2300 Government Center, Minneapolis, MN 55487',
      serviceArea: 'Hennepin',
      primaryContact: 'David Larson',
      orgEmail: 'dlarson@hennepin.gov',
      authRepresentative: 'Sarah Jenkins',
      employees: [
        { id: 3, username: 'david.larson@hennepin.gov', name: 'David Larson', phone: '(612) 348-3000', role: 'Region Admin', receiveNotice: 'true' }
      ],
      lenderList: [
        { id: 'LND-003', lenderName: 'Minneapolis Central Bank', status: 'Active', totalLoans: 18, activeAmount: '$210,500.00' }
      ],
      remittances: [
        { id: 3, period: '04/01/2026 - 09/30/2026', repaymentAmount: '$210,500.00', status: 'Submitted' }
      ]
    },
    'Merchants Bank - Cannon Falls': {
      name: 'Merchants Bank - Cannon Falls',
      orgName: 'Merchants Bank - Cannon Falls',
      address: '300 Main St W, Cannon Falls, Minnesota, 55009',
      serviceArea: 'Goodhue',
      primaryContact: 'Brian Hokanson',
      orgEmail: 'BEHokanson@merchantsbank.com',
      authRepresentative: 'Brian Hokanson',
      employees: [
        { id: 4, username: 'BEHokanson@merchantsbank.com', name: 'Brian Hokanson', phone: '(507) 263-4214', role: 'Lender Admin', receiveNotice: 'true' }
      ],
      lenderList: [
        { id: 'LND-001', lenderName: 'Merchants Bank - Cannon Falls', status: 'Active', totalLoans: 14, activeAmount: '$144,402.30' }
      ],
      remittances: [
        { id: 1, period: '04/01/2026 - 09/30/2026', repaymentAmount: '$144,402.30', status: 'Submitted' },
        { id: 2, period: '10/01/2025 - 03/31/2026', repaymentAmount: '$89,250.00', status: 'Pending' }
      ]
    }
  };

  // Sync region data with top header selection
  const currentRegionKey = regionProfiles[selectedOrgHeader] ? selectedOrgHeader : 'Ramsey';
  const currentProfile = regionProfiles[currentRegionKey];

  // Editable Form State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...currentProfile });

  // Sync state whenever selectedOrgHeader changes
  useEffect(() => {
    setFormData({ ...currentProfile });
  }, [selectedOrgHeader]);

  // Tab State (Default to Employees tab in MDA view as in screenshot)
  const [activeTab, setActiveTab] = useState(currentUserRole === 'MDAAdmin' ? 'employees' : 'remittance');
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesLimit, setEntriesLimit] = useState(10);

  // Add Contact Modal State
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [newContact, setNewContact] = useState({ username: '', name: '', phone: '', role: 'Admin. Admin', receiveNotice: 'true' });

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleAddContactSubmit = (e) => {
    e.preventDefault();
    if (!newContact.username || !newContact.name) {
      alert('Please fill in user name and email.');
      return;
    }
    currentProfile.employees.push({
      id: Date.now(),
      username: newContact.username,
      name: newContact.name,
      phone: newContact.phone || '(012) 345-6789',
      role: newContact.role,
      receiveNotice: newContact.receiveNotice
    });
    alert(`Contact "${newContact.name}" added successfully!`);
    setIsAddContactOpen(false);
    setNewContact({ username: '', name: '', phone: '', role: 'Admin. Admin', receiveNotice: 'true' });
  };

  return (
    <div className="my-org-view">
      <div className="page-header">
        <h1 className="page-title">My Organization</h1>
      </div>

      {/* Organization Info Box (Reference Screenshot Exact Match) */}
      <div className="org-card">
        <div className="org-card-header">My Organization</div>
        <div className="org-card-body">
          {/* Edit Button top right */}
          <div className="edit-btn-pos">
            {isEditing ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-primary" onClick={handleSave}>
                  <Save size={14} /> Save
                </button>
                <button className="btn btn-primary-outline" onClick={() => setIsEditing(false)}>
                  <X size={14} /> Cancel
                </button>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                <Edit2 size={14} /> Edit
              </button>
            )}
          </div>

          {/* Form Grid - 3 Rows matching Reference Screenshot */}
          <div className="form-grid">
            {/* Row 1: Name, Organization Name, Org Mailing Address */}
            <div className="form-group">
              <label className="form-label">Name</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.name}
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Organization Name</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.orgName}
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Org Mailing Address</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.address}
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            {/* Row 2: Org Service Area(s), Org Primary Contact, Org Email */}
            <div className="form-group">
              <label className="form-label">Org Service Area(s)</label>
              <select 
                className="form-input"
                value={formData.serviceArea}
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
              >
                <option value="Ramsey">Ramsey</option>
                <option value="Hennepin">Hennepin</option>
                <option value="Dakota">Dakota</option>
                <option value="Goodhue">Goodhue</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Org Primary Contact</label>
              <select 
                className="form-input"
                value={formData.primaryContact}
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, primaryContact: e.target.value })}
              >
                <option value="Yeswanth E">Yeswanth E</option>
                <option value="Brian Hokanson">Brian Hokanson</option>
                <option value="David Larson">David Larson</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Org Email</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.orgEmail}
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, orgEmail: e.target.value })}
              />
            </div>

            {/* Row 3: Auth Representative */}
            <div className="form-group">
              <label className="form-label">Auth Representative</label>
              <select 
                className="form-input"
                value={formData.authRepresentative}
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, authRepresentative: e.target.value })}
              >
                <option value="Please Select">Please Select</option>
                <option value="Yeswanth E">Yeswanth E</option>
                <option value="Brian Hokanson">Brian Hokanson</option>
                <option value="Sarah Jenkins">Sarah Jenkins</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* Tabs Bar (Reference Screenshot Exact Tabs) */}
      <div className="tabs-navigation">
        <button 
          className={`tab-btn ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          Employees
        </button>
        <button 
          className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          Service Area Contacts
        </button>
        <button 
          className={`tab-btn ${activeTab === 'lenders' ? 'active' : ''}`}
          onClick={() => setActiveTab('lenders')}
        >
          Lender List
        </button>
        <button 
          className={`tab-btn ${activeTab === 'salenders' ? 'active' : ''}`}
          onClick={() => setActiveTab('salenders')}
        >
          Service Area Lenders
        </button>
        <button 
          className={`tab-btn ${activeTab === 'attachments' ? 'active' : ''}`}
          onClick={() => setActiveTab('attachments')}
        >
          Attachments
        </button>
        <button 
          className={`tab-btn ${activeTab === 'remittance' ? 'active' : ''}`}
          onClick={() => setActiveTab('remittance')}
        >
          Remittance statement
        </button>
      </div>

      {/* Tab Panel Content Area (Light Ice Blue Container) */}
      <div className="tab-content-box">
        
        {/* EMPLOYEES TAB CONTENT (Screenshot Exact Match) */}
        {activeTab === 'employees' && (
          <div>
            {/* Top Action Button */}
            <div style={{ marginBottom: '16px' }}>
              <button className="btn btn-primary" onClick={() => setIsAddContactOpen(true)}>
                <UserPlus size={16} /> Add Contact
              </button>
            </div>

            {/* Table Controls */}
            <div className="table-controls">
              <div className="entries-selector">
                <span>Show</span>
                <select 
                  className="select-inline"
                  value={entriesLimit}
                  onChange={(e) => setEntriesLimit(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
                <span>entries</span>
              </div>

              <div className="search-box">
                <Search className="search-icon" />
                <input 
                  type="text" 
                  className="search-input"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Employees Data Table */}
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Receive Notice Copies</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProfile.employees
                  .filter(emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.username.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((emp) => (
                    <tr key={emp.id}>
                      <td><strong>{emp.username}</strong></td>
                      <td>{emp.name}</td>
                      <td>{emp.phone}</td>
                      <td>{emp.role}</td>
                      <td>{emp.receiveNotice}</td>
                      <td>
                        <button className="btn btn-primary-outline" style={{ padding: '2px 6px', fontSize: '11px' }}>
                          <ChevronDown size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="table-footer">
              <span>Showing 1 to {currentProfile.employees.length} of {currentProfile.employees.length} entries</span>
            </div>
          </div>
        )}

        {/* LENDER LIST TAB CONTENT */}
        {activeTab === 'lenders' && (
          <div>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Lender ID</th>
                  <th>Lender Name</th>
                  <th>Status</th>
                  <th>Total Active Loans</th>
                  <th>Active Loan Balance</th>
                </tr>
              </thead>
              <tbody>
                {currentProfile.lenderList.map((lnd) => (
                  <tr key={lnd.id}>
                    <td><code>{lnd.id}</code></td>
                    <td><strong>{lnd.lenderName}</strong></td>
                    <td><span className="badge badge-submitted">{lnd.status}</span></td>
                    <td>{lnd.totalLoans}</td>
                    <td><strong style={{ color: '#003865' }}>{lnd.activeAmount}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* REMITTANCE STATEMENT TAB CONTENT */}
        {activeTab === 'remittance' && (
          <div>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Remittance Period</th>
                  <th>Repayment Amount</th>
                  <th>Status</th>
                  <th>Statement</th>
                </tr>
              </thead>
              <tbody>
                {currentProfile.remittances.map((item) => (
                  <tr key={item.id}>
                    <td>{item.period}</td>
                    <td><strong>{item.repaymentAmount}</strong></td>
                    <td>
                      <span className={`badge ${item.status === 'Submitted' ? 'badge-submitted' : 'badge-pending'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-primary-outline" 
                        style={{ padding: '4px 12px', fontSize: '12px', background: '#ffffff' }}
                        onClick={() => onOpenStatementModal(item)}
                      >
                        <FileText size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab !== 'employees' && activeTab !== 'lenders' && activeTab !== 'remittance' && (
          <div style={{ padding: '20px 0', color: '#64748b' }}>
            <p style={{ fontWeight: 600 }}>{activeTab.toUpperCase()} Directory Panel for {currentRegionKey}</p>
          </div>
        )}

      </div>

      {/* Add Contact Modal */}
      {isAddContactOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <span>Add New Contact ({currentRegionKey})</span>
              <button onClick={() => setIsAddContactOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleAddContactSubmit}>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" required placeholder="e.g. Yeswanth Emuri" value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} />
                </div>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">User Name / Email *</label>
                  <input className="form-input" required placeholder="yeswanth.emuri@epathusa.net" value={newContact.username} onChange={e => setNewContact({ ...newContact, username: e.target.value })} />
                </div>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" placeholder="(012) 345-6789" value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <input className="form-input" value={newContact.role} onChange={e => setNewContact({ ...newContact, role: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary-outline" onClick={() => setIsAddContactOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
