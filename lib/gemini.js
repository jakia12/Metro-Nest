import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getChatCompletion(messages, options = {}) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash' // Fast and FREE
    });

    // Convert messages to Gemini format
    // Remove system message and convert to history
    const conversationMessages = messages.filter(m => m.role !== 'system');
    const systemMessage = messages.find(m => m.role === 'system');
    
    const history = conversationMessages.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const lastMessage = conversationMessages[conversationMessages.length - 1];

    // Include system prompt in first message if exists
    const instruction = systemMessage ? systemMessage.content + '\n\n' : '';
    const userMessage = instruction + lastMessage.content;

    const chat = model.startChat({
      history,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error('Gemini Error:', error);
    throw new Error('AI service temporarily unavailable. Please try again.');
  }
}