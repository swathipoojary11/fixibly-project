'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Wrench, User, Radio, ShieldCheck, LogOut, CheckCircle } from 'lucide-react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'customer';

  const roleInfo = {
    customer: { title: 'Customer Portal', icon: User, color: 'text-orange-600', badge: 'Customer Account' },
    technician: { title: 'Technician Job Hub', icon: Wrench, color: 'text-orange-600', badge: 'Service Provider' },
    dispatcher: { title: 'Dispatcher Board', icon: Radio, color: 'text-orange-600', badge: 'Dispatch & Operations' },
    admin: { title: 'Business Admin Dashboard', icon: ShieldCheck, color: 'text-orange-600', badge: 'System Admin' },
  }[role] || { title: 'User Dashboard', icon: User, color: 'text-orange-600', badge: 'Authenticated User' };

  const Icon = roleInfo.icon;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl p-8 shadow-md space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Icon className={`w-6 h-6 ${roleInfo.color}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{roleInfo.title}</h2>
              <span className="text-xs text-slate-500 font-medium">{roleInfo.badge}</span>
            </div>
          </div>

          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </Link>
        </div>

        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm flex items-start gap-3">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
          <div>
            <div className="font-bold text-emerald-900">Authentication Successful</div>
            <div className="text-xs text-emerald-700 mt-0.5">
              You are signed into FieldFlow as <strong className="uppercase">{role}</strong>.
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Navigation</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Link href="/" className="p-3 bg-slate-50 border border-slate-200 hover:border-orange-500 rounded-lg text-slate-700 font-semibold transition-all">
              🏠 Go to Home Page
            </Link>
            <Link href="/login" className="p-3 bg-slate-50 border border-slate-200 hover:border-orange-500 rounded-lg text-slate-700 font-semibold transition-all">
              🔐 Switch Login Role
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-500 text-sm">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
