// src/components/common/EmptyState.jsx
import React from "react";
import { FiInbox } from "react-icons/fi";

const EmptyState = ({ icon: Icon = FiInbox, title = "No data found", description = "Try adjusting your search or filters." }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-primary" />
    </div>
    <h3 className="text-base font-semibold text-dark-800 mb-1">{title}</h3>
    <p className="text-sm text-gray-400 max-w-xs">{description}</p>
  </div>
);

export default EmptyState;
