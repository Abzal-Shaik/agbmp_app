import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle, 
  Calculator, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  AlertTriangle, 
  History, 
  Lock, 
  CheckSquare, 
  Info,
  ShieldCheck
} from 'lucide-react';

export default function StatementModal({ statementData, onClose, currentUserRole = 'LenderAdmin', onSaveStatement }) {
  if (!statementData) return null;

  // Default initial loans if none in statement
  const initialLoans = statementData.loans || [
    {
      id: 1,
      borrowerName: 'John Doe Farms LLC',
      loanId: 'AG-LN-2024-001',
      loanDate: '04/15/2024',
      loanAmount: 150000.00,
      remainingLoanAmount: 95000.00,
      minAmountDue: 45000.00,
      allocatedMinDue: 45000.00,
      allocatedSurplusPayoff: 0.00,
      isPayOff: false,
      status: 'Pending'
    },
    {
      id: 2,
      borrowerName: 'Valley View Ag Inc',
      loanId: 'AG-LN-2024-014',
      loanDate: '09/10/2024',
      loanAmount: 80000.00,
      remainingLoanAmount: 48200.00,
      minAmountDue: 24200.00,
      allocatedMinDue: 24200.00,
      allocatedSurplusPayoff: 0.00,
      isPayOff: false,
      status: 'Pending'
    },
    {
      id: 3,
      borrowerName: 'Green Pastures Dairy',
      loanId: 'AG-LN-2025-008',
      loanDate: '03/22/2025',
      loanAmount: 120000.00,
      remainingLoanAmount: 70050.00,
      minAmountDue: 20050.00,
      allocatedMinDue: 20050.00,
      allocatedSurplusPayoff: 0.00,
      isPayOff: false,
      status: 'Pending'
    }
  ];

  const [loans, setLoans] = useState(initialLoans);
  const [totalMinDue, setTotalMinDue] = useState(0);

  // Form State
  const [repaymentAmountInput, setRepaymentAmountInput] = useState(statementData.repaymentAmountValue || 89250);
  const [paymentMode, setPaymentMode] = useState(statementData.paymentMode || 'Check'); // Check vs EFT
  const [allowEFT, setAllowEFT] = useState(statementData.allowEFT !== undefined ? statementData.allowEFT : true); // Database EFT permission
  const [eftDescription, setEftDescription] = useState(statementData.eftDescription || 'AgBMP Payment (Inv 09)');
  const [eftConfirmed, setEftConfirmed] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(statementData.status || 'Not Started');

  // Error messaging state
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('statement'); // 'statement' | 'audit'

  // Activity Audit Log State
  const [auditLogs, setAuditLogs] = useState(statementData.auditLogs || [
    { timestamp: '2026-03-01 08:00:00', user: 'SYSTEM', action: 'Statement Auto-Generated (March 1)', notes: 'Pooled Min Due: $89,250.00' }
  ]);

  // Recalculate Min Due Total
  useEffect(() => {
    const sumMin = loans.reduce((acc, l) => acc + l.minAmountDue, 0);
    setTotalMinDue(sumMin);
  }, [loans]);

  // Automated Distribution Algorithm
  // Rule 4: Distribute repayment amount to meet min due first across loan list.
  // For surplus over min due, prioritize Pay Off loans first, then earliest loan date ("Back-End").
  const runDistributionAlgorithm = (enteredAmount, currentLoansList) => {
    const numEntered = parseFloat(enteredAmount) || 0;
    
    // Check min due validation
    if (numEntered < totalMinDue) {
      setErrorMessage(`Repayment Amount ($${numEntered.toFixed(2)}) cannot be less than total minimum due ($${totalMinDue.toFixed(2)}).`);
    } else {
      setErrorMessage('');
    }

    let surplus = Math.max(0, numEntered - totalMinDue);

    // Create shallow copy of loans
    const updatedLoans = currentLoansList.map(loan => ({
      ...loan,
      allocatedMinDue: loan.minAmountDue,
      allocatedSurplusPayoff: 0.00
    }));

    // 1. Prioritize loans marked for "Pay Off"
    for (let i = 0; i < updatedLoans.length; i++) {
      if (updatedLoans[i].isPayOff && surplus > 0) {
        const payoffNeeded = updatedLoans[i].remainingLoanAmount - updatedLoans[i].minAmountDue;
        const alloc = Math.min(surplus, payoffNeeded);
        updatedLoans[i].allocatedSurplusPayoff += alloc;
        surplus -= alloc;
      }
    }

    // 2. Distribute remaining surplus to earliest loan date
    if (surplus > 0) {
      // Sort loans by loanDate (earliest first)
      const sortedIndexes = updatedLoans
        .map((loan, idx) => ({ idx, date: new Date(loan.loanDate) }))
        .sort((a, b) => a.date - b.date);

      for (let item of sortedIndexes) {
        const idx = item.idx;
        if (surplus <= 0) break;
        const payoffNeeded = updatedLoans[idx].remainingLoanAmount - (updatedLoans[idx].allocatedMinDue + updatedLoans[idx].allocatedSurplusPayoff);
        if (payoffNeeded > 0) {
          const alloc = Math.min(surplus, payoffNeeded);
          updatedLoans[idx].allocatedSurplusPayoff += alloc;
          surplus -= alloc;
        }
      }
    }

    setLoans(updatedLoans);
  };

  // Trigger distribution when repayment amount changes
  const handleAmountChange = (e) => {
    const val = e.target.value;
    setRepaymentAmountInput(val);
    runDistributionAlgorithm(val, loans);
  };

  // Toggle Pay Off Checkbox for a loan
  const handleTogglePayOff = (loanId) => {
    const updated = loans.map(loan => {
      if (loan.id === loanId) {
        return { ...loan, isPayOff: !loan.isPayOff };
      }
      return loan;
    });

    // Check if entered amount is sufficient to cover payoff balance requirement
    const targetLoan = updated.find(l => l.id === loanId);
    if (targetLoan.isPayOff) {
      const numEntered = parseFloat(repaymentAmountInput) || 0;
      const totalPayoffNeeded = targetLoan.remainingLoanAmount;
      if (numEntered < totalPayoffNeeded) {
        setErrorMessage(`Entered Repayment Amount ($${numEntered.toFixed(2)}) is insufficient to pay off ${targetLoan.borrowerName} (Full Payoff Balance: $${totalPayoffNeeded.toFixed(2)}). Please increase repayment amount.`);
      }
    }

    setLoans(updated);
    runDistributionAlgorithm(repaymentAmountInput, updated);
  };

  // MDA Override Loan Distribution
  const handleMDADistributionChange = (loanId, field, newVal) => {
    const val = parseFloat(newVal) || 0;
    const updated = loans.map(l => {
      if (l.id === loanId) {
        return { ...l, [field]: val };
      }
      return l;
    });
    setLoans(updated);
  };

  // Handle Form Submission (Lender or MDA)
  const handleSubmitRepayment = (e) => {
    e.preventDefault();

    const numEntered = parseFloat(repaymentAmountInput) || 0;
    if (numEntered < totalMinDue) {
      setErrorMessage(`Cannot submit: Repayment Amount ($${numEntered.toFixed(2)}) is less than total minimum due ($${totalMinDue.toFixed(2)}).`);
      return;
    }

    if (paymentMode === 'EFT' && !eftConfirmed) {
      setErrorMessage('You must confirm that you have entered the correct EFT description before submitting.');
      return;
    }

    const nextStatus = currentUserRole === 'MDAAdmin' ? 'MDA Matched' : 'Lender Submitted';
    setCurrentStatus(nextStatus);

    const newLog = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUserRole === 'MDAAdmin' ? 'MDA Administrator' : 'Lender Reporting Contact',
      action: currentUserRole === 'MDAAdmin' ? 'Repayment Finalized & Matched' : 'Remittance Statement Submitted',
      notes: `Amount: $${numEntered.toFixed(2)}, Mode: ${paymentMode}, Status: ${nextStatus}`
    };

    const updatedLogs = [...auditLogs, newLog];
    setAuditLogs(updatedLogs);

    if (onSaveStatement) {
      onSaveStatement({
        ...statementData,
        repaymentAmountValue: numEntered,
        amount: `$${numEntered.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        paymentMode,
        eftDescription,
        status: nextStatus,
        loans,
        auditLogs: updatedLogs
      });
    }

    alert(`Remittance statement submitted successfully! Status updated to "${nextStatus}".`);
    onClose();
  };

  // CSV Export functionality
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Borrower Name,Loan ID,Loan Date,Original Loan Amount,Remaining Loan Amount,Min Amount Due,Payoff Allocated,Status\n";
    loans.forEach(l => {
      csvContent += `"${l.borrowerName}","${l.loanId}","${l.loanDate}",${l.loanAmount},${l.remainingLoanAmount},${l.minAmountDue},${l.allocatedSurplusPayoff},"${l.status}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AgBMP_Remittance_Statement_${statementData.period || 'Report'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '950px', width: '95%', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calculator size={20} />
            <span className="modal-title">
              Remittance Statement Repayment & Distribution Portal ({statementData.period || 'Bi-Annual'})
            </span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Inner Nav Tabs */}
        <div style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1', padding: '0 20px', display: 'flex', gap: '12px' }}>
          <button 
            className={`tab-btn ${activeTab === 'statement' ? 'active' : ''}`} 
            style={{ borderRadius: '0', border: 'none', borderBottom: activeTab === 'statement' ? '3px solid #003865' : 'none' }}
            onClick={() => setActiveTab('statement')}
          >
            Statement Repayment Form
          </button>
          <button 
            className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`} 
            style={{ borderRadius: '0', border: 'none', borderBottom: activeTab === 'audit' ? '3px solid #003865' : 'none' }}
            onClick={() => setActiveTab('audit')}
          >
            Activity Audit Log ({auditLogs.length})
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-body" style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>
          
          {activeTab === 'statement' && (
            <form onSubmit={handleSubmitRepayment}>
              
              {/* Header Info Banner */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #003865', paddingBottom: '12px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ color: '#003865', fontSize: '18px', fontWeight: 700 }}>Merchants Bank - Cannon Falls</h2>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>Parent Lender Bi-Annual Statement Repayment Submission</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${
                    currentStatus === 'MDA Matched' ? 'badge-submitted' : 'badge-pending'
                  }`}>
                    Lifecycle Status: {currentStatus}
                  </span>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    Auto-Generated: {statementData.genDate || 'March 1, 2026'}
                  </p>
                </div>
              </div>

              {/* Validation Error Banner */}
              {errorMessage && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertTriangle size={18} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Repayment Amount Entry & Payment Mode Box */}
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  
                  {/* Left: Repayment Amount Input */}
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#003865', fontSize: '13px' }}>
                      Enter Statement Repayment Amount ($) *
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <span style={{ position: 'absolute', left: '12px', fontWeight: 700, color: '#003865' }}>$</span>
                      <input 
                        type="number"
                        step="0.01"
                        className="form-input"
                        style={{ paddingLeft: '28px', fontSize: '16px', fontWeight: 700, color: '#003865', border: errorMessage ? '2px solid #dc2626' : '1px solid #cbd5e1' }}
                        value={repaymentAmountInput}
                        onChange={handleAmountChange}
                        disabled={currentStatus === 'MDA Matched'}
                        required
                      />
                    </div>
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                      Minimum Due Required: <strong>{formatCurrency(totalMinDue)}</strong>
                    </p>
                  </div>

                  {/* Right: Payment Mode Selection (Check vs EFT) */}
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#003865', fontSize: '13px' }}>
                      Payment Mode Selection *
                    </label>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                      {/* Check Option */}
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                        <input 
                          type="radio" 
                          name="paymentMode"
                          value="Check"
                          checked={paymentMode === 'Check'}
                          onChange={() => setPaymentMode('Check')}
                          disabled={currentStatus === 'MDA Matched'}
                        />
                        <span>Check (Default)</span>
                      </label>

                      {/* EFT Option */}
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: allowEFT ? 'pointer' : 'not-allowed', fontSize: '13px', fontWeight: 600, opacity: allowEFT ? 1 : 0.5 }}>
                        <input 
                          type="radio" 
                          name="paymentMode"
                          value="EFT"
                          checked={paymentMode === 'EFT'}
                          onChange={() => allowEFT && setPaymentMode('EFT')}
                          disabled={!allowEFT || currentStatus === 'MDA Matched'}
                        />
                        <span>EFT (Electronic Funds Transfer)</span>
                        {!allowEFT && <Lock size={12} color="#dc2626" title="EFT Not Allowed for this Lender" />}
                      </label>
                    </div>

                    {!allowEFT && (
                      <p style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px' }}>
                        Lender is restricted to Check payments based on system records.
                      </p>
                    )}
                  </div>
                </div>

                {/* EFT Payment Description & Confirmation Section */}
                {paymentMode === 'EFT' && allowEFT && (
                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed #cbd5e1', background: '#eff6ff', padding: '16px', borderRadius: '6px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'center' }}>
                      
                      {/* EFT Description Input */}
                      <div className="form-group">
                        <label className="form-label" style={{ color: '#1e40af' }}>
                          EFT Payment Description (Optional - Max 20 Chars)
                        </label>
                        <input 
                          type="text" 
                          maxLength={20}
                          className="form-input"
                          placeholder="AgBMP Payment (Inv 09)"
                          value={eftDescription}
                          onChange={(e) => setEftDescription(e.target.value)}
                          disabled={currentStatus === 'MDA Matched'}
                        />
                        <p style={{ fontSize: '11px', color: '#1e40af', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Info size={12} /> Format example: <em>AgBMP Payment (Invoice #____)</em> ({eftDescription.length}/20 chars)
                        </p>
                      </div>

                      {/* EFT Confirmation Checkbox */}
                      <div style={{ background: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '12px', color: '#1e3a8a', fontWeight: 600 }}>
                          <input 
                            type="checkbox"
                            checked={eftConfirmed}
                            onChange={(e) => setEftConfirmed(e.target.checked)}
                            disabled={currentStatus === 'MDA Matched'}
                            style={{ marginTop: '2px', accentColor: '#003865' }}
                          />
                          <span>
                            I confirm that I have entered the correct EFT payment description as specified prior to submitting.
                          </span>
                        </label>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* Loan Repayment & Distribution Table */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#003865' }}>
                    Loan Repayment Distribution & Paid Off Identification
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Front-End (Min Due) + Back-End (Surplus Payoff Allocation)
                  </span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Mark Pay Off</th>
                        <th>Borrower Name</th>
                        <th>Loan ID</th>
                        <th>Loan Date</th>
                        <th>Remaining Loan Amount</th>
                        <th>Min. Due (Front-End)</th>
                        <th>Payoff Surplus (Back-End)</th>
                        <th>Total Distributed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loans.map((loan) => {
                        const totalAllocated = loan.allocatedMinDue + loan.allocatedSurplusPayoff;
                        return (
                          <tr key={loan.id} style={{ background: loan.isPayOff ? '#f0fdf4' : '#ffffff' }}>
                            <td style={{ textAlign: 'center' }}>
                              <input 
                                type="checkbox"
                                checked={loan.isPayOff}
                                onChange={() => handleTogglePayOff(loan.id)}
                                disabled={currentStatus === 'MDA Matched' && currentUserRole !== 'MDAAdmin'}
                                style={{ width: '16px', height: '16px', accentColor: '#166534', cursor: 'pointer' }}
                              />
                            </td>
                            <td><strong>{loan.borrowerName}</strong></td>
                            <td>{loan.loanId}</td>
                            <td>{loan.loanDate}</td>
                            <td>{formatCurrency(loan.remainingLoanAmount)}</td>
                            <td>
                              {currentUserRole === 'MDAAdmin' ? (
                                <input 
                                  type="number"
                                  className="form-input"
                                  style={{ width: '90px', padding: '4px' }}
                                  value={loan.allocatedMinDue}
                                  onChange={(e) => handleMDADistributionChange(loan.id, 'allocatedMinDue', e.target.value)}
                                />
                              ) : (
                                formatCurrency(loan.allocatedMinDue)
                              )}
                            </td>
                            <td>
                              {currentUserRole === 'MDAAdmin' ? (
                                <input 
                                  type="number"
                                  className="form-input"
                                  style={{ width: '90px', padding: '4px' }}
                                  value={loan.allocatedSurplusPayoff}
                                  onChange={(e) => handleMDADistributionChange(loan.id, 'allocatedSurplusPayoff', e.target.value)}
                                />
                              ) : (
                                <strong style={{ color: '#166534' }}>{formatCurrency(loan.allocatedSurplusPayoff)}</strong>
                              )}
                            </td>
                            <td>
                              <strong style={{ color: '#003865', fontSize: '14px' }}>
                                {formatCurrency(totalAllocated)}
                              </strong>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="modal-footer" style={{ margin: '0 -24px -24px -24px' }}>
                <button type="button" className="btn btn-primary-outline" onClick={handleExportCSV}>
                  <Download size={14} /> Export CSV
                </button>
                <button type="button" className="btn btn-primary-outline" onClick={() => window.print()}>
                  <Printer size={14} /> Print 1-Page Summary
                </button>
                <button type="button" className="btn btn-primary-outline" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={16} /> {currentUserRole === 'MDAAdmin' ? 'Finalize & Match Payment' : 'Submit Remittance Statement'}
                </button>
              </div>

            </form>
          )}

          {/* AUDIT LOG TAB */}
          {activeTab === 'audit' && (
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#003865', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <History size={18} /> Remittance Statement Activity Audit Trail
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
                Backend immutable activity log recording all status transitions, user edits, and payment distribution adjustments.
              </p>

              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User / Actor</th>
                    <th>Action Executed</th>
                    <th>Audit Details & Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log, i) => (
                    <tr key={i}>
                      <td><code style={{ fontSize: '12px', color: '#334155' }}>{log.timestamp}</code></td>
                      <td><strong>{log.user}</strong></td>
                      <td><span className="badge badge-submitted">{log.action}</span></td>
                      <td>{log.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
