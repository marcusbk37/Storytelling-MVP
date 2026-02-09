import Link from 'next/link';
import Image from 'next/image';
import NavBar from '@/components/NavBar';
import { getInterviewTrainingScenarios } from '@/lib/scenarios';

/*
 Interview Training Scenarios Page
 Style: Institutional / Digital Luxury / Academic
*/

export default function InterviewTrainingPage() {
  const scenarios = getInterviewTrainingScenarios();
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-900 selection:text-white">
      <NavBar />

      {/* HEADER: Institutional Style */}
      <header className="pt-24 pb-12 px-6 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 bg-indigo-900 rounded-full"></span>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Admissions Committee • Candidate Portal
                </p>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4 tracking-tight">
                Evaluation Protocols
              </h1>
              <p className="text-xl text-slate-600 font-light max-w-2xl leading-relaxed">
                Initiate mock interview sequences modeled on M7 business school criteria.
                <br className="hidden md:block"/>
                Focus on narrative structure, behavioral signals, and executive presence.
              </p>
            </div>
            
            {/* Cycle Status Widget */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-sm text-right min-w-[160px]">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Admissions Cycle</div>
              <div className="font-serif text-lg text-slate-900">{currentDate}</div>
            </div>
          </div>
        </div>
      </header>

      {/* METHODOLOGY STRIP */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 text-sm">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 border border-indigo-900 text-indigo-900 font-serif text-xs">I</span>
              <span className="text-slate-600"><strong className="text-slate-900">Select Board</strong>: Choose target school persona.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 border border-indigo-900 text-indigo-900 font-serif text-xs">II</span>
              <span className="text-slate-600"><strong className="text-slate-900">Interview</strong>: Voice-interactive STAR method.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 border border-indigo-900 text-indigo-900 font-serif text-xs">III</span>
              <span className="text-slate-600"><strong className="text-slate-900">Debrief</strong>: AI analysis of delivery & content.</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* ACTION BAR */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-end border-b border-slate-200 pb-4 gap-4">
          <div>
            <h2 className="text-lg font-serif font-semibold text-slate-900 flex items-center gap-2">
              Available Boards
              <span className="text-xs font-sans font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-sm border border-slate-200">
                {scenarios.length} Active
              </span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">Select an institution to begin the simulation.</p>
          </div>

          <Link
            href="/interview-training/dashboard"
            className="group flex items-center gap-2 text-sm font-bold text-indigo-900 uppercase tracking-wide hover:underline decoration-1 underline-offset-4"
          >
            <span>Access Performance Ledger</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>

        {/* SCENARIOS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {scenarios.map((scenario) => (
            <Link
              key={scenario.id}
              href={`/scenarios/${scenario.id}`}
              className="group block bg-white border border-slate-200 hover:border-indigo-900/50 hover:shadow-lg transition-all duration-500"
            >
              {/* Image Area */}
              <div className="relative h-64 overflow-hidden border-b border-slate-100">
                <div className="absolute top-0 left-0 w-full h-full bg-indigo-900/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* School/Badge Tag */}
                <div className="absolute top-4 left-4 z-20">
                   <span className="bg-white/95 backdrop-blur-sm px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-900 border border-slate-200 shadow-sm">
                      {scenario.domain || "MBA Core"}
                   </span>
                </div>

                <Image
                  src={scenario.persona?.image ?? '/personas/stanford.png'}
                  alt={scenario.title}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105 filter grayscale contrast-[0.95] group-hover:grayscale-0 group-hover:contrast-100"
                />
              </div>

              {/* Content Area */}
              <div className="p-6">
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="text-xl font-serif font-medium text-slate-900 group-hover:text-indigo-900 transition-colors">
                    {scenario.title}
                  </h3>
                  
                  {/* Difficulty Indicator */}
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border ${
                    scenario.difficulty === 'beginner' ? 'text-emerald-800 border-emerald-100 bg-emerald-50' :
                    scenario.difficulty === 'intermediate' ? 'text-indigo-800 border-indigo-100 bg-indigo-50' :
                    'text-red-900 border-red-100 bg-red-50'
                  }`}>
                    {scenario.difficulty}
                  </span>
                </div>

                <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-2 h-10 font-light">
                  {scenario.description}
                </p>

                {/* Footer of Card */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-900 uppercase tracking-wide transition-colors">
                    Enter Room
                  </span>
                  <svg 
                    className="w-4 h-4 text-slate-300 group-hover:text-indigo-900 transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* BOTTOM INFO BLOCK */}
        <div className="bg-slate-900 text-white p-8 md:p-12 flex flex-col md:flex-row justify-between items-start gap-8 border-t-4 border-indigo-500">
            <div className="max-w-xl">
                <h3 className="font-serif text-2xl mb-4">Why Simulation?</h3>
                <p className="text-slate-300 text-sm leading-relaxed font-light">
                    The modern admissions landscape requires more than rehearsed answers. It demands the ability to navigate ambiguity, demonstrate high EQ, and pivot narratives in real-time. Our AI models are fine-tuned on thousands of successful interview transcripts to replicate the pressure and cadence of a real committee interview.
                </p>
            </div>
            <div className="w-full md:w-auto min-w-[200px]">
                <p className="text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-4">Competency Areas</p>
                <ul className="space-y-2 text-sm text-slate-200 font-light">
                    <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-indigo-500 rounded-full"></span> Narrative Arc
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-indigo-500 rounded-full"></span> STAR Structure
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>  Why This School? 
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-indigo-500 rounded-full"></span> Executive Presence
                    </li>
                </ul>
            </div>
        </div>

        <div className="mt-8 text-center">
             <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                Academic Purpose Only • {new Date().getFullYear()}
             </p>
        </div>
      </main>
    </div>
  );
}