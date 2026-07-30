// src/components/admin/UserTable.jsx
import React from "react";
import StatusBadge from "../dispatcher-admin/StatusBadge";
import { FiEye, FiToggleLeft, FiToggleRight } from "react-icons/fi";

const UserTable = ({ users, onView, onToggleStatus }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100">
          {["Name", "Email", "Phone", "Role", "Status", "Joined", "Actions"].map(h => (
            <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors duration-150">
            <td className="py-3 px-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {u.name.charAt(0)}
                </div>
                <span className="font-medium text-dark-800 whitespace-nowrap">{u.name}</span>
              </div>
            </td>
            <td className="py-3 px-4 text-gray-500 text-xs">{u.email}</td>
            <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">{u.phone}</td>
            <td className="py-3 px-4 text-xs font-medium text-dark-700">{u.role}</td>
            <td className="py-3 px-4"><StatusBadge status={u.status} /></td>
            <td className="py-3 px-4 text-xs text-gray-400 whitespace-nowrap">{new Date(u.joinedDate).toLocaleDateString()}</td>
            <td className="py-3 px-4">
              <div className="flex items-center gap-1">
                <button onClick={() => onView && onView(u)} className="ff-btn-ghost flex items-center gap-1 text-xs">
                  <FiEye className="w-3.5 h-3.5" /> View
                </button>
                <button onClick={() => onToggleStatus && onToggleStatus(u)} className={`ff-btn-ghost flex items-center gap-1 text-xs ${u.status === "Active" ? "text-red-400 hover:bg-red-50" : "text-green-500 hover:bg-green-50"}`}>
                  {u.status === "Active" ? <FiToggleRight className="w-3.5 h-3.5" /> : <FiToggleLeft className="w-3.5 h-3.5" />}
                  {u.status === "Active" ? "Disable" : "Enable"}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UserTable;
