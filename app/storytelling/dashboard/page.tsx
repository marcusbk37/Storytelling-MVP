'use client';

import Link from 'next/link';
import NavBarDemo from '@/components/NavBarDemo';

/**
 * Storytelling dashboard – your sessions and progress.
 */

export default function StorytellingDashboardPage() {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-900 selection:text-white">
      <NavBarDemo />

      <header className="pt-24 pb-12 px-6 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Storytelling
              </p>
              <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4 tracking-tight">
                Dashboard
              </h1>
              <p className="text-xl text-slate-600 font-light max-w-2xl leading-relaxed">
                Your storytelling sessions and feedback. Start a session to see your activity here.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-right min-w-[180px]">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Date</div>
              <div className="font-mono text-sm text-slate-900">{currentDate}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 border border-slate-200 mb-12">
          <div className="bg-white p-6">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Sessions completed</p>
            <p className="text-3xl font-serif text-slate-900">0</p>
          </div>
          <div className="bg-white p-6">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Stories told</p>
            <p className="text-3xl font-serif text-slate-900">0</p>
          </div>
          <div className="bg-white p-6">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Last session</p>
            <p className="text-3xl font-serif text-slate-900">—</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm p-8">
          <h2 className="font-serif text-slate-900 text-lg mb-4">Recent activity</h2>
          <p className="text-slate-500 text-sm">Complete a storytelling session to see your activity and feedback here.</p>
          <Link href="/storytelling" className="inline-block mt-6 text-sm font-bold text-emerald-900 uppercase tracking-wide hover:underline">
            Start a session →
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Storytelling</p>
        </div>
      </main>
    </div>
  );
}
