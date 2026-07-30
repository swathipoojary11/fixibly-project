// src/components/common/ConfirmationModal.jsx
import React from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

const ConfirmationModal = ({ isOpen, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm, onCancel, variant = "danger" }) => {
  if (!isOpen) return null;
  const btnCls = variant === "danger"
    ? "bg-red-500 hover:bg-red-600 text-white"
    : "bg-primary hover:bg-primary-600 text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
        <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <FiX className="w-5 h-5" />
        </button>
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${variant === "danger" ? "bg-red-100" : "bg-orange-100"}`}>
            <FiAlertTriangle className={`w-5 h-5 ${variant === "danger" ? "text-red-500" : "text-primary"}`} />
          </div>
          <div>
            <h3 className="text-base font-bold text-dark-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={onCancel} className="ff-btn-secondary">{cancelLabel}</button>
          <button onClick={onConfirm} className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${btnCls}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
