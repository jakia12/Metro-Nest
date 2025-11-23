import { getChatCompletion } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // System prompt that defines the chatbot's personality
    const systemPrompt = {
      role: 'system',
      content: `You are Emma, a friendly and knowledgeable real estate assistant. Your role is to:

1. Help visitors find their perfect property
2. Answer questions about real estate, home buying process, and neighborhoods
3. Provide helpful information about mortgages and financing
4. Be warm, professional, and concise (2-4 sentences max per response)
5. When users ask about properties, describe general features and ask for their preferences
6. If asked about mortgage calculations, guide them to use the mortgage calculator
7. Naturally ask for their contact information when appropriate

Guidelines:
- Keep responses short and conversational
- Use emojis occasionally to be friendly (1 per message max)
- If you don't know something specific, admit it and offer to connect them with an agent
- Always provide next steps or ask follow-up questions to keep the conversation going

Remember: You're here to help people find their dream home and make the process easy!`
    };

    // Build messages array
    const messages = [
      systemPrompt,
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // Get AI response
    const aiResponse = await getChatCompletion(messages);

    return NextResponse.json({
      success: true,
      reply: aiResponse
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get response. Please try again.' 
      },
      { status: 500 }
    );
  }
}