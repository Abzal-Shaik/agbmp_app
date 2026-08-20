import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Landmark, 
  Building2, 
  ShieldCheck, 
  BarChart3, 
  BookOpen,
  ChevronDown,
  HelpCircle,
  Receipt,
  CreditCard,
  Users
} from 'lucide-react';

export default function Sidebar({ 
  collapsed, 
  activeView, 
  setActiveView,
  activeRole 
}) {
  return (
    <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-logo">
          <div className="logo-m">
            m
            <span className="logo-m-dot"></span>
          </div>
          {!collapsed && (
            <div className="brand-text">
              <span className="brand-state">MINNESOTA</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {/* Dashboard */}
        <div 
          className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveView('dashboard')}
          title="Dashboard View"
        >
          <div className="nav-item-left">
            <LayoutDashboard className="nav-icon" />
            {!collapsed && <span>Dashboard</span>}
          </div>
        </div>

        {/* Applications */}
        <div 
          className={`nav-item ${activeView === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveView('applications')}
          title="Applications Directory"
        >
          <div className="nav-item-left">
            <FileText className="nav-icon" />
            {!collapsed && <span>Applications</span>}
          </div>
        </div>

        {/* Loans */}
        <div 
          className={`nav-item ${activeView === 'loans' ? 'active' : ''}`}
          onClick={() => setActiveView('loans')}
          title="Active Loans Portfolio"
        >
          <div className="nav-item-left">
            <Landmark className="nav-icon" />
            {!collapsed && <span>Loans</span>}
          </div>
        </div>

        {/* My Org */}
        <div 
          className={`nav-item ${activeView === 'myorg' ? 'active' : ''}`}
          onClick={() => setActiveView('myorg')}
          title="My Organization Settings"
        >
          <div className="nav-item-left">
            <Building2 className="nav-icon" />
            {!collapsed && <span>{activeRole === 'LenderAdmin' ? 'My Org - Lender' : 'My Org'}</span>}
          </div>
        </div>

        {/* Cashier Processing View (for Cashier or Admin roles) */}
        {(activeRole === 'Cashier' || activeRole === 'MDAAdmin') && (
          <div 
            className={`nav-item ${activeView === 'cashier' ? 'active' : ''}`}
            onClick={() => setActiveView('cashier')}
            title="Cashier Remittance Deposit Portal"
          >
            <div className="nav-item-left">
              <CreditCard className="nav-icon" />
              {!collapsed && <span>Cashier Deposit Portal</span>}
            </div>
          </div>
        )}

        {/* MDA User Management (for MDA Admin role) */}
        {(activeRole === 'MDAAdmin') && (
          <div 
            className={`nav-item ${activeView === 'users' ? 'active' : ''}`}
            onClick={() => setActiveView('users')}
            title="MDA User Administration & Role Assignment"
          >
            <div className="nav-item-left">
              <Users className="nav-icon" />
              {!collapsed && <span>User Management</span>}
            </div>
          </div>
        )}

        {/* MDA Repayments Master View (for MDA Admin role) */}
        {(activeRole === 'MDAAdmin') && (
          <div 
            className={`nav-item ${activeView === 'repayments' ? 'active' : ''}`}
            onClick={() => setActiveView('repayments')}
            title="MDA Master Repayments Admin"
          >
            <div className="nav-item-left">
              <Receipt className="nav-icon" />
              {!collapsed && <span>Repayments Master</span>}
            </div>
          </div>
        )}

        {/* Admin */}
        <div className="nav-item" onClick={() => setActiveView(activeRole === 'MDAAdmin' ? 'users' : 'myorg')}>
          <div className="nav-item-left">
            <ShieldCheck className="nav-icon" />
            {!collapsed && <span>Admin</span>}
          </div>
          {!collapsed && <ChevronDown size={14} />}
        </div>
      </nav>
    </aside>
  );
}
