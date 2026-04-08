import { useState, useEffect, useCallback } from "react";

const API = "http://localhost:8081";

const palette = {
  bg: "#0f0f13",
  surface: "#16161d",
  card: "#1c1c26",
  border: "#2a2a38",
  accent: "#6c63ff",
  accentHover: "#7b72ff",
  accentSoft: "rgba(108,99,255,0.12)",
  success: "#22c55e",
  danger: "#ef4444",
  warn: "#f59e0b",
  textPrimary: "#e8e6f0",
  textSecondary: "#8b89a0",
  textMuted: "#525065",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: ${palette.bg};
    color: ${palette.textPrimary};
    min-height: 100vh;
  }

  .app {
    display: flex;
    min-height: 100vh;
  }

  /* Sidebar */
  .sidebar {
    width: 220px;
    flex-shrink: 0;
    background: ${palette.surface};
    border-right: 1px solid ${palette.border};
    display: flex;
    flex-direction: column;
    padding: 0;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 100;
  }

  .sidebar-logo {
    padding: 28px 20px 20px;
    border-bottom: 1px solid ${palette.border};
  }

  .sidebar-logo h1 {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 800;
    color: ${palette.textPrimary};
    letter-spacing: -0.3px;
    line-height: 1.2;
  }

  .sidebar-logo span {
    display: block;
    font-size: 11px;
    color: ${palette.textMuted};
    font-weight: 400;
    margin-top: 4px;
    letter-spacing: 0.4px;
  }

  .sidebar-nav {
    padding: 16px 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .nav-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 1.2px;
    color: ${palette.textMuted};
    padding: 8px 8px 6px;
    text-transform: uppercase;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: 8px;
    cursor: pointer;
    color: ${palette.textSecondary};
    font-size: 14px;
    font-weight: 400;
    transition: all 0.15s;
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
  }

  .nav-item:hover {
    background: rgba(255,255,255,0.05);
    color: ${palette.textPrimary};
  }

  .nav-item.active {
    background: ${palette.accentSoft};
    color: ${palette.accent};
    font-weight: 500;
  }

  .nav-item .nav-icon {
    width: 18px;
    height: 18px;
    opacity: 0.7;
    flex-shrink: 0;
  }

  .nav-item.active .nav-icon {
    opacity: 1;
  }

  /* Main */
  .main {
    margin-left: 220px;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .topbar {
    background: ${palette.surface};
    border-bottom: 1px solid ${palette.border};
    padding: 0 32px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .topbar-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: ${palette.textPrimary};
  }

  .topbar-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
    white-space: nowrap;
  }

  .btn-primary {
    background: ${palette.accent};
    color: #fff;
  }
  .btn-primary:hover { background: ${palette.accentHover}; transform: translateY(-1px); }

  .btn-ghost {
    background: transparent;
    color: ${palette.textSecondary};
    border: 1px solid ${palette.border};
  }
  .btn-ghost:hover {
    background: rgba(255,255,255,0.05);
    color: ${palette.textPrimary};
    border-color: rgba(255,255,255,0.15);
  }

  .btn-danger {
    background: rgba(239,68,68,0.12);
    color: ${palette.danger};
    border: 1px solid rgba(239,68,68,0.25);
  }
  .btn-danger:hover { background: rgba(239,68,68,0.2); }

  .btn-sm {
    padding: 5px 11px;
    font-size: 12px;
    border-radius: 6px;
  }

  /* Content */
  .content {
    padding: 32px;
    flex: 1;
  }

  /* Stats row */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }

  .stat-card {
    background: ${palette.card};
    border: 1px solid ${palette.border};
    border-radius: 12px;
    padding: 20px 22px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    transition: border-color 0.2s;
  }

  .stat-card:hover { border-color: rgba(108,99,255,0.4); }

  .stat-label {
    font-size: 12px;
    color: ${palette.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-weight: 500;
  }

  .stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: ${palette.textPrimary};
    line-height: 1;
  }

  .stat-sub {
    font-size: 12px;
    color: ${palette.textSecondary};
  }

  /* Table */
  .table-card {
    background: ${palette.card};
    border: 1px solid ${palette.border};
    border-radius: 12px;
    overflow: hidden;
  }

  .table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 22px;
    border-bottom: 1px solid ${palette.border};
  }

  .table-header h2 {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 8px;
    background: ${palette.surface};
    border: 1px solid ${palette.border};
    border-radius: 8px;
    padding: 7px 12px;
    min-width: 200px;
  }

  .search-box input {
    background: transparent;
    border: none;
    outline: none;
    color: ${palette.textPrimary};
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    width: 100%;
  }

  .search-box input::placeholder { color: ${palette.textMuted}; }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead th {
    padding: 11px 18px;
    text-align: left;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: ${palette.textMuted};
    background: ${palette.surface};
    border-bottom: 1px solid ${palette.border};
  }

  tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.1s;
  }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: rgba(255,255,255,0.025); }

  td {
    padding: 13px 18px;
    font-size: 13.5px;
    color: ${palette.textPrimary};
    vertical-align: middle;
  }

  .td-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  /* Badge */
  .badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 100px;
    font-size: 11.5px;
    font-weight: 500;
  }

  .badge-active { background: rgba(34,197,94,0.12); color: #4ade80; }
  .badge-inactive { background: rgba(239,68,68,0.1); color: #f87171; }
  .badge-dept { background: ${palette.accentSoft}; color: #a5a0ff; }
  .badge-loc { background: rgba(245,158,11,0.1); color: #fbbf24; }

  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    backdrop-filter: blur(4px);
  }

  .modal {
    background: ${palette.card};
    border: 1px solid ${palette.border};
    border-radius: 16px;
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 24px 18px;
    border-bottom: 1px solid ${palette.border};
  }

  .modal-head h3 {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
  }

  .modal-close {
    width: 28px; height: 28px;
    border-radius: 6px;
    border: 1px solid ${palette.border};
    background: transparent;
    color: ${palette.textSecondary};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: all 0.15s;
  }
  .modal-close:hover {
    background: rgba(239,68,68,0.1);
    color: ${palette.danger};
    border-color: rgba(239,68,68,0.3);
  }

  .modal-body {
    padding: 22px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-group label {
    font-size: 12px;
    font-weight: 500;
    color: ${palette.textSecondary};
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  .form-group input,
  .form-group select {
    background: ${palette.surface};
    border: 1px solid ${palette.border};
    border-radius: 8px;
    padding: 9px 13px;
    font-size: 13.5px;
    color: ${palette.textPrimary};
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
  }

  .form-group input:focus,
  .form-group select:focus {
    border-color: ${palette.accent};
    box-shadow: 0 0 0 3px ${palette.accentSoft};
  }

  .form-group select option {
    background: ${palette.card};
    color: ${palette.textPrimary};
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .modal-foot {
    padding: 16px 24px;
    border-top: 1px solid ${palette.border};
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  /* Toast */
  .toast-container {
    position: fixed;
    top: 20px; right: 20px;
    z-index: 999;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .toast {
    background: ${palette.card};
    border: 1px solid ${palette.border};
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 13px;
    color: ${palette.textPrimary};
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 280px;
    animation: slideIn 0.2s ease;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }

  .toast.success { border-left: 3px solid ${palette.success}; }
  .toast.error { border-left: 3px solid ${palette.danger}; }

  @keyframes slideIn {
    from { transform: translateX(40px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  /* Empty state */
  .empty {
    padding: 60px 20px;
    text-align: center;
    color: ${palette.textMuted};
    font-size: 14px;
  }

  /* Loading spinner */
  .spinner {
    display: inline-block;
    width: 16px; height: 16px;
    border: 2px solid rgba(108,99,255,0.3);
    border-top-color: ${palette.accent};
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .loading-row td {
    padding: 40px;
    text-align: center;
  }

  /* Avatar */
  .avatar {
    width: 32px; height: 32px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
    letter-spacing: -0.5px;
  }
`;

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    employees: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    departments: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
    locations: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    plus: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    ),
    edit: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    trash: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        <path d="M10 11v6"/><path d="M14 11v6"/>
        <path d="M9 6V4h6v2"/>
      </svg>
    ),
    search: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    check: "✓",
    x: "×",
    dashboard: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  };
  return <span className="nav-icon" style={{ display: "inline-flex" }}>{icons[name] || null}</span>;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const avatarColors = [
  ["#4338ca", "#a5b4fc"], ["#0e7490", "#67e8f9"], ["#9a3412", "#fdba74"],
  ["#5b21b6", "#c4b5fd"], ["#065f46", "#6ee7b7"],
];

function getAvatar(name = "") {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  const idx = name.charCodeAt(0) % avatarColors.length;
  const [bg, fg] = avatarColors[idx];
  return { initials, bg, fg };
}

// ─── Toast ─────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);
  return { toasts, push };
}

// ─── Modal ─────────────────────────────────────────────────────────────────
function Modal({ title, onClose, onSubmit, submitting, children }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSubmit} disabled={submitting}>
            {submitting ? <span className="spinner" /> : null}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Employee Modal ────────────────────────────────────────────────────────
function EmployeeModal({ emp, departments, onClose, onSave }) {
  const [form, setForm] = useState({
    empName: emp?.empName || "",
    email: emp?.email || "",
    phone: emp?.phone || "",
    salary: emp?.salary || "",
    hireDate: emp?.hireDate || "",
    status: emp?.status || "Active",
    department: emp?.department ? { deptId: emp.department.deptId } : null,
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await onSave(form, emp?.empId);
    setSaving(false);
  };

  return (
    <Modal title={emp ? "Edit Employee" : "Add Employee"} onClose={onClose} onSubmit={handleSave} submitting={saving}>
      <div className="form-row">
        <div className="form-group">
          <label>Full Name</label>
          <input value={form.empName} onChange={e => set("empName", e.target.value)} placeholder="Jane Smith" />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select value={form.status} onChange={e => set("status", e.target.value)}>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="jane@company.com" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Phone</label>
          <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 98765 43210" />
        </div>
        <div className="form-group">
          <label>Salary (₹)</label>
          <input type="number" value={form.salary} onChange={e => set("salary", e.target.value)} placeholder="50000" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Hire Date</label>
          <input type="date" value={form.hireDate} onChange={e => set("hireDate", e.target.value)} />
        </div>
        <div className="form-group">
          <label>Department</label>
          <select
            value={form.department?.deptId || ""}
            onChange={e => set("department", e.target.value ? { deptId: parseInt(e.target.value) } : null)}
          >
            <option value="">— None —</option>
            {departments.map(d => <option key={d.deptId} value={d.deptId}>{d.deptName}</option>)}
          </select>
        </div>
      </div>
    </Modal>
  );
}

// ─── Department Modal ──────────────────────────────────────────────────────
function DeptModal({ dept, locations, onClose, onSave }) {
  const [form, setForm] = useState({
    deptName: dept?.deptName || "",
    budget: dept?.budget || "",
    location: dept?.location ? { locationId: dept.location.locationId } : null,
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await onSave(form, dept?.deptId);
    setSaving(false);
  };

  return (
    <Modal title={dept ? "Edit Department" : "Add Department"} onClose={onClose} onSubmit={handleSave} submitting={saving}>
      <div className="form-group">
        <label>Department Name</label>
        <input value={form.deptName} onChange={e => set("deptName", e.target.value)} placeholder="Engineering" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Budget (₹)</label>
          <input type="number" value={form.budget} onChange={e => set("budget", e.target.value)} placeholder="1000000" />
        </div>
        <div className="form-group">
          <label>Location</label>
          <select
            value={form.location?.locationId || ""}
            onChange={e => set("location", e.target.value ? { locationId: parseInt(e.target.value) } : null)}
          >
            <option value="">— None —</option>
            {locations.map(l => <option key={l.locationId} value={l.locationId}>{l.city}, {l.country}</option>)}
          </select>
        </div>
      </div>
    </Modal>
  );
}

// ─── Location Modal ────────────────────────────────────────────────────────
function LocModal({ loc, onClose, onSave }) {
  const [form, setForm] = useState({
    city: loc?.city || "",
    state: loc?.state || "",
    country: loc?.country || "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await onSave(form, loc?.locationId);
    setSaving(false);
  };

  return (
    <Modal title={loc ? "Edit Location" : "Add Location"} onClose={onClose} onSubmit={handleSave} submitting={saving}>
      <div className="form-group">
        <label>City</label>
        <input value={form.city} onChange={e => set("city", e.target.value)} placeholder="Mumbai" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>State</label>
          <input value={form.state} onChange={e => set("state", e.target.value)} placeholder="Maharashtra" />
        </div>
        <div className="form-group">
          <label>Country</label>
          <input value={form.country} onChange={e => set("country", e.target.value)} placeholder="India" />
        </div>
      </div>
    </Modal>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("employees");
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState({ employees: false, departments: false, locations: false });
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const { toasts, push } = useToast();

  // ── Fetch ─────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading({ employees: true, departments: true, locations: true });
    try {
      const [empRes, deptRes, locRes] = await Promise.all([
        fetch(`${API}/api/v1/employees`),
        fetch(`${API}/departments`),
        fetch(`${API}/locations`),
      ]);
      const [emps, depts, locs] = await Promise.all([empRes.json(), deptRes.json(), locRes.json()]);
      setEmployees(emps);
      setDepartments(depts);
      setLocations(locs);
    } catch {
      push("Could not connect to backend. Is Spring Boot running on port 8081?", "error");
    } finally {
      setLoading({ employees: false, departments: false, locations: false });
    }
  }, [push]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Employee CRUD ─────────────────────────────────────────────────────
  const saveEmployee = async (form, id) => {
    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `${API}/api/v1/employees/${id}` : `${API}/api/v1/employees`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      if (id) {
        setEmployees(prev => prev.map(e => e.empId === id ? saved : e));
      } else {
        setEmployees(prev => [...prev, saved]);
      }
      push(id ? "Employee updated!" : "Employee added!", "success");
      setModal(null);
    } catch {
      push("Failed to save employee. Check console.", "error");
    }
  };

  const deleteEmployee = async (id) => {
if (!window.confirm("Delete this employee?")) return;
    try {
      await fetch(`${API}/api/v1/employees/${id}`, { method: "DELETE" });
      setEmployees(prev => prev.filter(e => e.empId !== id));
      push("Employee deleted.", "success");
    } catch {
      push("Delete failed.", "error");
    }
  };

  // ── Department CRUD ───────────────────────────────────────────────────
  const saveDepartment = async (form, id) => {
    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `${API}/departments/${id}` : `${API}/departments`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      if (id) {
        setDepartments(prev => prev.map(d => d.deptId === id ? saved : d));
      } else {
        setDepartments(prev => [...prev, saved]);
      }
      push(id ? "Department updated!" : "Department added!", "success");
      setModal(null);
    } catch {
      push("Failed to save department.", "error");
    }
  };

  const deleteDepartment = async (id) => {
    if (!window.confirm("Delete this department?")) return;
    try {
      await fetch(`${API}/departments/${id}`, { method: "DELETE" });
      setDepartments(prev => prev.filter(d => d.deptId !== id));
      push("Department deleted.", "success");
    } catch {
      push("Delete failed.", "error");
    }
  };

  // ── Location CRUD ─────────────────────────────────────────────────────
  const saveLocation = async (form, id) => {
    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `${API}/locations/${id}` : `${API}/locations`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      if (id) {
        setLocations(prev => prev.map(l => l.locationId === id ? saved : l));
      } else {
        setLocations(prev => [...prev, saved]);
      }
      push(id ? "Location updated!" : "Location added!", "success");
      setModal(null);
    } catch {
      push("Failed to save location.", "error");
    }
  };

  const deleteLocation = async (id) => {
    if (!window.confirm("Delete this location?")) return;
    try {
      await fetch(`${API}/locations/${id}`, { method: "DELETE" });
      setLocations(prev => prev.filter(l => l.locationId !== id));
      push("Location deleted.", "success");
    } catch {
      push("Delete failed.", "error");
    }
  };

  // ── Filter ─────────────────────────────────────────────────────────────
  const q = search.toLowerCase();
  const filteredEmps = employees.filter(e =>
    (e.empName || "").toLowerCase().includes(q) ||
    (e.email || "").toLowerCase().includes(q) ||
    (e.status || "").toLowerCase().includes(q) ||
    (e.department?.deptName || "").toLowerCase().includes(q)
  );
  const filteredDepts = departments.filter(d =>
    (d.deptName || "").toLowerCase().includes(q) ||
    (d.location?.city || "").toLowerCase().includes(q)
  );
  const filteredLocs = locations.filter(l =>
    (l.city || "").toLowerCase().includes(q) ||
    (l.state || "").toLowerCase().includes(q) ||
    (l.country || "").toLowerCase().includes(q)
  );

  const tabs = [
    { id: "employees", label: "Employees", icon: "employees" },
    { id: "departments", label: "Departments", icon: "departments" },
    { id: "locations", label: "Locations", icon: "locations" },
  ];

  const activeEmps = employees.filter(e => e.status === "Active").length;

  return (
    <>
      <style>{css}</style>
      <div className="app">

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <h1>EMS</h1>
            <span>Employee Management</span>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-label">Navigation</div>
            {tabs.map(t => (
              <button
                key={t.id}
                className={`nav-item ${tab === t.id ? "active" : ""}`}
                onClick={() => { setTab(t.id); setSearch(""); }}
              >
                <Icon name={t.icon} size={16} />
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <div className="main">
          <header className="topbar">
            <span className="topbar-title">
              {tabs.find(t => t.id === tab)?.label}
            </span>
            <div className="topbar-actions">
              <button className="btn btn-ghost btn-sm" onClick={fetchAll}>↻ Refresh</button>
              {tab === "employees" && (
                <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: "emp" })}>
                  <Icon name="plus" size={14} /> Add Employee
                </button>
              )}
              {tab === "departments" && (
                <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: "dept" })}>
                  <Icon name="plus" size={14} /> Add Department
                </button>
              )}
              {tab === "locations" && (
                <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: "loc" })}>
                  <Icon name="plus" size={14} /> Add Location
                </button>
              )}
            </div>
          </header>

          <div className="content">

            {/* Stats */}
            {tab === "employees" && (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Employees</div>
                  <div className="stat-value">{employees.length}</div>
                  <div className="stat-sub">across all departments</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Active</div>
                  <div className="stat-value" style={{ color: palette.success }}>{activeEmps}</div>
                  <div className="stat-sub">{employees.length - activeEmps} inactive</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Departments</div>
                  <div className="stat-value">{departments.length}</div>
                  <div className="stat-sub">{locations.length} office locations</div>
                </div>
              </div>
            )}

            {tab === "departments" && (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Departments</div>
                  <div className="stat-value">{departments.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Budget</div>
                  <div className="stat-value" style={{ fontSize: 24 }}>
                    ₹{(departments.reduce((s, d) => s + (d.budget || 0), 0) / 100000).toFixed(1)}L
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Locations Used</div>
                  <div className="stat-value">{new Set(departments.map(d => d.location?.locationId).filter(Boolean)).size}</div>
                </div>
              </div>
            )}

            {tab === "locations" && (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Offices</div>
                  <div className="stat-value">{locations.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Countries</div>
                  <div className="stat-value">{new Set(locations.map(l => l.country)).size}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Departments Hosted</div>
                  <div className="stat-value">{departments.length}</div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="table-card">
              <div className="table-header">
                <h2>
                  {tab === "employees" ? `${filteredEmps.length} Records` :
                   tab === "departments" ? `${filteredDepts.length} Departments` :
                   `${filteredLocs.length} Locations`}
                </h2>
                <div className="search-box">
                  <Icon name="search" size={14} />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search..."
                  />
                </div>
              </div>

              {/* ── Employees Table ─────────────────────────────────── */}
              {tab === "employees" && (
                <table>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Department</th>
                      <th>Salary</th>
                      <th>Hire Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading.employees ? (
                      <tr className="loading-row"><td colSpan={8}><span className="spinner" /></td></tr>
                    ) : filteredEmps.length === 0 ? (
                      <tr><td colSpan={8}><div className="empty">No employees found.</div></td></tr>
                    ) : filteredEmps.map(e => {
                      const av = getAvatar(e.empName);
                      return (
                        <tr key={e.empId}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div className="avatar" style={{ background: av.bg, color: av.fg }}>{av.initials}</div>
                              <div>
                                <div style={{ fontWeight: 500 }}>{e.empName || "—"}</div>
                                <div style={{ fontSize: 11, color: palette.textMuted }}>ID #{e.empId}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ color: palette.textSecondary }}>{e.email || "—"}</td>
                          <td style={{ color: palette.textSecondary }}>{e.phone || "—"}</td>
                          <td>
                            {e.department
                              ? <span className="badge badge-dept">{e.department.deptName}</span>
                              : <span style={{ color: palette.textMuted }}>—</span>}
                          </td>
                          <td>{e.salary ? `₹${Number(e.salary).toLocaleString("en-IN")}` : "—"}</td>
                          <td style={{ color: palette.textSecondary }}>{e.hireDate || "—"}</td>
                          <td>
                            <span className={`badge ${e.status === "Active" ? "badge-active" : "badge-inactive"}`}>
                              {e.status || "—"}
                            </span>
                          </td>
                          <td>
                            <div className="td-actions">
                              <button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: "emp", data: e })}>
                                <Icon name="edit" size={13} />
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => deleteEmployee(e.empId)}>
                                <Icon name="trash" size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {/* ── Departments Table ───────────────────────────────── */}
              {tab === "departments" && (
                <table>
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Budget</th>
                      <th>Location</th>
                      <th>Employees</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading.departments ? (
                      <tr className="loading-row"><td colSpan={5}><span className="spinner" /></td></tr>
                    ) : filteredDepts.length === 0 ? (
                      <tr><td colSpan={5}><div className="empty">No departments found.</div></td></tr>
                    ) : filteredDepts.map(d => {
                      const empCount = employees.filter(e => e.department?.deptId === d.deptId).length;
                      return (
                        <tr key={d.deptId}>
                          <td>
                            <div style={{ fontWeight: 500 }}>{d.deptName}</div>
                            <div style={{ fontSize: 11, color: palette.textMuted }}>ID #{d.deptId}</div>
                          </td>
                          <td>{d.budget ? `₹${Number(d.budget).toLocaleString("en-IN")}` : "—"}</td>
                          <td>
                            {d.location
                              ? <span className="badge badge-loc">{d.location.city}, {d.location.country}</span>
                              : <span style={{ color: palette.textMuted }}>—</span>}
                          </td>
                          <td>
                            <span className="badge badge-dept">{empCount} emp</span>
                          </td>
                          <td>
                            <div className="td-actions">
                              <button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: "dept", data: d })}>
                                <Icon name="edit" size={13} />
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => deleteDepartment(d.deptId)}>
                                <Icon name="trash" size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {/* ── Locations Table ─────────────────────────────────── */}
              {tab === "locations" && (
                <table>
                  <thead>
                    <tr>
                      <th>City</th>
                      <th>State</th>
                      <th>Country</th>
                      <th>Departments</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading.locations ? (
                      <tr className="loading-row"><td colSpan={5}><span className="spinner" /></td></tr>
                    ) : filteredLocs.length === 0 ? (
                      <tr><td colSpan={5}><div className="empty">No locations found.</div></td></tr>
                    ) : filteredLocs.map(l => {
                      const deptCount = departments.filter(d => d.location?.locationId === l.locationId).length;
                      return (
                        <tr key={l.locationId}>
                          <td style={{ fontWeight: 500 }}>{l.city}</td>
                          <td style={{ color: palette.textSecondary }}>{l.state || "—"}</td>
                          <td>
                            <span className="badge badge-loc">{l.country}</span>
                          </td>
                          <td>
                            <span className="badge badge-dept">{deptCount} dept</span>
                          </td>
                          <td>
                            <div className="td-actions">
                              <button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: "loc", data: l })}>
                                <Icon name="edit" size={13} />
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => deleteLocation(l.locationId)}>
                                <Icon name="trash" size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        {modal?.type === "emp" && (
          <EmployeeModal
            emp={modal.data}
            departments={departments}
            onClose={() => setModal(null)}
            onSave={saveEmployee}
          />
        )}
        {modal?.type === "dept" && (
          <DeptModal
            dept={modal.data}
            locations={locations}
            onClose={() => setModal(null)}
            onSave={saveDepartment}
          />
        )}
        {modal?.type === "loc" && (
          <LocModal
            loc={modal.data}
            onClose={() => setModal(null)}
            onSave={saveLocation}
          />
        )}

        {/* Toasts */}
        <div className="toast-container">
          {toasts.map(t => (
            <div key={t.id} className={`toast ${t.type}`}>
              <span>{t.type === "success" ? "✓" : "✕"}</span>
              {t.msg}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
