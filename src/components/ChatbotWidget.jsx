import React, { useState, useRef, useEffect } from 'react';
import { colors, fonts, radius } from '../styles/tokens';
import chatbotService from '../services/chatbot.service';

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChatIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: 'Merhaba! Ben e-Arzuhal yardım asistanıyım. Sözleşme oluşturma, PDF indirme veya onay süreci hakkında size yardımcı olabilirim.',
};

const SUGGESTED_INITIAL = [
  'Sözleşme nasıl oluşturulur?',
  'PDF nasıl indirilir?',
  'Hangi sözleşme tipleri destekleniyor?',
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggested, setSuggested] = useState(SUGGESTED_INITIAL);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getHistory = () =>
    messages.map((m) => ({ role: m.role, content: m.content }));

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSuggested([]);
    setLoading(true);

    try {
      const res = await chatbotService.sendMessage(trimmed, getHistory());
      setMessages((prev) => [...prev, { role: 'assistant', content: res.response }]);
      if (res.suggestedQuestions?.length) setSuggested(res.suggestedQuestions);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <>
      {/* Floating Buton */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Yardım asistanını aç"
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 4px 16px rgba(27,42,74,0.35)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          zIndex: 1000,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>

      {/* Chat Paneli */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '92px',
          right: '28px',
          width: '360px',
          height: '520px',
          background: colors.card,
          borderRadius: radius.xl,
          boxShadow: '0 8px 40px rgba(27,42,74,0.18)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 999,
          border: `1px solid ${colors.border}`,
          animation: 'fadeInUp 0.2s ease',
        }}>

          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0,
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ChatIcon />
            </div>
            <div>
              <div style={{ fontFamily: fonts.heading, fontSize: '15px', fontWeight: 600 }}>
                e-Arzuhal Asistan
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>
                {loading ? 'Yanıt yazılıyor...' : 'Aktif'}
              </div>
            </div>
          </div>

          {/* Mesajlar */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '82%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user'
                    ? `${radius.lg}px ${radius.lg}px 4px ${radius.lg}px`
                    : `${radius.lg}px ${radius.lg}px ${radius.lg}px 4px`,
                  background: msg.role === 'user'
                    ? `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`
                    : colors.surfaceAlt,
                  color: msg.role === 'user' ? '#fff' : colors.text,
                  fontSize: '13px',
                  lineHeight: 1.6,
                  fontFamily: fonts.body,
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: `${radius.lg}px ${radius.lg}px ${radius.lg}px 4px`,
                  background: colors.surfaceAlt,
                  display: 'flex', gap: '4px', alignItems: 'center',
                }}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: colors.textMuted,
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Önerilen Sorular */}
          {suggested.length > 0 && !loading && (
            <div style={{
              padding: '8px 16px',
              borderTop: `1px solid ${colors.border}`,
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              flexShrink: 0,
              background: colors.surface,
            }}>
              {suggested.map((q, i) => (
                <button
                  key={i}
                  onClick={() => send(q)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: radius.full,
                    border: `1px solid ${colors.border}`,
                    background: colors.card,
                    color: colors.primary,
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontFamily: fonts.body,
                    transition: 'border-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '12px 16px',
            borderTop: `1px solid ${colors.border}`,
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-end',
            flexShrink: 0,
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Mesajınızı yazın..."
              rows={1}
              style={{
                flex: 1,
                resize: 'none',
                border: `1px solid ${colors.border}`,
                borderRadius: radius.md,
                padding: '8px 12px',
                fontFamily: fonts.body,
                fontSize: '13px',
                color: colors.text,
                background: colors.surface,
                outline: 'none',
                lineHeight: 1.5,
                maxHeight: '80px',
                overflowY: 'auto',
              }}
              onFocus={(e) => { e.target.style.borderColor = colors.accent; }}
              onBlur={(e) => { e.target.style.borderColor = colors.border; }}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: radius.md,
                background: input.trim() && !loading
                  ? `linear-gradient(135deg, ${colors.accent}, ${colors.accentLight})`
                  : colors.surfaceAlt,
                border: 'none',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: input.trim() && !loading ? '#fff' : colors.textMuted,
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}
