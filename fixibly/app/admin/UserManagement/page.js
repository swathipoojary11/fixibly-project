"use client";
import React, { useState, useMemo } from "react";
import { customers, technicianUsers, dispatchers } from "../../data/users";
import UserTable from "../../components/admin/UserTable";
import SearchBar from "../../components/common/SearchBar";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import EmptyState from "../../components/common/EmptyState";
import { FiUsers, FiX, FiArrowLeft } from "react-icons/fi";

const TABS = [
  { key: "customers",   label: "Customers",   data: customers },
  { key: "technicians", label: "Technicians", data: technicianUsers },
  { key: "dispatchers", label: "Dispatchers", data: dispatchers },
];

const UserManagement = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("customers");
  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState({ customers, technicians: technicianUsers, dispatchers });
  const [modal, setModal] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [pendingToggle, setPendingToggle] = useState(null);

  const filtered = useMemo(() => {
    const data = allUsers[activeTab] || [];
    return data.filter(u =>
      !search || [u.name, u.email, u.phone].some(v => v?.toLowerCase().includes(search.toLowerCase()))
    );
  }, [allUsers, activeTab, search]);

  const handleToggle = (user) => {
    setPendingToggle(user);
    setModal({ title: `${user.status === "Active" ? "Disable" : "Enable"} Account`, message: `Are you sure you want to ${user.status === "Active" ? "disable" : "enable"} ${user.name}'s account?`, variant: user.status === "Active" ? "danger" : "primary" });
  };

  const confirmToggle = () => {
    setAllUsers(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(u => u.id === pendingToggle.id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u)
    }));
    setModal(null); setPendingToggle(null);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark-900 transition-colors">
        <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {TABS.map(t => (
          <div key={t.key} className="ff-card p-4">
            <p className="text-2xl font-bold text-dark-900">{t.data.length}</p>
            <p className="text-xs text-gray-500">{t.label}</p>
            <p className="text-xs text-green-500 mt-0.5">{t.data.filter(u => u.status === "Active").length} active</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="ff-card p-1 flex gap-1 w-fit">
        {TABS.map(t => (
          <button key={t.key} onClick={() => { setActiveTab(t.key); setSearch(""); }}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === t.key ? "bg-primary text-white shadow-orange" : "text-gray-500 hover:bg-gray-100"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="ff-card p-4">
        <SearchBar value={search} onChange={setSearch} placeholder={`Search ${activeTab}...`} />
      </div>

      {/* Table */}
      <div className="ff-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="ff-section-title capitalize">{activeTab} <span className="text-sm font-normal text-gray-400 ml-1">({filtered.length})</span></p>
          <p className="text-xs text-gray-400">Admin can view, enable, or disable accounts</p>
        </div>
        {filtered.length > 0
          ? <UserTable users={filtered} onView={setViewUser} onToggleStatus={handleToggle} />
          : <EmptyState icon={FiUsers} title="No users found" />
        }
      </div>

      {/* View User Modal */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewUser(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-fadeIn">
            <div className="bg-gradient-to-r from-dark-800 to-dark-900 p-5 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl">{viewUser.name.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-base">{viewUser.name}</p>
                    <p className="text-xs text-gray-400">{viewUser.id}</p>
                  </div>
                </div>
                <button onClick={() => setViewUser(null)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20"><FiX className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: "Email", value: viewUser.email },
                { label: "Phone", value: viewUser.phone },
                { label: "Role", value: viewUser.role },
                { label: "Status", value: viewUser.status },
                { label: "Joined", value: new Date(viewUser.joinedDate).toLocaleDateString() },
                ...(viewUser.category ? [{ label: "Category", value: viewUser.category }] : []),
                ...(viewUser.totalBookings !== undefined ? [{ label: "Total Bookings", value: viewUser.totalBookings }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-400">{label}</span>
                  <span className="text-sm font-semibold text-dark-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!modal}
        title={modal?.title}
        message={modal?.message}
        variant={modal?.variant}
        confirmLabel={pendingToggle?.status === "Active" ? "Disable" : "Enable"}
        onConfirm={confirmToggle}
        onCancel={() => { setModal(null); setPendingToggle(null); }}
      />
    </div>
  );
};

export default UserManagement;
