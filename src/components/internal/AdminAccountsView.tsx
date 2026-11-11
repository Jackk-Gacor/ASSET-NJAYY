import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  Users,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Search,
  KeyRound,
  AlertTriangle,
} from 'lucide-react';

interface PortalAccountEntry {
  id: string;
  role: UserRole;
  roleLabel: string;
  name: string;
  identifier: string;
  password: string;
  authType: 'Portal Internal' | 'Firebase Auth';
  canSwitchRole: boolean;
  notes: string;
}

const PORTAL_ACCOUNTS_DIRECTORY: PortalAccountEntry[] = [
  {
    id: 'acc-admin-internal',
    role: 'Admin',
    roleLabel: 'Admin',
    name: 'Administrator Asset',
    identifier: 'admin123',
    password: '12345678',
    authType: 'Portal Internal',
    canSwitchRole: true,
    notes: 'Akun utama Admin portal internal dengan akses penuh & switch role.',
  },
  {
    id: 'acc-admin-firebase',
    role: 'Admin',
    roleLabel: 'Admin',
    name: 'Adam Ahmad (Firebase Admin)',
    identifier: 'adamahmad091105@gmail.com',
    password: 'Sesuai Firebase Console',
    authType: 'Firebase Auth',
    canSwitchRole: true,
    notes: 'Login via Google Sign-In atau Email/Password Firebase Console.',
  },
  {
    id: 'acc-drawing-internal',
    role: 'Engineering',
    roleLabel: 'Drawing Data',
    name: 'Adam Ahmad (Drawing Data)',
    identifier: 'adamahmad09@gmail.com',
    password: 'adam123',
    authType: 'Portal Internal',
    canSwitchRole: false,
    notes: 'Terkunci khusus di role Drawing Data (Feeder, Uplink, SID).',
  },
  {
    id: 'acc-drawing-firebase',
    role: 'Engineering',
    roleLabel: 'Drawing Data',
    name: 'Adam Ahmad (Firebase Drawing)',
    identifier: 'adamahmdb09@gmail.com',
    password: 'Sesuai Firebase Console',
    authType: 'Firebase Auth',
    canSwitchRole: false,
    notes: 'Akun Firebase Auth terkunci khusus di role Drawing Data.',
  },
  {
    id: 'acc-timdata',
    role: 'Tim Data',
    roleLabel: 'Tim Data',
    name: 'Tim Data Asset',
    identifier: 'timdata@iconplus.co.id',
    password: 'data123',
    authType: 'Portal Internal',
    canSwitchRole: false,
    notes: 'Akun uji role Tim Data (terkunci per role).',
  },
  {
    id: 'acc-field',
    role: 'Field',
    roleLabel: 'Field',
    name: 'Petugas Lapangan (Field)',
    identifier: 'field@iconplus.co.id',
    password: 'field123',
    authType: 'Portal Internal',
    canSwitchRole: false,
    notes: 'Akun uji role Field (terkunci per role).',
  },
  {
    id: 'acc-supervisor',
    role: 'Supervisor',
    roleLabel: 'Supervisor',
    name: 'Supervisor Asset',
    identifier: 'supervisor@iconplus.co.id',
    password: 'spv123',
    authType: 'Portal Internal',
    canSwitchRole: false,
    notes: 'Akun uji role Supervisor (terkunci per role).',
  },
  {
    id: 'acc-viewer',
    role: 'Viewer',
    roleLabel: 'Viewer',
    name: 'Viewer Audit',
    identifier: 'viewer@iconplus.co.id',
    password: 'viewer123',
    authType: 'Portal Internal',
    canSwitchRole: false,
    notes: 'Akun uji role Viewer read-only (terkunci per role).',
  },
  {
    id: 'acc-jack-firebase',
    role: 'Engineering',
    roleLabel: 'Non-Admin (Fleksibel)',
    name: 'Jack Brawijaya (Firebase)',
    identifier: 'jackbrawijaya09@gmail.com',
    password: 'Sesuai Firebase Console',
    authType: 'Firebase Auth',
    canSwitchRole: false,
    notes: 'Dapat masuk ke role non-Admin pilihan saat login; diblokir dari Admin.',
  },
];

export const AdminAccountsView: React.FC = () => {
  const { currentUser, showToast, setCurrentView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (currentUser.role !== 'Admin') {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center max-w-lg mx-auto mt-10 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Akses Ditolak</h2>
        <p className="text-xs text-slate-600 mt-1">
          Halaman Daftar Akun Portal hanya dapat diakses oleh pengguna dengan role <strong>Admin</strong>.
        </p>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (id: string, text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(`${label} disalin ke clipboard`, 'success');
    setTimeout(() => setCopiedId(current => (current === id ? null : current)), 1800);
  };

  const filteredAccounts = PORTAL_ACCOUNTS_DIRECTORY.filter(acc => {
    const matchesRole = roleFilter === 'ALL' || acc.role === roleFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      acc.name.toLowerCase().includes(q) ||
      acc.identifier.toLowerCase().includes(q) ||
      acc.roleLabel.toLowerCase().includes(q) ||
      acc.authType.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Engineering':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Tim Data':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Field':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Supervisor':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              KHUSUS ADMIN
            </span>
            <span className="text-[11px] font-mono text-slate-400">PORTAL ACCESS DIRECTORY</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1.5">Daftar Akun Portal &amp; Hak Akses</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Referensi kredensial resmi portal internal dan akun Firebase Authentication per role.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">Total Akun</span>
            <span className="text-base font-bold text-slate-900">{PORTAL_ACCOUNTS_DIRECTORY.length}</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-200 text-center">
            <span className="text-[10px] font-semibold text-purple-600 uppercase block">Admin</span>
            <span className="text-base font-bold text-purple-900">
              {PORTAL_ACCOUNTS_DIRECTORY.filter(a => a.role === 'Admin').length}
            </span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-center">
            <span className="text-[10px] font-semibold text-blue-600 uppercase block">Firebase Auth</span>
            <span className="text-base font-bold text-blue-900">
              {PORTAL_ACCOUNTS_DIRECTORY.filter(a => a.authType === 'Firebase Auth').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari username, email, role, atau tipe autentikasi..."
            className="w-full pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {(['ALL', 'Admin', 'Engineering', 'Tim Data', 'Field', 'Supervisor', 'Viewer'] as const).map(
            role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  roleFilter === role
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {role === 'ALL' ? 'Semua Role' : role === 'Engineering' ? 'Drawing Data' : role}
              </button>
            )
          )}
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Nama Akun</th>
                <th className="px-4 py-3">Username / Email</th>
                <th className="px-4 py-3">Kata Sandi</th>
                <th className="px-4 py-3">Autentikasi</th>
                <th className="px-4 py-3">Status Akses</th>
                <th className="px-4 py-3">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredAccounts.map(acc => {
                const isPasswordFixed = acc.password !== 'Sesuai Firebase Console';
                const isVisible = !!visiblePasswords[acc.id];

                return (
                  <tr key={acc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border ${getRoleBadgeClass(
                          acc.role
                        )}`}
                      >
                        {acc.roleLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{acc.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {acc.identifier}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(`id-${acc.id}`, acc.identifier, 'Username/Email')}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors cursor-pointer"
                          title="Salin username/email"
                        >
                          {copiedId === `id-${acc.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {isPasswordFixed ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 min-w-[84px] inline-block">
                            {isVisible ? acc.password : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(acc.id)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                            title={isVisible ? 'Sembunyikan sandi' : 'Lihat sandi'}
                          >
                            {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopy(`pw-${acc.id}`, acc.password, 'Kata sandi')}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors cursor-pointer"
                            title="Salin kata sandi"
                          >
                            {copiedId === `pw-${acc.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 italic">
                          <KeyRound className="w-3 h-3 text-blue-500" />
                          {acc.password}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          acc.authType === 'Firebase Auth'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {acc.authType}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {acc.canSwitchRole ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          <Unlock className="w-3 h-3" />
                          Bebas Switch Role
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                          <Lock className="w-3 h-3" />
                          Terkunci Per Role
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 min-w-[220px]">{acc.notes}</td>
                  </tr>
                );
              })}

              {filteredAccounts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    Tidak ada akun yang cocok dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
