import React, { useState, useEffect } from "react";
import {
  Search,
  FileText,
  ChevronDown,
  Edit2,
  Save,
  X,
  UserPlus,
} from "lucide-react";

export default function MyOrgView({
  onOpenStatementModal,
  selectedOrgHeader = "Ramsey",
  currentUserRole = "MDAAdmin",
}) {
  // ============================================================
  // ORGANIZATION DATA
  // ============================================================

  const regionProfiles = {
    Ramsey: {
      name: "Ramsey",
      orgName: "AgBMP Loan Program - Minnesota Dept of Ag",
      address:
        "4th cross 625 N Robert St, 2nd line, Saint Paul, Minn",
      serviceArea: "Ramsey",
      primaryContact: "Yeswanth E",
      orgEmail: "yeswanth,Test",
      authRepresentative: "Please Select",

      employees: [
        {
          id: 1,
          username: "yeswanth.emuri@epathusa.net",
          name: "Yeswanth Emuri",
          phone: "(012) 345-6789",
          role: "Admin. Admin",
          receiveNotice: "true",
        },
        {
          id: 2,
          username: "anil.kurakula@epathusa.net",
          name: "Anil Kumar Kurakula",
          phone: "(012) 345-6789",
          role: "Admin. Admin",
          receiveNotice: "false",
        },
      ],

      lenderList: [
        {
          id: "LND-001",
          lenderName: "Merchants Bank - Cannon Falls",
          status: "Active",
          totalLoans: 14,
          activeAmount: "$144,402.30",
        },
        {
          id: "LND-002",
          lenderName: "Agribank FCB",
          status: "Active",
          totalLoans: 22,
          activeAmount: "$210,500.00",
        },
      ],

      remittances: [
        {
          id: 1,
          period: "04/01/2026 - 09/30/2026",
          repaymentAmount: "$144,402.30",
          status: "Submitted",
        },
        {
          id: 2,
          period: "10/01/2025 - 03/31/2026",
          repaymentAmount: "$89,250.00",
          status: "Pending",
        },
      ],
    },

    Hennepin: {
      name: "Hennepin",
      orgName: "AgBMP Loan Program - Hennepin Region",
      address:
        "A-2300 Government Center, Minneapolis, MN 55487",
      serviceArea: "Hennepin",
      primaryContact: "David Larson",
      orgEmail: "dlarson@hennepin.gov",
      authRepresentative: "Sarah Jenkins",

      employees: [
        {
          id: 3,
          username: "david.larson@hennepin.gov",
          name: "David Larson",
          phone: "(612) 348-3000",
          role: "Region Admin",
          receiveNotice: "true",
        },
      ],

      lenderList: [
        {
          id: "LND-003",
          lenderName: "Minneapolis Central Bank",
          status: "Active",
          totalLoans: 18,
          activeAmount: "$210,500.00",
        },
      ],

      remittances: [
        {
          id: 3,
          period: "04/01/2026 - 09/30/2026",
          repaymentAmount: "$210,500.00",
          status: "Submitted",
        },
      ],
    },

    "Merchants Bank - Cannon Falls": {
      name: "Merchants Bank - Cannon Falls",
      orgName: "Merchants Bank - Cannon Falls",
      address: "300 Main St W, Cannon Falls, Minnesota, 55009",
      serviceArea: "Goodhue",
      primaryContact: "Brian Hokanson",
      orgEmail: "BEHokanson@merchantsbank.com",
      authRepresentative: "Brian Hokanson",

      employees: [
        {
          id: 4,
          username: "BEHokanson@merchantsbank.com",
          name: "Brian Hokanson",
          phone: "(507) 263-4214",
          role: "Lender Admin",
          receiveNotice: "true",
        },
      ],

      lenderList: [
        {
          id: "LND-001",
          lenderName: "Merchants Bank - Cannon Falls",
          status: "Active",
          totalLoans: 14,
          activeAmount: "$144,402.30",
        },
      ],

      remittances: [
        {
          id: 1,
          period: "04/01/2026 - 09/30/2026",
          repaymentAmount: "$144,402.30",
          status: "Submitted",
        },
        {
          id: 2,
          period: "10/01/2025 - 03/31/2026",
          repaymentAmount: "$89,250.00",
          status: "Pending",
        },
      ],
    },
  };

  // ============================================================
  // CURRENT ORGANIZATION
  // ============================================================

  const currentRegionKey = regionProfiles[selectedOrgHeader]
    ? selectedOrgHeader
    : "Ramsey";

  const currentProfile = regionProfiles[currentRegionKey];

  // ============================================================
  // ORGANIZATION FORM STATE
  // ============================================================

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    ...currentProfile,
  });

  // ============================================================
  // DYNAMIC EMPLOYEE STATE
  // ============================================================

  const [employeesByRegion, setEmployeesByRegion] = useState(() => ({
    Ramsey: [...regionProfiles.Ramsey.employees],

    Hennepin: [...regionProfiles.Hennepin.employees],

    "Merchants Bank - Cannon Falls": [
      ...regionProfiles["Merchants Bank - Cannon Falls"].employees,
    ],
  }));

  // Current organization's employees
  const employees = employeesByRegion[currentRegionKey] || [];

  // ============================================================
  // SYNC FORM WHEN ORGANIZATION CHANGES
  // ============================================================

  useEffect(() => {
    setFormData({
      ...currentProfile,
    });

    setIsEditing(false);
  }, [currentRegionKey]);

  // ============================================================
  // TAB STATE
  // ============================================================

  const [activeTab, setActiveTab] = useState(
    currentUserRole === "MDAAdmin" ? "employees" : "remittance"
  );

  // ============================================================
  // SEARCH / PAGINATION
  // ============================================================

  const [searchTerm, setSearchTerm] = useState("");
  const [entriesLimit, setEntriesLimit] = useState(10);

  // ============================================================
  // ADD CONTACT MODAL
  // ============================================================

  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  const [newContact, setNewContact] = useState({
    username: "",
    name: "",
    phone: "",
    role: "Admin. Admin",
    receiveNotice: "true",
  });

  // ============================================================
  // EDIT ORGANIZATION
  // ============================================================

  const handleSave = () => {
    setIsEditing(false);

    alert("Organization information saved successfully.");
  };

  // ============================================================
  // ADD CONTACT
  // ============================================================

  const handleAddContactSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!newContact.name.trim()) {
      alert("Please enter the contact name.");
      return;
    }

    if (!newContact.username.trim()) {
      alert("Please enter the user name / email.");
      return;
    }

    // Check duplicate email
    const duplicate = employees.some(
      (employee) =>
        employee.username.toLowerCase() ===
        newContact.username.trim().toLowerCase()
    );

    if (duplicate) {
      alert("A contact with this user name / email already exists.");
      return;
    }

    // Create new employee
    const contact = {
      id: Date.now(),

      username: newContact.username.trim(),

      name: newContact.name.trim(),

      phone: newContact.phone.trim() || "(012) 345-6789",

      role: newContact.role.trim() || "Admin. Admin",

      receiveNotice: newContact.receiveNotice,
    };

    // IMPORTANT:
    // Update React state instead of directly modifying
    // currentProfile.employees.
    setEmployeesByRegion((previousEmployees) => ({
      ...previousEmployees,

      [currentRegionKey]: [
        ...(previousEmployees[currentRegionKey] || []),
        contact,
      ],
    }));

    // Close modal
    setIsAddContactOpen(false);

    // Reset form
    setNewContact({
      username: "",
      name: "",
      phone: "",
      role: "Admin. Admin",
      receiveNotice: "true",
    });

    alert(`Contact "${contact.name}" added successfully!`);
  };

  // ============================================================
  // DELETE CONTACT
  // ============================================================

  const handleDeleteContact = (employeeId) => {
    const employee = employees.find(
      (item) => item.id === employeeId
    );

    if (!employee) {
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to remove "${employee.name}"?`
    );

    if (!confirmDelete) {
      return;
    }

    setEmployeesByRegion((previousEmployees) => ({
      ...previousEmployees,

      [currentRegionKey]: (
        previousEmployees[currentRegionKey] || []
      ).filter((item) => item.id !== employeeId),
    }));
  };

  // ============================================================
  // SEARCH FILTER
  // ============================================================

  const filteredEmployees = employees.filter((employee) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return true;
    }

    return (
      employee.name.toLowerCase().includes(search) ||
      employee.username.toLowerCase().includes(search) ||
      employee.phone.toLowerCase().includes(search) ||
      employee.role.toLowerCase().includes(search)
    );
  });

  // ============================================================
  // PAGINATION
  // ============================================================

  const visibleEmployees = filteredEmployees.slice(
    0,
    entriesLimit
  );

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="my-org-view">

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div className="page-header">
        <h1 className="page-title">
          My Organization
        </h1>
      </div>

      {/* ======================================================
          ORGANIZATION INFORMATION
      ====================================================== */}

      <div className="org-card">

        <div className="org-card-header">
          My Organization
        </div>

        <div className="org-card-body">

          {/* Edit / Save / Cancel */}

          <div className="edit-btn-pos">

            {isEditing ? (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                }}
              >

                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                >
                  <Save size={14} />
                  Save
                </button>

                <button
                  className="btn btn-primary-outline"
                  onClick={() => {
                    setFormData({
                      ...currentProfile,
                    });

                    setIsEditing(false);
                  }}
                >
                  <X size={14} />
                  Cancel
                </button>

              </div>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size={14} />
                Edit
              </button>
            )}

          </div>

          {/* ==================================================
              FORM GRID
          ================================================== */}

          <div className="form-grid">

            {/* Name */}

            <div className="form-group">

              <label className="form-label">
                Name
              </label>

              <input
                type="text"
                className="form-input"
                value={formData.name}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />

            </div>

            {/* Organization Name */}

            <div className="form-group">

              <label className="form-label">
                Organization Name
              </label>

              <input
                type="text"
                className="form-input"
                value={formData.orgName}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    orgName: e.target.value,
                  })
                }
              />

            </div>

            {/* Address */}

            <div className="form-group">

              <label className="form-label">
                Org Mailing Address
              </label>

              <input
                type="text"
                className="form-input"
                value={formData.address}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value,
                  })
                }
              />

            </div>

            {/* Service Area */}

            <div className="form-group">

              <label className="form-label">
                Org Service Area(s)
              </label>

              <select
                className="form-input"
                value={formData.serviceArea}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    serviceArea: e.target.value,
                  })
                }
              >
                <option value="Ramsey">
                  Ramsey
                </option>

                <option value="Hennepin">
                  Hennepin
                </option>

                <option value="Dakota">
                  Dakota
                </option>

                <option value="Goodhue">
                  Goodhue
                </option>
              </select>

            </div>

            {/* Primary Contact */}

            <div className="form-group">

              <label className="form-label">
                Org Primary Contact
              </label>

              <select
                className="form-input"
                value={formData.primaryContact}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    primaryContact: e.target.value,
                  })
                }
              >

                <option value="">
                  Please Select
                </option>

                {employees.map((employee) => (
                  <option
                    key={employee.id}
                    value={employee.name}
                  >
                    {employee.name}
                  </option>
                ))}

              </select>

            </div>

            {/* Organization Email */}

            <div className="form-group">

              <label className="form-label">
                Org Email
              </label>

              <input
                type="text"
                className="form-input"
                value={formData.orgEmail}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    orgEmail: e.target.value,
                  })
                }
              />

            </div>

            {/* Auth Representative */}

            <div className="form-group">

              <label className="form-label">
                Auth Representative
              </label>

              <select
                className="form-input"
                value={formData.authRepresentative}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    authRepresentative: e.target.value,
                  })
                }
              >

                <option value="Please Select">
                  Please Select
                </option>

                {employees.map((employee) => (
                  <option
                    key={employee.id}
                    value={employee.name}
                  >
                    {employee.name}
                  </option>
                ))}

              </select>

            </div>

          </div>
        </div>
      </div>

      {/* ======================================================
          TABS
      ====================================================== */}

      <div className="tabs-navigation">

        <button
          className={`tab-btn ${
            activeTab === "employees" ? "active" : ""
          }`}
          onClick={() => setActiveTab("employees")}
        >
          Employees
        </button>

        <button
          className={`tab-btn ${
            activeTab === "contacts" ? "active" : ""
          }`}
          onClick={() => setActiveTab("contacts")}
        >
          Service Area Contacts
        </button>

        <button
          className={`tab-btn ${
            activeTab === "lenders" ? "active" : ""
          }`}
          onClick={() => setActiveTab("lenders")}
        >
          Lender List
        </button>

        <button
          className={`tab-btn ${
            activeTab === "salenders" ? "active" : ""
          }`}
          onClick={() => setActiveTab("salenders")}
        >
          Service Area Lenders
        </button>

        <button
          className={`tab-btn ${
            activeTab === "attachments" ? "active" : ""
          }`}
          onClick={() => setActiveTab("attachments")}
        >
          Attachments
        </button>

        <button
          className={`tab-btn ${
            activeTab === "remittance" ? "active" : ""
          }`}
          onClick={() => setActiveTab("remittance")}
        >
          Remittance statement
        </button>

      </div>

      {/* ======================================================
          TAB CONTENT
      ====================================================== */}

      <div className="tab-content-box">

        {/* ====================================================
            EMPLOYEES
        ==================================================== */}

        {activeTab === "employees" && (
          <div>

            {/* Add Contact */}

            <div
              style={{
                marginBottom: "16px",
              }}
            >

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setNewContact({
                    username: "",
                    name: "",
                    phone: "",
                    role: "Admin. Admin",
                    receiveNotice: "true",
                  });

                  setIsAddContactOpen(true);
                }}
              >
                <UserPlus size={16} />
                Add Contact
              </button>

            </div>

            {/* =================================================
                TABLE CONTROLS
            ================================================= */}

            <div className="table-controls">

              <div className="entries-selector">

                <span>
                  Show
                </span>

                <select
                  className="select-inline"
                  value={entriesLimit}
                  onChange={(e) =>
                    setEntriesLimit(
                      Number(e.target.value)
                    )
                  }
                >

                  <option value={10}>
                    10
                  </option>

                  <option value={25}>
                    25
                  </option>

                  <option value={50}>
                    50
                  </option>

                  <option value={100}>
                    100
                  </option>

                </select>

                <span>
                  entries
                </span>

              </div>

              {/* Search */}

              <div className="search-box">

                <Search className="search-icon" />

                <input
                  type="text"
                  className="search-input"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                />

              </div>

            </div>

            {/* =================================================
                EMPLOYEE TABLE
            ================================================= */}

            <table className="custom-table">

              <thead>

                <tr>

                  <th>
                    User Name
                  </th>

                  <th>
                    Name
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Receive Notice Copies
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {visibleEmployees.length === 0 ? (
                  <tr>

                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "25px",
                        color: "#64748b",
                      }}
                    >
                      {searchTerm
                        ? "No contacts found."
                        : "No contacts available."}
                    </td>

                  </tr>
                ) : (
                  visibleEmployees.map((employee) => (

                    <tr key={employee.id}>

                      <td>
                        <strong>
                          {employee.username}
                        </strong>
                      </td>

                      <td>
                        {employee.name}
                      </td>

                      <td>
                        {employee.phone}
                      </td>

                      <td>
                        {employee.role}
                      </td>

                      <td>
                        {employee.receiveNotice}
                      </td>

                      <td>

                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "center",
                          }}
                        >

                          <button
                            type="button"
                            className="btn btn-primary-outline"
                            style={{
                              padding: "2px 6px",
                              fontSize: "11px",
                            }}
                            title="Actions"
                          >
                            <ChevronDown size={14} />
                          </button>

                          <button
                            type="button"
                            className="btn btn-primary-outline"
                            style={{
                              padding: "4px 8px",
                              fontSize: "11px",
                            }}
                            onClick={() =>
                              handleDeleteContact(
                                employee.id
                              )
                            }
                            title="Remove contact"
                          >
                            <X size={13} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))
                )}

              </tbody>

            </table>

            {/* =================================================
                TABLE FOOTER
            ================================================= */}

            <div className="table-footer">

              <span>

                Showing{" "}

                {visibleEmployees.length === 0
                  ? 0
                  : 1}

                {" "}to{" "}

                {visibleEmployees.length}

                {" "}of{" "}

                {filteredEmployees.length}

                {" "}entries

              </span>

            </div>

          </div>
        )}

        {/* ====================================================
            LENDER LIST
        ==================================================== */}

        {activeTab === "lenders" && (
          <div>

            <table className="custom-table">

              <thead>

                <tr>

                  <th>
                    Lender ID
                  </th>

                  <th>
                    Lender Name
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Total Active Loans
                  </th>

                  <th>
                    Active Loan Balance
                  </th>

                </tr>

              </thead>

              <tbody>

                {currentProfile.lenderList.map(
                  (lender) => (

                    <tr key={lender.id}>

                      <td>
                        <code>
                          {lender.id}
                        </code>
                      </td>

                      <td>
                        <strong>
                          {lender.lenderName}
                        </strong>
                      </td>

                      <td>

                        <span className="badge badge-submitted">
                          {lender.status}
                        </span>

                      </td>

                      <td>
                        {lender.totalLoans}
                      </td>

                      <td>

                        <strong
                          style={{
                            color: "#003865",
                          }}
                        >
                          {lender.activeAmount}
                        </strong>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>
        )}

        {/* ====================================================
            REMITTANCE STATEMENT
        ==================================================== */}

        {activeTab === "remittance" && (
          <div>

            <table className="custom-table">

              <thead>

                <tr>

                  <th>
                    Remittance Period
                  </th>

                  <th>
                    Repayment Amount
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Statement
                  </th>

                </tr>

              </thead>

              <tbody>

                {currentProfile.remittances.map(
                  (item) => (

                    <tr key={item.id}>

                      <td>
                        {item.period}
                      </td>

                      <td>
                        <strong>
                          {item.repaymentAmount}
                        </strong>
                      </td>

                      <td>

                        <span
                          className={`badge ${
                            item.status === "Submitted"
                              ? "badge-submitted"
                              : "badge-pending"
                          }`}
                        >
                          {item.status}
                        </span>

                      </td>

                      <td>

                        <button
                          type="button"
                          className="btn btn-primary-outline"
                          style={{
                            padding: "4px 12px",
                            fontSize: "12px",
                            background: "#ffffff",
                          }}
                          onClick={() =>
                            onOpenStatementModal(item)
                          }
                        >
                          <FileText size={14} />
                          View
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>
        )}

        {/* ====================================================
            OTHER TABS
        ==================================================== */}

        {activeTab !== "employees" &&
          activeTab !== "lenders" &&
          activeTab !== "remittance" && (

            <div
              style={{
                padding: "20px 0",
                color: "#64748b",
              }}
            >

              <p
                style={{
                  fontWeight: 600,
                }}
              >
                {activeTab.toUpperCase()} Directory
                Panel for {currentRegionKey}
              </p>

            </div>

          )}

      </div>

      {/* ======================================================
          ADD CONTACT MODAL
      ====================================================== */}

      {isAddContactOpen && (

        <div
          className="modal-overlay"
          onClick={(e) => {

            // Close only when clicking outside modal
            if (e.target === e.currentTarget) {
              setIsAddContactOpen(false);
            }

          }}
        >

          <div
            className="modal-container"
            style={{
              maxWidth: "500px",
            }}
          >

            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="modal-header">

              <span>
                Add New Contact ({currentRegionKey})
              </span>

              <button
                type="button"
                onClick={() =>
                  setIsAddContactOpen(false)
                }
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                ✕
              </button>

            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form onSubmit={handleAddContactSubmit}>

              <div className="modal-body">

                {/* Full Name */}

                <div
                  className="form-group"
                  style={{
                    marginBottom: "12px",
                  }}
                >

                  <label className="form-label">
                    Full Name *
                  </label>

                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. John Smith"
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({
                        ...newContact,
                        name: e.target.value,
                      })
                    }
                    autoFocus
                  />

                </div>

                {/* Email */}

                <div
                  className="form-group"
                  style={{
                    marginBottom: "12px",
                  }}
                >

                  <label className="form-label">
                    User Name / Email *
                  </label>

                  <input
                    type="email"
                    className="form-input"
                    required
                    placeholder="john.smith@example.com"
                    value={newContact.username}
                    onChange={(e) =>
                      setNewContact({
                        ...newContact,
                        username: e.target.value,
                      })
                    }
                  />

                </div>

                {/* Phone */}

                <div
                  className="form-group"
                  style={{
                    marginBottom: "12px",
                  }}
                >

                  <label className="form-label">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    className="form-input"
                    placeholder="(012) 345-6789"
                    value={newContact.phone}
                    onChange={(e) =>
                      setNewContact({
                        ...newContact,
                        phone: e.target.value,
                      })
                    }
                  />

                </div>

                {/* Role */}

                <div
                  className="form-group"
                  style={{
                    marginBottom: "12px",
                  }}
                >

                  <label className="form-label">
                    Role
                  </label>

                  <select
                    className="form-input"
                    value={newContact.role}
                    onChange={(e) =>
                      setNewContact({
                        ...newContact,
                        role: e.target.value,
                      })
                    }
                  >

                    <option value="Admin. Admin">
                      Admin. Admin
                    </option>

                    <option value="Region Admin">
                      Region Admin
                    </option>

                    <option value="Lender Admin">
                      Lender Admin
                    </option>

                    <option value="Cashier">
                      Cashier
                    </option>

                    <option value="MDA User">
                      MDA User
                    </option>

                  </select>

                </div>

                {/* Receive Notices */}

                <div
                  className="form-group"
                  style={{
                    marginBottom: "5px",
                  }}
                >

                  <label className="form-label">
                    Receive Notice Copies
                  </label>

                  <select
                    className="form-input"
                    value={newContact.receiveNotice}
                    onChange={(e) =>
                      setNewContact({
                        ...newContact,
                        receiveNotice:
                          e.target.value,
                      })
                    }
                  >

                    <option value="true">
                      true
                    </option>

                    <option value="false">
                      false
                    </option>

                  </select>

                </div>

              </div>

              {/* =================================================
                  MODAL FOOTER
              ================================================= */}

              <div className="modal-footer">

                <button
                  type="button"
                  className="btn btn-primary-outline"
                  onClick={() =>
                    setIsAddContactOpen(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <UserPlus size={15} />
                  Add Contact
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}