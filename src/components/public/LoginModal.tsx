import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { INITIAL_USERS } from '../../data/initialData';
import { X, ShieldCheck, User, ArrowRight, Lock, KeyRound } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('Admin');
  const [username, setUsername] = useState('admin.asset');
  const [password, setPassword] = useState('••••••••');

  if (!isLoginModalOpen) return null;

  const rolesConfig: { role: UserRole; desc: string; color: string }[] = [
    {
      role: 'Admin',
      desc: 'Akses penuh ke semua modul, konfigurasi data, approval & user switch',
      color: 'border-purple-300 bg-purple-50 text-purple-700',
    },
    {
      role: 'Tim Data',
      desc: 'Input & upload data core, manajemen kapasitas port, inventarisasi',
      color: 'border-blue-300 bg-blue-50 text-blue-700',
    },
    {
      role: 'Engineering',
      desc: 'Feeder, Uplink, SID mapping, upload berkas CAD, GIS KMZ & Visio',
      color: 'border-sky-300 bg-sky-50 text-sky-700',
    },
    {
      role: 'Field',
      desc: 'Input laporan lapangan, verifikasi redaman OTDR & kondisi fisik tiang',
      color: 'border-amber-300 bg-amber-50 text-amber-700',
    },
    {
      role: 'Supervisor',
      desc: 'Approval WIG, evaluasi KPI tim, verifikasi SLA & laporan audit',
      color: 'border-emerald-300 bg-emerald-50 text-emerald-700',
    },
    {
      role: 'Viewer',
      desc: 'Mode pantau cepat untuk audit wilayah & pencarian data core read-only',
      color: 'border-slate-300 bg-slate-50 text-slate-700',
    },
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const user = INITIAL_USERS.find(u => u.role === role);
    if (user) {
      setUsername(user.email.split('@')[0]);
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    login(role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 to-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-300 font-mono">
                AUTENTIKASI PORTAL INTERNAL
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">Masuk ke Sistem Divisi Asset</h3>
            <p className="text-xs text-slate-300">Pilih simulasi akun staf atau login langsung</p>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Role selector buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Pilih Role Pengguna (Simulasi Hak Akses Langsung):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {rolesConfig.map(r => {
                const isSelected = selectedRole === r.role;
                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => handleRoleSelect(r.role)}
                    className={`p-3 text-left rounded-xl border text-xs transition-all relative ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600 font-bold text-blue-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{r.role}</span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1 line-clamp-2 font-normal">
                      {r.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Credentials */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username / Email Staf
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  placeholder="username@iconpl.co.id"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-600">
                Data disimpan di browser (localStorage)
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <span>Masuk Sebagai {selectedRole}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick One-Click Logins */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              ⚡ Pintasan Cepat 1-Klik:
            </p>
            <div className="flex flex-wrap gap-2">
              {rolesConfig.map(r => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => handleQuickLogin(r.role)}
                  className="px-2.5 py-1 text-xs rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Masuk sbg {r.role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
