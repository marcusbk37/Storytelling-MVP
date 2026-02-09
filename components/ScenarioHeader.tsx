'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PersonaConfig, ScenarioContext } from '@/lib/scenarios';

interface ScenarioHeaderProps {
    title: string;
    difficulty: string;
    persona?: PersonaConfig;
    context?: ScenarioContext;
    meta?: {
        attempts?: number;
        winRate?: number;
        lastPractice?: string;
        challenge?: string;
        winCondition?: string;
        domain?: string;
    };
}

export default function ScenarioHeader({
    title,
    difficulty,
    persona,
    context,
    meta,
}: ScenarioHeaderProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const getDifficultyProps = (diff: string) => {
        switch (diff) {
            case 'beginner':
                return {
                    label: 'Beginner',
                    bg: 'bg-gradient-to-r from-green-50 to-green-100',
                    text: 'text-green-800',
                    ring: 'ring-1 ring-green-100',
                    icon: '✨',
                };
            case 'intermediate':
                return {
                    label: 'Intermediate',
                    bg: 'bg-gradient-to-r from-yellow-50 to-yellow-100',
                    text: 'text-yellow-800',
                    ring: 'ring-1 ring-yellow-100',
                    icon: '⚙️',
                };
            case 'advanced':
                return {
                    label: 'Advanced',
                    bg: 'bg-gradient-to-r from-red-50 to-red-100',
                    text: 'text-red-700',
                    ring: 'ring-1 ring-red-100',
                    icon: '⚠️',
                };
            default:
                return {
                    label: diff.charAt(0).toUpperCase() + diff.slice(1),
                    bg: 'bg-gray-50',
                    text: 'text-gray-800',
                    ring: 'ring-1 ring-gray-100',
                    icon: 'ℹ️',
                };
        }
    };

    return (
        <div className="shadow-lg bg-white ">
            <div className="p-6 pt-2">
                <div className="flex items-center justify-between gap-6">
                    {/* Toggle Button */}
                    {persona && context && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition-colors"
                        >
                            <svg
                                className={`w-4 h-4 transition-transform ${isExpanded ? 'transform rotate-180' : ''
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
                            {isExpanded ? 'Hide' : 'Show'} Context
                        </button>
                    )}

                                {(() => {
                                    const d = getDifficultyProps(difficulty);
                                    return (
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${d.bg} ${d.text} ${d.ring} shadow-sm`}>
                                            <span className="text-xs">{d.icon}</span>
                                            <span className="uppercase tracking-wide text-[11px]">{d.label}</span>
                                        </span>
                                    );
                                })()}
                </div>
            </div>

            {/* Expanded Context Section */}
            {isExpanded && persona && context && (
                <div className="border-t border-gray-200 bg-gradient-to-br from-purple-200 to-blue-100 px-6 py-6 mr-6 ml-6 rounded-xl ">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Persona Info */}
                        <div>
                            {persona.image ? (
                                <div className="w-24 h-24 rounded-lg overflow-hidden shadow-md mb-4 fade-in-up  fade-in-delay-200">
                                    <Image
                                        src={persona.image}
                                        alt={persona.name}
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover"
                                        priority
                                    />
                                </div>
                            ) : (
                                <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-5xl shadow-md mb-4">
                                    👤
                                </div>
                            )}

                            <div className="space-y-2 fade-in-up  fade-in-delay-400">
                                <p className="text-lg font-semibold text-gray-900">{persona.name}</p>
                                <p className="text-sm font-serif text-gray-600">{persona.title}</p>
                                <div className="flex gap-2 mt-3">
                                    <span className="inline-block px-2 py-1 bg-indigo-200 text-indigo-800 rounded text-xs font-medium">
                                        Personality: {persona.personality.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Context & performance issues */}
                        <div className="md:col-span-2">

                            {/* Left: Title and Info */}
                            <div className="flex items-center gap-4 mb-2 fade-in-up  fade-in-delay-200">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest ">{title}</h2>
                            </div>

                            <p className="text-sm text-gray-700 leading-relaxed fade-in-up  fade-in-delay-200">
                                {context.backstory}
                            </p>

                            {persona.recentPerformanceIssues && persona.recentPerformanceIssues.length > 0 && (
                                <div className="mt-3 space-y-2   fade-in-up fade-in-delay-600">
                                    <p className="text-xs font-semibold text-gray-600 uppercase">Details:</p>
                                    <ul className="space-y-1">
                                        {persona.recentPerformanceIssues.map((issue, idx) => (
                                            <li key={idx} className="text-xs text-gray-700 flex items-start">
                                                <span className="mr-2 text-red-500">•</span>
                                                <span>
                                                    <strong>{issue.title}</strong> — {issue.description}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
