# Manager Training Scenarios Platform

A Next.js application that uses Hume AI's Empathic Voice Interface (EVI) to create realistic, AI-powered conversation simulations for manager training.

## 🎯 Overview

This platform allows managers to practice difficult conversations in a safe, simulated environment. The AI responds with emotional intelligence, creating authentic training experiences.

### Current Scenarios
- **Difficult Performance Review**: Practice delivering constructive feedback to a defensive, underperforming employee

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 with React and TypeScript
- **Styling**: Tailwind CSS
- **AI Voice**: Hume AI's Empathic Voice Interface (EVI)
- **Deployment**: Optimized for Vercel

### How Hume EVI Works

Hume's **Empathic Voice Interface** provides an end-to-end speech-to-speech solution:

1. **Speech-to-Text**: Captures user's voice with emotion detection
2. **LLM Processing**: Uses Hume's empathic language model with custom system prompts
3. **Text-to-Speech**: Generates emotionally expressive responses
4. **WebSocket Connection**: Maintains real-time conversational flow

#### Key Benefits of Hume EVI:
- ✅ **All-in-one solution** - No need for separate STT, LLM, and TTS services
- ✅ **Emotional intelligence** - Detects and responds to emotional cues
- ✅ **Natural conversations** - Low latency, maintains context
- ✅ **Easy integration** - Single WebSocket connection handles everything

### Project Structure

```
/
├── app/
│   ├── api/
│   │   ├── hume-auth/route.ts      # Secure token exchange endpoint
│   │   └── scenarios/
│   │       ├── route.ts             # List all scenarios
│   │       └── [id]/route.ts        # Get specific scenario
│   ├── scenarios/
│   │   └── [id]/page.tsx            # Individual scenario page
│   ├── page.tsx                     # Home page with scenario list
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Global styles
├── components/
│   └── ScenarioInterface.tsx        # Main conversation UI component
├── hooks/
│   └── useHumeEVI.ts                # Custom hook for Hume integration
├── lib/
│   ├── scenarios.ts                 # Scenario definitions and prompts
│   └── hume-config.ts               # Hume configuration utilities
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Hume AI account and API keys

### 1. Get Hume AI API Keys

1. Go to [https://platform.hume.ai/](https://platform.hume.ai/)
2. Sign up for an account
3. Navigate to API Keys section
4. Create new API credentials
5. Copy your **API Key** and **Secret Key**

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
HUME_API_KEY=your_api_key_here
HUME_SECRET_KEY=your_secret_key_here
```

**Important**: Never commit `.env.local` to version control!

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 How to Use

1. **Browse Scenarios**: On the home page, view available training scenarios
2. **Select a Scenario**: Click on a scenario card to enter the training session
3. **Review Objectives**: Read the objectives and tips in the left panel
4. **Start Session**: Click "Start Scenario" to connect to Hume AI
5. **Begin Conversation**: Click the microphone button and start speaking
6. **Practice**: Have a natural conversation with the AI character
7. **End Session**: Click "End Session" when finished

## 🔧 How It Works

### Authentication Flow

```
Client → /api/hume-auth → Hume OAuth → Access Token → Client
```

1. Client requests access token from our secure API route
2. Server exchanges API credentials for temporary access token
3. Token returned to client (API keys never exposed to browser)
4. Client uses token to establish WebSocket connection

### Conversation Flow

```
User speaks → Microphone → WebSocket → Hume EVI
                                            ↓
User hears ← Audio playback ← WebSocket ← AI Response
```

1. User's browser captures microphone audio
2. Audio streamed to Hume via WebSocket
3. Hume processes: speech → text → LLM → text → speech
4. Audio response streamed back and played in browser
5. Transcript updated in UI for both sides

### Key Components

#### `useHumeEVI` Hook
Custom React hook that manages:
- Authentication with Hume
- WebSocket connection lifecycle
- Audio input/output streaming
- Connection state and error handling

#### `ScenarioInterface` Component
Main UI component that provides:
- Scenario information display
- Conversation transcript
- Microphone controls
- Connection status indicators

#### Scenario System Prompts
Each scenario has a detailed system prompt that defines:
- AI character's personality and background
- Current situation and context
- Behavioral guidelines
- Emotional responses

## 📝 Adding New Scenarios

To add a new training scenario:

1. Open `lib/scenarios.ts`
2. Add a new scenario object with:
   - Unique ID
   - Title and description
   - Difficulty level
   - Detailed system prompt for the AI character
   - Learning objectives
   - Tips for the user

Example:

```typescript
'new-scenario-id': {
  id: 'new-scenario-id',
  title: 'Your Scenario Title',
  description: 'Brief description',
  difficulty: 'intermediate',
  systemPrompt: `Detailed AI character instructions...`,
  objectives: ['Objective 1', 'Objective 2'],
  tips: ['Tip 1', 'Tip 2']
}
```

3. Update `app/scenarios/[id]/page.tsx` `generateStaticParams()` to include new scenario ID

## 🚢 Deployment to Vercel

### 1. Install Vercel CLI (optional)

```bash
npm i -g vercel
```

### 2. Deploy

```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### 3. Set Environment Variables in Vercel

1. Go to your project settings in Vercel dashboard
2. Navigate to Environment Variables
3. Add:
   - `HUME_API_KEY`
   - `HUME_SECRET_KEY`

### 4. Redeploy

After adding environment variables, trigger a new deployment.

## 🔐 Security Considerations

- ✅ API keys stored server-side only (never exposed to client)
- ✅ Access tokens used for client connections (expire after period)
- ✅ Environment variables properly configured
- ✅ HTTPS enforced in production (Vercel default)

## 🎨 Customization

### Changing AI Voice

Edit `lib/hume-config.ts` to change the default voice:

```typescript
export const DEFAULT_EVI_CONFIG = {
  voice: 'ITO', // Options: KORA, ITO, DACHER, AURA
  language: 'en',
};
```

### Styling

The app uses Tailwind CSS. Customize colors and styles in:
- `tailwind.config.ts` - Theme configuration
- `app/globals.css` - Global styles
- Component files - Component-specific styles

## 🐛 Troubleshooting

### "Failed to authenticate with Hume"
- Check that `HUME_API_KEY` and `HUME_SECRET_KEY` are correctly set
- Verify keys are valid in Hume dashboard
- Ensure no extra spaces or quotes in `.env.local`

### Microphone not working
- Grant browser permission to access microphone
- Check browser console for errors
- Ensure you're on HTTPS in production (required for microphone access)

### Audio not playing
- Check browser audio settings
- Ensure computer volume is up
- Try a different browser (Chrome/Edge recommended)

### WebSocket connection issues
- Check network connectivity
- Verify Hume service status
- Review browser console for error messages

## 📚 Resources

- [Hume AI Documentation](https://dev.hume.ai/)
- [Hume EVI Guide](https://dev.hume.ai/docs/empathic-voice-interface-evi/overview)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)

## 🤝 Contributing

To extend this platform:

1. Add new scenarios in `lib/scenarios.ts`
2. Create additional training modules
3. Enhance UI/UX in components
4. Add analytics and progress tracking
5. Implement user authentication
6. Add scenario completion feedback

## 📄 License

MIT License - feel free to use this for your training needs!

## 🙏 Acknowledgments

Built with [Hume AI](https://hume.ai/)'s Empathic Voice Interface, enabling emotionally intelligent AI conversations.

