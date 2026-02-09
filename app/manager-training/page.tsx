import Link from 'next/link';
import Image from 'next/image';
import NavBar from '@/components/NavBar'; 
import { getManagerTrainingScenarios } from '@/lib/scenarios';

/**
 * Manager Training Scenarios Page
 * Route: /manager-training
 */

export default function ManagerTrainingPage() {
  const scenarios = getManagerTrainingScenarios();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <NavBar />

      {/* Header with Gradient Background and How It Works */}
      <header className="bg-gradient-to-br from-blue-300 via-blue-500 to-purple-600 shadow-lg pb-0">
        <div className="max-w-7xl mx-auto px-6 py-28">
          <h1 className="text-6xl font-semibold text-white tracking-wide leading-tight mb-4">
            Manager Training<br />Scenarios
          </h1>
          <p className="text-blue-50 text-lg font-light max-w-2xl">
            Practice difficult conversations with AI-powered simulations
          </p>
        </div>
      </header>

      {/* How It Works Section - Integrated with White Background */}
      <div className="bg-white shadow-lg -mt-8 relative z-10 ">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Choose a Scenario</h3>
                <p className="text-xs text-gray-600 mt-1">Select realistic management situations</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Have a Conversation</h3>
                <p className="text-xs text-gray-600 mt-1">Speak naturally with AI</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Learn & Improve</h3>
                <p className="text-xs text-gray-600 mt-1">Build confidence through practice</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Scenarios Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Available Scenarios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenarios.map((scenario) => (
              <Link
                key={scenario.id}
                href={`/scenarios/${scenario.id}`}
                className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
              >
                {/* Image Placeholder */}
                <div className="relative h-40 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                  {scenario.id === 'difficult-performance-review' ? (
                    <Image
                      src="/personas/alex.png"
                      alt={scenario.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      📚
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors flex-1">
                      {scenario.title}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                      scenario.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      scenario.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {scenario.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {scenario.description}
                  </p>

                  {/* Metadata Row */}
                  <div className="flex items-center gap-4 text-xs text-gray-600 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>1:1</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>2-5 min</span>
                    </div>
                  </div>

                  <div className="flex items-center text-indigo-600 group-hover:text-indigo-700 font-medium text-sm">
                    Start Scenario
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}

            {/* Coming Soon Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-dashed border-gray-300">
              <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🚀</div>
                  <p className="text-sm font-medium text-gray-600">Coming Soon</p>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  New Scenario
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  More training scenarios coming soon
                </p>

                {/* Metadata Row */}
                <div className="flex items-center gap-4 text-xs text-gray-600 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>1:1</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>2-5 min</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-400 font-medium text-sm">
                  Check back later
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Info */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
          <h3 className="font-semibold text-indigo-900 mb-2">
            Powered by Hume AI
          </h3>
          <p className="text-sm text-indigo-800">
            This platform uses Hume&apos;s Empathic Voice Interface (EVI) to create realistic, 
            emotionally intelligent conversations. The AI understands and responds to emotional 
            cues, making practice sessions feel authentic and valuable.
          </p>
        </div>
      </main>
    </div>
  );
}
