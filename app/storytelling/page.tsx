import Link from 'next/link';
import Image from 'next/image';
import NavBarDemo from '@/components/NavBarDemo';
import { getStorytellingScenarios } from '@/lib/scenarios';

/**
 * Storytelling sessions page – pick a session and talk with the journalist.
 */

export default function StorytellingPage() {
  const scenarios = getStorytellingScenarios();
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

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
                Storytelling Sessions
              </h1>
              <p className="text-xl text-slate-600 font-light max-w-2xl leading-relaxed">
                Select a session below to speak with a human interest journalist about one meaningful story from your life.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-sm text-right min-w-[200px]">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Date</div>
              <div className="font-serif text-lg text-slate-900">{currentDate}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 text-sm">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full border border-emerald-900 text-emerald-900 font-mono text-xs">1</span>
              <span className="text-slate-600"><strong className="text-slate-900">Choose a story</strong>: One moment, relationship, or turning point.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full border border-emerald-900 text-emerald-900 font-mono text-xs">2</span>
              <span className="text-slate-600"><strong className="text-slate-900">Speak it out</strong>: Talk with the journalist.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full border border-emerald-900 text-emerald-900 font-mono text-xs">3</span>
              <span className="text-slate-600"><strong className="text-slate-900">Reflect</strong>: Review feedback on clarity, emotion, and narrative.</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-end border-b border-slate-200 pb-4 gap-4">
          <h2 className="text-lg font-serif font-semibold text-slate-900 flex items-center gap-2">
            Sessions
            <span className="text-xs font-sans font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{scenarios.length} Available</span>
          </h2>
          <div className="text-xs text-slate-400">
            More storytelling sessions coming soon.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {scenarios.map((scenario) => (
            <Link
              key={scenario.id}
              href={`/scenarios/${scenario.id}`}
              className="group block bg-white border border-slate-200 hover:border-emerald-900/50 transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden border-b border-slate-100">
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-900 border border-slate-200 shadow-sm">
                    {scenario.domain}
                  </span>
                </div>
                <Image
                  src={scenario.persona?.image ?? '/personas/stanford.png'}
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
                <div className="grid grid-cols-2 border-t border-b border-slate-100 py-3 mb-5">
                  <div className="border-r border-slate-100 pr-4">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Est. duration</p>
                    <p className="text-sm font-mono text-slate-700">~30 min</p>
                  </div>
                  <div className="pl-4">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Focus</p>
                    <p className="text-sm font-mono text-slate-700">One story</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide group-hover:underline decoration-1 underline-offset-4">
                    Start session
                  </span>
                  {scenario.lastPractice && (
                    <span className="text-[10px] text-slate-400 font-mono">Last: {scenario.lastPractice}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}

          <div className="block bg-slate-50 border border-dashed border-slate-300 p-6 flex flex-col justify-center items-center text-center hover:bg-slate-100 transition-colors h-full min-h-[400px]">
            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
            <h3 className="text-lg font-serif font-medium text-slate-900 mb-2">More sessions soon</h3>
            <p className="text-sm text-slate-500 max-w-xs">
              Additional storytelling scenarios will appear here.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm p-0 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
            <h3 className="font-serif text-slate-900 text-lg">Your storytelling</h3>
            <Link href="/storytelling/dashboard" className="text-xs font-bold text-emerald-900 uppercase tracking-wide hover:underline">
              Dashboard →
            </Link>
          </div>
          <div className="p-8">
            <p className="text-slate-600 mb-6 leading-relaxed">
              Track your sessions and feedback. Metrics refresh as you complete conversations.
            </p>
            <div className="grid grid-cols-3 gap-px bg-slate-200 border border-slate-200">
              <div className="bg-white p-4">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Sessions</p>
                <p className="text-3xl font-serif text-slate-900">—</p>
              </div>
              <div className="bg-white p-4">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Stories completed</p>
                <p className="text-3xl font-serif text-slate-900">—</p>
              </div>
              <div className="bg-white p-4">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Last session</p>
                <p className="text-3xl font-serif text-slate-900">—</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">
            Storytelling
          </p>
        </div>
      </main>
    </div>
  );
}
