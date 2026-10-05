import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PublicNavbar } from './components/public/PublicNavbar';
import { PublicHero } from './components/public/PublicHero';
import { PublicStorytelling } from './components/public/PublicStorytelling';
import { PublicTeamSection } from './components/public/PublicTeamSection';
import { PublicVisiMisi } from './components/public/PublicVisiMisi';
import { PublicAboutAsset } from './components/public/PublicAboutAsset';
import { PublicFooter } from './components/public/PublicFooter';
import { LoginModal } from './components/public/LoginModal';

import { InternalLayout } from './components/internal/InternalLayout';
import { DashboardView } from './components/internal/DashboardView';
import { DataCoreSearch } from './components/internal/DataCoreSearch';
import { DataManagementView } from './components/internal/DataManagementView';
import { EngineeringView } from './components/internal/EngineeringView';
import { FieldReportingView } from './components/internal/FieldReportingView';
import { NetworkMapView } from './components/internal/NetworkMapView';
import { LogicalTopologyView } from './components/internal/LogicalTopologyView';
import { DataRingView } from './components/internal/DataRingView';
import { ReportsView } from './components/internal/ReportsView';
import { DataCoreDetailModal } from './components/internal/DataCoreDetailModal';

const AppContent: React.FC = () => {
  const { isLoggedIn, currentView } = useApp();
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // If user is logged in and on an internal view
  const isInternalView =
    isLoggedIn &&
    [
      'dashboard',
      'search',
      'data-core',
      'engineering-feeder',
      'engineering-uplink',
      'engineering-sid',
      'field',
      'network-map',
      'topology',
      'data-ring',
      'reports',
    ].includes(currentView);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      {isInternalView ? (
        <InternalLayout>
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'search' && <DataCoreSearch />}
          {currentView === 'data-core' && <DataManagementView />}
          {(currentView === 'engineering-feeder' ||
            currentView === 'engineering-uplink' ||
            currentView === 'engineering-sid') && <EngineeringView />}
          {currentView === 'field' && <FieldReportingView />}
          {currentView === 'network-map' && <NetworkMapView />}
          {currentView === 'topology' && <LogicalTopologyView />}
          {currentView === 'data-ring' && <DataRingView />}
          {currentView === 'reports' && <ReportsView />}
        </InternalLayout>
      ) : (
        <div className="flex-1 flex flex-col bg-slate-50 text-slate-800">
          <PublicNavbar />
          <main className="flex-1">
            {currentView === 'home' && (
              <>
                <PublicHero />
                <PublicTeamSection />
                <PublicStorytelling />
              </>
            )}
            {currentView === 'team' && <PublicTeamSection />}
            {currentView === 'visi-misi' && <PublicVisiMisi />}
            {currentView === 'about-asset' && <PublicAboutAsset />}
          </main>
          <PublicFooter />
        </div>
      )}

      {/* Global Modals */}
      <LoginModal />
      <DataCoreDetailModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
