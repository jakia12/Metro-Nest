// Test script for Gemini AI Chatbot
// Run this with: node test-gemini.mjs

import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const API_KEY = process.env.GEMINI_API_KEY;

console.log('🧪 Testing Gemini AI Chatbot...\n');

// Test 1: Check API Key
console.log('📋 Test 1: Checking API Key');
if (!API_KEY) {
  console.error('❌ FAILED: GEMINI_API_KEY not found in environment variables');
  console.log('💡 Solution: Create .env.local file with your API key');
  console.log('   Get key from: https://makersuite.google.com/app/apikey\n');
  process.exit(1);
} else {
  console.log(`✅ PASSED: API Key found (${API_KEY.substring(0, 10)}...)\n`);
}

// Test 2: Initialize Gemini
console.log('📋 Test 2: Initializing Gemini AI');
let genAI;
try {
  genAI = new GoogleGenerativeAI(API_KEY);
  console.log('✅ PASSED: Gemini AI initialized successfully\n');
} catch (error) {
  console.error('❌ FAILED:', error.message);
  process.exit(1);
}

// Test 3: Get Model
console.log('📋 Test 3: Loading Gemini 1.5 Flash model');
let model;
try {
  model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  console.log('✅ PASSED: Model loaded successfully\n');
} catch (error) {
  console.error('❌ FAILED:', error.message);
  process.exit(1);
}

// Test 4: Simple Generation
console.log('📋 Test 4: Testing simple text generation');
try {
  const result = await model.generateContent('Say "Hello from Emma!"');
  const response = await result.response;
  const text = response.text();
  console.log('✅ PASSED: Generation successful');
  console.log('📝 Response:', text, '\n');
} catch (error) {
  console.error('❌ FAILED:', error.message);
  console.log('💡 Check your API key and network connection\n');
  process.exit(1);
}

// Test 5: Chat Session with History
console.log('📋 Test 5: Testing chat session with conversation history');
try {
  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: 'Hello, I need help finding a home' }],
      },
      {
        role: 'model',
        parts: [{ text: 'Hi! I\'d be happy to help you find your dream home. What type of property are you looking for?' }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500,
    },
  });

  const result = await chat.sendMessage('I want a 3-bedroom apartment');
  const response = await result.response;
  const text = response.text();
  
  console.log('✅ PASSED: Chat session successful');
  console.log('📝 Response:', text, '\n');
} catch (error) {
  console.error('❌ FAILED:', error.message);
  process.exit(1);
}

// Test 6: Real Estate Assistant Simulation
console.log('📋 Test 6: Testing real estate assistant personality');
try {
  const systemPrompt = `You are Emma, a friendly and knowledgeable real estate assistant. 
Keep responses short and conversational (2-3 sentences). Use one emoji per message.`;

  const model2 = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const chat = model2.startChat({
    history: [],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500,
    },
  });

  const userMessage = systemPrompt + '\n\nUser: Tell me about mortgage rates';
  const result = await chat.sendMessage(userMessage);
  const response = await result.response;
  const text = response.text();
  
  console.log('✅ PASSED: Real estate personality test successful');
  console.log('📝 Emma\'s Response:', text, '\n');
} catch (error) {
  console.error('❌ FAILED:', error.message);
  process.exit(1);
}

// Final Summary
console.log('═══════════════════════════════════════');
console.log('✅ ALL TESTS PASSED! 🎉');
console.log('═══════════════════════════════════════');
console.log('\n📊 Summary:');
console.log('  • API Key: Valid');
console.log('  • Gemini AI: Connected');
console.log('  • Model: gemini-1.5-flash (Free Tier)');
console.log('  • Chat Sessions: Working');
console.log('  • Real Estate Assistant: Ready');
console.log('\n🚀 Your chatbot is ready to use!');
console.log('💡 Start your dev server with: npm run dev');
console.log('🌐 Then visit: http://localhost:3000');
console.log('💬 Look for the blue chat button in the bottom-right');
console.log('\n');
