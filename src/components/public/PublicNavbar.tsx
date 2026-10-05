import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LogIn, Menu, X, Shield, Activity, Network } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const { currentView, setCurrentView, setIsLoginModalOpen, isLoggedIn, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'visi-misi', label: 'Visi & Misi' },
    { id: 'storytelling', label: 'Story Tim Asset' },
    { id: 'about-asset', label: 'Profil & Digital Book' },
  ];

  const handleNavClick = (viewId: string) => {
    if (viewId === 'storytelling') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById('storytelling-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setCurrentView(viewId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 text-left focus:outline-none group"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-700 via-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Network className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-slate-900 block leading-tight">
                  PLN ICON<span className="text-sky-600">PLUS</span>
                </span>
                <span className="text-xs font-semibold text-slate-600 block tracking-wide">
                  Divisi Asset · Kantor Malang
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Clean text with hover indicators) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            {navItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-2 text-sm font-medium transition-colors hover:text-blue-700 ${
                    isActive ? 'text-blue-700 font-semibold' : 'text-slate-600'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-4 py-2 text-sm font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  Ke Dashboard
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 rounded-lg shadow-sm shadow-blue-700/25 transition-all flex items-center gap-2 active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Login Portal Internal</span>
              </button>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg ${
                currentView === item.id
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100">
            {isLoggedIn ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setCurrentView('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg"
                >
                  Buka Dashboard Internal
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs font-medium text-center text-slate-500"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-sm font-semibold text-center text-white bg-gradient-to-r from-blue-700 to-sky-600 rounded-lg flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login Portal Internal
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
