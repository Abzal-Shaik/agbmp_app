import React, { useState } from 'react';
import { Search, RotateCcw, Plus, Info, FileText } from 'lucide-react';

export default function ApplicationsView({ onOpenNewAppModal, onOpenAppDetailModal }) {
  // Filter Form Inputs State
  const [filterForm, setFilterForm] = useState({
    appNo: '',
    lgu: 'Select LGU',
    lender: 'Select Lender',
    borrower: '',
    firstName: '',
    lastName: '',
    dateFrom: '',
    dateTo: '',
    phone: ''
  });

  const [appliedFilters, setAppliedFilters] = useState({ ...filterForm });
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesLimit, setEntriesLimit] = useState(10);

  // Sample Applications Master List matching Image 2
  const [applicationsList, setApplicationsList] = useState([
    {
      id: '80061056',
      appNo: '80061056',
      appDate: '05/30/2024',
      borrower: 'John Doe Farms LLC',
      contactFirstName: 'Sujith',
      contactLastName: 'Kumar',
      category: 'Waste Management & Manure Storage',
      amount: '$45,000.00',
      lgu: 'Goodhue County',
      lender: 'Merchants Bank - Cannon Falls',
      lastModifiedBy: 'Sujith Kumar',
      status: 'Submitted'
    },
    {
      id: '1001',
      appNo: '1001',
      appDate: '06/12/2024',
      borrower: 'Valley View Ag Inc',
      contactFirstName: 'Robert',
      contactLastName: 'Miller',
      category: 'Conservation Tillage Equipment',
      amount: '$68,500.00',
      lgu: 'Dakota County',
      lender: 'Merchants Bank - Cannon Falls',
      lastModifiedBy: 'Brian Hokanson',
      status: 'Under Review'
    },
    {
      id: '1002',
      appNo: '1002',
      appDate: '07/04/2024',
      borrower: 'Green Pastures Dairy',
      contactFirstName: 'Sarah',
      contactLastName: 'Jenkins',
      category: 'Septic System Upgrade',
      amount: '$12,000.00',
      lgu: 'Rice County',
      lender: 'Agribank FCB',
      lastModifiedBy: 'Yeswanth E',
      status: 'Submitted'
    }
  ]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setAppliedFilters({ ...filterForm });
  };

  const handleResetFilters = () => {
    const empty = {
      appNo: '',
      lgu: 'Select LGU',
      lender: 'Select Lender',
      borrower: '',
      firstName: '',
      lastName: '',
      dateFrom: '',
      dateTo: '',
      phone: ''
    };
    setFilterForm(empty);
    setAppliedFilters(empty);
    setSearchTerm('');
  };

  // Filter records based on applied search inputs
  const filteredApps = applicationsList.filter(item => {
    const matchAppNo = !appliedFilters.appNo || item.appNo.toLowerCase().includes(appliedFilters.appNo.toLowerCase());
    const matchBorrower = !appliedFilters.borrower || item.borrower.toLowerCase().includes(appliedFilters.borrower.toLowerCase());
    const matchFirstName = !appliedFilters.firstName || item.contactFirstName.toLowerCase().includes(appliedFilters.firstName.toLowerCase());
    const matchLastName = !appliedFilters.lastName || item.contactLastName.toLowerCase().includes(appliedFilters.lastName.toLowerCase());
    const matchLgu = appliedFilters.lgu === 'Select LGU' || item.lgu === appliedFilters.lgu;
    const matchLender = appliedFilters.lender === 'Select Lender' || item.lender === appliedFilters.lender;
    const matchSearchTerm = !searchTerm || item.borrower.toLowerCase().includes(searchTerm.toLowerCase()) || item.appNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchAppNo && matchBorrower && matchFirstName && matchLastName && matchLgu && matchLender && matchSearchTerm;
  });

  return (
    <div className="applications-view">
      
      {/* Top Header Bar (Image 2 Exact Match) */}
      <div className="page-header">
        <h1 className="page-title">Applications</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary-outline" onClick={onOpenNewAppModal}>
            Create New Application
          </button>
          <button className="btn btn-primary-outline" onClick={() => alert('Bulk Application wizard opened.')}>
            Create Bulk Loan Application
          </button>
        </div>
      </div>

      {/* SEARCH FILTER FORM CARD (Image 2 Exact Fields) */}
      <div className="org-card" style={{ marginBottom: '24px' }}>
        <div className="org-card-header" style={{ background: '#003865' }}>Search</div>
        <div className="org-card-body">
          <form onSubmit={handleSearchSubmit}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
              
              {/* Row 1 */}
              <div className="form-group">
                <label className="form-label">Application No</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Enter Application No"
                  value={filterForm.appNo}
                  onChange={(e) => setFilterForm({ ...filterForm, appNo: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">LGU</label>
                <select 
                  className="form-input"
                  value={filterForm.lgu}
                  onChange={(e) => setFilterForm({ ...filterForm, lgu: e.target.value })}
                >
                  <option value="Select LGU">Select LGU</option>
                  <option value="Goodhue County">Goodhue County</option>
                  <option value="Dakota County">Dakota County</option>
                  <option value="Rice County">Rice County</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Lender</label>
                <select 
                  className="form-input"
                  value={filterForm.lender}
                  onChange={(e) => setFilterForm({ ...filterForm, lender: e.target.value })}
                >
                  <option value="Select Lender">Select Lender</option>
                  <option value="Merchants Bank - Cannon Falls">Merchants Bank - Cannon Falls</option>
                  <option value="Agribank FCB">Agribank FCB</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Borrower <Info size={12} color="#003865" />
                </label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Enter Borrower Name"
                  value={filterForm.borrower}
                  onChange={(e) => setFilterForm({ ...filterForm, borrower: e.target.value })}
                />
              </div>

              {/* Row 2 */}
              <div className="form-group">
                <label className="form-label">Contact First Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Enter Contact First Name"
                  value={filterForm.firstName}
                  onChange={(e) => setFilterForm({ ...filterForm, firstName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Last Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Enter Contact Last Name"
                  value={filterForm.lastName}
                  onChange={(e) => setFilterForm({ ...filterForm, lastName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Application Created From</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={filterForm.dateFrom}
                  onChange={(e) => setFilterForm({ ...filterForm, dateFrom: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Application Created To</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={filterForm.dateTo}
                  onChange={(e) => setFilterForm({ ...filterForm, dateTo: e.target.value })}
                />
              </div>

              {/* Row 3 */}
              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Enter Contact Phone"
                  value={filterForm.phone}
                  onChange={(e) => setFilterForm({ ...filterForm, phone: e.target.value })}
                />
              </div>

            </div>

            {/* Buttons Row */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button 
                type="button" 
                className="btn btn-primary-outline" 
                style={{ width: '120px', justifyContent: 'center' }}
                onClick={handleResetFilters}
              >
                Reset
              </button>
              <button 
                type="submit" 
                className="btn" 
                style={{ width: '120px', justifyContent: 'center', backgroundColor: '#54728c', color: '#ffffff' }}
              >
                Search
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* SEARCH RESULTS TABLE (Image 2 Exact Columns) */}
      <div className="tab-content-box" style={{ borderRadius: '8px' }}>
        <div style={{ fontWeight: 700, fontSize: '15px', color: '#003865', marginBottom: '16px' }}>
          Search Results
        </div>

        <div className="table-controls">
          <div className="entries-selector">
            <span>Show</span>
            <select 
              className="select-inline"
              value={entriesLimit}
              onChange={(e) => setEntriesLimit(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
            <span>entries</span>
          </div>

          <div className="search-box">
            <Search className="search-icon" />
            <input 
              type="text" 
              className="search-input"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Application No</th>
              <th>Application Date</th>
              <th>Borrower</th>
              <th>Contact First Name</th>
              <th>Contact Last Name</th>
              <th>Category</th>
              <th>Loan Amount</th>
              <th>LGU</th>
              <th>Lender</th>
              <th>Last Modified By</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.slice(0, entriesLimit).map((app) => (
              <tr key={app.id}>
                <td>
                  <button 
                    style={{ background: 'none', border: 'none', color: '#0b5ed7', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => onOpenAppDetailModal(app)}
                    title="Click to view full 4-digit Application details"
                  >
                    {app.appNo}
                  </button>
                </td>
                <td>{app.appDate}</td>
                <td><strong>{app.borrower}</strong></td>
                <td>{app.contactFirstName}</td>
                <td>{app.contactLastName}</td>
                <td>{app.category}</td>
                <td><strong>{app.amount}</strong></td>
                <td>{app.lgu}</td>
                <td>{app.lender}</td>
                <td>{app.lastModifiedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="table-footer">
          <span>Showing 1 to {Math.min(filteredApps.length, entriesLimit)} of {filteredApps.length} entries</span>
        </div>
      </div>

    </div>
  );
}
