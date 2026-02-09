# 👋 START HERE

Welcome to your Manager Training Platform! This document will guide you through getting started.

## 🎯 What You Have

A **complete, production-ready web application** that uses AI voice technology to train managers through realistic conversation simulations.

**Current scenario**: Difficult Performance Review

## 🚀 Quick Start (5 Minutes)

### Step 1: Get Hume AI Keys (2 min)

1. Visit **[https://platform.hume.ai/](https://platform.hume.ai/)**
2. Sign up for a free account
3. Go to **API Keys** section
4. Create new key and copy both:
   - API Key
   - Secret Key

### Step 2: Setup (2 min)

```bash
# Install dependencies
npm install

# Create environment file
# (Or just rename .env.local.example to .env.local)
echo "HUME_API_KEY=your_key_here" > .env.local
echo "HUME_SECRET_KEY=your_secret_here" >> .env.local
```

Edit `.env.local` and paste your actual keys!

### Step 3: Run (1 min)

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Step 4: Test

1. Click on **"Difficult Performance Review"**
2. Click **"Start Scenario"**
3. Click the **microphone button** 🎤
4. Say: *"Hi Alex, thanks for meeting with me today"*
5. Listen to the AI respond!

## 📚 Documentation Guide

We have extensive documentation. Here's what to read based on your needs:

### 🏃‍♂️ I Just Want to Use It
→ Read: **[QUICKSTART.md](./QUICKSTART.md)**
- Step-by-step setup
- Troubleshooting
- First conversation tips

### 🤔 I've Never Used Hume Before
→ Read: **[HUME_GUIDE.md](./HUME_GUIDE.md)**
- What is Hume AI?
- How EVI works
- System prompts explained
- Audio technical details
- Common issues

### 📖 I Want to Understand the Code
→ Read: **[ARCHITECTURE.md](./ARCHITECTURE.md)**
- System architecture
- Component breakdown
- Data flow diagrams
- Security architecture
- Code organization

### 🚢 I Want to Deploy
→ Read: **[DEPLOYMENT.md](./DEPLOYMENT.md)**
- Vercel deployment guide
- Environment variable setup
- Post-deployment checklist
- Monitoring and maintenance

### 📋 I Want an Overview
→ Read: **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)**
- High-level overview
- What's included
- Technology choices
- Cost estimation
- Next steps

### 🔧 I Want Full Details
→ Read: **[README.md](./README.md)**
- Complete documentation
- Feature list
- File structure
- Customization guide
- Adding scenarios

## 🗂️ Project Structure

```
Your Project
│
├── 📄 START_HERE.md ← You are here!
├── 📄 QUICKSTART.md ← Next: Quick setup guide
├── 📄 HUME_GUIDE.md ← Learn about Hume AI
├── 📄 README.md ← Main documentation
├── 📄 ARCHITECTURE.md ← Technical deep dive
├── 📄 DEPLOYMENT.md ← Go to production
├── 📄 PROJECT_SUMMARY.md ← Overview
│
├── 📁 app/ ← Next.js pages and API routes
│   ├── page.tsx ← Home page
│   ├── scenarios/[id]/page.tsx ← Scenario pages
│   └── api/ ← Backend endpoints
│
├── 📁 components/ ← React components
│   └── ScenarioInterface.tsx ← Main UI
│
├── 📁 hooks/ ← Custom React hooks
│   └── useHumeEVI.ts ← Hume integration
│
└── 📁 lib/ ← Utilities and config
    ├── scenarios.ts ← Add scenarios here!
    └── hume-config.ts ← Hume settings
```

## ✅ Checklist: Your First Session

- [ ] Installed dependencies (`npm install`)
- [ ] Got Hume API keys from platform.hume.ai
- [ ] Created `.env.local` with your keys
- [ ] Started dev server (`npm run dev`)
- [ ] Opened http://localhost:3000
- [ ] Selected a scenario
- [ ] Clicked "Start Scenario"
- [ ] Granted microphone permission
- [ ] Had a conversation with the AI
- [ ] Saw transcript update in real-time

## 🎓 Learning Path

### Beginner (Day 1)
1. ✅ Get app running
2. ✅ Have first conversation
3. ✅ Read QUICKSTART.md
4. ✅ Read HUME_GUIDE.md

### Intermediate (Week 1)
1. Understand code structure
2. Read ARCHITECTURE.md
3. Modify system prompt
4. Change voice
5. Customize UI colors

### Advanced (Week 2)
1. Add new scenario
2. Add custom features
3. Deploy to Vercel
4. Share with team

## 🆘 Having Issues?

### App won't start
```bash
# Check Node version (need 18+)
node -v

# Clear and reinstall
rm -rf node_modules
npm install
```

### Can't authenticate with Hume
- Check `.env.local` exists in root directory
- Verify no typos in keys
- No quotes around keys
- No spaces before/after keys

### Microphone not working
- Check browser permission prompt
- Try Chrome (works best)
- Ensure HTTPS in production
- Check System Preferences → Microphone

### Still stuck?
1. Check browser console (F12)
2. Check terminal output
3. Review QUICKSTART.md troubleshooting section
4. Review HUME_GUIDE.md common issues

## 🎯 What to Do Next

### Immediate Actions
1. ✅ Complete the checklist above
2. ✅ Have 2-3 practice conversations
3. ✅ Review the transcript accuracy
4. ✅ Try different conversation approaches

### Customization
1. **Change AI Voice**: Edit `lib/hume-config.ts`
2. **Modify UI Colors**: Edit Tailwind classes in components
3. **Update Scenario**: Edit `lib/scenarios.ts`
4. **Add New Scenario**: Copy template in `lib/scenarios.ts`

### Deployment
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

Full instructions in [DEPLOYMENT.md](./DEPLOYMENT.md)

## 💡 Pro Tips

1. **System Prompt is Key**: Spend time perfecting the AI character description in `lib/scenarios.ts`

2. **Test Different Approaches**: Try being harsh vs. empathetic in the performance review - the AI will respond differently!

3. **Watch the Console**: Open browser DevTools (F12) to see WebSocket events and understand the flow

4. **Voice Selection Matters**: Try different voices (KORA, ITO, DACHER, AURA) to find the best fit

5. **Mobile Works Too**: The app is responsive and works on phones/tablets

## 🎉 Success Indicators

You'll know it's working when:
- ✅ "Start Scenario" connects without errors
- ✅ Microphone button shows red when active
- ✅ Transcript appears as you speak
- ✅ AI voice plays through speakers
- ✅ Conversation feels natural
- ✅ AI responds appropriately to your tone

## 📞 Support Resources

- **Quick Issues**: [QUICKSTART.md](./QUICKSTART.md) → Troubleshooting section
- **Hume Issues**: [HUME_GUIDE.md](./HUME_GUIDE.md) → Common Issues section
- **Code Questions**: Comments throughout the code explain everything
- **Hume Docs**: [dev.hume.ai](https://dev.hume.ai/)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

## 🌟 This is Production-Ready!

This isn't a prototype or proof-of-concept. This is:
- ✅ Fully functional
- ✅ Type-safe (TypeScript)
- ✅ Secure (API keys protected)
- ✅ Well-documented
- ✅ Ready to deploy
- ✅ Ready to customize
- ✅ Ready to scale

## 🚀 Ready to Start?

### Option 1: Quick Start (Fastest)
→ Go to **[QUICKSTART.md](./QUICKSTART.md)**

### Option 2: Learn Hume First
→ Go to **[HUME_GUIDE.md](./HUME_GUIDE.md)**

### Option 3: Understand Architecture
→ Go to **[ARCHITECTURE.md](./ARCHITECTURE.md)**

---

## ⚡ TL;DR (Too Long; Didn't Read)

```bash
# 1. Install
npm install

# 2. Get keys from https://platform.hume.ai/

# 3. Create .env.local
echo "HUME_API_KEY=your_key" > .env.local
echo "HUME_SECRET_KEY=your_secret" >> .env.local

# 4. Run
npm run dev

# 5. Visit http://localhost:3000 and start talking!
```

---

**Welcome aboard! Let's train some managers!** 🎯

*Questions? Everything is thoroughly explained in the documentation files. Happy coding!* 🚀

