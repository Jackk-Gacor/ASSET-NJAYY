import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  LayoutGrid,
  Search,
  Database,
  Settings,
  MapPin,
  Map,
  GitBranch,
  RefreshCw,
  BarChart2,
  SlidersHorizontal,
  Menu,
  X,
  ChevronDown,
  Shield,
  LogOut,
  Home,
  CheckCircle,
  Bell,
} from 'lucide-react';

interface InternalLayoutProps {
  children: React.ReactNode;
}

export const InternalLayout: React.FC<InternalLayoutProps> = ({ children }) => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    switchRole,
    logout,
    toast,
    resetAllDataToDefault,
  } = useApp();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const availableRoles: UserRole[] = [
    'Admin',
    'Tim Data',
    'Engineering',
    'Field',
    'Supervisor',
    'Viewer',
  ];

  // Exact navigation items matching the visual reference screenshot
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'search', label: 'Data Core Search', icon: Search },
    { id: 'data-core', label: 'Data Management', icon: Database },
    {
      id: 'engineering-feeder',
      aliasIds: ['engineering-feeder', 'engineering-uplink', 'engineering-sid'],
      label: 'Engineering',
      icon: Settings,
    },
    { id: 'field', label: 'Field Report', icon: MapPin },
    { id: 'network-map', label: 'Network Map', icon: Map },
    { id: 'topology', label: 'Logical Topology', icon: GitBranch },
    { id: 'data-ring', label: 'Data Ring', icon: RefreshCw },
    { id: 'reports', label: 'Reports', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: SlidersHorizontal, isAction: true },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.id === 'settings') {
      setSettingsModalOpen(true);
      return;
    }
    setCurrentView(item.id);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isItemActive = (item: typeof navItems[0]) => {
    if (item.aliasIds) {
      return item.aliasIds.includes(currentView);
    }
    return currentView === item.id;
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'search':
        return 'Data Core Search';
      case 'data-core':
        return 'Data Management';
      case 'engineering-feeder':
      case 'engineering-uplink':
      case 'engineering-sid':
        return 'Engineering';
      case 'field':
        return 'Field Report';
      case 'network-map':
        return 'Network Map';
      case 'topology':
        return 'Logical Topology';
      case 'data-ring':
        return 'Data Ring';
      case 'reports':
        return 'Reports';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl border flex items-center gap-3 text-xs font-semibold ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
                : toast.type === 'warning'
                ? 'bg-amber-900 text-amber-100 border-amber-700'
                : 'bg-blue-900 text-blue-100 border-blue-700'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toast.text}</span>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        
        {/* ========================================================= */}
        {/* DESKTOP SIDEBAR (DARK NAVY MATCHING SCREENSHOT)           */}
        {/* ========================================================= */}
        <aside
          className={`hidden md:flex flex-col border-r border-slate-800/80 bg-[#081325] transition-all duration-300 ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Sidebar Top: Brand Lockup with Cyan Double Vertical Bars */}
          <div className="p-5 border-b border-slate-800/60 space-y-3">
            <div className="flex items-center gap-3">
              {/* Cyan double bars */}
              <div className="flex items-end gap-1.5 h-6 shrink-0">
                <div className="w-1.5 h-4 bg-cyan-400 rounded-xs" />
                <div className="w-1.5 h-6 bg-cyan-400 rounded-xs" />
              </div>

              {!sidebarCollapsed && (
                <div className="truncate">
                  <span className="text-xs font-medium text-slate-300 block truncate tracking-tight">
                    Network &amp; Reporting • Malang
                  </span>
                </div>
              )}
            </div>

            {/* CONTOH DATA pill badge */}
            {!sidebarCollapsed && (
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/80">
                  CONTOH DATA
                </span>
              </div>
            )}
          </div>

          {/* Navigation Items (Single flat list matching reference) */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
            {navItems.map(item => {
              const IconComp = item.icon;
              const active = isItemActive(item);

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-medium transition-all relative group ${
                    active
                      ? 'bg-[#10243E] text-white font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <IconComp
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      active ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />

                  {!sidebarCollapsed && (
                    <span className="truncate text-left flex-1">
                      {item.label}
                    </span>
                  )}

                  {/* Cyan tab accent on the right edge for active item */}
                  {active && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-l-md" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer: User profile info & simulation reset */}
          <div className="p-3 border-t border-slate-800/80 bg-[#060F1E] space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-900 text-sky-200 flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              {!sidebarCollapsed && (
                <div className="truncate flex-1">
                  <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-cyan-400 font-mono truncate">{currentUser.role}</p>
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                <button
                  onClick={() => resetAllDataToDefault()}
                  className="hover:text-cyan-300 underline"
                  title="Kembalikan data ke awal"
                >
                  Reset Simulasi
                </button>
                <button
                  onClick={() => setCurrentView('home')}
                  className="hover:text-white flex items-center gap-1"
                >
                  <Home className="w-3 h-3" />
                  <span>Public</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* ========================================================= */}
        {/* MAIN CONTENT AREA                                         */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8FAFC]">
          
          {/* Header Bar matching Reference Screenshot */}
          <header className="h-16 px-5 sm:px-8 flex items-center justify-between gap-4 border-b shrink-0 z-10 bg-white border-slate-200/80 text-slate-900">
            
            {/* Left Zone: Title and Breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden md:flex p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                title="Toggle Sidebar"
              >
                <Menu className="w-4 h-4" />
              </button>

              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase block leading-none text-slate-400">
                  ASSET DIGITAL HUB
                </span>
                <h2 className="text-lg sm:text-xl font-bold leading-tight mt-0.5 text-slate-900">
                  {getPageTitle()}
                </h2>
              </div>
            </div>

            {/* Right Zone: System Active Indicator, Notification & Actions */}
            <div className="flex items-center gap-3.5">
              
              {/* Notification Pill "3" as shown in screenshot */}
              <div
                className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center select-none"
                title="3 Notifikasi Sistem"
              >
                3
              </div>

              {/* Vertical Divider */}
              <div className="h-4 w-px bg-slate-200" />

              {/* System Active Status */}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-slate-600">
                  System active
                </span>
              </div>

              {/* Role Switcher Pill */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-700"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-slate-500">Role:</span>
                  <span className="font-semibold">{currentUser.role}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl py-1 z-50 text-slate-800">
                    <div className="px-3 py-2 border-b border-slate-100 text-[10px] font-mono font-bold text-slate-400 uppercase">
                      Simulasi Ganti Role
                    </div>
                    {availableRoles.map(role => (
                      <button
                        key={role}
                        onClick={() => {
                          switchRole(role);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                          currentUser.role === role ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                        }`}
                      >
                        <span>{role}</span>
                        {currentUser.role === role && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2 rounded-lg transition-colors text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                title="Keluar ke Website Publik"
              >
                <LogOut className="w-4 h-4" />
              </button>

            </div>

          </header>

          {/* Main Viewport */}
          <main className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-10">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>

        </div>

      </div>

      {/* Settings Modal */}
      {settingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Pengaturan &amp; Role Sistem</h3>
              </div>
              <button
                onClick={() => setSettingsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">
                  Simulasi Role Pengguna Aktif
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableRoles.map(role => (
                    <button
                      key={role}
                      onClick={() => {
                        switchRole(role);
                        setSettingsModalOpen(false);
                      }}
                      className={`p-2.5 rounded-xl border text-left font-medium transition-colors ${
                        currentUser.role === role
                          ? 'bg-blue-50 border-blue-400 text-blue-700 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Penyimpanan Lokal:</span>
                  <span className="font-mono text-slate-900 font-semibold">Browser LocalStorage</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Unit Wilayah:</span>
                  <span className="font-mono text-slate-900 font-semibold">PLN Icon Plus Malang</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSettingsModalOpen(false)}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              Simpan &amp; Tutup
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-full bg-[#081325] border-r border-slate-800 flex flex-col p-4 z-10 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex items-end gap-1 h-5">
                  <div className="w-1.5 h-3.5 bg-cyan-400 rounded-xs" />
                  <div className="w-1.5 h-5 bg-cyan-400 rounded-xs" />
                </div>
                <span className="font-bold text-white text-xs">Network &amp; Reporting • Malang</span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              {navItems.map(item => {
                const IconC = item.icon;
                const active = isItemActive(item);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs ${
                      active
                        ? 'bg-[#10243E] text-white font-semibold'
                        : 'text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <IconC className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={logout}
                className="w-full py-2.5 text-xs font-semibold text-rose-400 bg-rose-950/40 border border-rose-900/50 rounded-xl flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                Keluar ke Halaman Publik
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
