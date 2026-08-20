import React, { useState } from 'react';
import { UserPlus, Shield, Search, CheckCircle, XCircle, Mail, Building, Key } from 'lucide-react';

export default function UserManagementView({ users, onAddUser }) {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    username: '',
    password: 'password123',
    role: 'LenderAdmin',
    org: 'Merchants Bank - Cannon Falls'
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) {
      alert('Please fill in user name and email.');
      return;
    }

    const created = {
      id: `USR-${100 + users.length + 1}`,
      name: newUserForm.name,
      email: newUserForm.email,
      username: newUserForm.username || newUserForm.email.split('@')[0],
      password: newUserForm.password,
      role: newUserForm.role,
      org: newUserForm.org,
      status: 'Active',
      createdDate: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
    };

    onAddUser(created);
    alert(`User "${created.name}" created successfully with role "${created.role}"!`);
    setNewUserForm({ name: '', email: '', username: '', password: 'password123', role: 'LenderAdmin', org: 'Merchants Bank - Cannon Falls' });
    setIsAddUserModalOpen(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.org.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="user-management-view">
      <div className="page-header">
        <div>
          <h1 className="page-title">MDA User Administration & Role Assignment</h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Provision system accounts, assign role permissions (LenderAdmin, Cashier, MDAAdmin), and manage organization access.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddUserModalOpen(true)}>
          <UserPlus size={16} /> Add New System User
        </button>
      </div>

      <div className="tab-content-box" style={{ borderRadius: '8px' }}>
        {/* Table Controls */}
        <div className="table-controls">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Filter Role:</span>
            <select 
              className="select-inline"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="All">All User Roles</option>
              <option value="LenderAdmin">LenderAdmin</option>
              <option value="Cashier">Cashier</option>
              <option value="MDAAdmin">MDAAdmin</option>
            </select>
          </div>

          <div className="search-box">
            <Search className="search-icon" />
            <input 
              type="text" 
              className="search-input"
              placeholder="Search user name, email, org..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users Table */}
        <table className="custom-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>Assigned Role</th>
              <th>Organization</th>
              <th>Status</th>
              <th>Date Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td><code>{user.id}</code></td>
                <td><strong>{user.name}</strong></td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${
                    user.role === 'MDAAdmin' ? 'badge-submitted' : 
                    user.role === 'Cashier' ? 'badge-pending' : ''
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.org}</td>
                <td>
                  <span className="badge badge-submitted" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={10} /> {user.status}
                  </span>
                </td>
                <td>{user.createdDate || '08/01/2026'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={18} />
                <span className="modal-title">Provision New System User</span>
              </div>
              <button className="close-btn" onClick={() => setIsAddUserModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="modal-body" style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input 
                      type="text" 
                      className="form-input"
                      required
                      placeholder="e.g. Sarah Miller"
                      value={newUserForm.name}
                      onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input 
                      type="email" 
                      className="form-input"
                      required
                      placeholder="smiller@merchantsbank.com"
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="smiller (defaults to email prefix)"
                      value={newUserForm.username}
                      onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Initial Password</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={newUserForm.password}
                      onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Assign System Role *</label>
                    <select 
                      className="form-input"
                      value={newUserForm.role}
                      onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    >
                      <option value="LenderAdmin">LenderAdmin (Lender Management)</option>
                      <option value="Cashier">Cashier (Deposit Processing)</option>
                      <option value="MDAAdmin">MDAAdmin (Full Administrator)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Assign Organization *</label>
                    <select 
                      className="form-input"
                      value={newUserForm.org}
                      onChange={(e) => setNewUserForm({ ...newUserForm, org: e.target.value })}
                    >
                      <option value="Merchants Bank - Cannon Falls">Merchants Bank - Cannon Falls</option>
                      <option value="State Cashier Office">State Cashier Office</option>
                      <option value="Ramsey County (MDA Admin)">Ramsey County (MDA Admin)</option>
                      <option value="Hennepin">Hennepin County</option>
                    </select>
                  </div>

                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-primary-outline" onClick={() => setIsAddUserModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create User Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
