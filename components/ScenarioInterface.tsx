'use client';

import React, { useState, useEffect } from 'react';
import NavBarDemo from '@/components/NavBarDemo';
import { useHumeEVI } from '@/hooks/useHumeEVI';
import { Scenario, PersonaConfig, ScenarioContext } from '@/lib/scenarios';
import ScenarioHeader from './ScenarioHeader';
import MissionBriefing from './MissionBriefing';
import posthog from 'posthog-js';

/**
 * Main scenario interface component
 * 
 * This component:
 * 1. Displays scenario information and objectives
 * 2. Manages the Hume EVI connection
 * 3. Shows conversation transcript
 * 4. Provides controls for starting/stopping the conversation
 */

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface PracticeSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  score?: number;
  feedback?: {
    positives: string[];
    improvements: string[];
    sentiment: string;
    speakingPercentage: number;
    fillerWords: number;
    objectivesPracticed: number;
  };
  transcript?: Array<{
    speaker: string;
    text: string;
    timestamp: number;
    annotation?: {
      type: 'positive' | 'suggestion';
      label: string;
      suggestion?: string;
    };
  }>;
}

interface ScenarioInterfaceProps {
  scenario: Scenario;
}

export default function ScenarioInterface({ scenario }: ScenarioInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [persona, setPersona] = useState<PersonaConfig | undefined>(scenario.persona);
  const [context, setContext] = useState<ScenarioContext | undefined>(scenario.context);
  const [objectives, setObjectives] = useState<string[]>(scenario.objectives);
  const [checkedObjectives, setCheckedObjectives] = useState<boolean[]>(
    new Array(scenario.objectives.length).fill(false)
  );
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([]);
  const [currentSession, setCurrentSession] = useState<PracticeSession | null>(null);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [expandedTranscriptId, setExpandedTranscriptId] = useState<string | null>(null);
  const [expandedSuggestionId, setExpandedSuggestionId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Helper to generate dynamic instructions/systemPrompt
  const generateSystemPrompt = () => {
    // You can customize this logic to build a prompt from persona/context/objectives
    let prompt = scenario.systemPrompt;
    if (persona && context) {
      prompt = `You are playing the role of ${persona.name}, ${persona.title}.\n\n${context.backstory}\n\nCONVERSATION GUIDELINES:\n- ${objectives.join('\n- ')}\n\nKeep responses natural, conversational, and emotionally realistic.`;
    }
    return prompt;
  };

  const {
    isConnected,
    isConnecting,
    isSpeaking,
    isListening,
    error,
    connect,
    disconnect,
    startListening,
    stopListening,
  } = useHumeEVI({
    scenarioId: scenario.id,
    systemPrompt: generateSystemPrompt(),
    onMessage: (content, isUser) => {
      const message: Message = {
        id: Date.now().toString(),
        content,
        isUser,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, message]);
    },
    onError: (err) => {
      console.error('Hume error:', err);
    },
  });

  const handleStartSession = async () => {
    const sessionNumber = practiceSessions.length + 1;
    
    // Track scenario start for analytics
    posthog.capture('scenario_started', {
      scenario_id: scenario.id,
      scenario_title: scenario.title,
      session_number: sessionNumber, // Tracks repeat sessions (>1 means user is repeating)
    });

    const newSession: PracticeSession = {
      id: Date.now().toString(),
      startTime: new Date(),
    };
    setCurrentSession(newSession);
    await connect();
    setSessionStarted(true);
  };

  const handleEndSession = async () => {
    disconnect();
    setSessionStarted(false);

    if (currentSession && messages.length > 0) {
      // Start analysis
      setIsAnalyzing(true);

      try {
        // Format messages for API
        const transcript = messages.map(msg => ({
          speaker: msg.isUser ? 'User (You)' : persona?.name || 'AI',
          text: msg.content,
          timestamp: msg.timestamp.toLocaleTimeString(),
        }));

        // Call Claude analysis API
        console.log('📊 Requesting conversation analysis...');
        const response = await fetch('/api/analyze-conversation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcript,
            scenarioId: scenario.id,
            objectives,
            persona,
            context,
            systemPrompt: generateSystemPrompt(),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze conversation');
        }

        const { analysis } = await response.json();
        console.log('✅ Analysis received:', analysis);

        // Build transcript with annotations from key moments
        const annotatedTranscript = messages.map((msg, idx) => {
          // Find if this message has an annotation from Claude
          const keyMoment = analysis.keyMoments?.find((km: any) =>
            km.timestamp.toLowerCase().includes(msg.content.substring(0, 30).toLowerCase())
          );

          return {
            speaker: msg.isUser ? 'You' : persona?.name || 'AI',
            text: msg.content,
            timestamp: Math.floor((msg.timestamp.getTime() - currentSession.startTime.getTime()) / 1000),
            annotation: keyMoment ? {
              type: keyMoment.type,
              label: keyMoment.label,
              suggestion: keyMoment.suggestion,
            } : undefined,
          };
        });

        // Create completed session with Claude's analysis
        const completedSession: PracticeSession = {
          ...currentSession,
          endTime: new Date(),
          score: analysis.overallScore || 75,
          feedback: {
            positives: analysis.positives || [],
            improvements: analysis.improvements || [],
            sentiment: analysis.sentiment || 'Professional',
            speakingPercentage: analysis.speakingBalance?.managerPercentage || 50,
            fillerWords: analysis.fillerWordsEstimate || 0,
            objectivesPracticed: analysis.objectivesAnalysis?.achieved?.length || 0,
          },
          transcript: annotatedTranscript,
        };

        setPracticeSessions(prev => [completedSession, ...prev]);
        setCurrentSession(null);

        // Track scenario completion for analytics
        posthog.capture('scenario_completed', {
          scenario_id: scenario.id,
          scenario_title: scenario.title,
          session_number: practiceSessions.length + 1,
          score: completedSession.score,
          duration_seconds: completedSession.endTime && completedSession.startTime
            ? Math.floor((completedSession.endTime.getTime() - completedSession.startTime.getTime()) / 1000)
            : null,
          objectives_met: completedSession.feedback?.objectivesPracticed,
        });

        console.log('✅ Session saved with AI feedback');

      } catch (error) {
        console.error('❌ Failed to analyze conversation:', error);

        // Fallback: save session without AI feedback
        const completedSession: PracticeSession = {
          ...currentSession,
          endTime: new Date(),
          feedback: {
            positives: ['Session completed'],
            improvements: ['Analysis unavailable - please try again'],
            sentiment: 'Unknown',
            speakingPercentage: 50,
            fillerWords: 0,
            objectivesPracticed: 0,
          },
        };
        setPracticeSessions(prev => [completedSession, ...prev]);
        setCurrentSession(null);
      } finally {
        setIsAnalyzing(false);
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <NavBarDemo />
      <div className="flex flex-1 min-h-0">
        <aside className="w-80 flex-shrink-0 p-4 bg-white shadow-lg overflow-y-auto">
          {/* Objectives - now dynamic */}
          <div className=" pb-8 mb-2 border-b border-gray-200 p-4  fade-in-up fade-in-delay-200">
            <h2 className="text-xl font-serif text-slate-900 mb-4">Objectives</h2>
            <div className="space-y-3">
              {objectives.map((objective, idx) => (
                <label key={idx} className="flex items-start cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={checkedObjectives[idx]}
                    onChange={(e) => {
                      const newChecked = [...checkedObjectives];
                      newChecked[idx] = e.target.checked;
                      setCheckedObjectives(newChecked);
                    }}
                    className="mt-1 w-4 h-4 text-indigo-600 rounded border-gray-300 cursor-pointer"
                  />
                  <span className={`ml-3 text-sm ${checkedObjectives[idx]
                    ? 'text-gray-500 line-through'
                    : 'text-gray-700'
                    }`}>
                    {objective}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-4 pb-8 mb-2 border-b border-gray-200 fade-in-up fade-in-delay-400 bg-slate-50/50">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Key Considerations</h2>
            <ul className="space-y-3">
              {scenario.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start text-sm text-slate-600">
                  <span className="text-amber-600/60 mr-2 text-xs">■</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Connection Status */}
          <div className=" pb-8 mb-2 border-b border-gray-200 p-4  fade-in-up fade-in-delay-600">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">System Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Connection</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${isConnected ? 'bg-green-100 text-green-800' :
                  isConnecting ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                  {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Not Connected'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">AI Speaking</span>
                <span className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">You Speaking</span>
                <span className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
              </div>
            </div>
          </div>
          {/* Mission Briefing Section */}
          {persona && (
            <MissionBriefing
              persona={persona}
              context={context}
              onPersonaChange={(updates) => {
                const updated = { ...persona, ...updates };
                setPersona(updated);
              }}
              onContextChange={(updatedContext) => {
                setContext(updatedContext);
              }}
            />
          )}
        </aside>


        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-shrink-0">
            <ScenarioHeader
              title={scenario.title}
              difficulty={scenario.difficulty}
              persona={persona}
              context={context}
            />
          </div>
          <div className="flex-1 flex flex-col min-h-0 bg-white shadow-lg overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
              {!sessionStarted ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                    <span className="text-2xl">⚡️</span>
                  </div>
                  <h3 className="text-2xl font-serif text-slate-900 mb-2">Simulation Ready</h3>
                  <p className="text-slate-500 max-w-sm">
                    Initialize the session to begin the roleplay scenario. The AI will adopt the target persona immediately.
                  </p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-slate-400 text-sm uppercase tracking-widest mb-2">Session Active</p>
                  <p className="text-xl font-serif text-slate-700">Introduce yourself to begin.</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex fade-in-up ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${message.isUser
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                        }`}
                    >
                      <div className="flex items-start space-x-2">
                        <span className="text-sm font-semibold">
                          {message.isUser ? 'You' : persona?.name || 'AI'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Controls - flex-shrink-0 keeps button visible without scrolling */}
            <div className={`flex-shrink-0 border-t border-gray-200 p-6 ${!sessionStarted ? 'animated-gradient-soft rounded-b-xl' : 'bg-white'}`}>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-center gap-6">
                {!sessionStarted ? (
                  <button
                    onClick={handleStartSession}
                    disabled={isConnecting}
                    className="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-white transition-all duration-200 bg-emerald-950 border border-transparent rounded hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-900 w-64 shadow-lg shadow-emerald-900/20"
                  >
                    {isConnecting ? 'Establishing Uplink...' : 'Initialize Simulation'}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={toggleListening}
                      disabled={!isConnected || isSpeaking}
                      className={`flex items-center justify-center w-14 h-14 rounded-full border transition-all duration-300 shadow-md ${isListening
                        ? 'bg-white border-red-500 text-red-600 shadow-red-100 ring-4 ring-red-50'
                        : 'bg-emerald-950 border-emerald-950 text-white hover:bg-emerald-900'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isListening ? (
                        <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.66 9 5v6c0 1.66 1.34 3 3 3z" /><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" /></svg>
                      ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.66 9 5v6c0 1.66 1.34 3 3 3z" /><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" /></svg>
                      )}
                    </button>

                    <button
                      onClick={handleEndSession}
                      disabled={isAnalyzing}
                      className="px-6 py-3 bg-white text-slate-700 border border-slate-300 rounded text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      {isAnalyzing ? 'Processing Analysis...' : 'Conclude Session'}
                    </button>
                  </>
                )}
              </div>

              {sessionStarted && (
                <div className="mt-4 text-center">
                  <p className={`text-xs font-medium tracking-wider uppercase transition-colors ${isListening ? 'text-red-600' : 'text-slate-400'}`}>
                    {isListening ? '• Microphone Active' : isSpeaking ? 'Incoming Audio Stream...' : 'Standby'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>


        <aside className="w-1/3 flex-shrink-0 overflow-y-auto border-l border-slate-200 bg-slate-200 min-h-0">
          {/* Recent Practice Section */}
          {practiceSessions.length >= 0 && (
            <div className="  bg-white shadow-lg overflow-hidden fade-in fade-in-delay-200 h-full">
              <div className=" px-6 py-5 ">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-serif text-slate-900">Performance History</h2>
                  <button className="text-xs text-emerald-800 font-bold uppercase tracking-wide hover:underline">Export CSV</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Feedback</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* Loading State */}
                    {isAnalyzing && (
                      <tr className="bg-blue-50 animate-pulse">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" colSpan={4}>
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                            <span className="font-medium">Claude is analyzing your conversation...</span>
                          </div>
                        </td>
                      </tr>
                    )}

                    {practiceSessions.map((session) => (
                      <React.Fragment key={session.id}>
                        {/* Date row - starts a new section */}
                        <tr className="bg-gray-50">
                          <td colSpan={4} className="px-6 py-3 text-sm text-gray-700 font-medium">
                            {session.startTime.toLocaleString('en-US', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}                          </td>
                        </tr>

                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${session.score ? (
                              session.score >= 80 ? 'bg-green-100 text-green-800' :
                                session.score >= 70 ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                            ) : 'bg-gray-100 text-gray-800'
                              }`}>
                              {session.score ? `${session.score}%` : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {session.endTime && session.startTime ? (
                              `${Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 60000)} min`
                            ) : (
                              'In progress'
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {session.feedback ? (
                              <button
                                onClick={() => setExpandedSessionId(expandedSessionId === session.id ? null : session.id)}
                                className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                              >
                                {expandedSessionId === session.id ? 'Hide' : 'View'}
                              </button>
                            ) : (
                              <span className="text-gray-500 text-xs">No feedback yet</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setExpandedTranscriptId(expandedTranscriptId === session.id ? null : session.id)}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Replay and view transcript"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  const sessionData = `
                                    Practice Session - ${session.startTime.toLocaleDateString()} at ${session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    Score: ${session.score ? `${session.score}%` : 'Pending'}
                                    Duration: ${session.endTime && session.startTime ? `${Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 60000)} min` : 'In progress'}
                                    ${session.feedback ? `
                                    What Went Well:
                                    ${session.feedback.positives.join('\n')}

                                    Areas for Improvement:
                                    ${session.feedback.improvements.join('\n')}

                                    Sentiment: ${session.feedback.sentiment}
                                    Speaking %: ${session.feedback.speakingPercentage}%
                                    Filler Words: ${session.feedback.fillerWords}
                                    Objectives Practiced: ${session.feedback.objectivesPracticed}/5
                                ` : ''}
                                `;
                                  navigator.clipboard.writeText(sessionData);
                                  alert('Practice session details copied to clipboard!');
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Share practice session"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Feedback Section */}
                        {expandedSessionId === session.id && session.feedback && (
                          <tr className="bg-indigo-50 border-t border-indigo-200  fade-in-up fade-in-delay-200">
                            <td colSpan={4} className="px-6 py-6">
                              <div className="space-y-6">

                                {/* What Went Well */}
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <span className="text-green-600 mr-2">✓</span>
                                    What You Did Well
                                  </h4>
                                  <ul className="space-y-2">
                                    {session.feedback.positives.map((positive, idx) => (
                                      <li key={idx} className="text-sm text-gray-700 flex items-start">
                                        <span className="text-green-500 mr-2">•</span>
                                        <span>{positive}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Areas for Improvement */}
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <span className="text-yellow-600 mr-2">→</span>
                                    What You Could Improve
                                  </h4>
                                  <ul className="space-y-2">
                                    {session.feedback.improvements.map((improvement, idx) => (
                                      <li key={idx} className="text-sm text-gray-700 flex items-start">
                                        <span className="text-yellow-500 mr-2">•</span>
                                        <span>{improvement}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                {/* Metrics */}
                                <div className="grid grid-cols-3 md:grid-cols-3 gap-4 pt-4 border-t border-indigo-200">
                                  <div className="text-center">
                                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Speaking %</p>
                                    <p className="font-semibold text-gray-900">{session.feedback.speakingPercentage}%</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Filler Words</p>
                                    <p className="font-semibold text-gray-900">{session.feedback.fillerWords}</p>
                                  </div>
                                  <div className="text-center ">
                                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Objectives Met</p>
                                    <p className="font-semibold text-gray-900">{session.feedback.objectivesPracticed}/5</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 pt-4 border-t border-indigo-200">
                                  <div className="text-center">
                                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Sentiment</p>
                                    <p className="font-semibold text-gray-900">{session.feedback.sentiment}</p>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}

                        {/* Expanded Transcript Section */}
                        {expandedTranscriptId === session.id && session.transcript && (
                          <tr className="bg-gradient-to-r from-purple-100 to-blue-100 ">
                            <td colSpan={4} className="px-6 py-6">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-gray-900 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                    Session Transcript & Audio
                                  </h4>
                                  <button
                                    onClick={() => setExpandedTranscriptId(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    ✕
                                  </button>
                                </div>

                                {/* Transcript */}
                                <div className="bg-white rounded-lg max-h-96 overflow-y-auto">
                                  <div className="space-y-4 p-4">
                                    {session.transcript.map((entry, idx) => (
                                      <div key={idx}>
                                        <div className="flex gap-4 ">
                                          <div className="flex-shrink-0">
                                            <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full text-xs font-semibold ${entry.speaker === 'You'
                                              ? 'bg-indigo-100 text-indigo-700'
                                              : 'bg-gray-100 text-gray-700'
                                              }`}>
                                              {entry.speaker === 'You' ? 'You' : entry.speaker.charAt(0)}
                                            </span>
                                          </div>
                                          <div className="flex-grow">
                                            <p className="font-medium text-sm text-gray-900">{entry.speaker}</p>
                                            <p className="text-sm text-gray-700 mt-1  fade-in-up fade-in-delay-200">{entry.text}</p>
                                            <p className="text-xs text-gray-500 mt-1">{entry.timestamp}s</p>

                                            {/* Annotation Display */}
                                            {entry.annotation && (
                                              <div className="mt-3  fade-in-up fade-in-delay-600">
                                                {entry.annotation.type === 'positive' ? (
                                                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                    <p className="text-xs font-semibold text-green-700 flex items-center">
                                                      <span className="text-green-600 mr-2">✓</span>
                                                      {entry.annotation.label}
                                                    </p>
                                                  </div>
                                                ) : (
                                                  <div className="space-y-2">
                                                    <button
                                                      onClick={() => setExpandedSuggestionId(
                                                        expandedSuggestionId === `${session.id}-${idx}` ? null : `${session.id}-${idx}`
                                                      )}
                                                      className="w-full text-left bg-red-50 border border-red-200 rounded-lg p-3 hover:bg-red-100 transition-colors"
                                                    >
                                                      <p className="text-xs font-semibold text-red-700 flex items-center justify-between">
                                                        <span className="flex items-center">
                                                          <span className="text-red-600 mr-2">→</span>
                                                          {entry.annotation.label}
                                                        </span>
                                                        <span className="text-xs text-red-600">
                                                          {expandedSuggestionId === `${session.id}-${idx}` ? '−' : '+'}
                                                        </span>
                                                      </p>
                                                    </button>

                                                    {/* Expanded Suggestion */}
                                                    {expandedSuggestionId === `${session.id}-${idx}` && entry.annotation.suggestion && (
                                                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2 space-y-3">
                                                        <div>
                                                          <p className="text-xs font-semibold text-red-700 mb-2">Suggestion:</p>
                                                          <p className="text-sm text-red-900">{entry.annotation.suggestion}</p>
                                                        </div>
                                                        <button
                                                          onClick={() => {
                                                            setCheckedObjectives(new Array(5).fill(false));
                                                            setMessages([]);
                                                            setExpandedTranscriptId(null);
                                                            handleStartSession();
                                                          }}
                                                          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm transition-colors flex items-center justify-center gap-2"
                                                        >
                                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                          </svg>
                                                          Start roleplay from here
                                                        </button>
                                                      </div>
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                {/* Audio Player */}
                                <div className="bg-white rounded-lg p-4  ">
                                  <p className="text-sm text-gray-600 mb-3 font-medium">Audio Recording</p>
                                  <audio
                                    controls
                                    className="w-full  fade-in-up fade-in-delay-400"
                                    style={{
                                      accentColor: '#4f46e5'
                                    }}
                                  >
                                    <source src="data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==" type="audio/wav" />
                                    Your browser does not support the audio element.
                                  </audio>
                                  <p className="text-xs text-gray-500 mt-2">
                                    {session.endTime && session.startTime ? (
                                      `Duration: ${Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 60000)} minutes`
                                    ) : (
                                      'Duration: Unknown'
                                    )}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


        </aside>
      </div>
    </div>
  );
}

