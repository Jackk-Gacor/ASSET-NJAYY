import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, ShieldCheck, Cpu, HardHat, Compass, FileSpreadsheet } from 'lucide-react';
import heroTeamImage from '../../assets/images/hero_fiber_telecom_team_1791168728867.jpg';

export const PublicHero: React.FC = () => {
  const { setIsLoginModalOpen, setCurrentView } = useApp();

  const handleLearnMore = () => {
    const el = document.getElementById('storytelling-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setCurrentView('about-asset');
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-24 lg:pt-20 lg:pb-32">
      {/* Decorative fiber grid background */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(56, 189, 248, 0.4) 1px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Ambient gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Narrative Headline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>PT PLN ICON PLUS · WILAYAH KERJA MALANG RAYA</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Connecting Every Point <br />
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Behind the Network.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
              Divisi Asset bertanggung jawab atas tata kelola, validasi data core, pemetaan GIS engineering, dan verifikasi fisik infrastruktur fiber optic di seluruh wilayah Malang, Batu, hingga Malang Selatan. Kami memastikan setiap sambungan optik tercatat, terverifikasi, dan siap mengalirkan konektivitas andal.
            </p>

            {/* Quick value anchors */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-800/80 max-w-xl">
              <div>
                <p className="text-2xl font-bold font-mono tabular-nums text-white">420+ km</p>
                <p className="text-xs text-slate-400 mt-0.5">Rute Jalur Optik Malang</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono tabular-nums text-sky-400">12 POP</p>
                <p className="text-xs text-slate-400 mt-0.5">Sentral Distribusi Aktif</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono tabular-nums text-cyan-300">100% WIG</p>
                <p className="text-xs text-slate-400 mt-0.5">Standar Work in Ground</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 rounded-lg shadow-lg shadow-sky-600/25 transition-all flex items-center gap-2 group active:scale-95"
              >
                <span>Akses Portal Data Internal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleLearnMore}
                className="px-6 py-3.5 text-sm font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-sky-400" />
                <span>Pelajari Peran Tim Asset</span>
              </button>
            </div>

            {/* Micro disclaimer */}
            <p className="text-xs text-slate-500 pt-1">
              *Portal internal terproteksi bagi staf Data, Engineering, Field, dan Supervisor PLN Icon Plus Malang.
            </p>
          </div>

          {/* Right Column: Visual Frame */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative glow frame */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-2xl blur-md opacity-30 group-hover:opacity-60 transition duration-500" />

              <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-800 shadow-2xl">
                <img
                  src={heroTeamImage}
                  alt="Tim Divisi Asset PT PLN Icon Plus Malang"
                  className="w-full h-80 sm:h-96 object-cover object-center"
                  referrerPolicy="no-referrer"
                />

                {/* Overlay vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

                {/* Bottom caption card */}
                <div className="absolute bottom-0 inset-x-0 p-5 bg-slate-900/90 backdrop-blur-md border-t border-slate-700/70">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Divisi Asset · Kantor Malang</h4>
                      <p className="text-xs text-slate-300 mt-0.5">Integrasi Tim Data, Engineering GIS & Field Ops</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs pt-3 border-t border-slate-800">
                    <div className="p-1.5 rounded bg-slate-800/80">
                      <span className="block font-semibold text-slate-200">Data</span>
                      <span className="text-[10px] text-slate-400">Inventory Core</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-800/80">
                      <span className="block font-semibold text-sky-300">Engineering</span>
                      <span className="text-[10px] text-slate-400">CAD & GIS</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-800/80">
                      <span className="block font-semibold text-cyan-300">Field</span>
                      <span className="text-[10px] text-slate-400">Validasi Fisik</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
