import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  X,
  ShieldCheck,
  User,
  ArrowRight,
  Lock,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

const ROLE_DEFAULT_IDENTIFIER: Record<UserRole, string> = {
  Admin: 'admin123',
  Engineering: 'adamahmad09@gmail.com',
  'Tim Data': 'timdata@iconplus.co.id',
  Field: 'field@iconplus.co.id',
  Supervisor: 'supervisor@iconplus.co.id',
  Viewer: 'viewer@iconplus.co.id',
};

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, loginWithCredentials, loginWithGoogle } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('Admin');
  const [username, setUsername] = useState('admin123');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoginModalOpen) return null;

  const rolesConfig: {
    role: UserRole;
    label: string;
    shortDesc: string;
    identifier: string;
    passwordHint: string;
  }[] = [
    {
      role: 'Admin',
      label: 'Admin',
      shortDesc: 'Akses penuh & switch role',
      identifier: 'admin123',
      passwordHint: '12345678',
    },
    {
      role: 'Engineering',
      label: 'Drawing Data',
      shortDesc: 'Feeder, Uplink & SID',
      identifier: 'adamahmad09@gmail.com',
      passwordHint: 'adam123',
    },
    {
      role: 'Tim Data',
      label: 'Tim Data',
      shortDesc: 'Data core & kapasitas',
      identifier: 'timdata@iconplus.co.id',
      passwordHint: 'data123',
    },
    {
      role: 'Field',
      label: 'Field',
      shortDesc: 'Laporan & OTDR lapangan',
      identifier: 'field@iconplus.co.id',
      passwordHint: 'field123',
    },
    {
      role: 'Supervisor',
      label: 'Supervisor',
      shortDesc: 'Approval & evaluasi SLA',
      identifier: 'supervisor@iconplus.co.id',
      passwordHint: 'spv123',
    },
    {
      role: 'Viewer',
      label: 'Viewer',
      shortDesc: 'Pantau & audit read-only',
      identifier: 'viewer@iconplus.co.id',
      passwordHint: 'viewer123',
    },
  ];

  const selectedRoleLabel = rolesConfig.find(r => r.role === selectedRole)?.label || selectedRole;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setUsername(ROLE_DEFAULT_IDENTIFIER[role]);
    setPassword('');
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const result = await loginWithCredentials(username, password, selectedRole);
      if (!result.ok) {
        setErrorMsg(result.error || 'Username/email atau kata sandi tidak valid.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn"
      onClick={() => setIsLoginModalOpen(false)}
    >
      <div
        className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-300 font-mono">
                AUTENTIKASI PORTAL INTERNAL
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">Masuk ke Sistem Divisi Asset</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Tutup modal login"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Role Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Pilih Role Tujuan Login
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {rolesConfig.map(r => {
                const isSelected = selectedRole === r.role;
                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => handleRoleSelect(r.role)}
                    className={`px-3 py-2.5 text-left rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600 text-blue-950'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold">{r.label}</span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      {r.shortDesc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-3 border-t border-slate-100">
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username / Email Akun
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={username}
                  onChange={e => {
                    setUsername(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
                  placeholder="admin123 atau adamahmad09@gmail.com"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Masukkan kata sandi akun"
                  className="w-full pl-9 pr-10 py-2 text-sm text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={loginWithGoogle}
                className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                <span>Masuk dengan Google</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{isSubmitting ? 'Memverifikasi...' : `Masuk Sebagai ${selectedRoleLabel}`}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
