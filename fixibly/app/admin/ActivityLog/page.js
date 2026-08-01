"use client";
import React, { useState, useMemo } from "react";
import { useAdminStore } from "../AdminStore";
import ActivityTimeline from "../../components/admin/ActivityTimeline";
import SearchBar from "../../components/dispatcher-admin/SearchBar";
import EmptyState from "../../components/dispatcher-admin/EmptyState";
import { FiActivity, FiArrowLeft } from "react-icons/fi";

const ActivityLog = ({ onBack }) => {
    const { activityLogs = [], loading } = useAdminStore();
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        if (!search) return activityLogs;
        const q = search.toLowerCase();
        return activityLogs.filter(l =>
            [l.action, l.description, l.actor].some(v => v?.toLowerCase().includes(q))
        );
    }, [activityLogs, search]);

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

            <div className="ff-card p-4">
                <SearchBar value={search} onChange={setSearch} placeholder="Search actions, actors..." />
            </div>

            <div className="ff-card p-5">
                <div className="flex items-center justify-between mb-5">
                    <p className="ff-section-title">
                        Audit Timeline <span className="text-sm font-normal text-gray-400 ml-1">({filtered.length} events)</span>
                    </p>
                </div>
                {filtered.length > 0
                    ? <ActivityTimeline logs={filtered} />
                    : <EmptyState icon={FiActivity} title="No activity found" description="Try adjusting your search." />
                }
            </div>
        </div>
    );
};

export default ActivityLog;
