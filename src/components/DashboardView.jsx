import React, { useState } from 'react';
import { PlusCircle, Printer, Info, ChevronUp, ChevronDown, FileText } from 'lucide-react';

export default function DashboardView({ onOpenNewAppModal, onOpenAppDetailModal }) {
  // Accordion Expand/Collapse States
  const [openAccordions, setOpenAccordions] = useState({
    awaiting: true,
    active: true,
    future: true,
    inquiries: true,
    expired: true
  });

  const toggleAccordion = (key) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Sample Applications Dataset with 4-digit Application Numbers
  const dashboardApps = [
    { id: '1001', appNo: '1001', appDate: '05/30/2024', borrower: 'John Doe Farms LLC', contactFirstName: 'John', contactLastName: 'Doe', lgu: 'Goodhue County', lender: 'Merchants Bank - Cannon Falls', category: 'Waste Management', amount: '$45,000.00', tenure: '5 Yrs', rate: '4.5%', installment: '$843.75/mo', status: 'Submitted' },
    { id: '1002', appNo: '1002', appDate: '06/15/2024', borrower: 'Valley View Ag Inc', contactFirstName: 'Robert', contactLastName: 'Miller', lgu: 'Dakota County', lender: 'Merchants Bank - Cannon Falls', category: 'Conservation Tillage', amount: '$68,500.00', tenure: '7 Yrs', rate: '4.0%', installment: '$932.40/mo', status: 'Under Review' },
    { id: '1003', appNo: '1003', appDate: '07/02/2024', borrower: 'Green Pastures Dairy', contactFirstName: 'Sarah', contactLastName: 'Jenkins', lgu: 'Rice County', lender: 'Agribank FCB', category: 'Septic System Upgrade', amount: '$12,000.00', tenure: '3 Yrs', rate: '3.5%', installment: '$351.66/mo', status: 'Submitted' }
  ];

  return (
    <div className="dashboard-view">
      {/* Top Header & Buttons (Image 1 Exact Match) */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary-outline" onClick={onOpenNewAppModal}>
            Create New Application
          </button>
          <button className="btn btn-primary-outline" onClick={() => alert('Bulk Loan Application Wizard Opened.')}>
            Create Bulk Application
          </button>
          <button className="btn btn-primary-outline" onClick={() => window.print()}>
            <Printer size={14} /> Print All
          </button>
        </div>
      </div>

      {/* ACCORDION 1: Awaiting Approval from AgBMP */}
      <div className="org-card" style={{ marginBottom: '16px' }}>
        <div 
          className="org-card-header" 
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#003865' }}
          onClick={() => toggleAccordion('awaiting')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Awaiting Approval from AgBMP</span>
            <Info size={14} style={{ opacity: 0.8 }} />
            <button 
              style={{ background: 'none', border: '1px solid rgba(255,255,255,0.4)', color: '#fff', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); window.print(); }}
            >
              <Printer size={12} />
            </button>
          </div>
          {openAccordions.awaiting ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        
        {openAccordions.awaiting && (
          <div className="org-card-body" style={{ padding: '16px' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Application No</th>
                  <th>Application Date</th>
                  <th>Borrower</th>
                  <th>Category</th>
                  <th>Loan Amount</th>
                  <th>LGU</th>
                  <th>Lender</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardApps.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <button 
                        style={{ background: 'none', border: 'none', color: '#0b5ed7', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => onOpenAppDetailModal(app)}
                        title="Click to view Application Details"
                      >
                        {app.appNo}
                      </button>
                    </td>
                    <td>{app.appDate}</td>
                    <td><strong>{app.borrower}</strong></td>
                    <td>{app.category}</td>
                    <td><strong>{app.amount}</strong></td>
                    <td>{app.lgu}</td>
                    <td>{app.lender}</td>
                    <td><span className="badge badge-pending">{app.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ACCORDION 2: Current Active Applications */}
      <div className="org-card" style={{ marginBottom: '16px' }}>
        <div 
          className="org-card-header" 
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#003865' }}
          onClick={() => toggleAccordion('active')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Current Active Applications</span>
            <Info size={14} style={{ opacity: 0.8 }} />
            <button 
              style={{ background: 'none', border: '1px solid rgba(255,255,255,0.4)', color: '#fff', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); window.print(); }}
            >
              <Printer size={12} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>
              $5,000.00 <span style={{ fontSize: '11px', fontWeight: 400, opacity: 0.9 }}>Total Funds Available</span>
            </span>
            {openAccordions.active ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>

        {openAccordions.active && (
          <div className="org-card-body" style={{ padding: '16px' }}>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Active approved applications portfolio.</p>
          </div>
        )}
      </div>

      {/* ACCORDION 3: Applications Approved For Future Funding */}
      <div className="org-card" style={{ marginBottom: '16px' }}>
        <div 
          className="org-card-header" 
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#003865' }}
          onClick={() => toggleAccordion('future')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Applications Approved For Future Funding</span>
            <Info size={14} style={{ opacity: 0.8 }} />
            <button 
              style={{ background: 'none', border: '1px solid rgba(255,255,255,0.4)', color: '#fff', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); window.print(); }}
            >
              <Printer size={12} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '12px' }}>
            <span><strong>$0.00</strong> <span style={{ opacity: 0.8 }}>Est Outstanding Repayments</span></span>
            <span><strong>$0.00</strong> <span style={{ opacity: 0.8 }}>Est Repayments Oct 2026</span></span>
            <span><strong>$0.00</strong> <span style={{ opacity: 0.8 }}>Est Repayments April 2027</span></span>
            {openAccordions.future ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>

        {openAccordions.future && (
          <div className="org-card-body" style={{ padding: '16px' }}>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Future funding allocation applications.</p>
          </div>
        )}
      </div>

      {/* ACCORDION 4: Borrower Inquiries */}
      <div className="org-card" style={{ marginBottom: '16px' }}>
        <div 
          className="org-card-header" 
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#003865' }}
          onClick={() => toggleAccordion('inquiries')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Borrower Inquiries</span>
            <Info size={14} style={{ opacity: 0.8 }} />
            <button 
              style={{ background: 'none', border: '1px solid rgba(255,255,255,0.4)', color: '#fff', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); window.print(); }}
            >
              <Printer size={12} />
            </button>
          </div>
          {openAccordions.inquiries ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {openAccordions.inquiries && (
          <div className="org-card-body" style={{ padding: '16px' }}>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Borrower inquiries and pre-application list.</p>
          </div>
        )}
      </div>

      {/* ACCORDION 5: Expired, Denied Or Withdrawn Applications */}
      <div className="org-card" style={{ marginBottom: '16px' }}>
        <div 
          className="org-card-header" 
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#003865' }}
          onClick={() => toggleAccordion('expired')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Expired, Denied Or Withdrawn Applications</span>
            <Info size={14} style={{ opacity: 0.8 }} />
            <button 
              style={{ background: 'none', border: '1px solid rgba(255,255,255,0.4)', color: '#fff', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); window.print(); }}
            >
              <Printer size={12} />
            </button>
          </div>
          {openAccordions.expired ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {openAccordions.expired && (
          <div className="org-card-body" style={{ padding: '16px' }}>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Closed, expired, or withdrawn applications record history.</p>
          </div>
        )}
      </div>

    </div>
  );
}
