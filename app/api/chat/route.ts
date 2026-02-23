import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // ЗАМЕНИЛИ НА АКТУАЛЬНУЮ МОДЕЛЬ:
        model: "llama-3.3-70b-versatile", 
        messages: [
          {
            role: "system",
            content: "Ты — эксперт BOLASHAQ и Ivy League. Отвечай на русском. Будь вдохновляющим и профессиональным наставником."
          },
          ...messages
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq Error Details:", data);
      return NextResponse.json({ error: data.error?.message || "Ошибка API" }, { status: 500 });
    }

    return NextResponse.json({ 
      text: data.choices[0].message.content 
    });

  } catch (error: any) {
    console.error("Route Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}