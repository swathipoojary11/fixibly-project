'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Wrench, 
  User, 
  ShieldCheck, 
  Radio, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(`Logged in successfully as ${role.toUpperCase()}! Redirecting...`);
      setTimeout(() => {
        router.push(`/dashboard?role=${role}`);
      }, 1000);
    }, 600);
  };

  const handleQuickFill = (selectedRole) => {
    setRole(selectedRole);
    setEmail(`${selectedRole}@fieldflow.com`);
    setPassword('password123');
    setError('');
  };

  const roles = [
    { id: 'customer', label: 'Customer', icon: User, desc: 'Book & track home repairs' },
    { id: 'technician', label: 'Technician', icon: Wrench, desc: 'Job list & quick checklists' },
    { id: 'dispatcher', label: 'Dispatcher', icon: Radio, desc: 'Assign jobs & emergencies' },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, desc: 'Metrics & operational overview' },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-slate-100 text-slate-800">
      
      {/* Main Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-lg p-6 sm:p-8">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-orange-500 text-white shadow-sm mb-3">
            <Wrench className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 text-xs mt-1">Sign in to your FieldFlow account</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="mb-6">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Select Your Role
          </label>
          <div className="grid grid-cols-2 gap-2">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleQuickFill(r.id)}
                  className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 text-orange-950 font-semibold ring-1 ring-orange-500'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-orange-600' : 'text-slate-400'}`} />
                    <span>{r.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{r.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-10 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-orange-500 focus:ring-0" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-orange-600 hover:underline font-semibold">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          Don't have an account yet?{' '}
          <Link href={`/register?role=${role}`} className="text-orange-600 font-bold hover:underline">
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
}
