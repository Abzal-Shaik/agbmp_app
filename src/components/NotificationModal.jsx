import React, { useState } from 'react';
import { X, Bell, Mail, Clock, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function NotificationModal({ isOpen, onClose, userRole, orgEmails }) {
  if (!isOpen) return null;

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Bi-Annual Remittance Statement Auto-Generated',
      time: 'March 1, 2026 07:15 AM CT',
      message: 'March 1 Remittance Statement has been generated for Merchants Bank - Cannon Falls. Please review minimum amounts due across loans.',
      read: false,
      type: 'schedule'
    },
    {
      id: 2,
      title: 'Reminder: Remittance Statement Submission Due in 1 Week',
      time: 'March 24, 2026 07:30 AM CT',
      message: 'Remittance statement for period 04/01/2026 - 09/30/2026 is due in 7 days. Primary Contact & designated emails notified.',
      read: false,
      type: 'reminder'
    },
    {
      id: 3,
      title: 'EFT Repayment Submitted (Notice to Cashier Role)',
      time: 'March 18, 2026 08:30 AM CT',
      message: 'Agribank FCB submitted an EFT repayment ($210,500.00) with EFT Description "AgBMP Payment Inv 14". Ready for Cashier deposit.',
      read: false,
      type: 'eft'
    }
  ]);

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '650px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} />
            <span className="modal-title">System Notifications & Automated Alerts</span>
          </div>
          <button className="close-btn" onClick={onClose} title="Close Pop-Up Box">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '20px' }}>
          {/* Email dispatch info banner */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '12px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '12px', color: '#334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#003865' }}>
              <Mail size={14} /> Multi-Email Dispatcher Configured Under "My Org":
            </div>
            <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', marginTop: '4px', display: 'inline-block' }}>
              {orgEmails || 'BEHokanson@merchantsbank.com; JLliolr@merchantsbank.com'}
            </code>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
              High-Priority System Alerts ({unreadCount} Unread)
            </span>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                style={{ background: 'none', border: 'none', color: '#003865', fontSize: '12px', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto' }}>
            {notifications.map((n) => (
              <div 
                key={n.id}
                style={{ 
                  background: n.read ? '#f8fafc' : '#eff6ff', 
                  border: n.read ? '1px solid #e2e8f0' : '1px solid #93c5fd', 
                  padding: '14px', 
                  borderRadius: '6px',
                  display: 'flex',
                  gap: '12px',
                  position: 'relative'
                }}
              >
                <div style={{ marginTop: '2px' }}>
                  {n.type === 'schedule' && <Clock size={18} color="#0284c7" />}
                  {n.type === 'reminder' && <AlertCircle size={18} color="#d97706" />}
                  {n.type === 'eft' && <ShieldAlert size={18} color="#166534" />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#003865' }}>{n.title}</span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#334155', marginTop: '4px', lineHeight: 1.4 }}>
                    {n.message}
                  </p>
                </div>

                {!n.read && (
                  <button 
                    onClick={() => handleMarkAsRead(n.id)}
                    style={{ background: '#003865', color: '#ffffff', border: 'none', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', alignSelf: 'center' }}
                  >
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Close Notification Box
          </button>
        </div>
      </div>
    </div>
  );
}
