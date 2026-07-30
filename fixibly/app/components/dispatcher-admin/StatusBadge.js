// // src/components/common/StatusBadge.jsx
// import React from "react";

// const variants = {
//   // Booking statuses
//   "Pending":       "bg-yellow-100 text-yellow-700 border border-yellow-200",
//   "Assigned":      "bg-blue-100 text-blue-700 border border-blue-200",
//   "On The Way":    "bg-cyan-100 text-cyan-700 border border-cyan-200",
//   "In Progress":   "bg-orange-100 text-orange-700 border border-orange-200",
//   "Completed":     "bg-green-100 text-green-700 border border-green-200",
//   "Cancelled":     "bg-red-100 text-red-700 border border-red-200",
//   "Delayed":       "bg-purple-100 text-purple-700 border border-purple-200",
//   "Emergency":     "bg-red-100 text-red-700 border border-red-200",
//   // User statuses
//   "Active":        "bg-green-100 text-green-700 border border-green-200",
//   "Inactive":      "bg-gray-100 text-gray-500 border border-gray-200",
//   "Busy":          "bg-orange-100 text-orange-700 border border-orange-200",
//   "Available":     "bg-green-100 text-green-700 border border-green-200",
//   // Log statuses
//   "Created":       "bg-blue-100 text-blue-700 border border-blue-200",
//   "Accepted":      "bg-teal-100 text-teal-700 border border-teal-200",
//   "Arrived":       "bg-indigo-100 text-indigo-700 border border-indigo-200",
//   // Priority
//   "High":          "bg-orange-100 text-orange-700 border border-orange-200",
//   "Normal":        "bg-gray-100 text-gray-600 border border-gray-200",
//   "Low":           "bg-slate-100 text-slate-500 border border-slate-200",
//   // System
//   "Operational":   "bg-green-100 text-green-700 border border-green-200",
//   "Degraded":      "bg-yellow-100 text-yellow-700 border border-yellow-200",
//   "Down":          "bg-red-100 text-red-700 border border-red-200",
// };

// const StatusBadge = ({ status, size = "sm" }) => { 
//   const cls = variants[status] || "bg-gray-100 text-gray-600 border border-gray-200";
//   const sz = size === "xs" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1";
//   return (
//     <span className={`inline-flex items-center font-semibold rounded-full ${sz} ${cls} whitespace-nowrap`}>
//       {status}
//     </span>
//   );
// };

// export default StatusBadge;

// src/components/common/StatusBadge.jsx
// Import the React library, which is necessary for creating React components.
import React from "react";

// Define a constant object 'variants' that maps status strings to their corresponding Tailwind CSS classes.
// This acts as a style dictionary for different statuses.
const variants = {
  // Booking statuses and their associated styles.
  "Pending":       "bg-yellow-100 text-yellow-700 border border-yellow-200",
  "Assigned":      "bg-blue-100 text-blue-700 border border-blue-200",
  "On The Way":    "bg-cyan-100 text-cyan-700 border border-cyan-200",
  "In Progress":   "bg-orange-100 text-orange-700 border border-orange-200",
  "Completed":     "bg-green-100 text-green-700 border border-green-200",
  "Cancelled":     "bg-red-100 text-red-700 border border-red-200",
  "Delayed":       "bg-purple-100 text-purple-700 border border-purple-200",
  "Emergency":     "bg-red-100 text-red-700 border border-red-200",
  // User statuses and their associated styles.
  "Active":        "bg-green-100 text-green-700 border border-green-200",
  "Inactive":      "bg-gray-100 text-gray-500 border border-gray-200",
  "Busy":          "bg-orange-100 text-orange-700 border border-orange-200",
  "Available":     "bg-green-100 text-green-700 border border-green-200",
  // Log statuses and their associated styles.
  "Created":       "bg-blue-100 text-blue-700 border border-blue-200",
  "Accepted":      "bg-teal-100 text-teal-700 border border-teal-200",
  "Arrived":       "bg-indigo-100 text-indigo-700 border border-indigo-200",
  // Priority levels and their associated styles.
  "High":          "bg-orange-100 text-orange-700 border border-orange-200",
  "Normal":        "bg-gray-100 text-gray-600 border border-gray-200",
  "Low":           "bg-slate-100 text-slate-500 border border-slate-200",
  // System health statuses and their associated styles.
  "Operational":   "bg-green-100 text-green-700 border border-green-200",
  "Degraded":      "bg-yellow-100 text-yellow-700 border border-yellow-200",
  "Down":          "bg-red-100 text-red-700 border border-red-200",
};

// Define the StatusBadge functional component. It takes 'status' and 'size' as props.
// 'size' has a default value of "sm" (small).
const StatusBadge = ({ status, size = "sm" }) => { 
  // Look up the CSS classes for the given 'status' in the 'variants' object.
  // If the status is not found, use a default gray style as a fallback.
  const cls = variants[status] || "bg-gray-100 text-gray-600 border border-gray-200";
  // Determine the size-related CSS classes based on the 'size' prop.
  // "xs" (extra-small) has smaller text and padding than the default "sm".
  const sz = size === "xs" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1";
  // Return a <span> element which will be rendered as the badge.
  return (
    // Use a template literal to combine several sets of Tailwind CSS classes for styling.
    // - `inline-flex items-center`: Makes it an inline element and centers its content.
    // - `font-semibold rounded-full`: Makes the text bold and the badge's corners fully rounded.
    // - `${sz}`: Applies the size-specific classes.
    // - `${cls}`: Applies the color and border classes based on the status.
    // - `whitespace-nowrap`: Prevents the text inside the badge from wrapping to a new line.
    <span className={`inline-flex items-center font-semibold rounded-full ${sz} ${cls} whitespace-nowrap`}>
      {/* Display the status text inside the span. */}
      {status}
    </span>
  );
};

// Export the StatusBadge component so it can be imported and used in other files.
export default StatusBadge;
