# Quick Start Guide

Get your Manager Training Platform running in 5 minutes!

## Prerequisites Check

- [ ] Node.js 18 or higher installed
- [ ] npm or yarn package manager
- [ ] Modern web browser (Chrome, Firefox, or Edge)
- [ ] Microphone access

## Step-by-Step Setup

### 1️⃣ Get Hume AI API Keys (2 minutes)

1. Visit [https://platform.hume.ai/](https://platform.hume.ai/)
2. Sign up for a free account
3. Navigate to the **API Keys** section
4. Click **Create New API Key**
5. Copy both:
   - API Key (starts with `api_...`)
   - Secret Key (long alphanumeric string)

💡 **Tip**: Keep these keys secure! You'll need them in the next step.

### 2️⃣ Install Dependencies (1 minute)

```bash
# Navigate to project directory
cd "Hume Speech to Speech MVP Scenario"

# Install all dependencies
npm install
```

This will install:
- Next.js framework
- React libraries
- Hume SDK
- Tailwind CSS
- TypeScript dependencies

### 3️⃣ Configure Environment (30 seconds)

Create a file named `.env.local` in the root directory:

```bash
# Copy the example file
cp .env.local.example .env.local
```

Edit `.env.local` and add your Hume keys:

```
HUME_API_KEY=api_your_actual_key_here
HUME_SECRET_KEY=your_actual_secret_key_here
```

⚠️ **Important**: Replace the placeholder values with your actual keys!

### 4️⃣ Start Development Server (30 seconds)

```bash
npm run dev
```

You should see:

```
▲ Next.js 14.2.13
- Local:        http://localhost:3000
- Ready in 2.3s
```

### 5️⃣ Test the Application (1 minute)

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. You should see the **Manager Training Scenarios** home page
3. Click on **Difficult Performance Review** scenario
4. Review the objectives and tips
5. Click **Start Scenario**
6. When connected, click the **microphone button** 🎤
7. Grant microphone permission when prompted
8. Start speaking!

## First Conversation Tips

Try starting with:

> "Hi Alex, thanks for meeting with me today. How are you doing?"

The AI will respond as Alex, the underperforming employee. Practice your management skills!

## Troubleshooting

### "Failed to authenticate with Hume"

**Problem**: Can't connect to Hume AI

**Solutions**:
- Verify your API keys are correct in `.env.local`
- Check for extra spaces or quotes around keys
- Ensure keys are active in Hume dashboard
- Restart the dev server (`Ctrl+C` then `npm run dev`)

### Microphone not working

**Problem**: Can't capture audio

**Solutions**:
- Click the browser permission prompt to allow microphone
- Check System Preferences → Security & Privacy → Microphone
- Try a different browser (Chrome works best)
- Ensure no other app is using the microphone

### No audio playback

**Problem**: Can't hear AI responses

**Solutions**:
- Check your computer volume
- Try headphones to isolate audio
- Check browser audio settings
- Look for console errors (press F12)

### Page won't load / shows 404

**Problem**: Blank page or error

**Solutions**:
- Ensure dev server is running (`npm run dev`)
- Clear browser cache and refresh
- Check terminal for build errors
- Try accessing `http://localhost:3000` directly

### Dependencies fail to install

**Problem**: npm install errors

**Solutions**:
- Update Node.js: `node -v` should show 18+
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and try again
- Use `npm install --legacy-peer-deps` if needed

## Next Steps

### Explore the Code

- **`lib/scenarios.ts`**: Add new training scenarios
- **`components/ScenarioInterface.tsx`**: Customize the UI
- **`hooks/useHumeEVI.ts`**: Understand Hume integration
- **`app/api/hume-auth/route.ts`**: See authentication flow

### Customize Your Instance

1. **Change AI Voice**: Edit `lib/hume-config.ts`
   ```typescript
   voice: 'ITO', // Try: KORA, ITO, DACHER, AURA
   ```

2. **Add New Scenarios**: Copy the template in `lib/scenarios.ts`

3. **Customize Styling**: Edit Tailwind classes in components

4. **Add Features**: 
   - User authentication
   - Progress tracking
   - Session recording
   - Feedback collection

### Deploy to Production

Ready to go live? See deployment instructions:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Follow prompts and add your environment variables in the Vercel dashboard.

## Resources

- 📖 [Full README](./README.md) - Comprehensive documentation
- 🏗️ [Architecture Guide](./ARCHITECTURE.md) - Technical deep dive
- 🔗 [Hume AI Docs](https://dev.hume.ai/) - API reference
- 💬 [Next.js Docs](https://nextjs.org/docs) - Framework guide

## Support

Having issues? Check:

1. **Terminal output**: Look for error messages
2. **Browser console** (F12): Check for JavaScript errors
3. **Network tab** (F12): Verify API calls are working
4. **.env.local file**: Confirm keys are set correctly

## Success! 🎉

You should now have:
- ✅ Running development server
- ✅ Connected to Hume AI
- ✅ Working conversation interface
- ✅ Functional microphone input
- ✅ AI voice responses

**Ready to train some managers!** Practice the difficult performance review scenario and explore the code to understand how it all works together.

---

Happy coding! 🚀

