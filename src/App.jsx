import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import MyOrgView from './components/MyOrgView';
import ApplicationsView from './components/ApplicationsView';
import LoansView from './components/LoansView';
import MDARepaymentsView from './components/MDARepaymentsView';
import CashierView from './components/CashierView';
import UserManagementView from './components/UserManagementView';
import NewApplicationModal from './components/NewApplicationModal';
import StatementModal from './components/StatementModal';
import NotificationModal from './components/NotificationModal';
import ApplicationDetailModal from './components/ApplicationDetailModal';
import LoginPage from './components/LoginPage';
import Footer from './components/Footer';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = sessionStorage.getItem('agbmp_auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch(e) {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!currentUser);

  // System Users List State (Managed by MDA Admin)
  const [systemUsers, setSystemUsers] = useState([
    { id: 'USR-101', name: 'Brian Hokanson', email: 'BEHokanson@merchantsbank.com', username: 'lenderadmin', role: 'LenderAdmin', org: 'Merchants Bank - Cannon Falls', status: 'Active', createdDate: '08/01/2026' },
    { id: 'USR-102', name: 'MDA Administrator', email: 'mdauserad@yopmail.com', username: 'mdaadmin', role: 'MDAAdmin', org: 'Ramsey', status: 'Active', createdDate: '08/01/2026' },
    { id: 'USR-103', name: 'State Cashier', email: 'cashier.sso@mn.gov', username: 'cashier', role: 'Cashier', org: 'State Cashier Office', status: 'Active', createdDate: '08/01/2026' }
  ]);

  // Navigation & Layout state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedOrg, setSelectedOrg] = useState(currentUser?.org || 'Ramsey');
  const [activeRole, setActiveRole] = useState(currentUser?.role || 'MDAAdmin');

  // Notifications Modal State
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Detail Modal State for 4-Digit Application Numbers
  const [selectedAppForDetail, setSelectedAppForDetail] = useState(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActiveRole(user.role);
    setSelectedOrg(user.org);
    try {
      sessionStorage.setItem('agbmp_auth_user', JSON.stringify(user));
    } catch(e) {}
    
    if (user.role === 'Cashier') setActiveView('cashier');
    else if (user.role === 'MDAAdmin') setActiveView('dashboard');
    else setActiveView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    try {
      sessionStorage.removeItem('agbmp_auth_user');
    } catch(e) {}
  };

  const handleAddSystemUser = (newUser) => {
    setSystemUsers([newUser, ...systemUsers]);
  };

  // Master Repayments List State
  const [repaymentsList, setRepaymentsList] = useState([
    {
      id: 1,
      lenderName: 'Merchants Bank - Cannon Falls',
      lenderId: 'MB-55009',
      period: '04/01/2026 - 09/30/2026',
      genDate: 'March 1, 2026',
      repaymentAmountValue: 144402.30,
      repaymentAmount: '$144,402.30',
      dateCreated: '03/01/2026',
      dateSubmitted: '03/15/2026',
      paymentMode: 'Check',
      allowEFT: true,
      status: 'Lender Submitted'
    },
    {
      id: 2,
      lenderName: 'Merchants Bank - Cannon Falls',
      lenderId: 'MB-55009',
      period: '10/01/2025 - 03/31/2026',
      genDate: 'September 1, 2025',
      repaymentAmountValue: 89250.00,
      repaymentAmount: '$89,250.00',
      dateCreated: '09/01/2025',
      dateSubmitted: '09/20/2025',
      paymentMode: 'Check',
      allowEFT: true,
      status: 'Pending'
    }
  ]);

  // Modals state
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);
  const [activeStatementData, setActiveStatementData] = useState(null);

  const handleSaveStatement = (updatedStatement) => {
    const updatedList = repaymentsList.map(item => {
      if (item.id === updatedStatement.id || item.period === updatedStatement.period) {
        return { ...item, ...updatedStatement };
      }
      return item;
    });
    setRepaymentsList(updatedList);
  };

  const handleUpdateRemittanceStatus = (id, newStatus) => {
    setRepaymentsList(repaymentsList.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {/* Left Sidebar */}
      <Sidebar 
        collapsed={!sidebarOpen}
        activeView={activeView}
        setActiveView={setActiveView}
        activeRole={activeRole}
      />

      {/* Right Main Wrapper */}
      <div className="main-wrapper">
        {/* Top Header */}
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          selectedOrg={selectedOrg}
          setSelectedOrg={setSelectedOrg}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenNotifications={() => setIsNotificationOpen(true)}
        />

        {/* Dynamic Main Content Area */}
        <main className="content-area">
          {activeView === 'dashboard' && (
            <DashboardView 
              onOpenNewAppModal={() => setIsNewAppModalOpen(true)}
              onOpenAppDetailModal={(app) => setSelectedAppForDetail(app)}
              currentUserRole={activeRole}
            />
          )}

          {activeView === 'myorg' && (
            <MyOrgView 
              selectedOrgHeader={selectedOrg}
              currentUserRole={activeRole}
              onOpenStatementModal={(data) => setActiveStatementData(data)}
            />
          )}

          {activeView === 'applications' && (
            <ApplicationsView 
              onOpenNewAppModal={() => setIsNewAppModalOpen(true)}
              onOpenAppDetailModal={(app) => setSelectedAppForDetail(app)}
              currentUserRole={activeRole}
            />
          )}

          {activeView === 'loans' && (
            <LoansView />
          )}

          {activeView === 'users' && (
            <UserManagementView 
              users={systemUsers}
              onAddUser={handleAddSystemUser}
            />
          )}

          {activeView === 'repayments' && (
            <MDARepaymentsView 
              repayments={repaymentsList}
              onOpenMDADistributionModal={(data) => setActiveStatementData(data)}
            />
          )}

          {activeView === 'cashier' && (
            <CashierView 
              remittances={repaymentsList}
              onUpdateRemittanceStatus={handleUpdateRemittanceStatus}
            />
          )}
        </main>

        {/* Bottom Footer */}
        <Footer />
      </div>

      {/* Modals */}
      <NewApplicationModal 
        isOpen={isNewAppModalOpen}
        onClose={() => setIsNewAppModalOpen(false)}
      />

      <StatementModal 
        statementData={activeStatementData}
        currentUserRole={activeRole}
        onClose={() => setActiveStatementData(null)}
        onSaveStatement={handleSaveStatement}
      />

      <NotificationModal 
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        userRole={activeRole}
      />

      <ApplicationDetailModal 
        application={selectedAppForDetail}
        onClose={() => setSelectedAppForDetail(null)}
      />
    </div>
  );
}
