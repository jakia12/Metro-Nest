import { NextResponse } from 'next/server';

// Simple in-memory AI responses (no external API needed initially)
// You can later replace this with OpenAI, Gemini, or any other AI service

const SYSTEM_CONTEXT = `You are a helpful real estate AI assistant. You help users:
- Find properties for sale or rent
- Understand the buying/renting process
- Get information about mortgages and financing
- Learn about neighborhoods and areas
- Schedule property viewings

Keep responses friendly, concise (2-4 sentences), and helpful. Use emojis occasionally.`;

// Predefined responses for common questions (fallback when AI service is not available)
const predefinedResponses = {
  greeting: [
    "Hi there! 👋 I'm here to help you find your perfect home. Are you looking to buy or rent?",
    "Hello! 🏠 I'd love to help you with your real estate needs. What are you looking for today?",
    "Hey! Welcome! I'm your AI real estate assistant. How can I help you find your dream property?"
  ],
  properties: [
    "I can help you find the perfect property! 🏡 To get started, could you tell me: Are you looking to buy or rent? And what's your preferred number of bedrooms?",
    "Great! I'd love to show you our available properties. What type of property interests you - apartment, house, condo, or villa? And what's your budget range?"
  ],
  buying_process: [
    "The home buying process typically involves: 1) Getting pre-approved for a mortgage 💰 2) Finding the right property 🏠 3) Making an offer 📝 4) Home inspection 🔍 5) Closing the deal 🎉 Which step would you like to know more about?",
    "Buying a home is exciting! The process usually takes 30-45 days from offer to closing. First, I'd recommend getting pre-approved for a mortgage to know your budget. Would you like me to explain any specific step in detail?"
  ],
  mortgage: [
    "Mortgage rates vary based on factors like credit score, down payment, and loan type. 📊 Current rates are competitive! I recommend speaking with a mortgage specialist. Would you like me to connect you with one?",
    "Great question! Most buyers need a mortgage to purchase a home. You'll typically need: a good credit score (620+), proof of income, and a down payment (usually 3-20%). Want more specific information?"
  ],
  bedrooms: [
    "Perfect! I can help you find {X}-bedroom properties. What's your budget range and preferred location? 🗺️",
    "Great choice! {X}-bedroom homes are very popular. Do you have a specific neighborhood or price range in mind?"
  ],
  default: [
    "I'd be happy to help with that! Could you provide a bit more detail so I can give you the best information? 🤔",
    "That's a great question! To give you the most accurate information, could you tell me more about what you're looking for?",
    "I'm here to help! Let me know more details about your situation, and I'll provide you with the best guidance. 📞"
  ]
};

function getSimpleAIResponse(userMessage, history = []) {
  const message = userMessage.toLowerCase();
  
  // Detect intent
  if (message.match(/\b(hi|hello|hey|good morning|good evening)\b/)) {
    return predefinedResponses.greeting[Math.floor(Math.random() * predefinedResponses.greeting.length)];
  }
  
  if (message.match(/\b(properties|property|homes|houses|apartments|listings)\b/) && 
      message.match(/\b(show|find|search|looking for|want to see|available)\b/)) {
    return predefinedResponses.properties[Math.floor(Math.random() * predefinedResponses.properties.length)];
  }
  
  if (message.match(/\b(buy|buying|purchase|purchasing)\b/) && 
      message.match(/\b(process|steps|how to|guide)\b/)) {
    return predefinedResponses.buying_process[Math.floor(Math.random() * predefinedResponses.buying_process.length)];
  }
  
  if (message.match(/\b(mortgage|loan|financing|finance|rate|rates)\b/)) {
    return predefinedResponses.mortgage[Math.floor(Math.random() * predefinedResponses.mortgage.length)];
  }
  
  // Extract bedroom count
  const bedroomMatch = message.match(/(\d+)[\s-]*(bed|bedroom)/);
  if (bedroomMatch) {
    const count = bedroomMatch[1];
    const responses = predefinedResponses.bedrooms;
    const response = responses[Math.floor(Math.random() * responses.length)];
    return response.replace('{X}', count);
  }
  
  // Default response
  return predefinedResponses.default[Math.floor(Math.random() * predefinedResponses.default.length)];
}

export async function POST(request) {
  try {
    const { message, history = [] } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Try to use AI service if available
    let aiResponse;
    
    if (process.env.OPENAI_API_KEY) {
      // Use OpenAI
      aiResponse = await getOpenAIResponse(message, history);
    } else if (process.env.GEMINI_API_KEY) {
      // Use Gemini
      aiResponse = await getGeminiResponse(message, history);
    } else {
      // Use simple pattern matching (works without any API)
      console.log('Using simple AI (no API key found)');
      aiResponse = getSimpleAIResponse(message, history);
    }

    return NextResponse.json({
      message: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process your message. Please try again.',
        message: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment, or contact our support team for immediate assistance. 🙏"
      },
      { status: 500 }
    );
  }
}

// OpenAI implementation (will use if OPENAI_API_KEY is set)
async function getOpenAIResponse(message, history) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: SYSTEM_CONTEXT },
          ...history.map(h => ({ role: h.role, content: h.content })),
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI error:', error);
    // Fallback to simple AI
    return getSimpleAIResponse(message, history);
  }
}

// Gemini implementation (will use if GEMINI_API_KEY is set)
async function getGeminiResponse(message, history) {
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const historyFormatted = history.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }]
    }));

    const chat = model.startChat({
      history: historyFormatted,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200,
      },
    });

    const fullMessage = SYSTEM_CONTEXT + '\n\nUser: ' + message;
    const result = await chat.sendMessage(fullMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini error:', error);
    // Fallback to simple AI
    return getSimpleAIResponse(message, history);
  }
}
