"use client";

export default function DispatcherRouteLayout({ children }) {
  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-900">{children}</div>
      <style jsx global>{`
        .ff-card {
          background: #ffffff;
          border-radius: 0.875rem;
          border: 1px solid #f3f4f6;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07);
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .ff-card:hover {
          box-shadow: 0 4px 12px 0 rgb(0 0 0 / 0.10), 0 2px 4px -1px rgb(0 0 0 / 0.06);
        }
        .ff-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
          border-radius: 0.625rem;
          background: #f97316;
          color: #fff;
          font-size: 0.8125rem;
          font-weight: 600;
          transition: background 0.15s ease, box-shadow 0.15s ease;
          cursor: pointer;
          white-space: nowrap;
        }
        .ff-btn-primary:hover {
          background: #ea6c0a;
          box-shadow: 0 4px 14px 0 rgb(249 115 22 / 0.35);
        }
        .ff-btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
          border-radius: 0.625rem;
          background: #f3f4f6;
          color: #374151;
          font-size: 0.8125rem;
          font-weight: 600;
          transition: background 0.15s ease;
          cursor: pointer;
          white-space: nowrap;
        }
        .ff-btn-secondary:hover {
          background: #e5e7eb;
        }
        .ff-input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 0.625rem;
          border: 1.5px solid #e5e7eb;
          background: #fff;
          color: #111827;
          font-size: 0.8125rem;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .ff-input:focus {
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgb(249 115 22 / 0.12);
        }
        .bg-primary { background-color: #f97316; }
        .text-primary { color: #f97316; }
        .border-primary { border-color: #f97316; }
        .bg-dark-900 { background-color: #111827; }
        .text-dark-900 { color: #111827; }
        .text-dark-800 { color: #1f2937; }
        .text-dark-700 { color: #374151; }
        .bg-background { background-color: #f9fafb; }
        .text-foreground { color: #111827; }
        .shadow-card { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07); }
        .shadow-card-hover { box-shadow: 0 4px 12px 0 rgb(0 0 0 / 0.10), 0 2px 4px -1px rgb(0 0 0 / 0.06); }
        .shadow-orange { box-shadow: 0 4px 14px 0 rgb(249 115 22 / 0.35); }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.22s ease both; }
      `}</style>
    </>
  );
}
