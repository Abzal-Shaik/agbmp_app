import React from 'react';
import { Menu, Bell, ChevronDown, UserCheck, ShieldCheck, CreditCard, LogOut } from 'lucide-react';

export default function Header({ 
  sidebarOpen, 
  setSidebarOpen, 
  selectedOrg, 
  setSelectedOrg, 
  activeRole, 
  setActiveRole,
  currentUser,
  onLogout,
  onOpenNotifications 
}) {

  const handleOrgChange = (e) => {
    const org = e.target.value;
    setSelectedOrg(org);

    if (org === 'Merchants Bank - Cannon Falls') {
      setActiveRole('LenderAdmin');
    } else if (org === 'State Cashier Office') {
      setActiveRole('Cashier');
    } else if (org === 'Ramsey County (MDA Admin)') {
      setActiveRole('MDAAdmin');
    }
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          className="menu-toggle" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title="Toggle Navigation"
        >
          <Menu size={22} />
        </button>
        <span className="system-title">AgBMP Loan Management System</span>
      </div>

      <div className="header-right">
        {/* Dynamic Multi-Org Selector */}
        <select 
          className="org-selector"
          value={selectedOrg}
          onChange={handleOrgChange}
          title="Select Organization to dynamically allocate role permissions"
        >
          <option value="Merchants Bank - Cannon Falls">Merchants Bank - Cannon Falls (Lender Role)</option>
          <option value="State Cashier Office">State Cashier Office (Cashier Role)</option>
          <option value="Ramsey County (MDA Admin)">Ramsey County (MDA Admin Role)</option>
          <option value="Hennepin">Hennepin County (Approver Role)</option>
        </select>

        {/* Notification Bell */}
        <button 
          className="notification-btn" 
          onClick={onOpenNotifications}
          title="View High-Priority Notifications"
        >
          <Bell size={20} />
          <span className="notification-badge">{activeRole === 'LenderAdmin' ? '3' : '5'}</span>
        </button>

        {/* User Details Display */}
        <div 
          className="user-profile" 
          onClick={() => {
            if (activeRole === 'LenderAdmin') setActiveRole('Cashier');
            else if (activeRole === 'Cashier') setActiveRole('MDAAdmin');
            else setActiveRole('LenderAdmin');
          }}
          title="Click to cycle active user role (LenderAdmin -> Cashier -> MDAAdmin)"
        >
          <span className="user-email">
            {currentUser?.email || (activeRole === 'LenderAdmin' ? 'BEHokanson@merchantsbank.com' : (activeRole === 'Cashier' ? 'cashier.sso@mn.gov' : 'mdauserad@yopmail.com'))}
          </span>
          <span className="user-role" style={{ color: '#003865', fontWeight: 700 }}>
            Role: {activeRole} (Switch)
          </span>
        </div>

        {/* Logout Button */}
        {onLogout && (
          <button 
            className="btn btn-primary-outline" 
            onClick={onLogout}
            style={{ padding: '6px 12px', fontSize: '12px', borderColor: '#cbd5e1', color: '#dc2626' }}
            title="Log Out of System"
          >
            <LogOut size={14} /> Log Out
          </button>
        )}
      </div>
    </header>
  );
}
