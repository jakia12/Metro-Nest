# 🚀 Quick Start - AI Chatbot

## ⚡ 3 Steps to Get Your Chatbot Working

### 1️⃣ Get API Key (2 minutes)
- Visit: https://makersuite.google.com/app/apikey
- Sign in with Google
- Click "Create API Key"
- Copy the key

### 2️⃣ Add to Environment (30 seconds)
Create `.env.local` file in your project root:

```env
GEMINI_API_KEY=paste_your_key_here
```

### 3️⃣ Restart Server (10 seconds)
```bash
# Stop server (Ctrl+C), then:
npm run dev
```

## ✅ Test It

### Option A: Use the Test Script
```bash
node test-gemini.mjs
```

### Option B: Test in Browser
1. Open http://localhost:3000
2. Click the blue chat button (bottom-right)
3. Say "Hello"

## ❓ Still Not Working?

### Check These:
- [ ] `.env.local` file exists in root folder (same level as package.json)
- [ ] API key has no extra spaces before/after
- [ ] You restarted the dev server after adding the key
- [ ] Browser console shows no errors (F12)

### Quick Debug:
Add this line to `app/api/ai/chat/route.js` at line 6:
```javascript
console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
```

Check your terminal - should show `true`.

## 📚 More Info
See `CHATBOT_SETUP.md` for detailed troubleshooting.

---

**That's it!** Your AI chatbot should now be working! 🎉
