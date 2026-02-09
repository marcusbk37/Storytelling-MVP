import Link from 'next/link';
import Image from 'next/image';
import NavBarDemo from '@/components/NavBarDemo';
import { getSalesTrainingScenarios } from '@/lib/scenarios';

/**
 * Sales Training Scenarios page
 * Style: Digital Luxury / Institutional
 */

export default function SalesTrainingPage() {
  const scenarios = getSalesTrainingScenarios();
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-900 selection:text-white">
      <NavBarDemo />

      {/* HEADER: Editorial Style */}
      <header className="pt-24 pb-12 px-6 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Global Wealth Management Division
              </p>
              <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4 tracking-tight">
                Simulation Library
              </h1>
              <p className="text-xl text-slate-600 font-light max-w-2xl leading-relaxed">
                Select a client dossier below to initiate an AI-driven roleplay session. <br className="hidden md:block"/>
                All simulations are scored against the <span className="font-semibold text-emerald-900">2025 Wealth Standards</span>.
              </p>
            </div>
            
            {/* System Status / Date Widget */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-sm text-right min-w-[200px]">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">System Date</div>
              <div className="font-serif text-lg text-slate-900">{currentDate}</div>
            </div>
          </div>
        </div>
      </header>

      {/* METHODOLOGY STRIP: Clean, Process-Oriented */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 text-sm">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full border border-emerald-900 text-emerald-900 font-mono text-xs">1</span>
              <span className="text-slate-600"><strong className="text-slate-900">Select Profile</strong>: Review client liquidity & needs.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full border border-emerald-900 text-emerald-900 font-mono text-xs">2</span>
              <span className="text-slate-600"><strong className="text-slate-900">Initiate Uplink</strong>: Voice-interactive negotiation.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full border border-emerald-900 text-emerald-900 font-mono text-xs">3</span>
              <span className="text-slate-600"><strong className="text-slate-900">Analysis</strong>: Receive behavioral alpha scoring.</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* ACTION BAR: High Tech / Minimal */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-end border-b border-slate-200 pb-4 gap-4">
          <div>
            <h2 className="text-lg font-serif font-semibold text-slate-900 flex items-center gap-2">
              Client Dossiers
              <span className="text-xs font-sans font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{scenarios.length} Available</span>
            </h2>
          </div>
          
          <button className="group flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-300 hover:border-emerald-900 text-slate-700 hover:text-emerald-900 transition-all text-sm font-medium rounded-sm shadow-sm">
            <svg className="w-4 h-4 text-emerald-900/60 group-hover:text-emerald-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            <span>Ingest Gong Data</span>
          </button>
        </div>

        {/* SCENARIOS GRID: The "File" Look */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {scenarios.map((scenario) => (
            <Link
              key={scenario.id}
              href={`/scenarios/${scenario.id}`}
              className="group block bg-white border border-slate-200 hover:border-emerald-900/50 transition-all duration-300"
            >
              {/* Image Area with "Expensive" Filter */}
              <div className="relative h-56 overflow-hidden border-b border-slate-100">
                <div className="absolute top-4 left-4 z-10">
                   {/* Domain Badge: Minimalist Tag */}
                   <span className="bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-900 border border-slate-200 shadow-sm">
                      {scenario.domain}
                   </span>
                </div>

                <Image
                  src={scenario.persona?.image ?? '/personas/alex.png'}
                  alt={scenario.title}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105 filter grayscale contrast-[0.9] group-hover:grayscale-0 group-hover:contrast-100"
                />
                
                {scenario.isNew && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-white/20"></span>
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="p-6">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-lg font-serif font-medium text-slate-900 group-hover:text-emerald-900 transition-colors">
                    {scenario.title}
                  </h3>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border ${
                    scenario.difficulty === 'beginner' ? 'text-emerald-700 border-emerald-100 bg-emerald-50' :
                    scenario.difficulty === 'intermediate' ? 'text-amber-700 border-amber-100 bg-amber-50' :
                    'text-red-800 border-red-100 bg-red-50'
                  }`}>
                    {scenario.difficulty}
                  </span>
                </div>
                
                <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-2 h-10">
                  {scenario.challenge ?? scenario.description}
                </p>

                {/* Metrics Table */}
                <div className="grid grid-cols-2 border-t border-b border-slate-100 py-3 mb-5">
                    <div className="border-r border-slate-100 pr-4">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Est. Duration</p>
                        <p className="text-sm font-mono text-slate-700">2-5 min</p>
                    </div>
                    <div className="pl-4">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Win Prob.</p>
                        <p className="text-sm font-mono text-slate-700">
                            {scenario.winRate ? `${Math.round(scenario.winRate * 100)}%` : '--'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide group-hover:underline decoration-1 underline-offset-4">
                    Access Dossier
                  </span>
                  
                  {scenario.lastPractice && (
                     <span className="text-[10px] text-slate-400 font-mono">
                        Last: {scenario.lastPractice}
                     </span>
                  )}
                </div>
              </div>
            </Link>
          ))}

          {/* New Custom Scenario Card (Wireframe Style) */}
          <div className="block bg-slate-50 border border-dashed border-slate-300 p-6 flex flex-col justify-center items-center text-center hover:bg-slate-100 transition-colors cursor-pointer group h-full min-h-[400px]">
            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4 group-hover:border-emerald-300 group-hover:shadow-md transition-all">
                <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
            <h3 className="text-lg font-serif font-medium text-slate-900 mb-2">Build Custom Scenario</h3>
            <p className="text-sm text-slate-500 max-w-xs mb-6">
                Generate a new client persona based on internal Gong.io recordings or CRM data.
            </p>
            <button className="text-xs font-bold text-emerald-950 uppercase tracking-wide border-b border-emerald-950 pb-0.5">
                Initialize Builder
            </button>
          </div>
        </div>

        {/* DASHBOARD WIDGET: The "Bloomberg Terminal" Look */}
        <div className="bg-white border border-slate-200 shadow-sm p-0 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                <h3 className="font-serif text-slate-900 text-lg">Team Alpha Performance</h3>
                <Link href="/sales-training/dashboard" className="text-xs font-bold text-emerald-900 uppercase tracking-wide hover:underline">
                    Full Report →
                </Link>
            </div>
            
            <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                    <p className="text-slate-600 mb-6 leading-relaxed">
                        {`Aggregate analysis of the wealth management division's performance in high-stakes negotiation simulations. Metrics updated hourly.`}
                    </p>
                    <div className="grid grid-cols-3 gap-px bg-slate-200 border border-slate-200">
                        {/* Metric 1 */}
                        <div className="bg-white p-4">
                            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Active Bankers</p>
                            <p className="text-3xl font-serif text-slate-900">12</p>
                        </div>
                        {/* Metric 2 */}
                        <div className="bg-white p-4">
                            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Sims Completed</p>
                            <p className="text-3xl font-serif text-slate-900">156</p>
                        </div>
                        {/* Metric 3 */}
                        <div className="bg-white p-4">
                            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Avg. Alpha</p>
                            <p className="text-3xl font-serif text-emerald-800">87<span className="text-sm align-top">%</span></p>
                        </div>
                    </div>
                </div>
                
                {/* Visual Decorative Element (Abstract Chart) */}
                <div className="w-full md:w-1/3 h-32 flex items-end justify-between gap-1 px-4 border-b border-slate-200 pb-2">
                    {[40, 65, 45, 70, 85, 60, 75, 90, 80, 95].map((h, i) => (
                        <div key={i} className="w-full bg-slate-100 hover:bg-emerald-900/20 transition-colors relative group" style={{ height: `${h}%` }}>
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono bg-slate-900 text-white px-1">
                                {h}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
             <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                Confidential • Internal Use Only • Wealth Management Division
             </p>
        </div>
      </main>
    </div>
  );
}