import React from 'react';
import { useApp } from '../../context/AppContext';
import { Network, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const { setCurrentView, setIsLoginModalOpen } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Network className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-extrabold text-white block">
                  PLN ICON<span className="text-sky-400">PLUS</span>
                </span>
                <span className="text-xs text-slate-400">Divisi Asset · Wilayah Malang</span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Pusat informasi data core, pemetaan topologi transmisi optik, engineering SLD/GIS, dan pelaporan lapangan terpadu wilayah Malang Raya.
            </p>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-amber-300 font-mono">
              ⚠️ CONTOH DATA SIMULASI DIGITAL HUB
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Halaman Publik</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Beranda Corporate
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('visi-misi');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Visi & Misi Divisi
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('about-asset');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Profil Asset & Digital Book
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-sky-400 hover:text-sky-300 font-semibold transition-colors"
                >
                  Login Internal Portal →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Cakupan Wilayah Malang */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Cakupan Wilayah Kerja</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>· Malang Kota (Klojen, Blimbing, Sukun, Lowokwaru)</li>
              <li>· Kota Batu (Alun-Alun, Bumiaji, Sisir)</li>
              <li>· Singosari & KEK Singhasari (Malang Utara)</li>
              <li>· Lawang & Perbatasan Pasuruan</li>
              <li>· Kepanjen & Koridor Malang Selatan</li>
              <li>· Turen & Dampit (Jalur Tenggara)</li>
            </ul>
          </div>

          {/* Col 4: Kontak Kantor */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Kantor Operasional</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  Kantor Perwakilan Malang, SBU Regional Jatim<br />
                  Jl. Basuki Rahmat, Klojen, Kota Malang, Jawa Timur
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>asset.malang@iconpl.co.id</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>(0341) 362-xxxx (Ext. Asset & GIS)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© {new Date().getFullYear()} PT PLN Icon Plus - Divisi Asset Malang. Hak Cipta Dilindungi.</p>
          <p className="text-[11px] font-mono">
            Environment: AI Studio Sandbox · Status: Online · LocalStorage Persistence Active
          </p>
        </div>
      </div>
    </footer>
  );
};
