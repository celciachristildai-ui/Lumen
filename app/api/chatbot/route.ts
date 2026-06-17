import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are LUMEN AI — a friendly, knowledgeable assistant for the LUMEN Event Booking Platform.

Your capabilities:
- Help users discover events by category (Music, Technology, Art & Culture, Food & Drink, Sports, Business)
- Explain how to book events, manage bookings, cancel bookings
- Answer questions about pricing, payment (Stripe), and refund policies
- Help with account registration and login issues
- Provide general event recommendations based on the user's interests

About the platform:
- LUMEN is a modern event booking platform based in India
- Users can browse and filter events by category or search by name/location
- Booking requires creating a free account
- Payment is securely processed via Stripe
- Free events are instantly confirmed; paid events go through Stripe Checkout
- Users can view all their bookings in the Dashboard

Tone: Warm, concise, enthusiastic. Use emojis sparingly. Keep answers short (2-4 sentences).
If asked something you do not know, say so honestly and suggest they contact support.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        reply: 'The AI assistant is not configured yet. Please add GEMINI_API_KEY to your environment variables.',
      });
    }

    const contents = messages.slice(-10).map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents,
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error('[GEMINI_ERROR]', err);
      throw new Error('Gemini API error');
    }

    const data = await res.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Sorry, I could not generate a response.';

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error('[CHATBOT_ERROR]', err?.message);
    return NextResponse.json({
      reply: "I'm having a moment — please try again shortly!",
    });
  }
}