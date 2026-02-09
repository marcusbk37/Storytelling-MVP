"use client";
import { useState } from 'react';
import Link from 'next/link';
import NavBarDemo from '@/components/NavBarDemo';

/**
 * Team Performance Dashboard
 * Style: Digital Luxury / Institutional / Private Banking
 */

export default function TeamPerformanceDashboard() {
  // --- MOCK DATA (Preserved) ---
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Chen',
      completedScenarios: 24,
      avgScore: 92,
      lastPractice: '2 days ago',
      trend: 'up',
      aum: 120000000,
      scenarios: [
        { name: 'Market Volatility', score: 92 },
        { name: 'Managing Client Panic', score: 95 },
        { name: 'Cross-Border LPOA', score: 78 }
      ],
      recommendedModules: ['Gatekeeper', 'Advanced EQ']
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      completedScenarios: 18,
      avgScore: 87,
      lastPractice: '5 days ago',
      trend: 'up',
      aum: 95000000,
      scenarios: [
        { name: 'Discovery Call', score: 88 },
        { name: 'Objection Handling', score: 82 }
      ],
      recommendedModules: ['Objection Handling', 'Fargo Upsell']
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      completedScenarios: 31,
      avgScore: 95,
      lastPractice: '1 day ago',
      trend: 'up',
      aum: 110000000,
      scenarios: [
        { name: 'Cold Call Opening', score: 94 },
        { name: 'Enterprise Sales Pitch', score: 91 }
      ],
      recommendedModules: ['Upsell Techniques', 'Enterprise Pitch']
    },
    {
      id: 4,
      name: 'James Wilson',
      completedScenarios: 12,
      avgScore: 78,
      lastPractice: '3 weeks ago',
      trend: 'down',
      aum: 65000000,
      scenarios: [
        { name: 'Managing Drawdowns', score: 60 },
        { name: 'Regulatory Basics', score: 75 }
      ],
      recommendedModules: ['Resilience Training', 'Regulatory Refresher']
    },
    {
      id: 5,
      name: 'Priya Patel',
      completedScenarios: 28,
      avgScore: 89,
      lastPractice: '4 days ago',
      trend: 'stable',
      aum: 40000000,
      scenarios: [
        { name: 'Cold Call Opening', score: 86 },
        { name: 'Cross-Selling', score: 72 }
      ],
      recommendedModules: ['Cross-Sell Fundamentals']
    },
    {
      id: 6,
      name: 'David Kim',
      completedScenarios: 22,
      avgScore: 85,
      lastPractice: '1 week ago',
      trend: 'up',
      aum: 85000000,
      scenarios: [
        { name: 'Enterprise Sales Pitch', score: 87 },
        { name: 'Discovery Call', score: 83 }
      ],
      recommendedModules: ['Discovery Masterclass']
    }
  ];

  const metrics = {
    aumAtRisk: 45000000,
    aumAtRiskReason: 'Sensitivity: Resilience Scores < 70%',
    avgTrustScore: 7.2,
    avgTrustTarget: 8.5,
    crossSellRatio: 1.2,
    trainingCompletion: 64,
    module: 'Regulatory & Trust',
    fargoAdoption: null
  };

  const competencyGaps = [
    { name: 'Objection Handling', pct: 42, reason: 'Fee justification vs. Retrocessions.' },
    { name: 'Cross-Selling', pct: 30, reason: 'Missed family-complexity cues.' },
    { name: 'Managing Drawdowns', pct: 55, reason: 'Re-anchoring failure.' },
    { name: 'Cross-Border LPOA', pct: 68, reason: 'Documentation nuances.' },
  ];

  const performanceByScenario = [
    { name: 'Cold Call Opening', avgScore: 82, attempts: 156 },
    { name: 'Handling Price Objections', avgScore: 76, attempts: 142 },
    { name: 'Discovery Call', avgScore: 88, attempts: 168 },
    { name: 'Closing Techniques', avgScore: 79, attempts: 134 },
    { name: 'Enterprise Sales Pitch', avgScore: 85, attempts: 98 },
    { name: 'Market Volatility', avgScore: 81, attempts: 120 },
    { name: 'Managing Client Panic', avgScore: 74, attempts: 90 },
  ];

  const recentActivity = [
    { member: 'Emily Rodriguez', action: 'Completed', scenario: 'Cold Call Opening', score: 94, time: '2h ago' },
    { member: 'Sarah Chen', action: 'Completed', scenario: 'Closing Techniques', score: 88, time: '5h ago' },
    { member: 'Marcus Johnson', action: 'Completed', scenario: 'Discovery Call', score: 91, time: '1d ago' },
    { member: 'Priya Patel', action: 'Completed', scenario: 'Cold Call Opening', score: 86, time: '2d ago' },
    { member: 'David Kim', action: 'Completed', scenario: 'Enterprise Sales Pitch', score: 87, time: '3d ago' },
  ];

  // --- HELPERS ---
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

  // Styled specifically for the luxury aesthetic (Darker, richer colors)
  const getProgressColor = (pct: number) => {
    if (pct <= 40) return 'bg-red-900'; // Deep red
    if (pct <= 70) return 'bg-amber-600'; // Gold/Bronze
    return 'bg-emerald-900'; // Deep Green
  };

  // --- STATE ---
  const [openRows, setOpenRows] = useState<Record<number, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalGap, setModalGap] = useState<any>(null);
  const [selectedTrainings, setSelectedTrainings] = useState<string[]>([]);

  const openDeployModal = (gap: any) => {
    setModalGap(gap);
    setSelectedTrainings([]);
    setModalOpen(true);
  };

  const closeDeployModal = () => {
    setModalOpen(false);
    setModalGap(null);
    setSelectedTrainings([]);
  };

  const toggleTrainingSelection = (name: string) => {
    setSelectedTrainings((prev) => prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]);
  };

  const confirmDeploy = () => {
    if (!modalGap) return;
    alert(`Deploying [${selectedTrainings.join(', ')}] for gap: ${modalGap.name}`);
    closeDeployModal();
  };

  const toggleRow = (id: number) => {
    setOpenRows((p) => ({ ...p, [id]: !p[id] }));
  };

  const handleDeploy = (memberName: string) => {
    alert(`Deployed recommended training to ${memberName}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-900 selection:text-white">
      <NavBarDemo />

      {/* HEADER: Editorial / Institutional Style */}
      <header className="pt-24 pb-12 px-6 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Private Banking • Team Alpha
              </p>
              <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4 tracking-tight">
                Performance Ledger
              </h1>
              <p className="text-xl text-slate-600 font-light max-w-2xl leading-relaxed">
                Aggregated analysis of relationship manager competency, AUM risk exposure, and compliance adherence.
              </p>
            </div>
            
            {/* System Date Stamp */}
            <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-right min-w-[180px]">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Report Date</div>
              <div className="font-mono text-sm text-slate-900">{currentDate}</div>
            </div>
          </div>
        </div>
      </header>

      {/* KPI STRIP: Bloomberg Terminal Style */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            
            {/* Metric 1: AUM Risk */}
            <div className="p-6 group hover:bg-slate-50 transition-colors">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Net AUM Exposure</p>
              <p className="text-3xl font-serif text-slate-900 mb-1">{formatCurrency(metrics.aumAtRisk)}</p>
              <p className="text-xs font-mono text-red-800 bg-red-50 inline-block px-1.5 py-0.5 border border-red-100">
                Warning: {metrics.aumAtRiskReason.split(':')[0]}
              </p>
            </div>

            {/* Metric 2: Trust Score */}
            <div className="p-6 group hover:bg-slate-50 transition-colors">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Avg. EQ / Trust Index</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-serif text-slate-900">{metrics.avgTrustScore}</p>
                <span className="text-sm text-slate-400 font-light">/ 10.0</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Target: {metrics.avgTrustTarget}</p>
            </div>

            {/* Metric 3: Cross Sell */}
            <div className="p-6 group hover:bg-slate-50 transition-colors">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Cross-Sell Velocity</p>
              <p className="text-3xl font-serif text-slate-900">{metrics.crossSellRatio}x</p>
              <p className="text-xs text-slate-500 mt-1">Institutional Avg: 1.1x</p>
            </div>

             {/* Metric 4: Compliance */}
             <div className="p-6 group hover:bg-slate-50 transition-colors">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Training Compliance</p>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-serif text-slate-900">{metrics.trainingCompletion}<span className="text-lg">%</span></p>
                {/* Minimalist donut chart representation */}
                <svg width="24" height="24" viewBox="0 0 24 24" className="transform -rotate-90">
                    <circle cx="12" cy="12" r="10" stroke="#f1f5f9" strokeWidth="4" fill="none" />
                    <circle cx="12" cy="12" r="10" stroke="#064e3b" strokeWidth="4" fill="none" strokeDasharray="62.8" strokeDashoffset={62.8 - (62.8 * metrics.trainingCompletion) / 100} />
                </svg>
              </div>
              <p className="text-xs text-slate-500 mt-1">Focus: {metrics.module}</p>
            </div>

          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT COLUMN: The Ledger (Team Table) */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
              <h2 className="font-serif text-xl text-slate-900">Relationship Managers</h2>
              <div className="flex gap-4">
                <button className="text-[10px] uppercase font-bold text-emerald-900 tracking-wider hover:underline">
                    Download CSV
                </button>
                <select className="bg-transparent text-xs font-mono text-slate-600 border-none focus:ring-0 cursor-pointer">
                    <option>Sort: AUM (High-Low)</option>
                    <option>Sort: Perf (High-Low)</option>
                </select>
              </div>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Banker / AUM</th>
                    <th className="text-left py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Simulations</th>
                    <th className="text-left py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Alpha Score</th>
                    <th className="text-left py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last Active</th>
                    <th className="text-center py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teamMembers.map((member) => (
                    <>
                      <tr
                        key={`row-${member.id}`}
                        className={`group transition-colors cursor-pointer ${openRows[member.id] ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                        onClick={() => toggleRow(member.id)}
                      >
                        <td className="py-5 px-6">
                          <div className="font-serif text-slate-900 text-lg">{member.name}</div>
                          <div className="font-mono text-xs text-slate-500 mt-1">{formatCurrency(member.aum || 0)}</div>
                        </td>
                        <td className="py-5 px-6 font-mono text-sm text-slate-600">{member.completedScenarios}</td>
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-lg font-medium text-slate-900">{member.avgScore}</span>
                            {/* Thin luxury line bar */}
                            <div className="w-16 h-0.5 bg-slate-200">
                              <div
                                className={`h-0.5 ${member.avgScore > 90 ? 'bg-emerald-800' : member.avgScore > 80 ? 'bg-emerald-600' : 'bg-amber-600'}`}
                                style={{ width: `${member.avgScore}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6 font-mono text-xs text-slate-500">{member.lastPractice}</td>
                        <td className="py-5 px-6 text-center">
                            {member.trend === 'up' && <span className="text-emerald-900 text-xs">▲</span>}
                            {member.trend === 'down' && <span className="text-red-900 text-xs">▼</span>}
                            {member.trend === 'stable' && <span className="text-slate-400 text-xs">—</span>}
                        </td>
                      </tr>

                      {/* Expandable Detail View: "The File" */}
                      {openRows[member.id] && (
                        <tr key={`exp-${member.id}`} className="bg-slate-50 shadow-inner">
                          <td colSpan={5} className="px-6 py-6">
                            <div className="flex flex-col lg:flex-row gap-8 pl-4 border-l-2 border-emerald-900/20">
                              
                              {/* Recent Scenarios */}
                              <div className="flex-1">
                                <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-3">Recent Simulations</h4>
                                <div className="space-y-2">
                                  {member.scenarios?.map((s, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
                                      <span className="text-sm font-serif text-slate-700">{s.name}</span>
                                      <span className="font-mono text-xs font-medium text-slate-900">{s.score}/100</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Action Items */}
                              <div className="lg:w-1/3">
                                <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-3">Corrective Actions</h4>
                                <div className="space-y-3">
                                  {member.recommendedModules?.map((m, idx) => (
                                    <div key={idx} className="bg-white border border-slate-200 p-3 flex justify-between items-center shadow-sm">
                                      <span className="text-xs font-medium text-slate-700">{m}</span>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleDeploy(member.name); }}
                                        className="text-[10px] font-bold text-emerald-900 uppercase tracking-wide border border-emerald-900/20 px-2 py-1 hover:bg-emerald-900 hover:text-white transition-all"
                                      >
                                        Assign
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT COLUMN: Insights & Ticker */}
          <div className="space-y-12">
            
            {/* Competency Gaps (Risk Radar) */}
            <div>
              <h3 className="font-serif text-xl text-slate-900 mb-6 flex items-center gap-2">
                Systemic Vulnerabilities
                <span className="bg-red-50 text-red-900 border border-red-100 text-[10px] font-bold px-1.5 py-0.5 uppercase rounded-sm">
                    Action Req.
                </span>
              </h3>
              
              <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-6">
                {competencyGaps.map((g) => {
                  const barColor = getProgressColor(g.pct);
                  return (
                    <div key={g.name} className="group cursor-pointer" onClick={() => openDeployModal(g)}>
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-sm font-medium text-slate-900 group-hover:text-emerald-900 transition-colors">{g.name}</span>
                        <span className="font-mono text-sm font-bold text-slate-900">{g.pct}% <span className="text-[10px] text-slate-400 font-normal uppercase">Failure Rate</span></span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 mb-2">
                        <div className={`h-1 transition-all duration-500 ${barColor}`} style={{ width: `${g.pct}%` }}></div>
                      </div>
                      <p className="text-xs text-slate-500 italic leading-snug border-l-2 border-slate-200 pl-2">
                        {g.reason}
                      </p>
                      <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                         <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wide border-b border-emerald-900">Initiate Training Program →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity Ticker */}
            <div>
              <h3 className="font-serif text-xl text-slate-900 mb-6">Live Feed</h3>
              <div className="bg-slate-50 border border-slate-200 p-0">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="p-4 border-b border-slate-200 last:border-0 flex items-start gap-3">
                    <div className="min-w-[32px] h-8 flex items-center justify-center bg-white border border-slate-200 font-serif text-slate-900 text-xs">
                        {activity.member.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-900 truncate">
                        <span className="font-bold">{activity.member}</span> completed <span className="italic">{activity.scenario}</span>
                      </p>
                      <div className="flex justify-between items-center mt-1">
                          <span className="text-[10px] font-mono text-slate-400">{activity.time}</span>
                          <span className="font-mono text-xs font-bold text-emerald-900">Score: {activity.score}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-slate-200 text-center">
         <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
            Confidential • Internal Use Only • Wealth Management Division
         </p>
      </footer>

      {/* DEPLOY MODAL: Styled as a "Trade Confirmation" */}
      {modalOpen && modalGap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-serif text-lg text-slate-900">Remediation Protocol</h3>
                <p className="text-xs font-mono text-slate-500 uppercase mt-0.5">Target: {modalGap.name}</p>
              </div>
              <button onClick={closeDeployModal} className="text-slate-400 hover:text-slate-900">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-3">Select simulation modules to deploy to affected Relationship Managers:</p>
                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                  {performanceByScenario.map((s) => (
                    <label key={s.name} className={`flex items-center gap-3 p-3 border cursor-pointer transition-all ${
                        selectedTrainings.includes(s.name) 
                        ? 'bg-emerald-50 border-emerald-900' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}>
                      <input
                        type="checkbox"
                        checked={selectedTrainings.includes(s.name)}
                        onChange={() => toggleTrainingSelection(s.name)}
                        className="w-4 h-4 text-emerald-900 border-slate-300 focus:ring-emerald-900"
                      />
                      <div className="flex-1 flex justify-between">
                        <span className="text-sm font-medium text-slate-900">{s.name}</span>
                        <span className="font-mono text-xs text-slate-500">Avg: {s.avgScore}%</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button 
                onClick={closeDeployModal} 
                className="px-4 py-2 text-xs font-bold text-slate-600 uppercase tracking-wide hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeploy} 
                className="px-6 py-2 bg-emerald-900 text-white text-xs font-bold uppercase tracking-wide hover:bg-emerald-800 transition-colors shadow-sm"
              >
                Confirm Deployment
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}