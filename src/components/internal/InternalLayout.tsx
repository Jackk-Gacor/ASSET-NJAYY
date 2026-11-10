import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  LayoutGrid,
  Search,
  Database,
  PenTool,
  MapPin,
  Map,
  GitBranch,
  BarChart2,
  SlidersHorizontal,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Shield,
  LogOut,
  Home,
  CheckCircle,
  PanelLeft,
  PanelTop,
} from 'lucide-react';

interface InternalLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  aliasIds?: string[];
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isAction?: boolean;
  subItems?: { id: string; label: string }[];
}

interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
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

  const [navLayout, setNavLayout] = useState<'sidebar' | 'topbar'>(() => {
    try {
      const saved = localStorage.getItem('pln_asset_nav_layout');
      return saved === 'topbar' ? 'topbar' : 'sidebar';
    } catch {
      return 'sidebar';
    }
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [openTopGroup, setOpenTopGroup] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const topbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (topbarRef.current && !topbarRef.current.contains(e.target as Node)) {
        setOpenTopGroup(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleNavLayout = (mode: 'sidebar' | 'topbar') => {
    setNavLayout(mode);
    setOpenTopGroup(null);
    try {
      localStorage.setItem('pln_asset_nav_layout', mode);
    } catch {
      // ignore storage errors
    }
  };

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const availableRoles: UserRole[] = [
    'Admin',
    'Tim Data',
    'Engineering',
    'Field',
    'Supervisor',
    'Viewer',
  ];

  const getRoleDisplayLabel = (role: UserRole) => {
    return role === 'Engineering' ? 'Drawing Data' : role;
  };

  // Scalable, compact grouped navigation structure
  const navGroups: NavGroup[] = [
    {
      id: 'overview',
      title: 'Utama',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
        { id: 'search', label: 'Data Core Search', icon: Search },
      ],
    },
    {
      id: 'asset-drawing',
      title: 'Asset & Drawing',
      items: [
        {
          id: 'engineering-feeder',
          aliasIds: ['engineering-feeder', 'engineering-uplink', 'engineering-sid'],
          label: 'Drawing Data',
          icon: PenTool,
          subItems: [
            { id: 'engineering-feeder', label: 'Feeder' },
            { id: 'engineering-uplink', label: 'Uplink' },
            { id: 'engineering-sid', label: 'SID Layanan' },
          ],
        },
      ],
    },
    {
      id: 'network-gis',
      title: 'Peta & Topologi',
      items: [
        {
          id: 'network-map',
          aliasIds: ['network-map', 'data-ring'],
          label: 'Network & Ring Map',
          icon: Map,
        },
        { id: 'topology', label: 'Logical Topology', icon: GitBranch },
      ],
    },
    {
      id: 'system',
      title: 'Laporan & Sistem',
      items: [
        { id: 'reports', label: 'Reports', icon: BarChart2 },
        { id: 'settings', label: 'Settings', icon: SlidersHorizontal, isAction: true },
      ],
    },
  ];

  const handleNavClick = (itemId: string) => {
    if (itemId === 'settings') {
      setSettingsModalOpen(true);
      setOpenTopGroup(null);
      setMobileSidebarOpen(false);
      return;
    }
    setCurrentView(itemId);
    setOpenTopGroup(null);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isItemActive = (item: NavItem) => {
    if (item.aliasIds) {
      return item.aliasIds.includes(currentView);
    }
    return currentView === item.id;
  };

  const getPageMeta = () => {
    switch (currentView) {
      case 'dashboard':
        return { group: 'Utama', title: 'Dashboard' };
      case 'search':
        return { group: 'Utama', title: 'Data Core Search' };
      case 'engineering-feeder':
        return { group: 'Asset & Drawing', title: 'Drawing Data · Feeder' };
      case 'engineering-uplink':
        return { group: 'Asset & Drawing', title: 'Drawing Data · Uplink' };
      case 'engineering-sid':
        return { group: 'Asset & Drawing', title: 'Drawing Data · SID Layanan' };
      case 'network-map':
      case 'data-ring':
        return { group: 'Peta & Topologi', title: 'Network & Ring Map' };
      case 'topology':
        return { group: 'Peta & Topologi', title: 'Logical Topology' };
      case 'reports':
        return { group: 'Laporan & Sistem', title: 'Reports' };
      default:
        return { group: 'Utama', title: 'Dashboard' };
    }
  };

  const pageMeta = getPageMeta();

  return (
    <div className="h-screen bg-slate-900 text-slate-100 flex flex-col font-sans overflow-hidden">
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

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* ========================================================= */}
        {/* DESKTOP COMPACT GROUPED SIDEBAR                           */}
        {/* ========================================================= */}
        {navLayout === 'sidebar' && (
          <aside
            className={`hidden md:flex flex-col border-r border-slate-800/80 bg-[#081325] transition-all duration-300 shrink-0 ${
              sidebarCollapsed ? 'w-[72px]' : 'w-60'
            }`}
          >
            {/* Compact Brand Header */}
            <div className="h-16 px-4 border-b border-slate-800/60 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex items-end gap-1 h-5 shrink-0">
                  <div className="w-1.5 h-3.5 bg-cyan-400 rounded-xs" />
                  <div className="w-1.5 h-5 bg-cyan-400 rounded-xs" />
                </div>
                {!sidebarCollapsed && (
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate tracking-tight">
                      ASSET HUB
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 block truncate">
                      PLN Icon Plus · Malang
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Compact Grouped Navigation */}
            <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-3">
              {navGroups.map(group => {
                const isGroupCollapsed = !!collapsedGroups[group.id];
                return (
                  <div key={group.id} className="space-y-1">
                    {!sidebarCollapsed && (
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.id)}
                        className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        <span>{group.title}</span>
                        {isGroupCollapsed ? (
                          <ChevronRight className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                    )}

                    {(!isGroupCollapsed || sidebarCollapsed) && (
                      <div className="space-y-0.5">
                        {group.items.map(item => {
                          const IconComp = item.icon;
                          const active = isItemActive(item);

                          return (
                            <div key={item.id}>
                              <button
                                onClick={() => handleNavClick(item.id)}
                                title={sidebarCollapsed ? item.label : undefined}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all relative group ${
                                  active
                                    ? 'bg-[#10243E] text-white font-semibold'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                                }`}
                              >
                                <IconComp
                                  className={`w-4 h-4 shrink-0 transition-colors ${
                                    active
                                      ? 'text-cyan-400'
                                      : 'text-slate-400 group-hover:text-slate-200'
                                  }`}
                                />
                                {!sidebarCollapsed && (
                                  <span className="truncate text-left flex-1">{item.label}</span>
                                )}
                                {active && (
                                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-cyan-400 rounded-l-md" />
                                )}
                              </button>

                              {/* Nested compact sub-items when Drawing Data is active */}
                              {!sidebarCollapsed && active && item.subItems && (
                                <div className="ml-6 pl-3 mt-1 mb-1 border-l border-slate-800 space-y-0.5">
                                  {item.subItems.map(sub => {
                                    const subActive = currentView === sub.id;
                                    return (
                                      <button
                                        key={sub.id}
                                        onClick={() => handleNavClick(sub.id)}
                                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
                                          subActive
                                            ? 'text-cyan-300 bg-cyan-950/50 font-semibold'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                                        }`}
                                      >
                                        {sub.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Compact Sidebar Footer */}
            <div className="p-2.5 border-t border-slate-800/80 bg-[#060F1E] space-y-2 shrink-0">
              <div className="flex items-center gap-2.5 px-1">
                <div className="w-7 h-7 rounded-lg bg-sky-900 text-sky-200 flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                {!sidebarCollapsed && (
                  <div className="truncate flex-1">
                    <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-cyan-400 font-mono truncate">
                      {getRoleDisplayLabel(currentUser.role)}
                    </p>
                  </div>
                )}
              </div>

              {!sidebarCollapsed && (
                <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between px-1 text-[10px] text-slate-400">
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
        )}

        {/* ========================================================= */}
        {/* MAIN CONTENT AREA                                         */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden bg-[#F8FAFC]">
          {/* Primary Header Bar */}
          <header className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4 border-b shrink-0 z-20 bg-white border-slate-200/80 text-slate-900">
            {/* Left Zone: Toggle, Brand (in topbar mode), & Breadcrumb + Page Title */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                title="Buka Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {navLayout === 'sidebar' ? (
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden md:flex p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                  title={sidebarCollapsed ? 'Perluas Sidebar' : 'Ringkas Sidebar'}
                >
                  <Menu className="w-4 h-4" />
                </button>
              ) : (
                <div className="hidden md:flex items-center gap-2 pr-3 border-r border-slate-200 shrink-0">
                  <div className="flex items-end gap-1 h-5">
                    <div className="w-1.5 h-3.5 bg-blue-600 rounded-xs" />
                    <div className="w-1.5 h-5 bg-cyan-500 rounded-xs" />
                  </div>
                  <span className="text-xs font-extrabold text-slate-900 tracking-tight">
                    ASSET HUB
                  </span>
                </div>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400">
                  <span>ASSET DIGITAL HUB</span>
                  <span>/</span>
                  <span className="text-blue-600">{pageMeta.group}</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold leading-tight text-slate-900 truncate">
                  {pageMeta.title}
                </h2>
              </div>
            </div>

            {/* Right Zone: Layout Mode Switcher, System Status, Role & Logout */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              {/* Flexible Navigation Mode Toggle (Desktop) */}
              <div
                className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200"
                title="Ubah tata letak navigasi (Sidebar / Top Navbar)"
              >
                <button
                  type="button"
                  onClick={() => toggleNavLayout('sidebar')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    navLayout === 'sidebar'
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <PanelLeft className="w-3.5 h-3.5" />
                  <span>Sidebar</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleNavLayout('topbar')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    navLayout === 'topbar'
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <PanelTop className="w-3.5 h-3.5" />
                  <span>Topbar</span>
                </button>
              </div>

              {/* System Active Status */}
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/70">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-emerald-700">Active</span>
              </div>

              {/* Role Switcher */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-700"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-slate-500">Role:</span>
                  <span className="font-semibold">{getRoleDisplayLabel(currentUser.role)}</span>
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
                          currentUser.role === role
                            ? 'text-blue-600 font-bold bg-blue-50/50'
                            : 'text-slate-700'
                        }`}
                      >
                        <span>{getRoleDisplayLabel(role)}</span>
                        {currentUser.role === role && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        )}
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

          {/* Horizontal Compact Top Navbar Mode (Desktop) */}
          {navLayout === 'topbar' && (
            <div
              ref={topbarRef}
              className="hidden md:flex items-center justify-between px-6 py-2 bg-[#081325] border-b border-slate-800 text-slate-200 shrink-0 z-10"
            >
              <div className="flex items-center gap-2">
                {navGroups.map(group => {
                  const isGroupActive = group.items.some(item => isItemActive(item));
                  const isDropdownOpen = openTopGroup === group.id;

                  return (
                    <div key={group.id} className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenTopGroup(isDropdownOpen ? null : group.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          isGroupActive
                            ? 'bg-[#10243E] text-cyan-300 border border-cyan-500/30'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                        }`}
                      >
                        <span>{group.title}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${
                            isDropdownOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute left-0 mt-2 w-60 bg-[#0B192E] border border-slate-700/80 rounded-xl shadow-2xl py-1.5 z-50">
                          {group.items.map(item => {
                            const IconComp = item.icon;
                            const active = isItemActive(item);
                            return (
                              <div key={item.id}>
                                <button
                                  type="button"
                                  onClick={() => handleNavClick(item.id)}
                                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs transition-colors ${
                                    active
                                      ? 'bg-[#10243E] text-cyan-300 font-semibold'
                                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                                  }`}
                                >
                                  <IconComp className="w-4 h-4 shrink-0" />
                                  <span>{item.label}</span>
                                </button>
                                {item.subItems && (
                                  <div className="pl-9 pr-2 pb-1 space-y-0.5">
                                    {item.subItems.map(sub => (
                                      <button
                                        key={sub.id}
                                        type="button"
                                        onClick={() => handleNavClick(sub.id)}
                                        className={`w-full text-left px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                                          currentView === sub.id
                                            ? 'text-cyan-300 bg-cyan-950/60 font-semibold'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                        }`}
                                      >
                                        {sub.label}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <button
                  onClick={() => resetAllDataToDefault()}
                  className="hover:text-cyan-300 underline"
                >
                  Reset Simulasi
                </button>
                <button
                  onClick={() => setCurrentView('home')}
                  className="hover:text-white flex items-center gap-1"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Public</span>
                </button>
              </div>
            </div>
          )}

          {/* Main Viewport */}
          <main className="flex-1 overflow-y-auto p-5 sm:p-7 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
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
                  Tata Letak Navigasi Desktop
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => toggleNavLayout('sidebar')}
                    className={`p-2.5 rounded-xl border text-left font-medium flex items-center gap-2 transition-colors ${
                      navLayout === 'sidebar'
                        ? 'bg-blue-50 border-blue-400 text-blue-700 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <PanelLeft className="w-4 h-4" />
                    <span>Compact Sidebar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleNavLayout('topbar')}
                    className={`p-2.5 rounded-xl border text-left font-medium flex items-center gap-2 transition-colors ${
                      navLayout === 'topbar'
                        ? 'bg-blue-50 border-blue-400 text-blue-700 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <PanelTop className="w-4 h-4" />
                    <span>Top Navbar</span>
                  </button>
                </div>
              </div>

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
                      {getRoleDisplayLabel(role)}
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

      {/* Mobile Compact Grouped Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-full bg-[#081325] border-r border-slate-800 flex flex-col p-4 z-10 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex items-end gap-1 h-5">
                  <div className="w-1.5 h-3.5 bg-cyan-400 rounded-xs" />
                  <div className="w-1.5 h-5 bg-cyan-400 rounded-xs" />
                </div>
                <span className="font-bold text-white text-xs">ASSET HUB · Malang</span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 flex-1">
              {navGroups.map(group => (
                <div key={group.id} className="space-y-1">
                  <span className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                    {group.title}
                  </span>
                  <div className="space-y-0.5">
                    {group.items.map(item => {
                      const IconC = item.icon;
                      const active = isItemActive(item);
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs ${
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
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800">
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
