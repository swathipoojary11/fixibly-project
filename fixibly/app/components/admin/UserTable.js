// src/components/admin/UserTable.jsx
import React from "react";
import StatusBadge from "../dispatcher-admin/StatusBadge";
import { FiEye, FiToggleLeft, FiToggleRight } from "react-icons/fi";

const UserTable = ({ users, onView, onToggleStatus }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100">
          {["User Profile", "Contact Info", "Role & Activity", "Verification", "Status", "Actions"].map(h => (
            <th key={h} className="text-left py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors duration-150">
            <td className="py-3 px-4">
              <div className="flex items-center gap-3">
                {u.profileImage ? (
                  <img src={u.profileImage} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm bg-gray-100" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                    {u.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-bold text-dark-900 whitespace-nowrap text-sm">{u.name}</p>
                  <p className="text-[10px] text-gray-400">Joined {new Date(u.joinedDate || new Date()).toLocaleDateString()}</p>
                </div>
              </div>
            </td>
            <td className="py-3 px-4">
              <p className="text-xs text-dark-800 font-medium">{u.email || "No Email"}</p>
              <p className="text-xs text-gray-500">{u.phone || "No Phone"}</p>
            </td>
            <td className="py-3 px-4">
              <p className="text-xs font-bold text-primary">{u.role}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Last login: {u.lastLogin || "Today"}</p>
            </td>
            <td className="py-3 px-4">
              {u.verified ? <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-md font-bold flex items-center w-fit gap-1">✓ Verified</span> : <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-1 rounded-md font-bold flex items-center w-fit gap-1">⚠ Unverified</span>}
            </td>
            <td className="py-3 px-4"><StatusBadge status={u.status || "Active"} /></td>
            <td className="py-3 px-4">
              <div className="flex items-center gap-1">
                <button onClick={() => onView && onView(u)} className="ff-btn-ghost flex items-center gap-1 text-xs">
                  <FiEye className="w-3.5 h-3.5" /> View
                </button>
                {onToggleStatus && (
                  <button onClick={() => onToggleStatus(u)} className={`ff-btn-ghost flex items-center gap-1 text-xs ${u.status === "Active" ? "text-red-400 hover:bg-red-50" : "text-green-500 hover:bg-green-50"}`}>
                    {u.status === "Active" ? <FiToggleRight className="w-3.5 h-3.5" /> : <FiToggleLeft className="w-3.5 h-3.5" />}
                    {u.status === "Active" ? "Disable" : "Enable"}
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UserTable;
