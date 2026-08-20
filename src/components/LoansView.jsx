import React, { useState } from 'react';
import { Search, Info } from 'lucide-react';

export default function LoansView() {
  const [filterForm, setFilterForm] = useState({
    loanId: '',
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

  // Sample Loans Master List matching Image 3
  const [loansList, setLoansList] = useState([
    {
      id: '4839',
      loanId: '4839',
      borrower: '',
      contactFirstName: 'Anders& -',
      contactLastName: 'Thiseth &',
      category: 'Septic Systems',
      disbursedAmount: '$5,067.00',
      lgu: 'Wilkin County',
      lender: 'Bank of the West - Breckenridge'
    },
    {
      id: '37834',
      loanId: '37834',
      borrower: 'BARTON',
      contactFirstName: 'BARTON',
      contactLastName: 'LLC',
      category: 'Structural Erosion Control',
      disbursedAmount: '$0.00',
      lgu: 'McLeod Soil and Water Conservation District',
      lender: 'McLeod County Drainage Authority CD40'
    }
  ]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setAppliedFilters({ ...filterForm });
  };

  const handleResetFilters = () => {
    const empty = {
      loanId: '',
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

  const filteredLoans = loansList.filter(item => {
    const matchLoanId = !appliedFilters.loanId || item.loanId.toLowerCase().includes(appliedFilters.loanId.toLowerCase());
    const matchBorrower = !appliedFilters.borrower || item.borrower.toLowerCase().includes(appliedFilters.borrower.toLowerCase());
    const matchFirstName = !appliedFilters.firstName || item.contactFirstName.toLowerCase().includes(appliedFilters.firstName.toLowerCase());
    const matchLgu = appliedFilters.lgu === 'Select LGU' || item.lgu === appliedFilters.lgu;
    const matchSearchTerm = !searchTerm || item.loanId.toLowerCase().includes(searchTerm.toLowerCase()) || item.contactFirstName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchLoanId && matchBorrower && matchFirstName && matchLgu && matchSearchTerm;
  });

  return (
    <div className="loans-view">
      
      {/* Top Header Bar */}
      <div className="page-header">
        <h1 className="page-title">Loans</h1>
      </div>

      {/* SEARCH FILTER FORM CARD (Image 3 Exact Fields) */}
      <div className="org-card" style={{ marginBottom: '24px' }}>
        <div className="org-card-header" style={{ background: '#003865' }}>Search</div>
        <div className="org-card-body">
          <form onSubmit={handleSearchSubmit}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
              
              {/* Row 1 */}
              <div className="form-group">
                <label className="form-label">Loan ID</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Enter Loan ID"
                  value={filterForm.loanId}
                  onChange={(e) => setFilterForm({ ...filterForm, loanId: e.target.value })}
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
                  <option value="Wilkin County">Wilkin County</option>
                  <option value="McLeod Soil and Water Conservation District">McLeod Soil & Water</option>
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
                  <option value="Bank of the West - Breckenridge">Bank of the West</option>
                  <option value="McLeod County Drainage Authority CD40">McLeod Drainage</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Borrower <Info size={12} color="#003865" />
                </label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Borrower Name"
                  value={filterForm.borrower}
                  onChange={(e) => setFilterForm({ ...filterForm, borrower: e.target.value })}
                />
              </div>

              {/* Row 2 */}
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Contact First Name"
                  value={filterForm.firstName}
                  onChange={(e) => setFilterForm({ ...filterForm, firstName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Contact Last Name"
                  value={filterForm.lastName}
                  onChange={(e) => setFilterForm({ ...filterForm, lastName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Loan Created From</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={filterForm.dateFrom}
                  onChange={(e) => setFilterForm({ ...filterForm, dateFrom: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Loan Created To</label>
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

      {/* SEARCH RESULTS TABLE (Image 3 Exact Columns) */}
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
              <th>Loan ID</th>
              <th>Borrower</th>
              <th>Contact First Name</th>
              <th>Contact Last Name</th>
              <th>Category</th>
              <th>Total Disbursed Amount</th>
              <th>LGU</th>
              <th>Lender</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.slice(0, entriesLimit).map((loan) => (
              <tr key={loan.id}>
                <td>
                  <button 
                    style={{ background: 'none', border: 'none', color: '#0b5ed7', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => alert(`Loan ID ${loan.loanId} details popup.`)}
                  >
                    {loan.loanId}
                  </button>
                </td>
                <td>{loan.borrower}</td>
                <td>{loan.contactFirstName}</td>
                <td>{loan.contactLastName}</td>
                <td>{loan.category}</td>
                <td><strong>{loan.disbursedAmount}</strong></td>
                <td>{loan.lgu}</td>
                <td>{loan.lender}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="table-footer">
          <span>Showing 1 to {Math.min(filteredLoans.length, entriesLimit)} of {filteredLoans.length} entries</span>
        </div>
      </div>

    </div>
  );
}
