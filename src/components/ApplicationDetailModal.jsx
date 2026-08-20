import React from 'react';
import { X, FileText, Printer, Calendar, DollarSign, User, Building, MapPin, CheckCircle, Clock } from 'lucide-react';

export default function ApplicationDetailModal({ application, onClose }) {
  if (!application) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '850px' }}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} />
            <span className="modal-title">AgBMP Loan Application Detail - {application.id || application.appNo}</span>
          </div>
          <button className="close-btn" onClick={onClose} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '24px' }}>
          
          {/* Top Banner with 4-Digit App No & Status */}
          <div style={{ background: '#003865', color: '#ffffff', padding: '16px 20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#93c5fd' }}>4-Digit Application Number</span>
              <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '2px 0 0 0' }}>{application.id || application.appNo || '1001'}</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-submitted" style={{ fontSize: '13px', padding: '6px 14px' }}>
                Status: {application.status || 'Submitted'}
              </span>
              <p style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '4px' }}>Date: {application.appDate || application.dateCreated || '05/30/2024'}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* Applicant & Location Details */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#003865', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={16} /> Borrower & Contact Details
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '12px', display: 'block' }}>Borrower / Entity Name</span>
                  <strong style={{ color: '#0f172a', fontSize: '14px' }}>{application.borrower || application.applicant}</strong>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Contact First Name</span>
                    <span>{application.contactFirstName || 'John'}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Contact Last Name</span>
                    <span>{application.contactLastName || 'Doe'}</span>
                  </div>
                </div>

                <div style={{ marginTop: '4px' }}>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>LGU (Local Govt Unit)</span>
                  <strong>{application.lgu || 'Goodhue County'}</strong>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Assigned Lender</span>
                  <span>{application.lender || 'Merchants Bank - Cannon Falls'}</span>
                </div>
              </div>
            </div>

            {/* Loan Financial Terms & Calculation Summary */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#003865', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DollarSign size={16} /> Loan Terms & Calculation Summary
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #cbd5e1', paddingBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Requested Loan Amount:</span>
                  <strong style={{ color: '#003865', fontSize: '15px' }}>{application.amount || application.requestedAmount}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #cbd5e1', paddingBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Loan Tenure:</span>
                  <strong>{application.tenure || '5 Years'}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #cbd5e1', paddingBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Interest Rate:</span>
                  <strong>{application.rate || '4.5%'}</strong>
                </div>

                <div style={{ background: '#e0f2fe', border: '1px solid #bae6fd', padding: '10px', borderRadius: '6px', marginTop: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: '#0369a1' }}>
                    <span>Est. Installment Payment:</span>
                    <span>{application.installment || '$843.75/mo'}</span>
                  </div>
                </div>

                <div style={{ marginTop: '4px' }}>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Project Category</span>
                  <span>{application.category || 'Waste Management & Manure Storage'}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn btn-primary-outline" onClick={() => window.print()}>
            <Printer size={14} /> Print Application Details
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
