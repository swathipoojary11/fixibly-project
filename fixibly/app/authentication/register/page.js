'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Wrench, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

function RegisterForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess('Customer account registered successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login?role=customer');
      }, 1200);
    }, 600);
  };

  return (
    <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-lg p-6 sm:p-8 my-8">
      
      {/* Header Branding */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-orange-500 text-white shadow-sm mb-3">
          <Wrench className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customer Registration</h1>
        <p className="text-slate-500 text-xs mt-1">Create an account to book home repair & field services</p>
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

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address *
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
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Primary Service Address
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main Street, City, ZIP"
              className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password *
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? (
            <span className="inline-block w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
          ) : (
            <>
              <span>Create Customer Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Links */}
      <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
        Already have an account?{' '}
        <Link href="/login" className="text-orange-600 font-bold hover:underline">
          Sign In
        </Link>
      </div>

    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-slate-100 text-slate-800">
      <Suspense fallback={<div className="text-slate-500 text-sm">Loading form...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
