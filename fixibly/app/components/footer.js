'use client';

import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-[#0F172A] text-white border-t border-gray-800 text-xs">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1: Brand Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="bg-[#FF5500] text-white font-black text-sm px-2 py-0.5 rounded">
              FF
            </div>
            <span className="text-lg font-bold">Field<span className="text-[#FF5500]">Flow</span></span>
          </div>
          <p className="text-gray-400 leading-relaxed">
            On-demand home services and field dispatch platform. Quick booking, transparent costs, and verified local pros.
          </p>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="font-bold text-sm text-[#FF5500] mb-3 uppercase tracking-wider">Quick Navigation</h4>
          <ul className="space-y-2 text-gray-300">
            <li>
              <button onClick={() => router.push('/customer')} className="hover:text-[#FF5500]">Home Dashboard</button>
            </li>
            <li>
              <button onClick={() => router.push('/customer/categories')} className="hover:text-[#FF5500]">Service Categories</button>
            </li>
            <li>
              <button onClick={() => router.push('/customer/book')} className="hover:text-[#FF5500]">Book a Technician</button>
            </li>
            <li>
              <button onClick={() => router.push('/customer/history')} className="hover:text-[#FF5500]">Booking History</button>
            </li>
          </ul>
        </div>

        {/* Col 3: Popular Services */}
        <div>
          <h4 className="font-bold text-sm text-[#FF5500] mb-3 uppercase tracking-wider">Services</h4>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#" className="hover:text-[#FF5500]">Plumbing & Pipe Repair</a></li>
            <li><a href="#" className="hover:text-[#FF5500]">Electrical Circuit & Wiring</a></li>
            <li><a href="#" className="hover:text-[#FF5500]">Appliance Installation</a></li>
            <li><a href="#" className="hover:text-[#FF5500]">Deep Home Cleaning</a></li>
          </ul>
        </div>

        {/* Col 4: Contact */}
        <div>
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
}