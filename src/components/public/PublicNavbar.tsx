import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, X, Activity, Network } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const { currentView, setCurrentView, setIsLoginModalOpen, isLoggedIn, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'tentang-sistem', label: 'Tentang sistem' },
    { id: 'role-akses', label: 'Role & akses' },
    { id: 'fitur', label: 'Fitur' },
    { id: 'tim-kami', label: 'Tim kami' },
  ];

  const handleNavClick = (viewId: string) => {
    if (viewId === 'tentang-sistem') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById('storytelling-section') || document.getElementById('tentang-sistem');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (viewId === 'role-akses') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById('role-akses');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (viewId === 'fitur') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById('fitur-dashboard');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (viewId === 'tim-kami') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById('tim-kami');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setCurrentView(viewId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Zone 1: ASSET+ DAILY REPORT Brand Wordmark (Icon Plus Signature Blue Palette) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
            >
              {/* Electric Blue / Sky Gradient Icon */}
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-700 via-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <Network className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-0.5">
                  <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                    ASSET
                  </span>
                  <span className="text-xl font-black text-blue-600 leading-none">+</span>
                </div>
                <span className="text-[9px] font-extrabold text-slate-400 tracking-[0.2em] uppercase leading-tight mt-0.5">
                  DAILY REPORT
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="py-2 text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: LOGIN Pill Button (Dark Navy) */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-blue-500/20"
                >
                  <Activity className="w-3.5 h-3.5 text-sky-200" />
                  <span>Dashboard Internal</span>
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-7 py-2.5 text-xs font-extrabold text-white bg-[#0F172A] hover:bg-blue-900 rounded-full tracking-wider transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer uppercase"
              >
                LOGIN
              </button>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-4 py-1.5 text-xs font-extrabold text-white bg-slate-900 rounded-full tracking-wider uppercase"
            >
              LOGIN
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="w-full text-left py-2 text-sm font-semibold text-slate-700 hover:text-blue-600"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setIsLoginModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-xs font-extrabold text-white bg-slate-900 rounded-full tracking-wider uppercase text-center"
            >
              LOGIN
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
