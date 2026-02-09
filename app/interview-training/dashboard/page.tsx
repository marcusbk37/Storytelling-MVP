"use client";
import Link from 'next/link';
import NavBarDemo from '@/components/NavBarDemo';

export default function InterviewDashboard() {
  // Mock metrics
  const metrics = {
    interviewsTaken: 12,
    avgClarityScore: 82,
    avgEngagementScore: 87,
    practiceCompletion: 68,
    recentImprovement: 'up'
  };

  const recentSessions = [
    { id: 1, scenario: 'Stanford GSB: "What matters most?"', score: 88, date: 'Nov 28', status: 'Distinction' },
    { id: 2, scenario: 'HBS: "The Case Method"', score: 76, date: 'Nov 25', status: 'Review Needed' },
    { id: 3, scenario: 'Wharton: Team Conflict', score: 91, date: 'Nov 12', status: 'High Distinction' },
    { id: 4, scenario: 'Stanford GSB: Behavioral', score: 84, date: 'Nov 10', status: 'Proficient' }
  ];

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-fuchsia-200 selection:text-fuchsia-900 relative overflow-hidden">
      
      {/* Ambient Background Gradients (The "Glow") */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-200/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-violet-200/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      
      <NavBarDemo />

      {/* HEADER: Editorial / Vogue Business Style */}
      <header className="relative pt-24 pb-12 px-6 border-b border-fuchsia-100/50 bg-white/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold text-fuchsia-900/60 uppercase tracking-widest mb-3">
              Candidate Performance Ledger
            </p>
            <h1 className="text-5xl md:text-6xl font-serif tracking-tight text-slate-900 mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-700 via-purple-600 to-indigo-600">
                Executive
              </span>
              <br />
              Summary.
            </h1>
          </div>
          
          <div className="text-right">
             <div className="inline-block px-4 py-2 border border-fuchsia-200 rounded-full bg-white/50 backdrop-blur-sm">
                <p className="text-xs font-mono text-fuchsia-800">
                   {currentDate} • <span className="text-green-600">Live</span>
                </p>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        
        {/* KPI STRIP: Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
                { label: 'Total Simulations', value: metrics.interviewsTaken, unit: '', desc: 'Lifetime sessions' },
                { label: 'Clarity Index', value: metrics.avgClarityScore, unit: '%', desc: 'Narrative structure' },
                { label: 'Engagement Score', value: metrics.avgEngagementScore, unit: '%', desc: 'Emotional connection' },
                { label: 'Curriculum Status', value: metrics.practiceCompletion, unit: '%', desc: 'Modules active' },
            ].map((stat, i) => (
                <div key={i} className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(192,38,211,0.15)] transition-all duration-500">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-700 to-purple-800">
                            {stat.value}
                        </span>
                        <span className="text-sm text-purple-400 font-medium">{stat.unit}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 font-light border-t border-fuchsia-50 pt-2">
                        {stat.desc}
                    </p>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT: Recent Activity Table */}
            <div className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-2xl border border-white shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-fuchsia-100 flex justify-between items-center bg-gradient-to-r from-fuchsia-50/50 to-transparent">
                    <h2 className="font-serif text-xl text-slate-800">Session History</h2>
                    <Link href="/interview-training" className="text-xs font-bold text-fuchsia-700 uppercase tracking-widest hover:text-purple-900 transition-colors">
                        View All Scenarios →
                    </Link>
                </div>
                
                <div className="p-0">
                    {recentSessions.map((s, idx) => (
                        <div key={s.id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-fuchsia-50 hover:bg-white transition-colors cursor-pointer last:border-0">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-fuchsia-100 to-purple-200 flex items-center justify-center text-fuchsia-700 font-serif font-bold text-lg group-hover:scale-110 transition-transform">
                                    {idx + 1}
                                </div>
                                <div>
                                    <h4 className="text-slate-900 font-medium text-lg font-serif">{s.scenario}</h4>
                                    <p className="text-xs text-slate-500 font-mono mt-1">{s.date} • AI Assessor</p>
                                </div>
                            </div>
                            
                            <div className="mt-4 md:mt-0 flex items-center gap-6 text-right">
                                <div>
                                    <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                        s.score >= 90 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        s.score >= 80 ? 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100' :
                                        'bg-amber-50 text-amber-700 border-amber-100'
                                    }`}>
                                        {s.status}
                                    </span>
                                </div>
                                <div className="min-w-[60px]">
                                    <span className="block text-2xl font-serif text-slate-900">{s.score}</span>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold">Score</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT: Analysis / Insight Column */}
            <div className="space-y-6">
                
                {/* Visualizer Card */}
                <div className="bg-gradient-to-br from-fuchsia-900 to-purple-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                    {/* Decorative glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500 rounded-full blur-[60px] opacity-30"></div>
                    
                    <h3 className="font-serif text-2xl mb-2 relative z-10">Analysis</h3>
                    <p className="text-fuchsia-100/80 text-sm font-light leading-relaxed mb-8 relative z-10">
                        Your engagement scores are trending upward. Focus on <strong className="text-white font-medium">structured brevity</strong> to improve Clarity metrics in the next session.
                    </p>

                    {/* Abstract Bar Chart */}
                    <div className="flex items-end justify-between h-24 gap-2 relative z-10">
                        {[40, 60, 45, 75, 65, 85, 80].map((h, i) => (
                            <div key={i} className="w-full bg-white/10 hover:bg-white/30 transition-colors rounded-t-sm" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="bg-white/60 backdrop-blur-sm border border-fuchsia-100 p-6 rounded-2xl">
                    <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest mb-4">Recommended Next Step</h4>
                    <p className="text-slate-900 font-serif text-lg mb-4">{`'Tell me about a time you failed.'`}</p>
                    <button className="w-full py-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-medium shadow-lg hover:shadow-fuchsia-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
                        <span>Initiate Simulation</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                </div>

            </div>
        </div>
      </main>
    </div>
  );
}