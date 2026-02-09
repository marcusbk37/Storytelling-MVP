# Understanding Hume AI for This Project

Since you mentioned you've never used Hume before, this guide explains everything you need to know about how Hume AI powers this application.

## 🤖 What is Hume AI?

Hume AI is an **emotion AI platform** that specializes in understanding and expressing human emotions. Their flagship product for voice applications is called **EVI (Empathic Voice Interface)**.

### What Makes Hume Special?

Unlike traditional AI voice systems, Hume:
- ✅ Detects emotional tone in user's voice
- ✅ Responds with appropriate emotional expression
- ✅ Maintains natural conversational flow
- ✅ Handles the entire voice pipeline in one service

## 🎯 What is EVI (Empathic Voice Interface)?

**EVI is an all-in-one conversational AI** that handles everything from voice input to voice output.

### Traditional Approach (Complex)

```
Your App
   ↓
1. Google Speech-to-Text (transcribe user)
   ↓
2. OpenAI GPT-4 (generate response)
   ↓
3. ElevenLabs (convert to speech)
   ↓
User hears response

Problems:
❌ Multiple API integrations
❌ Complex orchestration
❌ Latency from multiple services
❌ No emotional continuity
```

### Hume EVI Approach (Simple)

```
Your App
   ↓
Hume EVI (does everything)
   • Speech-to-Text
   • Emotion Detection
   • LLM Processing
   • Emotional Response
   • Text-to-Speech
   ↓
User hears emotionally-aware response

Benefits:
✅ Single API integration
✅ One WebSocket connection
✅ Low latency
✅ Consistent emotional intelligence
```

## 🔑 Getting Your API Keys

### Step-by-Step

1. **Visit**: [https://platform.hume.ai/](https://platform.hume.ai/)

2. **Sign Up**:
   - Click "Sign Up" or "Get Started"
   - Use email or Google/GitHub authentication
   - Verify your email if required

3. **Navigate to API Keys**:
   - Once logged in, go to your dashboard
   - Look for "API Keys" or "Settings" in the navigation
   - You might see it as "Credentials" or "Developer"

4. **Create New API Key**:
   - Click "Create New API Key" or similar button
   - Give it a name (e.g., "Manager Training App")
   - You'll receive TWO keys:

   **API Key** (Client ID):
   - Starts with something like `api_...`
   - This identifies your application
   - Example: `api_abc123xyz789`

   **Secret Key**:
   - Long alphanumeric string
   - This authenticates your requests
   - Example: `sk_abc123xyz789def456ghi789...`

5. **Save Your Keys**:
   - ⚠️ **CRITICAL**: Copy both keys immediately!
   - Store them securely (password manager recommended)
   - The Secret Key may only show once!
   - You'll need both for the `.env.local` file

### Free Tier / Pricing

- **Free Tier**: Usually includes development credits
- **Paid Plans**: Check [hume.ai/pricing](https://www.hume.ai/pricing)
- **Billing**: Typically charged per minute of audio processed
- **Development**: Free tier usually sufficient for testing

## 🏗️ How EVI Works in This Project

### The Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ YOUR BROWSER                                                 │
│                                                              │
│  1. User speaks into microphone                             │
│     ↓                                                        │
│  2. Browser captures audio                                  │
│     ↓                                                        │
│  3. useHumeEVI hook processes audio                        │
│     • Converts to Int16Array                                │
│     • Encodes as Base64                                     │
│     ↓                                                        │
└──────┼───────────────────────────────────────────────────────┘
       │
       │ WebSocket (wss://)
       ↓
┌─────────────────────────────────────────────────────────────┐
│ HUME EVI CLOUD SERVICE                                       │
│                                                              │
│  4. Receives audio stream                                   │
│     ↓                                                        │
│  5. Speech-to-Text + Emotion Detection                      │
│     • Transcribes words                                     │
│     • Analyzes: tone, pitch, pace                           │
│     • Detects: frustration, confidence, hesitation, etc.    │
│     ↓                                                        │
│  6. LLM Processing (Empathic Language Model)                │
│     • Considers transcript                                  │
│     • Considers detected emotions                           │
│     • Considers conversation history                        │
│     • Considers system prompt (your scenario)               │
│     • Generates emotionally appropriate response            │
│     ↓                                                        │
│  7. Emotional Text-to-Speech                                │
│     • Converts response to speech                           │
│     • Adds emotional expression to voice                    │
│     • Matches appropriate tone (defensive, open, etc.)      │
│     ↓                                                        │
└──────┼───────────────────────────────────────────────────────┘
       │
       │ WebSocket (wss://)
       ↓
┌─────────────────────────────────────────────────────────────┐
│ YOUR BROWSER                                                 │
│                                                              │
│  8. Receives audio response (Base64)                        │
│     ↓                                                        │
│  9. Decodes and plays through speakers                      │
│     ↓                                                        │
│  10. User hears AI response                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
Step 1: Your Browser
   ↓
   POST /api/hume-auth
   Body: { scenarioId: "difficult-performance-review" }
   
Step 2: Your Next.js Server
   ↓
   POST https://api.hume.ai/oauth2-cc/token
   Body: {
     grant_type: 'client_credentials',
     client_id: YOUR_API_KEY,
     client_secret: YOUR_SECRET_KEY
   }
   
Step 3: Hume Server
   ↓
   Returns: {
     access_token: "eyJ...",
     expires_in: 3600
   }
   
Step 4: Your Next.js Server
   ↓
   Returns token to browser
   
Step 5: Your Browser
   ↓
   Uses token to connect WebSocket:
   wss://api.hume.ai/v0/evi/chat
```

**Why This Flow?**
- 🔒 API keys never exposed to browser
- 🔑 Access tokens are temporary (expire after ~1 hour)
- ✅ More secure than client-side keys
- 🔄 Tokens can be refreshed without exposing secrets

## 📝 System Prompts - The Magic

The **system prompt** is THE MOST IMPORTANT part of your Hume integration. It defines how the AI behaves.

### Anatomy of a Good System Prompt

```typescript
systemPrompt: `
  You are playing the role of [CHARACTER NAME], [DESCRIPTION].
  
  CHARACTER TRAITS:
  - List personality traits
  - How they react to situations
  - What makes them defensive/open
  
  BACKGROUND:
  - Their history
  - Current situation
  - Why they're in this conversation
  
  CONVERSATION GUIDELINES:
  - How to respond to different approaches
  - When to open up or stay defensive
  - What information to reveal when
  
  EMOTIONAL BEHAVIOR:
  - Start [emotion]
  - Become [emotion] if [condition]
  - Show [emotion] when [trigger]
`
```

### Example from Our Project

```typescript
systemPrompt: `You are playing the role of Alex, a software engineer 
who has been underperforming for the past quarter.

CHARACTER TRAITS:
- You're defensive and tend to make excuses initially
- You have some personal challenges that have affected your work
- You care about your job but feel overwhelmed
- You respond better to empathetic approaches than harsh criticism

YOUR BACKSTORY:
- You've been with the company for 2 years
- Previously a strong performer
- Recently dealing with caring for a sick parent

CONVERSATION GUIDELINES:
- Start defensive or dismissive when criticized
- Gradually open up if treated with respect and empathy
- Show willingness to improve if a concrete plan is offered

Keep responses natural and emotionally realistic.`
```

### System Prompt Best Practices

✅ **DO**:
- Be specific about emotions and when to show them
- Give clear behavioral guidelines
- Include backstory for authenticity
- Specify how to react to different approaches
- Keep it conversational (write like you're briefing an actor)

❌ **DON'T**:
- Make it too rigid or scripted
- Include actual dialog examples (let AI be creative)
- Forget emotional dynamics
- Make it too short (needs context to be realistic)

## 🎙️ Voice Options

Hume provides several voice options:

| Voice Name | Gender | Personality |
|------------|--------|-------------|
| **KORA** | Female | Warm and empathetic |
| **ITO** | Male | Professional and calm |
| **DACHER** | Male | Friendly and engaging |
| **AURA** | Female | Confident and clear |

### Changing the Voice

In `lib/hume-config.ts`:

```typescript
export const DEFAULT_EVI_CONFIG = {
  voice: 'KORA', // Change to: ITO, DACHER, or AURA
  language: 'en',
};
```

Or in the WebSocket connection config:

```typescript
voice: {
  provider: 'HUME_AI',
  name: 'ITO', // Male professional voice
}
```

### Voice Selection Tips

- **KORA**: Best for empathetic, supportive roles
- **ITO**: Good for authority figures, calm professionals
- **DACHER**: Friendly peer conversations
- **AURA**: Confident, direct communication

## 🔊 Audio Technical Details

### Audio Format Requirements

Hume EVI expects:
- **Sample Rate**: 16,000 Hz (16 kHz)
- **Channels**: Mono (1 channel)
- **Bit Depth**: 16-bit
- **Encoding**: PCM (converted to Base64 for transmission)

### Our Implementation

```typescript
// 1. Create AudioContext with correct sample rate
const audioContext = new AudioContext({ sampleRate: 16000 });

// 2. Process audio in chunks
const processor = audioContext.createScriptProcessor(4096, 1, 1);

processor.onaudioprocess = (e) => {
  // 3. Get audio data (Float32Array)
  const inputData = e.inputBuffer.getChannelData(0);
  
  // 4. Convert to Int16Array
  const int16Data = new Int16Array(inputData.length);
  for (let i = 0; i < inputData.length; i++) {
    int16Data[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
  }
  
  // 5. Convert to Base64
  const base64 = btoa(String.fromCharCode(...new Uint8Array(int16Data.buffer)));
  
  // 6. Send to Hume
  socket.sendAudio(base64);
};
```

**Why these conversions?**
- Float32: Browser's native audio format
- Int16: More efficient for transmission
- Base64: Text encoding for WebSocket

## 📊 WebSocket Events

### Events You Can Listen For

| Event | When It Fires | Data Received |
|-------|---------------|---------------|
| `audio` | AI is speaking (chunks) | `{ data: base64String }` |
| `audio_end` | AI finished speaking | - |
| `user_message` | User's speech transcribed | `{ message: { content: string } }` |
| `assistant_message` | AI's response text | `{ message: { content: string } }` |
| `error` | Something went wrong | `{ message: string }` |

### Example Event Handling

```typescript
// Set up listeners
socket.on('audio', (audioData) => {
  console.log('AI speaking:', audioData.data.substring(0, 50) + '...');
  playAudioData(audioData.data);
  setIsSpeaking(true);
});

socket.on('audio_end', () => {
  console.log('AI finished speaking');
  setIsSpeaking(false);
});

socket.on('user_message', (message) => {
  console.log('User said:', message.message.content);
  addToTranscript(message.message.content, true);
});

socket.on('assistant_message', (message) => {
  console.log('AI said:', message.message.content);
  addToTranscript(message.message.content, false);
});

socket.on('error', (err) => {
  console.error('Error:', err);
  setError(err.message);
});
```

## 💡 Advanced Features

### Emotion Metadata

Hume provides emotion data with messages:

```typescript
socket.on('user_message', (message) => {
  console.log('User said:', message.message.content);
  console.log('Detected emotions:', message.emotions);
  // emotions might include: {
  //   frustration: 0.7,
  //   confidence: 0.3,
  //   anxiety: 0.5
  // }
});
```

You could use this to:
- Provide feedback to users
- Adapt training difficulty
- Track emotional progress
- Display emotion indicators in UI

### Conversation Context

EVI maintains context across the conversation:

```typescript
// First message
User: "Hi Alex, how are you?"
Alex: "I'm fine..." [defensive tone]

// Later in conversation
User: "I want to help you succeed"
Alex: "Actually, I've been dealing with some personal stuff..." [opens up]
```

The AI remembers:
- What was said earlier
- Emotional trajectory
- Whether trust was built
- Topics discussed

## 🐛 Common Issues & Solutions

### 1. "Failed to authenticate with Hume"

**Problem**: Can't get access token

**Causes**:
- Wrong API keys
- Keys not set in environment
- Typo in `.env.local`
- Keys expired or revoked

**Solutions**:
```bash
# Check your .env.local file
cat .env.local

# Should show:
# HUME_API_KEY=api_...
# HUME_SECRET_KEY=sk_...

# No quotes, no extra spaces!
```

### 2. WebSocket Won't Connect

**Problem**: Connection fails after auth succeeds

**Causes**:
- Firewall blocking WebSocket
- Network issues
- Hume service temporarily down

**Solutions**:
- Check browser console for errors
- Try different network
- Check [Hume status page](https://status.hume.ai/)

### 3. Audio Not Transmitting

**Problem**: Microphone works but Hume doesn't respond

**Causes**:
- Wrong audio format
- Not calling `sendAudio()` correctly
- WebSocket disconnected

**Debug**:
```typescript
// Add logging
socket.on('user_message', (msg) => {
  console.log('✅ Hume received:', msg.message.content);
});

// If you don't see this log, audio isn't reaching Hume
```

### 4. No Audio Playback

**Problem**: Get response but can't hear it

**Causes**:
- Browser audio blocked
- Volume muted
- Audio decode error

**Solutions**:
- Check browser permissions
- Check system volume
- Look for console errors
- Try: `new AudioContext()` in browser console

## 📚 Additional Resources

### Official Hume Docs
- [EVI Overview](https://dev.hume.ai/docs/empathic-voice-interface-evi/overview)
- [API Reference](https://dev.hume.ai/reference)
- [SDK Documentation](https://www.npmjs.com/package/hume)

### Best Practices
- [System Prompt Guide](https://dev.hume.ai/docs/empathic-voice-interface-evi/configuration)
- [Voice Customization](https://dev.hume.ai/docs/empathic-voice-interface-evi/voices)

### Community
- [Hume Discord](https://discord.gg/hume) (if available)
- [Support Email](mailto:support@hume.ai)

## 🎓 Learning Path

### Day 1: Basics
1. ✅ Get API keys
2. ✅ Run the app
3. ✅ Have first conversation
4. ✅ Review system prompt

### Day 2: Customization
1. Change voice
2. Modify system prompt
3. Observe behavior changes
4. Test different approaches

### Day 3: Development
1. Read `useHumeEVI.ts` code
2. Understand WebSocket flow
3. Add console logs to see events
4. Experiment with custom features

### Week 1: Mastery
1. Create new scenario
2. Add emotion indicators
3. Implement conversation analytics
4. Deploy to production

## 🎯 Key Takeaways

1. **Hume EVI = Complete Solution**
   - Don't need separate STT, LLM, TTS
   - One WebSocket handles everything

2. **System Prompt is Critical**
   - Defines entire AI behavior
   - Worth spending time to perfect

3. **Emotions are the Differentiator**
   - Not just words, but HOW they're said
   - Makes conversations feel real

4. **Simple Integration**
   - Authenticate → Connect → Send Audio → Receive Audio
   - That's it!

5. **Security First**
   - API keys stay on server
   - Tokens for client connections
   - HTTPS required in production

## ✅ You're Now a Hume Expert!

You understand:
- ✅ What Hume EVI does
- ✅ How to get API keys
- ✅ How authentication works
- ✅ How audio flows through the system
- ✅ How to write system prompts
- ✅ How to customize voices
- ✅ How to debug issues

**Now go build amazing conversational experiences!** 🚀

---

Questions? Everything is implemented in this project - just explore the code!

