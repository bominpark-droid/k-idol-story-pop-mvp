import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // 1. OpenAI: 아이돌 답변 생성
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "너는 다정한 K-Pop 아이돌이야. 팬의 질문에 항상 설레고 다정하게 한국어로 대답해줘. 답변은 2문장 이내로 짧게 해줘." 
        },
        { role: "user", content: message }
      ],
    });

    const reply = completion.choices[0].message.content;
    console.log("OpenAI Reply:", reply); // 답변 생성 확인용 로그

    // 2. ElevenLabs: 목소리 생성
    const voiceResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
        },
        body: JSON.stringify({
          text: reply,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        }),
      }
    );

    // [중요] 에러가 났을 때, ElevenLabs가 보내준 진짜 이유를 로그에 찍는 코드
    if (!voiceResponse.ok) {
      const errorData = await voiceResponse.json();
      console.error("ElevenLabs 상세 에러:", errorData); // Vercel 로그에서 이 부분을 확인해야 함
      throw new Error(`ElevenLabs Error: ${JSON.stringify(errorData)}`);
    }

    const audioBuffer = await voiceResponse.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({ reply, audio: base64Audio });
  } catch (error: any) {
    console.error("최종 에러 발생:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
