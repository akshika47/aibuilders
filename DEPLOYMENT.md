# 🚀 Deployment Guide for CAL AI

This guide covers different deployment options for your CAL AI Food Nutrition Analyzer.

## 🌐 Netlify Deployment (Recommended)

Your app is now configured for Netlify deployment with serverless functions!

### Quick Deploy to Netlify:

1. **Push your changes to GitHub:**
   ```bash
   git add .
   git commit -m "Add Netlify deployment configuration"
   git push origin main
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your `aibuilders` repository
   - Netlify will auto-detect the settings from `netlify.toml`
   - Click "Deploy site"

3. **Set Environment Variables:**
   - In Netlify dashboard, go to Site settings > Environment variables
   - Add: `OPENAI_API_KEY` = `your_openai_api_key_here`

4. **Your app will be live at:** `https://your-site-name.netlify.app`

### What's Configured:
- ✅ Serverless function for OpenAI API calls
- ✅ Static file hosting for frontend
- ✅ Automatic builds from GitHub
- ✅ CORS handling
- ✅ Environment variable support

## 🔧 Alternative Deployment Options

### Option 2: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Add `OPENAI_API_KEY` in Vercel dashboard

### Option 3: Railway/Render (Full Stack)
For the original Node.js server:
1. Connect your GitHub repo
2. Set `OPENAI_API_KEY` environment variable
3. Deploy automatically

### Option 4: Heroku
1. Install Heroku CLI
2. `heroku create your-app-name`
3. `heroku config:set OPENAI_API_KEY=your_key`
4. `git push heroku main`

## 🛠️ Local Development

For local development, you can still use:
```bash
npm start  # Uses the Express server
```

Or test the Netlify functions locally:
```bash
npm install -g netlify-cli
netlify dev
```

## 🔒 Security Notes

- ✅ API keys are stored as environment variables
- ✅ CORS is properly configured
- ✅ No sensitive data in repository
- ✅ Client-side API calls go through your backend

## 📱 Features After Deployment

- 🎯 AI-powered food recognition
- 📊 Detailed nutritional analysis
- 💡 Health insights and recommendations
- 📱 Mobile-responsive design
- ⚡ Fast serverless functions
- 🔒 Secure API key handling

Your CAL AI app is ready for production! 🎉
