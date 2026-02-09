# Deployment Guide

Step-by-step guide to deploying your Manager Training Platform to production.

## Deployment Options

This application is optimized for **Vercel** (recommended), but can also be deployed to other Next.js-compatible platforms.

## Option 1: Vercel (Recommended)

### Why Vercel?

- ✅ Built specifically for Next.js
- ✅ Zero-config deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions
- ✅ Free tier available

### Prerequisites

- GitHub, GitLab, or Bitbucket account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Hume AI API keys

### Method A: Deploy via Git (Recommended)

#### 1. Push to Git Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Manager Training Platform"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/manager-training.git

# Push
git push -u origin main
```

⚠️ **Important**: Ensure `.env.local` is in `.gitignore` (it already is by default)

#### 2. Import Project in Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Select **"Import Git Repository"**
4. Choose your repository
5. Vercel will auto-detect Next.js settings ✅

#### 3. Configure Environment Variables

In the Vercel project setup:

1. Expand **"Environment Variables"** section
2. Add the following:

| Name | Value |
|------|-------|
| `HUME_API_KEY` | Your Hume API key |
| `HUME_SECRET_KEY` | Your Hume secret key |

3. Select which environments (Production, Preview, Development)
   - ✅ Production (required)
   - ✅ Preview (recommended)
   - ⬜ Development (optional)

#### 4. Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Visit your production URL!

#### 5. Set Up Automatic Deployments

Vercel automatically:
- Deploys `main` branch → Production
- Deploys other branches → Preview URLs
- Deploys pull requests → Preview URLs

Every git push triggers a new deployment! 🚀

### Method B: Deploy via Vercel CLI

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Login

```bash
vercel login
```

#### 3. Deploy

```bash
# From project directory
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - What's your project name? manager-training
# - In which directory is your code? ./
# - Override settings? No
```

#### 4. Add Environment Variables

```bash
# Add production secrets
vercel env add HUME_API_KEY production
# (paste your API key when prompted)

vercel env add HUME_SECRET_KEY production
# (paste your secret key when prompted)
```

#### 5. Deploy to Production

```bash
vercel --prod
```

Your app is live! 🎉

### Post-Deployment Configuration

#### Custom Domain (Optional)

1. Go to project settings in Vercel
2. Navigate to **Domains**
3. Add your custom domain
4. Update DNS records as instructed
5. Vercel handles SSL automatically

#### Environment Variables Updates

To update environment variables:

1. Go to project settings
2. Navigate to **Environment Variables**
3. Edit or add variables
4. Click **Save**
5. **Important**: Redeploy for changes to take effect

#### Monitoring and Logs

- **Analytics**: Vercel dashboard shows traffic and performance
- **Logs**: View function logs in real-time
- **Errors**: Check "Functions" tab for serverless function errors

## Option 2: Other Platforms

### Deploy to Netlify

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Build the app: `npm run build`
3. Deploy: `netlify deploy --prod`
4. Add environment variables in Netlify dashboard

### Deploy to Railway

1. Visit [railway.app](https://railway.app)
2. Create new project from GitHub
3. Railway auto-detects Next.js
4. Add environment variables
5. Deploy

### Deploy to AWS Amplify

1. Visit [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Connect repository
3. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   ```
4. Add environment variables
5. Deploy

## Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] Home page displays scenarios
- [ ] Can navigate to scenario detail page
- [ ] "Start Scenario" button works
- [ ] Microphone permission requested
- [ ] Can establish connection to Hume
- [ ] Audio input captures correctly
- [ ] AI responds with audio
- [ ] Transcript displays both sides
- [ ] No console errors
- [ ] HTTPS working (required for microphone)

## Testing in Production

### Manual Testing

1. Visit your production URL
2. Test complete conversation flow:
   - Browse scenarios
   - Select scenario
   - Start session
   - Speak into microphone
   - Verify AI response
   - Check transcript accuracy
   - End session

### Load Testing (Optional)

For production readiness:

```bash
# Install Artillery
npm install -g artillery

# Create test config (artillery.yml)
artillery quick --count 10 --num 50 https://your-app.vercel.app
```

## Monitoring and Maintenance

### Vercel Analytics

Enable in project settings:
- **Web Analytics**: Track page views, performance
- **Speed Insights**: Monitor Core Web Vitals

### Error Tracking (Optional)

Integrate Sentry for error monitoring:

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

Add to environment variables:
- `SENTRY_DSN`
- `SENTRY_AUTH_TOKEN`

### Uptime Monitoring (Optional)

Use services like:
- [UptimeRobot](https://uptimerobot.com/) (free)
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

## Cost Considerations

### Vercel Pricing

**Hobby Plan (Free)**:
- ✅ Unlimited projects
- ✅ 100 GB bandwidth
- ✅ Serverless function execution
- ⚠️ Limited to personal use

**Pro Plan ($20/month)**:
- ✅ Commercial use
- ✅ 1TB bandwidth
- ✅ Advanced analytics
- ✅ Password protection

### Hume AI Pricing

Check [Hume's pricing page](https://www.hume.ai/pricing) for:
- Free tier limits
- Per-minute audio processing costs
- Volume discounts

💡 **Tip**: Monitor usage in both platforms to avoid surprises!

## Scaling Considerations

### For High Traffic

1. **Optimize Images**: Use Next.js `<Image>` component
2. **Caching**: Implement ISR (Incremental Static Regeneration)
3. **CDN**: Leverage Vercel's Edge Network
4. **Database**: Add Vercel Postgres for user data
5. **Rate Limiting**: Implement API rate limits

### For Enterprise

1. **Authentication**: Add NextAuth.js
2. **Analytics**: Track user progress and insights
3. **Admin Dashboard**: Manage scenarios and users
4. **Multi-tenant**: Support multiple organizations
5. **Custom Deployment**: Consider dedicated infrastructure

## Rollback Strategy

If something goes wrong:

### Vercel Rollback

1. Go to project **Deployments**
2. Find previous working deployment
3. Click three dots (⋯)
4. Select **"Promote to Production"**
5. Instant rollback! ⚡

### Git Rollback

```bash
# Revert to previous commit
git revert HEAD

# Or reset to specific commit
git reset --hard <commit-hash>

# Force push (use with caution!)
git push --force
```

## Security Checklist

Before going live:

- [ ] Environment variables are NOT in git
- [ ] `.env.local` is in `.gitignore`
- [ ] API keys are in Vercel environment variables
- [ ] HTTPS is enabled (automatic on Vercel)
- [ ] No API keys in client-side code
- [ ] Error messages don't expose sensitive info
- [ ] CORS configured correctly (if using custom API)

## Troubleshooting Production Issues

### Build Fails

**Check build logs in Vercel:**
1. Go to Deployments
2. Click failed deployment
3. Check build logs for errors

**Common fixes:**
- TypeScript errors → Run `npm run build` locally first
- Missing dependencies → Check `package.json`
- Environment variables → Verify they're set correctly

### Runtime Errors

**Check function logs:**
1. Go to Deployments
2. Click on deployment
3. Navigate to "Functions" tab
4. Check runtime logs

**Common issues:**
- "Failed to authenticate with Hume" → Check API keys
- "Not connected" → Verify Hume service status
- Microphone not working → Ensure HTTPS

### Performance Issues

**Optimize:**
- Enable caching headers
- Minimize bundle size
- Use dynamic imports
- Optimize images
- Remove console.logs in production

## Support Resources

- 📚 [Vercel Docs](https://vercel.com/docs)
- 🔧 [Vercel Support](https://vercel.com/support)
- 💬 [Vercel Discord](https://vercel.com/discord)
- 🤖 [Hume Support](https://hume.ai/support)
- 📖 [Next.js Docs](https://nextjs.org/docs)

## Success! 🚀

Your Manager Training Platform is now live and accessible to users worldwide!

**Next Steps:**
1. Share the URL with your team
2. Gather feedback from users
3. Monitor usage and performance
4. Iterate and improve

---

Need help? Check the README.md or open an issue in your repository.

