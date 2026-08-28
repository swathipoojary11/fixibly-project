// src/components/common/FilterBar.jsx
import React from "react";
import { FiFilter } from "react-icons/fi";

const FilterBar = ({ filters, values, onChange }) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <FiFilter className="text-gray-400 w-4 h-4 shrink-0" />
      {filters.map((f) => (
        <select
          key={f.key}
          value={values[f.key] || ""}
          onChange={(e) => onChange(f.key, e.target.value)}
          className="ff-input w-auto! text-xs py-2 cursor-pointer"
        >
          <option value="">{f.label}</option>
          {f.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ))}
    </div>
  );
};

export default FilterBar;
