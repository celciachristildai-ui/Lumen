import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

Tone: Warm, concise, enthusiastic. Use emojis sparingly. Keep answers short (2-4 sentences) unless the user asks for detail.
If asked something you don't know, say so honestly and suggest they contact support.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        reply:
          "The AI assistant isn't configured yet. Please add your OPENAI_API_KEY to .env.local. In the meantime, you can explore events on the Explore Events page!",
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.slice(-10).map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error('[CHATBOT_ERROR]', err?.message);
    return NextResponse.json({
      reply: "I'm having a moment — please try again shortly! 🙏",
    });
  }
}
