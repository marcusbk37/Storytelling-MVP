'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PersonaConfig, PersonalityType, ScenarioContext } from '@/lib/scenarios';

interface MissionBriefingProps {
  persona: PersonaConfig;
  context?: ScenarioContext;
  onPersonaChange?: (updates: Partial<PersonaConfig>) => void;
  onContextChange?: (context: ScenarioContext) => void;
}

const PERSONALITY_COLORS: Record<PersonalityType, { bg: string; text: string }> = {
  defensive: { bg: 'bg-red-100', text: 'text-red-700' },
  cooperative: { bg: 'bg-blue-100', text: 'text-blue-700' },
  emotional: { bg: 'bg-pink-100', text: 'text-pink-700' },
  analytical: { bg: 'bg-purple-100', text: 'text-purple-700' },
  antagonistic: { bg: 'bg-orange-100', text: 'text-orange-700' },
};

export default function MissionBriefing({
  persona,
  context,
  onPersonaChange,
  onContextChange,
}: MissionBriefingProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localPersona, setLocalPersona] = useState<PersonaConfig>(persona);
  const [customScenarioText, setCustomScenarioText] = useState('');

  const handleTemperatureChange = (value: number) => {
    const updated = { ...localPersona, temperature: value };
    setLocalPersona(updated);
    onPersonaChange?.(updated);
  };

  const handleCustomizeScenario = () => {
    if (customScenarioText.trim() && context) {
      const updatedContext: ScenarioContext = {
        ...context,
        backstory: customScenarioText
      };
      onContextChange?.(updatedContext);
      setCustomScenarioText('');
    }
  };

  return (
    <div className=" pb-8 mb-2  p-4 overflow-hidden  hover:bg-gray-50 transition-colors">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full  flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className="text-left">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ">Customize</h2>
            <p className="text-sm text-slate-800">Configure this scenario</p>
          </div>
        </div>
        <svg
          className={`w-6 h-6 text-gray-400 transition-transform ${isExpanded ? 'transform rotate-180' : ''
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-gray-200  space-y-6"> 
          <div >
            <textarea
              value={customScenarioText}
              onChange={(e) => setCustomScenarioText(e.target.value)}
              placeholder="E.g., you're meeting with the CTO of a tech startup who is skeptical of AI."
              className="w-full h-24 p-3 border border-indigo-300 rounded-lg font-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
            <button
              onClick={handleCustomizeScenario}
              disabled={!customScenarioText.trim()}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Update Scenario Context
            </button>
          </div>

          {/* Persona Section */}
          {/* Persona Image & Basic Info */}
          <div className="md:col-span-1">
            <div className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg p-6 flex flex-col items-center text-center">
              {/* Persona Avatar */}
              {localPersona.image ? (
                <div className="w-24 h-24 mb-4 rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={localPersona.image}
                    alt={localPersona.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-4xl mb-4">
                  👤
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900">{localPersona.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{localPersona.title}</p>
            </div>
          </div>
          {/* Difficulty Slider - Cooperative to Antagonistic */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-gray-900">Attitude</label>
              <span className="text-sm font-medium text-indigo-600">
                {localPersona.temperature < 33 ? 'Cooperative' : localPersona.temperature < 67 ? 'Neutral' : 'Antagonistic'}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500 w-20">Cooperative</span>
              <input
                type="range"
                min="0"
                max="100"
                value={localPersona.temperature}
                onChange={(e) => handleTemperatureChange(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-xs text-gray-500 w-20 text-right">Antagonistic</span>
            </div>
          </div>
          {/* Performance Issues Section - Within Customize */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <span className="mr-2">⚠️</span>
              Details
            </h4>
            <div className="space-y-2">
              {localPersona.recentPerformanceIssues.map((issue, idx) => (
                <div key={idx} className="text-xs">
                  <p className="font-medium text-gray-900">{issue.title}</p>
                  <p className="text-gray-600">{issue.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
