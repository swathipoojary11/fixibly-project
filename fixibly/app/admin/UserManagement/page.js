"use client";
import React, { useState, useEffect, useMemo } from "react";
import { fetchApi } from "@/app/utils/api";
import UserTable from "../../components/admin/UserTable";
import SearchBar from "../../components/dispatcher-admin/SearchBar";
import ConfirmationModal from "../../components/dispatcher-admin/ConfirmationModal";
import EmptyState from "../../components/dispatcher-admin/EmptyState";
import { FiUsers, FiX, FiArrowLeft, FiLoader } from "react-icons/fi";

const TABS = [
  { key: "all", label: "All Users" },
  { key: "customers", label: "Customers" },
  { key: "technicians", label: "Technicians" },
  { key: "dispatchers", label: "Dispatchers" },
];

const UserManagement = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [pendingToggle, setPendingToggle] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/admin/users');
      if (res.users) {
        setUsersList(res.users.map(u => ({
          id: u.user_id,
          name: u.full_name || 'N/A',
          email: u.email,
          phone: u.phone || 'N/A',
          role: u.roles?.role_name || (u.role_id === 1 ? 'Customer' : u.role_id === 2 ? 'Technician' : u.role_id === 3 ? 'Dispatcher' : 'Admin'),
          status: u.is_active ? 'Active' : 'Inactive',
          joinedDate: u.created_at
        })));
      }
    } catch (err) {
      console.error("Failed to fetch admin users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    return usersList.filter(u => {
      const matchRole = activeTab === "all" ||
        (activeTab === "customers" && u.role === "Customer") ||
        (activeTab === "technicians" && u.role === "Technician") ||
        (activeTab === "dispatchers" && u.role === "Dispatcher");

      const matchSearch = !search || [u.name, u.email, u.phone].some(v => v?.toLowerCase().includes(search.toLowerCase()));

      return matchRole && matchSearch;
    });
  }, [usersList, activeTab, search]);

  const handleToggle = (user) => {
    setPendingToggle(user);
    setModal({
      title: `${user.status === "Active" ? "Disable" : "Enable"} Account`,
      message: `Are you sure you want to ${user.status === "Active" ? "disable" : "enable"} ${user.name}'s account?`,
      variant: user.status === "Active" ? "danger" : "primary"
    });
  };

  const confirmToggle = async () => {
    if (!pendingToggle) return;
    try {
      const res = await fetchApi(`/admin/users/${pendingToggle.id}/toggle-status`, {
        method: 'PATCH'
      });
      if (res.success) {
        fetchUsers();
      }
    } catch (err) {
      alert("Failed to toggle status: " + err.message);
    } finally {
      setModal(null);
      setPendingToggle(null);
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark-900 transition-colors">
        <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {TABS.map(t => {
          const tabCount = usersList.filter(u => t.key === "all" ? true : u.role.toLowerCase().startsWith(t.key.slice(0, 4))).length;
          return (
            <div key={t.key} className="ff-card p-4">
              <p className="text-2xl font-bold text-dark-900">{tabCount}</p>
              <p className="text-xs text-gray-500">{t.label}</p>
            </div>
          );
        })}
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
        <SearchBar value={search} onChange={setSearch} placeholder={`Search users...`} />
      </div>

      {/* Table */}
      <div className="ff-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="ff-section-title capitalize">{activeTab} <span className="text-sm font-normal text-gray-400 ml-1">({filtered.length})</span></p>
          <p className="text-xs text-gray-400">Admin account status management</p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs font-semibold text-gray-500 flex items-center justify-center gap-2">
            <FiLoader className="animate-spin text-primary" /> Loading users from database...
          </div>
        ) : filtered.length > 0 ? (
          <UserTable users={filtered} onView={setViewUser} onToggleStatus={handleToggle} />
        ) : (
          <EmptyState icon={FiUsers} title="No users found" />
        )}
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
                    <p className="text-xs text-gray-400">ID: #{viewUser.id}</p>
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
