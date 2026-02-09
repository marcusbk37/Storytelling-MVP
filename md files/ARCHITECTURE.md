# Architecture Deep Dive

This document explains the technical architecture of the Manager Training Platform in detail.

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (Client)                      │
│                                                              │
│  ┌────────────────┐         ┌──────────────────┐          │
│  │  React         │         │  useHumeEVI      │          │
│  │  Components    │◄────────┤  Custom Hook     │          │
│  │                │         │                  │          │
│  │  - Home Page   │         │ - Auth           │          │
│  │  - Scenario UI │         │ - WebSocket      │          │
│  │  - Transcript  │         │ - Audio Stream   │          │
│  └────────────────┘         └──────────────────┘          │
│         │                            │                      │
│         │ HTTP                       │ WebSocket            │
└─────────┼────────────────────────────┼──────────────────────┘
          │                            │
          ▼                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Server (API Routes)               │
│                                                              │
│  ┌────────────────┐         ┌──────────────────┐          │
│  │ /api/hume-auth │         │ /api/scenarios   │          │
│  │                │         │                  │          │
│  │ Token Exchange │         │ Scenario Data    │          │
│  └────────────────┘         └──────────────────┘          │
│         │                                                    │
│         │ HTTPS                                             │
└─────────┼──────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                         Hume AI API                          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Empathic Voice Interface (EVI)          │  │
│  │                                                      │  │
│  │  Speech-to-Text → LLM Processing → Text-to-Speech  │  │
│  │        (with emotional intelligence)                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Layer

#### 1. Page Components (`app/`)

**Home Page** (`app/page.tsx`)
- Lists all available scenarios
- Provides platform overview
- Server-rendered for SEO

**Scenario Page** (`app/scenarios/[id]/page.tsx`)
- Dynamic route for individual scenarios
- Loads scenario data
- Renders `ScenarioInterface` component

#### 2. UI Components (`components/`)

**ScenarioInterface** (`components/ScenarioInterface.tsx`)
- Main conversation interface
- Manages UI state (messages, session status)
- Uses `useHumeEVI` hook for Hume integration
- Features:
  - Objectives and tips sidebar
  - Conversation transcript
  - Microphone controls
  - Connection status indicators

#### 3. Custom Hooks (`hooks/`)

**useHumeEVI** (`hooks/useHumeEVI.ts`)
- Encapsulates all Hume EVI logic
- Manages WebSocket connection
- Handles audio streaming (in/out)
- Provides clean API for components

### Backend Layer

#### API Routes (`app/api/`)

**Authentication Route** (`/api/hume-auth`)
- **Purpose**: Securely exchange API credentials for access token
- **Method**: POST
- **Input**: `{ scenarioId: string }`
- **Output**: `{ accessToken: string, expiresIn: number }`
- **Security**: API keys never leave the server

**Scenarios Route** (`/api/scenarios`)
- **Purpose**: List all scenarios
- **Method**: GET
- **Output**: Array of scenario objects

**Scenario Detail Route** (`/api/scenarios/[id]`)
- **Purpose**: Get specific scenario details
- **Method**: GET
- **Output**: Single scenario object

### Data Layer

#### Scenario Definitions (`lib/scenarios.ts`)

```typescript
interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  systemPrompt: string;        // Core AI behavior definition
  objectives: string[];         // Learning goals
  tips: string[];              // User guidance
}
```

## Hume EVI Integration Details

### Authentication Flow

```
Step 1: Client needs to start conversation
   ↓
Step 2: Client calls /api/hume-auth (POST)
   ↓
Step 3: Server sends OAuth request to Hume
   Request: {
     grant_type: 'client_credentials',
     client_id: HUME_API_KEY,
     client_secret: HUME_SECRET_KEY
   }
   ↓
Step 4: Hume returns access token
   Response: {
     access_token: 'eyJ...',
     expires_in: 3600
   }
   ↓
Step 5: Server forwards token to client
   ↓
Step 6: Client uses token for WebSocket connection
```

### WebSocket Communication

#### Connection Setup

```typescript
const client = new HumeClient({ accessToken });

const socket = await client.empathicVoice.chat.connect({
  config: {
    systemPrompt: scenario.systemPrompt,
    voice: { provider: 'HUME_AI', name: 'KORA' },
    language: { code: 'en' }
  }
});
```

#### Event Handlers

| Event | Description | Data |
|-------|-------------|------|
| `audio` | AI voice audio chunk | `{ data: base64String }` |
| `audio_end` | AI finished speaking | - |
| `user_message` | User speech transcript | `{ message: { content: string } }` |
| `assistant_message` | AI response transcript | `{ message: { content: string } }` |
| `error` | Connection or processing error | `{ message: string }` |

### Audio Processing

#### Microphone Input

```
Browser Microphone
   ↓
getUserMedia()
   ↓
AudioContext (16kHz sample rate)
   ↓
ScriptProcessor Node
   ↓
Float32Array → Int16Array conversion
   ↓
Base64 encoding
   ↓
WebSocket.sendAudio(base64)
   ↓
Hume EVI
```

#### Audio Output

```
Hume EVI
   ↓
WebSocket receives audio event
   ↓
Base64 string
   ↓
atob() decode to binary
   ↓
ArrayBuffer
   ↓
AudioContext.decodeAudioData()
   ↓
AudioBufferSourceNode
   ↓
Speaker output
```

## State Management

### Component State (React useState)

```typescript
// ScenarioInterface.tsx
const [messages, setMessages] = useState<Message[]>([]);
const [sessionStarted, setSessionStarted] = useState(false);

// useHumeEVI.ts
const [isConnected, setIsConnected] = useState(false);
const [isConnecting, setIsConnecting] = useState(false);
const [isSpeaking, setIsSpeaking] = useState(false);
const [isListening, setIsListening] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### Ref Management (React useRef)

```typescript
// Persistent references (don't trigger re-renders)
const clientRef = useRef<HumeClient | null>(null);
const socketRef = useRef<any>(null);
const audioContextRef = useRef<AudioContext | null>(null);
const mediaStreamRef = useRef<MediaStream | null>(null);
```

## Data Flow

### Starting a Conversation

```
1. User clicks "Start Scenario"
   ↓
2. ScenarioInterface.handleStartSession()
   ↓
3. useHumeEVI.connect()
   ↓
4. Fetch /api/hume-auth
   ↓
5. Initialize HumeClient
   ↓
6. Establish WebSocket
   ↓
7. Set up event listeners
   ↓
8. Update state: isConnected = true
   ↓
9. UI shows microphone button enabled
```

### User Speaks

```
1. User clicks microphone button
   ↓
2. useHumeEVI.startListening()
   ↓
3. Request microphone permission
   ↓
4. Create AudioContext and MediaStream
   ↓
5. Process audio chunks
   ↓
6. Convert Float32 → Int16 → Base64
   ↓
7. socket.sendAudio(base64)
   ↓
8. Hume processes audio
   ↓
9. Receive 'user_message' event
   ↓
10. Update transcript with user's words
```

### AI Responds

```
1. Hume's LLM generates response
   ↓
2. Hume converts text to speech
   ↓
3. Receive 'assistant_message' event
   ↓
4. Update transcript with AI's words
   ↓
5. Receive 'audio' events (chunks)
   ↓
6. Decode base64 → ArrayBuffer
   ↓
7. AudioContext.decodeAudioData()
   ↓
8. Play through speakers
   ↓
9. Receive 'audio_end' event
   ↓
10. Update state: isSpeaking = false
```

## Performance Considerations

### Optimizations

1. **Audio Chunking**: Process audio in 4096-sample chunks for balance between latency and efficiency
2. **Base64 Encoding**: Efficient for WebSocket transmission
3. **State Batching**: React automatically batches state updates
4. **Event-Driven**: Non-blocking WebSocket communication
5. **Static Generation**: Scenario pages can be pre-rendered

### Scalability

- **Stateless API Routes**: Can scale horizontally
- **Client-Side Processing**: Audio processing happens in browser
- **CDN-Ready**: Static assets served via Vercel Edge Network
- **WebSocket Limits**: Hume handles connection management

## Security Architecture

### API Key Protection

```
❌ NEVER expose in browser
   HUME_API_KEY
   HUME_SECRET_KEY

✅ Server-side only
   - Stored in .env.local
   - Accessed via process.env
   - Used in API routes only

✅ Client uses temporary tokens
   - Access tokens have expiration
   - Scoped to specific session
   - Can be revoked
```

### Best Practices

1. **Environment Variables**: All secrets in `.env.local`
2. **HTTPS Only**: Required for microphone access
3. **Token Expiration**: Access tokens expire (typical: 1 hour)
4. **Input Validation**: Validate scenario IDs and user input
5. **Error Handling**: Never expose internal errors to client

## Deployment Architecture

### Vercel Deployment

```
Git Push
   ↓
Vercel Build
   ↓
Next.js Build
   - Static pages generated
   - API routes bundled
   - Assets optimized
   ↓
Deploy to Edge Network
   - Functions: Regional (serverless)
   - Static Assets: Global CDN
   - Environment Variables: Encrypted
   ↓
Production URL
```

### Environment Variables in Production

1. Set in Vercel dashboard
2. Encrypted at rest
3. Injected at runtime
4. Separate per environment (dev/preview/prod)

## Future Enhancements

### Potential Additions

1. **User Authentication**: NextAuth.js integration
2. **Database**: Store conversation history (Vercel Postgres)
3. **Analytics**: Track user progress and common patterns
4. **Feedback System**: Rate conversations, get AI suggestions
5. **Admin Dashboard**: Manage scenarios, view analytics
6. **Multi-language**: Expand beyond English
7. **Mobile App**: React Native with same backend

### Scalability Paths

1. **Caching**: Redis for session data
2. **Queue System**: Handle high concurrent users
3. **Monitoring**: Vercel Analytics, Sentry for errors
4. **Load Testing**: Ensure performance at scale
5. **Cost Optimization**: Monitor Hume API usage

## Conclusion

This architecture provides:
- ✅ Clean separation of concerns
- ✅ Type-safe TypeScript throughout
- ✅ Secure API key management
- ✅ Scalable serverless design
- ✅ Real-time voice communication
- ✅ Excellent developer experience

The modular design makes it easy to add new scenarios, customize behavior, and extend functionality as needed.

