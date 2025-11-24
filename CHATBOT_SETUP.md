# AI Chatbot Setup & Troubleshooting Guide

## 🤖 Overview
Your MetroNest app has an AI-powered chatbot assistant named "Emma" that helps users find properties and answer real estate questions.

## 📦 Components

### 1. **ChatWidget** (`components/shared/ChatWidget.jsx`)
- Floating chat button in the bottom-right corner
- Handles open/close/minimize states
- Already integrated in your main layout

### 2. **ChatWindow** (`components/shared/ChatWindow.jsx`)
- Main chat interface with messages
- Sends messages to the API
- Displays typing indicators

### 3. **API Route** (`app/api/ai/chat/route.js`)
- Handles chat requests
- Processes conversation history
- Returns AI responses

### 4. **Gemini Library** (`lib/gemini.js`)
- Integrates with Google's Gemini AI
- Converts messages to Gemini format
- Handles API communication

## ⚙️ Setup Instructions

### Step 1: Get Gemini API Key (FREE)
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

### Step 2: Add Environment Variable
Create or update your `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_api_key_here
```

**Important:** Replace `your_api_key_here` with your actual Gemini API key.

### Step 3: Restart Development Server
After adding the environment variable, restart your dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## 🧪 Testing the Chatbot

### Manual Test
1. Open your app in the browser
2. Look for the blue chat button in the bottom-right corner
3. Click it to open the chat window
4. Try sending a message like:
   - "Hello"
   - "I'm looking for a 3-bedroom apartment"
   - "Tell me about the home buying process"

### Expected Behavior
- ✅ Chat window opens/closes smoothly
- ✅ Messages appear in the conversation
- ✅ Typing indicator shows while AI is thinking
- ✅ AI responds with helpful real estate assistance
- ✅ Responses are concise (2-4 sentences)

## 🐛 Common Issues & Solutions

### Issue 1: "AI service temporarily unavailable"
**Cause:** Missing or invalid GEMINI_API_KEY
**Solution:**
- Check that `.env.local` file exists in the root directory
- Verify the API key is correct
- Restart the dev server after adding the key

### Issue 2: Chat button not visible
**Cause:** ChatWidget not rendering
**Solution:**
- Check browser console for errors
- Verify ChatWidget is imported in `app/(pages)/(root)/(main)/layout.js`
- Clear browser cache and hard refresh

### Issue 3: Network error when sending messages
**Cause:** API route not found or error in the route
**Solution:**
- Check browser Network tab, look for `/api/ai/chat` request
- Check terminal for server-side errors
- Verify `lib/gemini.js` can import GoogleGenerativeAI

### Issue 4: Slow responses
**Cause:** Using Gemini 1.5 Flash (free tier has rate limits)
**Solution:**
- This is normal for free tier
- Responses typically take 1-3 seconds
- Consider upgrading to paid tier for faster responses

## 📊 API Usage & Limits

### Gemini 1.5 Flash (Free Tier)
- **Cost:** FREE ✅
- **Rate Limit:** 15 requests per minute
- **Max Tokens:** 1 million tokens per day
- **Response Time:** ~1-3 seconds

This should be more than enough for development and moderate production usage.

## 🔧 Debugging Commands

### Check if API key is loaded:
```javascript
// Add this to app/api/ai/chat/route.js temporarily
console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
```

### Test Gemini connection directly:
Create a test file `test-gemini.js` in the root:

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Say hello!');
    const response = await result.response;
    console.log('✅ Gemini Test Successful:', response.text());
  } catch (error) {
    console.error('❌ Gemini Test Failed:', error.message);
  }
}

test();
```

Run with: `node test-gemini.js`

## 🎨 Customization

### Change Chatbot Name
Edit `app/api/ai/chat/route.js`, line 18:
```javascript
content: `You are Emma, a friendly...`
// Change "Emma" to your preferred name
```

Also update `components/shared/ChatWindow.jsx`, lines 9, 30, and 84.

### Modify Personality
Edit the system prompt in `app/api/ai/chat/route.js` (lines 16-34)

### Change Appearance
Edit `components/shared/ChatWindow.jsx` to modify:
- Colors (currently blue theme)
- Size (currently 400x600px)
- Icons
- Messages styling

### Adjust Response Length
Edit `lib/gemini.js`, line 31:
```javascript
maxOutputTokens: 500, // Increase for longer responses
```

## 📱 Features

### Current Features:
- ✅ Real-time conversation
- ✅ Conversation history maintained
- ✅ Typing indicators
- ✅ Minimize/maximize window
- ✅ Smooth animations
- ✅ Mobile responsive
- ✅ Context-aware responses
- ✅ Real estate domain expertise

### Potential Enhancements:
- [ ] Save conversation history to database
- [ ] User authentication integration
- [ ] Quick reply buttons
- [ ] Property recommendations based on conversation
- [ ] Lead capture integration
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Send conversation transcript via email

## 🚀 Production Checklist

Before deploying to production:

1. ✅ Set GEMINI_API_KEY in production environment variables
2. ✅ Test rate limiting behavior
3. ✅ Add error tracking (e.g., Sentry)
4. ✅ Monitor API usage in Google Cloud Console
5. ✅ Consider adding conversation logging
6. ✅ Add analytics to track chatbot engagement
7. ✅ Test mobile responsiveness
8. ✅ Add CORS headers if needed for API

## 📞 Support

If you're still experiencing issues:
1. Check browser console for client-side errors
2. Check terminal/server logs for API errors
3. Verify all files are saved
4. Try clearing browser cache
5. Test in incognito/private browsing mode

## 📄 File Structure

```
metro-nest/
├── components/
│   └── shared/
│       ├── ChatWidget.jsx      # Floating button & state management
│       └── ChatWindow.jsx       # Chat interface
├── app/
│   └── api/
│       └── ai/
│           └── chat/
│               └── route.js     # API endpoint
├── lib/
│   └── gemini.js                # Gemini AI integration
└── .env.local                   # Environment variables (create this!)
```

---

**Last Updated:** 2025-11-24

**Status:** ✅ Ready to use (just add API key)
