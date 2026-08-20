import React, { useState, useEffect } from 'react';
import { X, Check, Database, Calculator, Hash, Percent, Calendar } from 'lucide-react';
import { dbManager } from '../../db/dbManager';

export default function NewApplicationModal({ isOpen, onClose, onApplicationCreated }) {
  const [formData, setFormData] = useState({
    borrowerName: '',
    projectCategory: 'Waste Management & Manure Storage',
    county: 'Goodhue',
    requestedAmount: '50000',
    tenureYears: '5',
    interestRate: '4.5',
    repaymentFrequency: 'bi-annual', // bi-annual vs monthly
    estimatedCompletion: '',
    lenderName: 'Merchants Bank - Cannon Falls'
  });

  // Calculated Financial Metrics
  const [calculatedInstallment, setCalculatedInstallment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalRepayment, setTotalRepayment] = useState(0);
  const [autoAppNumber, setAutoAppNumber] = useState('APP-1001');

  // Compute live loan interest & installment payment
  useEffect(() => {
    const principal = parseFloat(formData.requestedAmount) || 0;
    const years = parseFloat(formData.tenureYears) || 1;
    const annualRate = (parseFloat(formData.interestRate) || 0) / 100;
    const periodsPerYear = formData.repaymentFrequency === 'bi-annual' ? 2 : 12;
    const totalPeriods = years * periodsPerYear;

    if (principal > 0 && totalPeriods > 0) {
      // Interest Calculation formula: Simple/Amortized Loan Interest
      const calculatedTotInterest = principal * annualRate * years;
      const totalRepay = principal + calculatedTotInterest;
      const periodPayment = totalRepay / totalPeriods;

      setCalculatedInstallment(periodPayment);
      setTotalInterest(calculatedTotInterest);
      setTotalRepayment(totalRepay);
    } else {
      setCalculatedInstallment(0);
      setTotalInterest(0);
      setTotalRepayment(0);
    }
  }, [formData.requestedAmount, formData.tenureYears, formData.interestRate, formData.repaymentFrequency]);

  // Generate 4-digit Application Number when modal opens
  useEffect(() => {
    if (isOpen) {
      const existingApps = dbManager.getApplications();
      const next4DigitSeq = 1000 + existingApps.length + 1;
      setAutoAppNumber(`APP-${next4DigitSeq}`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.borrowerName || !formData.requestedAmount) {
      alert('Please fill in all mandatory fields.');
      return;
    }

    const principalAmt = parseFloat(formData.requestedAmount) || 0;

    // Insert new application into database with 4-digit number & financial parameters
    const createdRecord = dbManager.createApplication({
      id: autoAppNumber, // 4-digit application number e.g. APP-1001
      borrowerName: formData.borrowerName,
      projectCategory: formData.projectCategory,
      county: formData.county,
      requestedAmount: `$${principalAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      tenureYears: formData.tenureYears,
      interestRate: `${formData.interestRate}%`,
      estimatedInstallment: `$${calculatedInstallment.toFixed(2)}`,
      estimatedCompletion: formData.estimatedCompletion,
      lenderName: formData.lenderName
    });

    alert(`Application "${createdRecord.applicant}" successfully created!\nAuto Application Number: ${autoAppNumber}\nLoan Amount: ${createdRecord.requestedAmount}\nTenure: ${formData.tenureYears} Years (${formData.interestRate}% Interest)\nEst. ${formData.repaymentFrequency === 'bi-annual' ? 'Bi-Annual' : 'Monthly'} Installment: $${calculatedInstallment.toFixed(2)}`);
    
    if (onApplicationCreated) {
      onApplicationCreated(createdRecord);
    }

    setFormData({
      borrowerName: '',
      projectCategory: 'Waste Management & Manure Storage',
      county: 'Goodhue',
      requestedAmount: '50000',
      tenureYears: '5',
      interestRate: '4.5',
      repaymentFrequency: 'bi-annual',
      estimatedCompletion: '',
      lenderName: 'Merchants Bank - Cannon Falls'
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={18} />
            <span className="modal-title">Create AgBMP Loan Application & Interest Calculator</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '24px' }}>
            
            {/* Auto 4-Digit App Number Banner */}
            <div style={{ background: '#003865', color: '#ffffff', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#93c5fd' }}>Auto-Generated Application Number</span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px' }}>{autoAppNumber}</h3>
              </div>
              <div style={{ background: '#ffffff', color: '#003865', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
                4-Digit Sequential Tracking Key
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              {/* Left Column: Basic Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Borrower Name / Entity *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required
                    placeholder="e.g. John Doe Dairy LLC" 
                    value={formData.borrowerName}
                    onChange={(e) => setFormData({ ...formData, borrowerName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Project Category *</label>
                  <select 
                    className="form-input"
                    value={formData.projectCategory}
                    onChange={(e) => setFormData({ ...formData, projectCategory: e.target.value })}
                  >
                    <option value="Waste Management & Manure Storage">Waste Management & Manure Storage</option>
                    <option value="Conservation Tillage Equipment">Conservation Tillage Equipment</option>
                    <option value="Septic System Upgrade">Septic System Upgrade</option>
                    <option value="Precision Agriculture Irrigation">Precision Agriculture Irrigation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">County Location *</label>
                  <select 
                    className="form-input"
                    value={formData.county}
                    onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                  >
                    <option value="Dakota">Dakota</option>
                    <option value="Goodhue">Goodhue</option>
                    <option value="Hennepin">Hennepin</option>
                    <option value="Ramsey">Ramsey</option>
                    <option value="Rice">Rice</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Est. Project Completion Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={formData.estimatedCompletion}
                    onChange={(e) => setFormData({ ...formData, estimatedCompletion: e.target.value })}
                  />
                </div>
              </div>

              {/* Right Column: Loan Amount, Tenure & Interest Calculator */}
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#003865', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calculator size={16} /> Loan Terms & Interest Calculation
                </h4>

                <div className="form-group">
                  <label className="form-label">Loan Amount ($) *</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    required
                    style={{ fontWeight: 700, color: '#003865' }}
                    value={formData.requestedAmount}
                    onChange={(e) => setFormData({ ...formData, requestedAmount: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">Tenure (Years) *</label>
                    <select 
                      className="form-input"
                      value={formData.tenureYears}
                      onChange={(e) => setFormData({ ...formData, tenureYears: e.target.value })}
                    >
                      <option value="1">1 Year</option>
                      <option value="3">3 Years</option>
                      <option value="5">5 Years</option>
                      <option value="7">7 Years</option>
                      <option value="10">10 Years</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Interest Rate (%) *</label>
                    <input 
                      type="number"
                      step="0.1" 
                      className="form-input" 
                      value={formData.interestRate}
                      onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Repayment Frequency</label>
                  <select 
                    className="form-input"
                    value={formData.repaymentFrequency}
                    onChange={(e) => setFormData({ ...formData, repaymentFrequency: e.target.value })}
                  >
                    <option value="bi-annual">Bi-Annual (Every 6 Months)</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                {/* Calculation Summary Box */}
                <div style={{ background: '#e0f2fe', border: '1px solid #bae6fd', padding: '12px', borderRadius: '6px', marginTop: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                    <span>Est. Installment Payment:</span>
                    <strong style={{ color: '#003865' }}>${calculatedInstallment.toFixed(2)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                    <span>Total Interest Payable:</span>
                    <strong>${totalInterest.toFixed(2)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderTop: '1px solid #93c5fd', paddingTop: '4px', fontWeight: 700, color: '#0369a1' }}>
                    <span>Total Repayment Amount:</span>
                    <span>${totalRepayment.toFixed(2)}</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-primary-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} /> Save Application ({autoAppNumber})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
