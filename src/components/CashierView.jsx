import React, { useState } from 'react';
import { Search, Download, Filter, ArrowUpDown, DollarSign, CheckSquare, Shield, FileSpreadsheet, Lock } from 'lucide-react';

export default function CashierView({ remittances, onUpdateRemittanceStatus }) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterYear, setFilterYear] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortColumn, setSortColumn] = useState('dateCreated');
  const [sortDirection, setSortDirection] = useState('desc');

  // Filter out 'MDA Matched' / 'Matched' items for Cashier view requirement
  const availableRemittances = remittances.filter(item => item.status !== 'MDA Matched' && item.status !== 'Matched');

  const filteredData = availableRemittances.filter(item => {
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    const matchesYear = filterYear === 'All' || (item.dateCreated && item.dateCreated.includes(filterYear));
    const matchesSearch = item.lenderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.eftDescription || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.lenderId || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesYear && matchesSearch;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let valA = a[sortColumn] || '';
    let valB = b[sortColumn] || '';
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSelectRow = (id, paymentMode) => {
    // Requirement 2: Unable to select items that do not have a payment type tied to them
    if (!paymentMode || paymentMode === 'None') {
      alert('Cannot select item: Payment type (Check/EFT) is missing.');
      return;
    }

    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleToggleSelectAll = () => {
    const selectable = sortedData.filter(i => i.paymentMode && i.paymentMode !== 'None');
    if (selectedIds.length === selectable.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(selectable.map(i => i.id));
    }
  };

  // Export Selected Repayments into Excel/CSV with Funding Source Breakdown & Total Row
  const handleExportDepositExcel = () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one repayment item tied to Check/EFT to export and deposit.');
      return;
    }

    const selectedItems = sortedData.filter(item => selectedIds.includes(item.id));

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Bank Name,Customer#,Payment Mode,EFT Description,Funding PFA,Funding Suppl,Funding CWL,Funding CWF,Total Check Amount,Requested Amount,Status\n";

    let totalCheckSum = 0;
    let totalRequestedSum = 0;

    selectedItems.forEach(item => {
      const amtVal = parseFloat(item.repaymentAmountValue || item.repaymentAmount.toString().replace(/[^0-9.]/g, '')) || 0;
      totalCheckSum += amtVal;
      totalRequestedSum += amtVal;

      // Funding Source allocation breakdown
      const pfa = amtVal * 0.4;
      const suppl = amtVal * 0.3;
      const cwl = amtVal * 0.2;
      const cwf = amtVal * 0.1;

      csvContent += `"${item.lenderName}","${item.lenderId || 'CUST-009'}","${item.paymentMode}","${item.eftDescription || ''}",${pfa.toFixed(2)},${suppl.toFixed(2)},${cwl.toFixed(2)},${cwf.toFixed(2)},${amtVal.toFixed(2)},${amtVal.toFixed(2)},"Cashier Deposited"\n`;
    });

    // Add Sum Total Row at the bottom
    csvContent += `\n"TOTAL ALL BANKS","--","--","--",${(totalCheckSum*0.4).toFixed(2)},${(totalCheckSum*0.3).toFixed(2)},${(totalCheckSum*0.2).toFixed(2)},${(totalCheckSum*0.1).toFixed(2)},${totalCheckSum.toFixed(2)},${totalRequestedSum.toFixed(2)},"DEPOSITED TOTAL"\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AgBMP_Cashier_Deposit_Export_${new Date().toISOString().substring(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Automatically mark exported items as "Cashier Deposited"
    selectedIds.forEach(id => {
      if (onUpdateRemittanceStatus) {
        onUpdateRemittanceStatus(id, 'Cashier Deposited');
      }
    });

    alert(`${selectedItems.length} repayment item(s) exported to deposit file! Status updated to "Cashier Deposited".`);
    setSelectedIds([]);
  };

  return (
    <div className="cashier-view">
      <div className="page-header">
        <div>
          <h1 className="page-title">Cashier Remittance Deposit Portal</h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Process submitted lender repayments, view funding source breakdowns (PFA, Suppl, CWL, CWF), and export bank deposit files.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={handleExportDepositExcel} disabled={selectedIds.length === 0}>
            <FileSpreadsheet size={16} /> Export Selected to Excel ({selectedIds.length}) & Mark Deposited
          </button>
        </div>
      </div>

      <div className="tab-content-box" style={{ borderRadius: '8px' }}>
        {/* Controls */}
        <div className="table-controls">
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} color="#64748b" />
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Filter Status:</span>
              <select 
                className="select-inline"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Active Statuses</option>
                <option value="Not Started">Not Started</option>
                <option value="Lender Submitted">Lender Submitted</option>
                <option value="Cashier Deposited">Cashier Deposited</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Year:</span>
              <select 
                className="select-inline"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="All">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
            </div>
          </div>

          <div className="search-box">
            <Search className="search-icon" />
            <input 
              type="text" 
              className="search-input"
              placeholder="Search Lender ID, Name, EFT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Cashier Table */}
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>
                <input 
                  type="checkbox"
                  checked={selectedIds.length > 0 && selectedIds.length === sortedData.filter(i => i.paymentMode && i.paymentMode !== 'None').length}
                  onChange={handleToggleSelectAll}
                />
              </th>
              <th>Lender Name</th>
              <th>Lender ID</th>
              <th>Payment Mode</th>
              <th>Deposit Amount</th>
              <th>EFT Description</th>
              <th>Funding Breakdown (PFA/Suppl/CWL/CWF)</th>
              <th>Created Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => {
              const hasPayment = item.paymentMode && item.paymentMode !== 'None';
              const amtVal = parseFloat(item.repaymentAmountValue || item.repaymentAmount.toString().replace(/[^0-9.]/g, '')) || 0;
              return (
                <tr key={item.id} style={{ opacity: hasPayment ? 1 : 0.6 }}>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelectRow(item.id, item.paymentMode)}
                      disabled={!hasPayment}
                      style={{ cursor: hasPayment ? 'pointer' : 'not-allowed' }}
                    />
                  </td>
                  <td><strong>{item.lenderName || item.lender}</strong></td>
                  <td><code>{item.lenderId || 'MB-55009'}</code></td>
                  <td>
                    <span className="badge" style={{ background: item.paymentMode === 'EFT' ? '#dbeafe' : '#f1f5f9', color: item.paymentMode === 'EFT' ? '#1e40af' : '#334155' }}>
                      {item.paymentMode || 'Check'}
                    </span>
                  </td>
                  <td><strong style={{ color: '#003865', fontSize: '14px' }}>{item.repaymentAmount}</strong></td>
                  <td>
                    {item.eftDescription ? (
                      <code style={{ background: '#fef3c7', padding: '2px 6px', borderRadius: '4px', color: '#92400e', fontSize: '11px' }}>
                        {item.eftDescription}
                      </code>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '12px' }}>N/A (Check)</span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: '11px', color: '#475569' }}>
                      PFA: ${(amtVal*0.4).toFixed(0)} | Suppl: ${(amtVal*0.3).toFixed(0)} | CWL: ${(amtVal*0.2).toFixed(0)} | CWF: ${(amtVal*0.1).toFixed(0)}
                    </div>
                  </td>
                  <td>{item.dateCreated}</td>
                  <td>
                    <span className={`badge ${
                      item.status === 'Cashier Deposited' ? 'badge-submitted' : 'badge-pending'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer info */}
        <div style={{ marginTop: '16px', fontSize: '12px', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Showing {sortedData.length} active deposits for Cashier processing (Excludes Matched records)</span>
          <span style={{ fontWeight: 600, color: '#003865' }}>
            Selected Deposit Total: ${sortedData.filter(i => selectedIds.includes(i.id)).reduce((s, i) => s + (parseFloat(i.repaymentAmountValue || i.repaymentAmount.toString().replace(/[^0-9.]/g, ''))||0), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}
