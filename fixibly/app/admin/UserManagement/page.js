"use client";
import React, { useState, useMemo } from "react";
import { useAdminStore } from "../AdminStore";
import UserTable from "../../components/admin/UserTable";
import SearchBar from "../../components/dispatcher-admin/SearchBar";
import ConfirmationModal from "../../components/dispatcher-admin/ConfirmationModal";
import EmptyState from "../../components/dispatcher-admin/EmptyState";
import { FiUsers, FiX, FiArrowLeft } from "react-icons/fi";

const TABS = [
    { key: "customers",   label: "Customers"   },
    { key: "technicians", label: "Technicians" },
    { key: "dispatchers", label: "Dispatchers" },
];

const UserManagement = ({ onBack = () => {} }) => {
    const { customers, technicians, dispatchers, userCounts, loading } = useAdminStore();
    const [activeTab, setActiveTab] = useState("customers");
    const [search, setSearch] = useState("");
    const [modal, setModal] = useState(null);
    const [viewUser, setViewUser] = useState(null);
    const [pendingToggle, setPendingToggle] = useState(null);
    const [overrides, setOverrides] = useState({});

    const dataMap = useMemo(() => ({
        customers:   customers.map(u => ({ ...u, ...(overrides[u.id] || {}) })),
        technicians: technicians.map(u => ({ ...u, ...(overrides[u.id] || {}) })),
        dispatchers: dispatchers.map(u => ({ ...u, ...(overrides[u.id] || {}) }))
    }), [customers, technicians, dispatchers, overrides]);

    const filtered = useMemo(() => {
        const data = dataMap[activeTab] || [];
        return data.filter(u =>
            !search || [u.name, u.email, u.phone].some(v => v?.toLowerCase().includes(search.toLowerCase()))
        );
    }, [dataMap, activeTab, search]);

    const counts = {
        customers:   customers.length,
        technicians: technicians.length,
        dispatchers: dispatchers.length
    };

    const handleToggle = (user) => {
        setPendingToggle(user);
        setModal({
            title: `${user.status === "Active" ? "Disable" : "Enable"} Account`,
            message: `Are you sure you want to ${user.status === "Active" ? "disable" : "enable"} ${user.name}'s account?`,
            variant: user.status === "Active" ? "danger" : "primary"
        });
    };

    const confirmToggle = () => {
        setOverrides(prev => ({
            ...prev,
            [pendingToggle.id]: { status: pendingToggle.status === "Active" ? "Inactive" : "Active" }
        }));
        setModal(null);
        setPendingToggle(null);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-5 animate-fadeIn">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark-900 transition-colors">
                <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
                {TABS.map(t => (
                    <div key={t.key} className="ff-card p-4">
                        <p className="text-2xl font-bold text-dark-900">{counts[t.key]}</p>
                        <p className="text-xs text-gray-500">{t.label}</p>
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
                    <p className="text-xs text-gray-400">Admin view — read only for customers</p>
                </div>
                {filtered.length > 0
                    ? <UserTable users={filtered} onView={setViewUser} onToggleStatus={activeTab !== "customers" ? handleToggle : null} />
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
                                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                                        {viewUser.name?.charAt(0) || "?"}
                                    </div>
                                    <div>
                                        <p className="font-bold text-base">{viewUser.name}</p>
                                        <p className="text-xs text-gray-400">{viewUser.role}</p>
                                    </div>
                                </div>
                                <button onClick={() => setViewUser(null)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20"><FiX className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            {[
                                { label: "Email",   value: viewUser.email   || "—" },
                                { label: "Phone",   value: viewUser.phone   || "—" },
                                { label: "Status",  value: viewUser.status  || "Active" },
                                { label: "Joined",  value: viewUser.joinedDate ? new Date(viewUser.joinedDate).toLocaleDateString() : "—" },
                                ...(viewUser.category    ? [{ label: "Category",  value: viewUser.category }]    : []),
                                ...(viewUser.avgRating !== undefined ? [{ label: "Rating", value: `★ ${viewUser.avgRating}` }] : []),
                                ...(viewUser.availability ? [{ label: "Availability", value: viewUser.availability }] : []),
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
