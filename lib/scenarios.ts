// Scenario definitions for storytelling
// Each scenario defines the context, role, and behavior of the AI.

export type PersonalityType = 'defensive' | 'cooperative' | 'emotional' | 'analytical' | 'antagonistic';

export interface PerformanceIssue {
  title: string;
  description: string;
}

export interface PersonaConfig {
  name: string;
  title: string;
  image?: string; // URL to persona image or placeholder
  temperature: number; // 0-100: 0 = predictable, 100 = unpredictable
  personality: PersonalityType[];
  voice?: 'ITO' | 'KORA' | 'DACHER' | 'AURA'; // Voice for the AI persona
  duration: number; // in minutes
  recentPerformanceIssues: PerformanceIssue[];
}

export interface ScenarioContext {
  backstory: string; // Why you're having this conversation
  meetingDetails: {
    date: string; // e.g., "Today"
    time: string; // e.g., "Flexible"
  };
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  systemPrompt: string; // for the roleplay
  objectives: string[]; // Key learning objectives
  tips: string[];
  // Optional fields used by the UI
  domain?: string; // e.g., Storytelling, Relationships
  challenge?: string; // short prompt written from user's perspective
  attempts?: number;
  winRate?: number; // 0-1
  lastPractice?: string;
  isNew?: boolean;
  winCondition?: string;
  persona?: PersonaConfig;
  context?: ScenarioContext;
  type: 'storytelling' | 'manager-training' | 'interview-training' | 'relationship-training';
}

// Single storytelling scenario that powers the Hume EVI pipeline.
export const scenarios: Record<string, Scenario> = {
  storytelling: {
    id: 'storytelling',
    title: 'Human Interest Storytelling',
    description:
      'Have a deep, open-ended conversation with a human interest journalist about one meaningful story from your life.',
    difficulty: 'intermediate',
    domain: 'Storytelling',
    challenge:
      'You are telling a single, important story from your life. The journalist will help you go deeper on moments, emotions, and meaning.',
    attempts: 0,
    winRate: 0,
    lastPractice: undefined,
    isNew: true,
    persona: {
      name: 'Riley',
      title: 'Human Interest Journalist',
      temperature: 55,
      image: '/personas/stanford.png',
      personality: ['cooperative', 'emotional', 'analytical'],
      duration: 15,
      recentPerformanceIssues: [
        {
          title: 'Going deeper',
          description:
            'Try to move past facts and timelines into specific scenes, emotions, and what was at stake.',
        },
      ],
    },
    systemPrompt: `You are a human interest journalist having a one-on-one conversation with the user.

Your ONLY goal is to help the user tell one meaningful story from their life in a way that feels honest, specific, and emotionally rich.

ROLE:
- You are warm, curious, and non-judgmental.
- You listen closely and reflect back what you hear.
- You ask follow-up questions that help the user go deeper, not wider.

FOCUS:
- Stay with ONE story at a time (one moment, one relationship, or one turning point).
- Help the user move from vague summary to specific scenes, dialogue, and details.
- Explore what the story meant to them: emotions, stakes, decisions, and what changed.

CONVERSATION GUIDELINES:
- Start by asking what story they want to tell today, or what moment has been on their mind.
- Ask open-ended questions: "What happened next?", "What did that feel like?", "What were you afraid of?", "What surprised you?"
- Gently slow them down when they skip past important moments; ask them to zoom in on a single scene.
- Reflect their words back to them so they feel heard, and occasionally connect threads you notice.
- Do NOT give advice, fix problems, or turn it into coaching. Stay in interviewer/journalist mode.
- Avoid switching topics frequently; keep returning to the core story.

TONE:
- Empathetic, grounded, human, and present.
- You sound like a thoughtful longform journalist interviewing someone for a profile.

Keep your responses fairly concise but rich, usually 1–3 sentences plus one specific follow-up question. Never rush the user; let them lead, and you guide with curiosity.`,
    winCondition:
      'The user feels they have told one specific, emotionally honest story with clear moments, emotions, and meaning.',
    objectives: [
      'Choose one meaningful story to focus on (one moment, relationship, or turning point).',
      'Share concrete scenes and details—where you were, who was there, what was said—not just a summary.',
      'Include how you felt, what was at stake, and what changed for you.',
      'Let the journalist reflect your story back so you can hear it clearly and go deeper if you want.',
    ],
    tips: [
      'Describe specific scenes: where you were, who was there, what was said.',
      'Stay with one story; avoid jumping between multiple life chapters.',
      'Name your feelings when they come up—the journalist will follow up on them.',
      'If you’re not sure what to say next, try: “Can I tell you more about that moment?”',
    ],
    context: {
      backstory:
        'You’re here to tell one meaningful story from your life. Riley is a human interest journalist who will listen, ask follow-up questions, and help you go deeper. Focus on one experience, relationship, or turning point—and go beyond the timeline to the moments and feelings that matter.',
      meetingDetails: {
        date: 'Today',
        time: 'Flexible',
      },
    },
    type: 'storytelling',
  },
};

export function getScenario(id: string): Scenario | undefined {
  return scenarios[id];
}

export function getStorytellingScenarios(): Scenario[] {
  return Object.values(scenarios).filter((scenario) => scenario.type === 'storytelling');
}

export function getManagerTrainingScenarios(): Scenario[] {
  return [];
}

export function getInterviewTrainingScenarios(): Scenario[] {
  return [];
}

export function getAllScenarios(): Scenario[] {
  return Object.values(scenarios);
}
