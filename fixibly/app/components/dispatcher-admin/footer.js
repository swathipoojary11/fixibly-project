import React from "react";

const Footer = () => {
  return (
    <footer className="rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden mt-10">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Col 1: Brand Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="bg-[#FF5500] text-white font-black text-sm px-2 py-0.5 rounded">
              FF
            </div>
            <span className="text-lg font-bold">Field<span className="text-[#FF5500]">Flow</span></span>
          </div>
          <p className="text-gray-400 leading-relaxed max-w-sm">
            On-demand home services and field dispatch platform. Quick booking, transparent costs, and verified local pros.
          </p>
        </div>

        {/* Col 2: Contact Us */}
        <div className="md:ml-auto">
          <h4 className="font-bold text-sm text-[#FF5500] mb-3 uppercase tracking-wider">Contact Us</h4>
          <ul className="space-y-2 text-gray-300">
            <li>📍 Sahyadri Campus, Mangalore</li>
            <li>✉️ support@fieldflow.com</li>
            <li>📞 +91 98765 43210</li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="bg-black/50 py-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-[11px] gap-2">
          <p>© {new Date().getFullYear()} FieldFlow. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;