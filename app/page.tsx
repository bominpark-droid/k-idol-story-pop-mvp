"use client";
import { useState, useEffect } from "react";

export default function IdolTalk() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 입 모양 뻐끔거림 로직
  useEffect(() => {
    let interval: any;
    if (isSpeaking) {
      interval = setInterval(() => setIsSpeaking(p => !p), 150);
    }
    return () => clearInterval(interval);
  }, [isSpeaking]);

  const handleTalk = async () => {
    if (!text || isLoading) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      
      const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
      setIsSpeaking(true);
      audio.play();
      audio.onended = () => setIsSpeaking(false);
    } catch (e) {
      console.error("오류 발생:", e);
      alert("AI 응답 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#000', color: '#fff', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#ec4899', fontSize: '2rem', fontWeight: 'bold', marginBottom: '2.5rem' }}>STORY POP MVP</h1>
      
      {/* 아바타 영역 */}
      <div style={{ width: '280px', height: '280px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #ec4899', boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)', marginBottom: '2.5rem' }}>
        <img 
          src={isSpeaking ? "/avatar_Open.jpeg" : "/avatar_Close.jpeg"} 
          alt="Idol" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>

      {/* 입력창 & 버튼 */}
      <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="text" 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="최애에게 말을 걸어보세요..." 
          style={{ padding: '1rem', borderRadius: '0.75rem', border: 'none', fontSize: '1rem', color: '#000' }} 
        />
        <button 
          onClick={handleTalk} 
          disabled={isLoading} 
          style={{ padding: '1rem', backgroundColor: '#ec4899', color: '#fff', borderRadius: '0.75rem', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
        >
          {isLoading ? "생각 중..." : "대화하기"}
        </button>
      </div>
    </div>
  );
}
