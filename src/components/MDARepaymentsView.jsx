import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, FileText, CheckCircle, Clock, ShieldCheck, History, Sliders } from 'lucide-react';

export default function MDARepaymentsView({ repayments, onOpenMDADistributionModal }) {
  const [filterPeriod, setFilterPeriod] = useState('All');
  const [sortColumn, setSortColumn] = useState('dateSubmitted');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (col) => {
    if (sortColumn === col) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(col);
      setSortDirection('asc');
    }
  };

  const filteredRepayments = repayments.filter(item => {
    const matchesPeriod = filterPeriod === 'All' || item.period === filterPeriod;
    const matchesSearch = item.lenderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.status.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPeriod && matchesSearch;
  });

  const sortedRepayments = [...filteredRepayments].sort((a, b) => {
    let valA = a[sortColumn] || '';
    let valB = b[sortColumn] || '';
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="mda-repayments-view">
      <div className="page-header">
        <div>
          <h1 className="page-title">MDA Master Repayments Administration</h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Review, modify loan distributions, finalize payments, and inspect activity audit logs across all Lenders.
          </p>
        </div>
        <div style={{ background: '#003865', color: '#ffffff', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={16} /> MDA Administrator Mode
        </div>
      </div>

      <div className="tab-content-box" style={{ borderRadius: '8px' }}>
        {/* Controls */}
        <div className="table-controls">
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} color="#64748b" />
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Filter Period:</span>
              <select 
                className="select-inline"
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
              >
                <option value="All">All Remittance Periods</option>
                <option value="04/01/2026 - 09/30/2026">04/01/2026 - 09/30/2026</option>
                <option value="10/01/2025 - 03/31/2026">10/01/2025 - 03/31/2026</option>
                <option value="04/01/2025 - 09/30/2025">04/01/2025 - 09/30/2025</option>
              </select>
            </div>
          </div>

          <div className="search-box">
            <Search className="search-icon" />
            <input 
              type="text" 
              className="search-input"
              placeholder="Search Lender or Period..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Master Repayments Table */}
        <table className="custom-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('lenderName')} style={{ cursor: 'pointer' }}>
                Lender <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
              </th>
              <th onClick={() => handleSort('period')} style={{ cursor: 'pointer' }}>
                Remittance Period <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
              </th>
              <th onClick={() => handleSort('repaymentAmount')} style={{ cursor: 'pointer' }}>
                Repayment Amount <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
              </th>
              <th onClick={() => handleSort('dateCreated')} style={{ cursor: 'pointer' }}>
                Date Created <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
              </th>
              <th onClick={() => handleSort('dateSubmitted')} style={{ cursor: 'pointer' }}>
                Date Submitted <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
              </th>
              <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                Status <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedRepayments.map((row) => (
              <tr key={row.id}>
                <td><strong>{row.lenderName}</strong></td>
                <td>{row.period}</td>
                <td><strong style={{ color: '#003865' }}>{row.repaymentAmount}</strong></td>
                <td>{row.dateCreated}</td>
                <td>{row.dateSubmitted || 'N/A'}</td>
                <td>
                  <span className={`badge ${
                    row.status === 'MDA Matched' ? 'badge-submitted' : 
                    row.status === 'Lender Submitted' || row.status === 'Cashier Deposited' ? 'badge-pending' : ''
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-primary-outline" 
                    style={{ padding: '3px 8px', fontSize: '11px' }}
                    onClick={() => onOpenMDADistributionModal(row)}
                  >
                    <Sliders size={12} /> Review & Distribution Override
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
