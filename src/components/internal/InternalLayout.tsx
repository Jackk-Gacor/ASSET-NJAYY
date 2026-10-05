import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  LayoutDashboard,
  Search,
  Database,
  Compass,
  HardHat,
  Network,
  Share2,
  RefreshCw,
  FileBarChart,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Shield,
  Layers,
  Bell,
  Sparkles,
  UserCheck,
  FolderGit2,
  Home,
  CheckCircle,
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

  const availableRoles: UserRole[] = [
    'Admin',
    'Tim Data',
    'Engineering',
    'Field',
    'Supervisor',
    'Viewer',
  ];

  // Navigation structure based on spec #15
  const navSections = [
    {
      group: 'UTAMA',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'DATA CORE',
      items: [
        { id: 'search', label: 'Data Core Search', icon: Search, badge: 'Fitur Utama' },
        { id: 'data-core', label: 'Data Core Table', icon: Database },
      ],
    },
    {
      group: 'ENGINEERING',
      items: [
        { id: 'engineering-feeder', label: 'Feeder & Tracing', icon: Compass },
        { id: 'engineering-uplink', label: 'Uplink & OLT', icon: Layers },
        { id: 'engineering-sid', label: 'SID & 3-Pilar', icon: FolderGit2 },
      ],
    },
    {
      group: 'OPERASIONAL',
      items: [
        { id: 'field', label: 'Field Form & Log', icon: HardHat },
      ],
    },
    {
      group: 'JARINGAN MALANG',
      items: [
        { id: 'network-map', label: 'Network Map Malang', icon: Network },
        { id: 'topology', label: 'Logical Topology', icon: Share2 },
        { id: 'data-ring', label: 'Data Ring Loops', icon: RefreshCw },
      ],
    },
    {
      group: 'REPORTING',
      items: [
        { id: 'reports', label: 'Report & Evaluasi', icon: FileBarChart },
      ],
    },
  ];

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

      {/* Top Banner: SIMULASI DATA NOTICE */}
      <div className="bg-gradient-to-r from-blue-900 via-sky-900 to-indigo-950 text-sky-200 text-[11px] px-4 py-1.5 font-mono border-b border-sky-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-white tracking-wide">CONTOH DATA SIMULASI</span>
          <span className="hidden sm:inline">· Wilayah Kerja PLN Icon Plus Malang · Storage: Browser LocalStorage</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => resetAllDataToDefault()}
            className="text-[10px] text-sky-300 hover:text-white underline transition-colors"
            title="Kembalikan data ke kondisi awal"
          >
            Reset Data Default
          </button>
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-1 text-[10px] text-sky-300 hover:text-white transition-colors"
          >
            <Home className="w-3 h-3" />
            <span>Halaman Publik</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:flex flex-col border-r border-slate-800 bg-slate-950 transition-all duration-300 ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Sidebar Brand Lockup */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20">
                <Network className="w-5 h-5" />
              </div>
              {!sidebarCollapsed && (
                <div className="truncate">
                  <span className="text-sm font-extrabold tracking-tight text-white block leading-tight">
                    PLN ICON<span className="text-sky-400">PLUS</span>
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 block truncate">
                    Divisi Asset Malang
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Nav Items List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-6">
            {navSections.map(sec => (
              <div key={sec.group} className="space-y-1">
                {!sidebarCollapsed && (
                  <p className="px-3 text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                    {sec.group}
                  </p>
                )}
                {sec.items.map(item => {
                  const IconComp = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <IconComp className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && (
                        <div className="flex-1 flex items-center justify-between text-left truncate">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar Footer: Current user role info */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-900 text-sky-200 flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              {!sidebarCollapsed && (
                <div className="truncate flex-1">
                  <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-sky-400 font-mono truncate">{currentUser.role}</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-900">
          
          {/* Internal Top Bar */}
          <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
            
            {/* Left: Mobile Toggle & Breadcrumbs */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden md:flex p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                title="Toggle Sidebar"
              >
                <Menu className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span className="text-slate-400">Portal Asset</span>
                <span>/</span>
                <span className="text-white font-semibold capitalize">
                  {currentView.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* Right Zone: Role Switcher Dropdown & User Logout */}
            <div className="flex items-center gap-3">
              
              {/* Role Switcher Pill */}
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-200 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline text-slate-400">Role:</span>
                  <span className="font-semibold text-white">{currentUser.role}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1 z-50">
                    <div className="px-3 py-2 border-b border-slate-700 text-[10px] font-mono text-slate-400 uppercase">
                      Simulasi Ganti Role
                    </div>
                    {availableRoles.map(role => (
                      <button
                        key={role}
                        onClick={() => {
                          switchRole(role);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700 ${
                          currentUser.role === role ? 'text-sky-400 font-bold bg-slate-700/50' : 'text-slate-300'
                        }`}
                      >
                        <span>{role}</span>
                        {currentUser.role === role && <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Search Shortcut */}
              <button
                onClick={() => setCurrentView('search')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Cari Data Core</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Keluar ke Website Publik"
              >
                <LogOut className="w-4 h-4" />
              </button>

            </div>

          </header>

          {/* Main Viewport */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </main>

        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-full bg-slate-950 border-r border-slate-800 flex flex-col p-4 z-10 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-white text-sm">Divisi Asset Malang</span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {navSections.map(sec => (
                <div key={sec.group} className="space-y-1">
                  <p className="px-2 text-[10px] font-mono text-slate-500 uppercase">{sec.group}</p>
                  {sec.items.map(item => {
                    const IconC = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs ${
                          currentView === item.id
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'text-slate-400 hover:bg-slate-900'
                        }`}
                      >
                        <IconC className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={logout}
                className="w-full py-2 text-xs font-semibold text-rose-400 bg-rose-950/40 border border-rose-900/50 rounded-lg flex items-center justify-center gap-2"
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
